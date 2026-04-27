import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';

const dir = process.cwd();
const token = process.argv[2];

if (!token) {
  console.error('Error: Please provide a GitHub Personal Access Token as an argument.');
  console.log('Usage: node scripts/git-push.mjs <token>');
  process.exit(1);
}

async function push() {
  let attempt = 0;
  const maxAttempts = 5;

  while (attempt < maxAttempts) {
    try {
      attempt++;
      console.log(`--- Attempt ${attempt} ---`);
      
      console.log('Initializing git in:', dir);
      if (!fs.existsSync(path.join(dir, '.git'))) {
        await git.init({ fs, dir });
      }

      console.log('Adding all files...');
      const files = fs.readdirSync(dir).filter(f => !f.startsWith('.') && f !== 'node_modules');
      for (const file of files) {
        await git.add({ fs, dir, filepath: file });
      }

      console.log('Committing changes...');
      try {
        await git.commit({
          fs,
          dir,
          message: 'docs: add complete professional submission README',
          author: { name: 'StellarPay Bot', email: 'bot@stellarpay.dev' }
        });
      } catch (e) {
        console.log('No new changes to commit.');
      }

      console.log('Setting up main branch...');
      try {
        await git.branch({ fs, dir, ref: 'main', checkout: true });
      } catch (e) {
        // Branch might already exist
      }

      console.log('Pushing to GitHub (this may take a minute)...');
      await git.push({
        fs,
        http,
        dir,
        url: 'https://github.com/Keshavsudhane01/stellar-belt---stellar-pay',
        remote: 'origin',
        ref: 'main',
        force: true,
        onAuth: () => ({ username: token, password: '' }),
        onProgress: (progress) => {
          console.log(`Progress: ${progress.phase} - ${progress.loaded}/${progress.total || '?'}`);
        }
      });

      console.log('Successfully pushed to main!');
      return; // Exit loop on success
    } catch (err) {
      console.error('Git operation failed:', err.message);
      if (err.message.includes('timeout') || err.message.includes('403')) {
        console.log('Waiting 10 seconds before retry...');
        await new Promise(r => setTimeout(r, 10000));
      } else {
        throw err;
      }
    }
  }
  console.error('Max attempts reached. Push failed.');
}

push();

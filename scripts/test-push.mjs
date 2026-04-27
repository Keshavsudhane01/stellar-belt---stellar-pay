import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';

const dir = process.cwd();
const token = process.argv[2];

async function push() {
  try {
    console.log('Adding README.md only...');
    await git.add({ fs, dir, filepath: 'README.md' });

    console.log('Committing...');
    await git.commit({
      fs,
      dir,
      message: 'docs: update README',
      author: { name: 'StellarPay Bot', email: 'bot@stellarpay.dev' }
    });

    console.log('Pushing...');
    await git.push({
      fs,
      http,
      dir,
      url: 'https://github.com/Keshavsudhane01/stellar-belt---stellar-pay',
      remote: 'origin',
      ref: 'main',
      force: true,
      onAuth: () => ({ username: token, password: '' })
    });

    console.log('Success!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

push();

import fs from 'fs';
import path from 'path';

const token = process.argv[2];
const owner = 'Keshavsudhane01';
const repo = 'stellar-belt---stellar-pay';
const branch = 'main';
const BASE_URL = `https://api.github.com/repos/${owner}/${repo}/contents`;

const headers = {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
  'User-Agent': 'StellarPay-Pusher'
};

async function getFileSha(filePath) {
  const res = await fetch(`${BASE_URL}/${filePath}?ref=${branch}`, { headers });
  if (res.status === 404) return null;
  const data = await res.json();
  return data.sha || null;
}

async function uploadFile(localPath, repoPath) {
  console.log(`Uploading: ${repoPath}`);
  const content = fs.readFileSync(localPath);
  const base64 = content.toString('base64');
  const sha = await getFileSha(repoPath);

  const body = {
    message: `chore: upload ${repoPath}`,
    content: base64,
    branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${BASE_URL}/${repoPath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (res.ok) {
    console.log(`  ✓ ${repoPath}`);
  } else {
    console.error(`  ✗ ${repoPath}: ${data.message}`);
  }
}

async function uploadDirectory(localDir, repoDir = '') {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const repoPath = repoDir ? `${repoDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      await uploadDirectory(localPath, repoPath);
    } else {
      await uploadFile(localPath, repoPath);
    }
  }
}

async function main() {
  if (!token) {
    console.error('Usage: node scripts/api-push.mjs <github_token>');
    process.exit(1);
  }

  console.log('=== GitHub API Uploader ===');
  console.log(`Repo: ${owner}/${repo}`);

  // Upload README.md
  await uploadFile('README.md', 'README.md');

  // Upload screenshots
  const screenshotsDir = 'screenshots';
  if (fs.existsSync(screenshotsDir)) {
    await uploadDirectory(screenshotsDir, 'screenshots');
  }

  console.log('\n=== Done! ===');
}

main().catch(err => console.error('Fatal error:', err.message));

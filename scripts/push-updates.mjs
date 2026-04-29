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

const FILES_TO_PUSH = [
  'README.md',
  '.github/workflows/deploy-contracts.yml',
  'scripts/update-addresses.mjs',
  'scripts/deploy-contracts.mjs',
];

async function getFileSha(filePath) {
  const res = await fetch(`${BASE_URL}/${filePath}?ref=${branch}`, { headers });
  if (res.status === 404) return null;
  const data = await res.json();
  return data.sha || null;
}

async function uploadFile(localPath, repoPath) {
  console.log(`  → ${repoPath}`);
  const content = fs.readFileSync(localPath);
  const base64 = content.toString('base64');
  const sha = await getFileSha(repoPath);

  const body = { message: `docs: update README and add contract deploy workflow`, content: base64, branch };
  if (sha) body.sha = sha;

  const res = await fetch(`${BASE_URL}/${repoPath}`, {
    method: 'PUT', headers, body: JSON.stringify(body)
  });

  if (res.ok) {
    console.log(`  ✓ ${repoPath}`);
  } else {
    const data = await res.json();
    console.error(`  ✗ ${repoPath}: ${data.message}`);
  }
}

async function main() {
  if (!token) { console.error('Usage: node scripts/push-updates.mjs <token>'); process.exit(1); }
  console.log('=== Pushing updates to GitHub ===');
  for (const file of FILES_TO_PUSH) {
    if (fs.existsSync(file)) await uploadFile(file, file);
    else console.log(`  ⊘ Not found locally: ${file}`);
  }
  console.log('\n=== Done! ===');
  console.log('\nNext steps:');
  console.log('1. Go to: https://github.com/Keshavsudhane01/stellar-belt---stellar-pay/actions');
  console.log('2. Click "Deploy Soroban Contracts" workflow');
  console.log('3. Click "Run workflow" and provide your Stellar secret key');
  console.log('4. Contracts will be built, deployed, and addresses committed automatically');
}

main().catch(err => console.error('Fatal error:', err.message));

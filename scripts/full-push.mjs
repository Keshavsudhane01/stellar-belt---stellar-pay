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

// Directories and files to skip
const SKIP = new Set([
  'node_modules', '.next', '.git', 'node.zip', 'node',
  'package-lock.json' // too large
]);

async function getFileSha(filePath) {
  try {
    const res = await fetch(`${BASE_URL}/${filePath}?ref=${branch}`, { headers });
    if (res.status === 404) return null;
    const data = await res.json();
    return data.sha || null;
  } catch {
    return null;
  }
}

async function uploadFile(localPath, repoPath) {
  const stat = fs.statSync(localPath);
  if (stat.size > 8_000_000) {
    console.log(`  ⚠ Skipping (too large ${(stat.size/1024/1024).toFixed(1)}MB): ${repoPath}`);
    return;
  }
  console.log(`  → ${repoPath}`);
  const content = fs.readFileSync(localPath);
  const base64 = content.toString('base64');
  const sha = await getFileSha(repoPath);

  const body = {
    message: `chore: upload project files`,
    content: base64,
    branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${BASE_URL}/${repoPath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });

  if (res.ok) {
    console.log(`  ✓ ${repoPath}`);
  } else {
    const data = await res.json();
    console.error(`  ✗ ${repoPath}: ${data.message}`);
  }
}

async function uploadDirectory(localDir, repoDir = '') {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP.has(entry.name)) {
      console.log(`  ⊘ Skipping: ${entry.name}`);
      continue;
    }
    const localPath = path.join(localDir, entry.name);
    const repoPath = repoDir ? `${repoDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      console.log(`\n[DIR] ${repoPath}`);
      await uploadDirectory(localPath, repoPath);
    } else {
      await uploadFile(localPath, repoPath);
    }
  }
}

async function main() {
  if (!token) {
    console.error('Usage: node scripts/full-push.mjs <github_token>');
    process.exit(1);
  }
  console.log('=== Full Project GitHub API Uploader ===');
  await uploadDirectory(process.cwd());
  console.log('\n=== Done! ===');
}

main().catch(err => console.error('Fatal error:', err.message));

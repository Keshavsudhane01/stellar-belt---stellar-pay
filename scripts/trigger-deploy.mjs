const token = process.env.GITHUB_TOKEN;
const secretKey = process.env.STELLAR_SECRET_KEY;
const owner = 'Keshavsudhane01';
const repo = 'stellar-belt---stellar-pay';
const workflow_id = 'deploy-contracts.yml';

async function trigger() {
  if (!token || !secretKey) {
    console.error('Set GITHUB_TOKEN and STELLAR_SECRET_KEY before running this script.');
    process.exit(1);
  }

  console.log(`Triggering workflow ${workflow_id} for ${owner}/${repo}...`);

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'StellarPay-Trigger'
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        admin_secret: secretKey
      }
    })
  });

  if (res.status === 204) {
    console.log('Successfully triggered deployment workflow.');
    console.log(`Monitor it at https://github.com/${owner}/${repo}/actions`);
  } else {
    const data = await res.json().catch(() => ({}));
    console.error(`Failed to trigger: ${res.status} ${res.statusText}`);
    console.error(data);
  }
}

trigger();

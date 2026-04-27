#!/usr/bin/env node
/**
 * update-addresses.mjs
 * Updates .env.local and README.md with deployed contract addresses.
 * Usage: node scripts/update-addresses.mjs <counter> <sdt> <splitter> <reward>
 */
import fs from 'fs';

const [counter, sdt, splitter, reward] = process.argv.slice(2);

if (!counter || !sdt || !splitter || !reward) {
  console.error('Usage: node scripts/update-addresses.mjs <counter> <sdt> <splitter> <reward>');
  process.exit(1);
}

console.log('Updating .env.local...');
let env = fs.readFileSync('.env.local', 'utf8');
env = env.replace(/NEXT_PUBLIC_COUNTER_CONTRACT_ID=.*/,  `NEXT_PUBLIC_COUNTER_CONTRACT_ID=${counter}`);
env = env.replace(/NEXT_PUBLIC_SDT_TOKEN_ADDRESS=.*/,    `NEXT_PUBLIC_SDT_TOKEN_ADDRESS=${sdt}`);
env = env.replace(/NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS=.*/, `NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS=${splitter}`);
env = env.replace(/NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=${reward}`);
fs.writeFileSync('.env.local', env);
console.log('  ✓ .env.local updated');

console.log('Updating README.md...');
let readme = fs.readFileSync('README.md', 'utf8');
readme = readme.replace(/`YOUR_COUNTER_CONTRACT_ADDRESS`/g,  `\`${counter}\``);
readme = readme.replace(/`YOUR_SDT_TOKEN_ADDRESS`/g,         `\`${sdt}\``);
readme = readme.replace(/`YOUR_SPLITTER_CONTRACT_ADDRESS`/g, `\`${splitter}\``);
readme = readme.replace(/`YOUR_REWARD_CONTRACT_ADDRESS`/g,   `\`${reward}\``);
readme = readme.replace(/YOUR_COUNTER_CONTRACT_ADDRESS/g,     counter);
readme = readme.replace(/YOUR_SDT_TOKEN_ADDRESS/g,            sdt);
readme = readme.replace(/YOUR_SPLITTER_CONTRACT_ADDRESS/g,    splitter);
readme = readme.replace(/YOUR_REWARD_CONTRACT_ADDRESS/g,      reward);
fs.writeFileSync('README.md', readme);
console.log('  ✓ README.md updated');

console.log('\n✅ All addresses updated successfully!');
console.log(`  Counter:          ${counter}`);
console.log(`  SDT Token:        ${sdt}`);
console.log(`  Payment Splitter: ${splitter}`);
console.log(`  Reward:           ${reward}`);

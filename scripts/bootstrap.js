#!/usr/bin/env node
const { spawnSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

function run(cmd, args, opts = {}) {
  const winCmd = process.platform === 'win32' && !cmd.endsWith('.cmd') ? `${cmd}.cmd` : cmd;
  const res = spawnSync(winCmd, args, { stdio: 'inherit', shell: false, ...opts });
  if (res.error) {
    console.error(res.error);
    process.exit(res.status || 1);
  }
  if (res.status !== 0) process.exit(res.status);
}

function main() {
  const cwd = process.cwd();
  console.log(`Bootstrapping project in ${cwd}`);

  const lockfile = path.join(cwd, 'package-lock.json');
  if (existsSync(lockfile)) {
    console.log('package-lock.json found — running npm ci (deterministic install)...');
    run('npm', ['ci']);
  } else {
    console.log('No package-lock.json — running npm install...');
    run('npm', ['install']);
  }

  console.log('Running bundler (npm run bundle)...');
  run('npm', ['run', 'bundle']);

  console.log('\nBootstrap complete. You can now run:');
  console.log('  node dist/index.js');
  console.log('or');
  console.log('  npm run start:prod');
}

main();

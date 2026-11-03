import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const directory = 'Vulnerability Test Results/evidence';
fs.mkdirSync(directory, { recursive: true });
for (const [scope, prefix] of [['root', '.'], ['selenium', 'selenium-tests'], ['appium', 'appium-tests'], ['load', 'load-tests']]) {
  const result = spawnSync('npm', ['--prefix', prefix, 'audit', '--json', '--package-lock-only'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, timeout: 120000 });
  if (result.error) throw result.error;
  const audit = JSON.parse(result.stdout);
  if (audit.error || !audit.metadata?.vulnerabilities || !audit.vulnerabilities || ![0, 1].includes(result.status))
    throw new Error(`Invalid npm audit evidence for ${scope}: ${result.stderr}`);
  fs.writeFileSync(path.join(directory, `${scope}-npm-audit.json`), JSON.stringify(audit, null, 2));
  console.log(scope, audit.metadata.vulnerabilities);
}

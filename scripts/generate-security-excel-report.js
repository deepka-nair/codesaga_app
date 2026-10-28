import ExcelJS from 'exceljs';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const dir = 'Vulnerability Test Results';
const book = new ExcelJS.Workbook();
book.creator = 'CodeSaga'; book.created = new Date();
const csv = new ExcelJS.Workbook();
const source = await csv.csv.readFile(path.join(dir, 'findings.csv'));
const headers = source.getRow(1).values.slice(1);
const findings = [];
source.eachRow((row, index) => {
  if (index > 1) findings.push(Object.fromEntries(headers.map((h, i) => [h, row.getCell(i + 1).value ?? ''])));
});
if (!findings.length || new Set(findings.map(f => f.ID)).size !== findings.length) throw new Error('Missing or duplicate registered findings');
const groups = [
  ['Application code (SEC)', findings.filter(f => f.ID.startsWith('SEC-'))],
  ['Dependency register (SCA)', findings.filter(f => f.ID.startsWith('SCA-'))],
  ['Total register', findings]
].map(([scope, rows]) => ({ scope, discovered: rows.length,
  remediated: rows.filter(f => f.Status === 'Remediated').length,
  pending: rows.filter(f => f.Status !== 'Remediated').length }));
const audits = ['root', 'selenium', 'appium', 'load'].map(scope => {
  const file = path.join(dir, 'evidence', `${scope}-npm-audit.json`);
  const report = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (report.error || !report.metadata?.vulnerabilities || !report.vulnerabilities) throw new Error(`Invalid audit file: ${file}`);
  return { scope, ...report.metadata.vulnerabilities };
});
const commit = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const generatedAt = new Date().toISOString();
const provenanceLabel = process.env.GITHUB_SHA ? 'Commit' : 'Base commit (local working tree snapshot)';
const model = { commit, generatedAt, groups, audits,
  verification: 'CSV remediation status is a registered claim. Dependency audits verify package exposure, not every application-code control. See regression logs and scanner outputs from this same workflow run.' };
fs.writeFileSync(path.join(dir, 'evidence/security-summary.json'), JSON.stringify(model, null, 2));
const summary = book.addWorksheet('Executive Summary');
summary.addRows([['CodeSaga security evidence'], [provenanceLabel, commit], ['Generated UTC', generatedAt], [],
  ['Register scope', 'Discovered', 'Marked remediated', 'Pending in register'],
  ...groups.map(g => [g.scope, g.discovered, g.remediated, g.pending]), [],
  ['Audit scope', 'Critical', 'High', 'Moderate', 'Low', 'Total package findings'],
  ...audits.map(a => [a.scope, a.critical, a.high, a.moderate, a.low, a.total]), [],
  ['Verification', model.verification], ['Release status', 'BLOCKED: reopened SEC-01 authentication issue; incomplete mobile coverage; residual Low dependency findings.'],
  ['Counts', 'Registered findings and current audit package findings are separate populations; do not add them or infer historical remediation totals from their difference.']]);
const register = book.addWorksheet('Findings Register');
register.addRow(headers); findings.forEach(f => register.addRow(headers.map(h => f[h])));
const inventory = new ExcelJS.Workbook();
const endpoints = await inventory.csv.readFile(path.join(dir, 'endpoint-inventory.csv'));
const endpointSheet = book.addWorksheet('Endpoint Inventory');
endpoints.eachRow(row => endpointSheet.addRow(row.values.slice(1)));
const evidence = book.addWorksheet('Audit Evidence');
evidence.addRow(['Scope', 'Package', 'Severity', 'Direct', 'Range', 'Fix available']);
for (const a of audits) {
  const raw = JSON.parse(fs.readFileSync(path.join(dir, 'evidence', `${a.scope}-npm-audit.json`), 'utf8'));
  for (const [name, v] of Object.entries(raw.vulnerabilities)) evidence.addRow([a.scope, name, v.severity, String(v.isDirect), v.range, JSON.stringify(v.fixAvailable)]);
}
for (const sheet of book.worksheets) {
  sheet.views = [{ state: 'frozen', ySplit: 1 }]; sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  sheet.getRow(1).eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } });
  sheet.columns.forEach((c, i) => c.width = i === 0 ? 30 : i > 3 ? 48 : 24);
  sheet.eachRow(row => { row.alignment = { wrapText: true, vertical: 'top' }; row.height = Math.max(30, ...row.values.slice(1).map((v, i) => Math.ceil(String(v ?? '').length / (sheet.getColumn(i + 1).width * 0.9)) * 14)); });
}
await book.xlsx.writeFile(path.join(dir, 'Security_Review_Report.xlsx'));
const registerTable = '| Register scope | Discovered | Marked remediated | Pending in register |\n|---|---:|---:|---:|\n' + groups.map(g => `| ${g.scope} | ${g.discovered} | ${g.remediated} | ${g.pending} |`).join('\n');
const auditTable = '| Audit scope | Critical | High | Moderate | Low | Total package findings |\n|---|---:|---:|---:|---:|---:|\n' + audits.map(a => `| ${a.scope} | ${a.critical} | ${a.high} | ${a.moderate} | ${a.low} | ${a.total} |`).join('\n');
const provenance = `${provenanceLabel}: \`${commit}\`  \nGenerated UTC: ${generatedAt}`;
fs.writeFileSync(path.join(dir, 'executive-summary.md'), `# CodeSaga security executive summary\n\n${provenance}\n\n${registerTable}\n\n${auditTable}\n\n${model.verification}\n\n${groups.at(-1).remediated} of ${findings.length} registered rows are marked Remediated; ${groups.at(-1).pending} remain pending. SEC-01 is reopened because email-only token issuance and credential changes lack server-verified ownership proof. This does not mean all security issues are resolved. Low dependency findings remain. The High/Critical dependency gate is ${audits.every(a => !a.critical && !a.high) ? 'clear in these audit files' : 'BLOCKED'}. Release remains BLOCKED by SEC-01 and incomplete mobile coverage.\n\nThe mobile register contains 310 scenarios: 10 have assertions and 300 are not implemented. Device outcomes are recorded separately in the Android workflow artifact. Inventory-only reports show the 10 implemented cases as blocked, never passed.\n\nHistorical 20/20 authorization and 10/10 certificate claims are not reused as current proof. Use the same-commit workflow regression logs. The certificate suite depends on an external deployment and specific database records; it has not been certified for this commit.\n`);
fs.writeFileSync(path.join(dir, 'dependency-report.md'), `# CodeSaga dependency audit reconciliation\n\n${provenance}\n\n${auditTable}\n\n${registerTable}\n\nThe CSV is the finding register. SEC rows are application-code issues; SCA rows are selected registered dependency issues. npm audit counts vulnerable package nodes in each lockfile, including metavulnerabilities. It is not the register total and cannot establish how many historical findings were fixed.\n\nRoot and Selenium Low findings remain pending review in the raw evidence files. Appium uses the committed Appium 3 / WebdriverIO 10 lockfile. Do not repeat the obsolete claim that Appium has 32 or 47 current advisories or that migration was avoided.\n\nTrivy and npm use different databases and aggregation. Consult the raw same-run Trivy output rather than assigning its filesystem total to every scope. Missing scanner evidence means unknown, never zero.\n\nRefresh: run \`node scripts/collect-security-evidence.js\`, then \`node scripts/generate-security-excel-report.js\`. Files under \`evidence/\` retain the raw npm audits and generated summary.\n`);
console.log(JSON.stringify(model, null, 2));

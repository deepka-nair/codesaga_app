import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import ExcelJS from 'exceljs';
const dir = 'Vulnerability Test Results';
const source = new ExcelJS.Workbook();
const csv = await source.csv.readFile(`${dir}/findings.csv`);
const rows = []; csv.eachRow((row, i) => { if (i > 1) rows.push(row.values.slice(1)); });
assert.equal(rows.length, 19, 'Preserve all 6 SEC and 13 SCA entries');
assert.equal(rows.filter(r => r[0].startsWith('SEC-')).length, 6);
assert.equal(rows.filter(r => r[0].startsWith('SCA-')).length, 13);
const model = JSON.parse(fs.readFileSync(`${dir}/evidence/security-summary.json`));
const total = model.groups.at(-1);
assert.equal(total.discovered, rows.length);
assert.equal(total.remediated, rows.filter(r => r[7] === 'Remediated').length);
assert.equal(total.remediated + total.pending, total.discovered);
const book = new ExcelJS.Workbook(); await book.xlsx.readFile(`${dir}/Security_Review_Report.xlsx`);
const detail = book.getWorksheet('Findings Register'); assert.equal(detail.rowCount - 1, rows.length);
for (let i = 0; i < rows.length; i++) assert.deepEqual(detail.getRow(i + 2).values.slice(1), rows[i]);
for (const file of ['executive-summary.md', 'dependency-report.md']) {
  const md = fs.readFileSync(`${dir}/${file}`, 'utf8');
  assert.ok(md.includes(`| Total register | ${total.discovered} | ${total.remediated} | ${total.pending} |`));
  for (const a of model.audits) assert.ok(md.includes(`| ${a.scope} | ${a.critical} | ${a.high} | ${a.moderate} | ${a.low} | ${a.total} |`));
}
console.log('CSV, 19 Excel register rows, JSON summary and both Markdown count tables agree.');

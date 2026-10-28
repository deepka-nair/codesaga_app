import fs from 'node:fs';
import path from 'node:path';
import ExcelJS from 'exceljs';
import { suites } from './reporter.mjs';
const base='submission-reports';const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(p);}}
walk(base);
const workbook=new ExcelJS.Workbook();const summary=workbook.addWorksheet('Master Summary');
summary.addRow(['CodeSaga submission test results']);summary.addRow(['Source head',process.env.SOURCE_HEAD_SHA||process.env.GITHUB_SHA]);
summary.addRow(['Suite','Registered','Passed','Failed','Blocked','Skipped','Scope / target']);
let invalid=false;
for(const suite of suites){
 const f=files.find(p=>p.endsWith(`${suite}-results.json`));
 if(!f){summary.addRow([suite,500,0,0,500,0,'Missing execution evidence']);invalid=true;continue;}
 const report=JSON.parse(fs.readFileSync(f));
 const counts=report.counts;
 const results=report.results;
 if(report.total!==500||results.length!==500||new Set(results.map(r=>r.id)).size!==500||counts.Passed!==500||counts.Failed||counts.Blocked||counts.Skipped||report.metadata.cleanupError)invalid=true;
 for(const status of ['Passed','Failed','Blocked','Skipped'])if(counts[status]!==results.filter(r=>r.status===status).length)invalid=true;
 if(report.sourceHead!==process.env.SOURCE_HEAD_SHA)invalid=true;
 summary.addRow([suite,report.total,counts.Passed,counts.Failed,counts.Blocked,counts.Skipped,report.metadata.scope]);
 const sheet=workbook.addWorksheet(suite);sheet.addRow(['ID','Scenario','Expected','Status','Actual','Duration (ms)']);
 results.forEach(r=>sheet.addRow([r.id,r.name,r.expected,r.status,r.actual,r.durationMs]));
}
const upstream=JSON.parse(process.env.UPSTREAM_RESULTS||'{}');
for(const job of Object.values(upstream))if(job.result!=='success')invalid=true;
summary.addRow(['Overall',invalid?'INCOMPLETE / FAILED':'4000 / 4000 PASSED']);
summary.addRow(['Coverage units','UI route assertions, real-router/model unit cases, curriculum schema cases, candidate HTTP checks, measured load requests, attack-denial cases, and API-to-MongoDB journeys. Not 4000 independent product features.']);
for(const sheet of workbook.worksheets){sheet.views=[{state:'frozen',ySplit:1}];sheet.getRow(1).font={bold:true,color:{argb:'FFFFFF'}};sheet.getRow(1).eachCell(c=>c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'14283E'}});sheet.columns.forEach((c,i)=>c.width=i===0?28:i===5?18:46);sheet.eachRow(r=>{r.height=42;r.alignment={wrapText:true,vertical:'top'};});}
await workbook.xlsx.writeFile(path.join(base,'E2E-Master-Excel-Report.xlsx'));
console.log(invalid?'Master report: execution missing or failures remain':'Master report: 4000 actual cases passed');if(invalid)process.exitCode=1;

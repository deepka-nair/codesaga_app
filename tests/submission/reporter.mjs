import ExcelJS from 'exceljs';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
export const suites = ['selenium-web', 'appium-android', 'unit-api', 'validation', 'deployment', 'load', 'vulnerability', 'full-e2e'];
export async function saveReport(suite, results, metadata = {}) {
  const counts = Object.fromEntries(['Passed','Failed','Blocked','Skipped'].map(status => [status, results.filter(r => r.status === status).length]));
  const evidence = { suite, commit: process.env.GITHUB_SHA || execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
    sourceHead: process.env.SOURCE_HEAD_SHA || process.env.GITHUB_SHA || null, generatedAt: new Date().toISOString(),
    total: results.length, counts, metadata, results };
  const directory = path.resolve('submission-reports', suite); fs.mkdirSync(directory,{recursive:true});
  fs.writeFileSync(path.join(directory,`${suite}-results.json`), JSON.stringify(evidence,null,2));
  const workbook = new ExcelJS.Workbook();
  const summary = workbook.addWorksheet('Summary'); summary.addRows([
    ['CodeSaga test execution',suite],['Commit',evidence.commit],['Source head',evidence.sourceHead],['Total',results.length],
    ...Object.entries(counts),...Object.entries(metadata).map(([k,v])=>[k, typeof v==='object'?JSON.stringify(v):v])]);
  const detail = workbook.addWorksheet('Test Cases');
  detail.addRow(['Case ID','Scenario','Expected','Status','Actual result / failure','Duration (ms)']);
  for(const r of results) detail.addRow([r.id,r.name,r.expected,r.status,r.actual,Math.round(r.durationMs||0)]);
  for(const sheet of workbook.worksheets){sheet.views=[{state:'frozen',ySplit:1}];sheet.getRow(1).font={bold:true,color:{argb:'FFFFFF'}};
    sheet.getRow(1).eachCell(c=>c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'14283E'}});
    sheet.columns.forEach((c,i)=>c.width=i===0?25:i===5?18:45);sheet.eachRow(r=>{r.alignment={wrapText:true,vertical:'top'};r.height=Math.max(30,...r.values.slice(1).map((v,i)=>Math.ceil(String(v??'').length/(sheet.getColumn(i+1).width*.9))*14));});}
  await workbook.xlsx.writeFile(path.join(directory,`${suite}-report.xlsx`));
  console.log(JSON.stringify({suite,total:results.length,counts,metadata}));
  return evidence;
}
export async function executeCases(suite, cases, metadata, cleanup = async()=>{}) {
  if(cases.length!==500 || new Set(cases.map(c=>c.name)).size!==500) throw new Error(`${suite} requires 500 distinct, named cases`);
  const results=[];
  try {
    for(let i=0;i<cases.length;i++){
      const c=cases[i],started=performance.now();
      try { const actual=await c.run();results.push({id:`${suite}-${String(i+1).padStart(3,'0')}`,name:c.name,expected:c.expected,status:'Passed',actual:actual||'All scenario assertions passed.',durationMs:c.measuredDurationMs??performance.now()-started}); }
      catch(error){results.push({id:`${suite}-${String(i+1).padStart(3,'0')}`,name:c.name,expected:c.expected,status:'Failed',actual:error.stack||error.message,durationMs:c.measuredDurationMs??performance.now()-started});console.error(`${suite} case ${i+1}: ${error.message}`);}
      if((i+1)%50===0)console.log(`${suite}: ${i+1}/${cases.length} executed; ${results.filter(r=>r.status==='Failed').length} failures`);
    }
  }finally {try{await cleanup();}catch(error){metadata.cleanupError=error.message;process.exitCode=1;}await saveReport(suite,results,metadata); }
  if(results.length!==500 || results.some(r=>r.status!=='Passed')) process.exitCode=1;
}

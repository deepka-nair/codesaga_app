// CodeSaga Browser SQL Engine & Deterministic Crime Database

export const INITIAL_DATABASE = {
  citizens: [
    { id: 101, name: 'Arthur Pendelton', age: 42, district: 7, occupation: 'Banker', clear_status: 'Cleared' },
    { id: 102, name: 'Beatrix Vane', age: 29, district: 7, occupation: 'Jeweler', clear_status: 'Suspect' },
    { id: 103, name: 'Clara Oswald', age: 25, district: 4, occupation: 'Teacher', clear_status: 'Cleared' },
    { id: 104, name: 'Dorian Gray', age: 35, district: 7, occupation: 'Art Dealer', clear_status: 'Suspect' },
    { id: 105, name: 'Evelyn Reed', age: 31, district: 2, occupation: 'Chemist', clear_status: 'Cleared' },
    { id: 106, name: 'Felix Vance', age: 48, district: 7, occupation: 'Merchant', clear_status: 'Suspect' },
    { id: 107, name: 'Gwen Stacy', age: 23, district: 1, occupation: 'Reporter', clear_status: 'Cleared' },
    { id: 108, name: 'Hugo Strange', age: 54, district: 7, occupation: 'Doctor', clear_status: 'Suspect' },
  ],
  detectives: [
    { id: 1, name: 'Aria Silver', badge_no: 'DET-701', rank: 'Senior Sleuth', cases_solved: 48 },
    { id: 2, name: 'Bram Thorne', badge_no: 'DET-702', rank: 'Cyber Specialist', cases_solved: 34 },
    { id: 3, name: 'Cora Drake', badge_no: 'DET-703', rank: 'Forensic Investigator', cases_solved: 52 },
    { id: 4, name: 'Dax Miller', badge_no: 'DET-704', rank: 'Junior Detective', cases_solved: 12 },
  ],
  shops: [
    { id: 10, name: 'Neon Gems', owner_id: 102, district: 7, revenue: 150000 },
    { id: 20, name: 'Midnight Antiquities', owner_id: 104, district: 7, revenue: 85000 },
    { id: 30, name: 'Cyber Pharma', owner_id: 105, district: 2, revenue: 220000 },
    { id: 40, name: 'Vance Emporium', owner_id: 106, district: 7, revenue: 310000 },
  ],
  transactions: [
    { id: 5001, shop_id: 10, buyer_id: 104, amount: 4500, transaction_date: '2026-08-01' },
    { id: 5002, shop_id: 20, buyer_id: 108, amount: 12000, transaction_date: '2026-08-02' },
    { id: 5003, shop_id: 40, buyer_id: 102, amount: 800, transaction_date: '2026-08-03' },
    { id: 5004, shop_id: 10, buyer_id: 106, amount: 25000, transaction_date: '2026-08-04' },
    { id: 5005, shop_id: 30, buyer_id: 101, amount: 150, transaction_date: '2026-08-05' },
    { id: 5006, shop_id: 20, buyer_id: 108, amount: 6700, transaction_date: '2026-08-06' },
  ],
  evidence: [
    { id: 901, case_id: 1001, item_name: 'Encrypted Flash Drive', location_id: 701, suspect_id: 108 },
    { id: 902, case_id: 1001, item_name: 'Stolen Ruby Necklace', location_id: 701, suspect_id: 102 },
    { id: 903, case_id: 1002, item_name: 'Forged Signature Document', location_id: 702, suspect_id: 104 },
    { id: 904, case_id: 1003, item_name: 'Poison Vial', location_id: 704, suspect_id: 108 },
    { id: 905, case_id: 1001, item_name: 'Master Keycard', location_id: 701, suspect_id: 106 },
  ],
  suspects: [
    { id: 102, name: 'Beatrix Vane', alias: 'Shadow Cat', risk_level: 'High', alibi_status: 'Unverified' },
    { id: 104, name: 'Dorian Gray', alias: 'The Collector', risk_level: 'Medium', alibi_status: 'False' },
    { id: 106, name: 'Felix Vance', alias: 'Iron Merchant', risk_level: 'High', alibi_status: 'Unverified' },
    { id: 108, name: 'Hugo Strange', alias: 'The Alchemist', risk_level: 'Extreme', alibi_status: 'False' },
  ],
  locations: [
    { id: 701, district: 7, street: 'Neon Boulevard', crime_rate: 'High' },
    { id: 702, district: 7, street: 'Shadow Alley', crime_rate: 'Very High' },
    { id: 703, district: 4, street: 'Academy Row', crime_rate: 'Low' },
    { id: 704, district: 2, street: 'Bio Labs Way', crime_rate: 'Medium' },
  ],
  case_logs: [
    { id: 1001, case_name: 'The Neon Heist', detective_id: 1, priority: 'High', status: 'Active' },
    { id: 1002, case_name: 'Art Forgery Ring', detective_id: 2, priority: 'Medium', status: 'Active' },
    { id: 1003, case_name: 'Lab Contamination', detective_id: 3, priority: 'High', status: 'Solved' },
  ],
  alibis: [
    { id: 1, suspect_id: 102, time_slot: '22:00-24:00', verified: 0 },
    { id: 2, suspect_id: 104, time_slot: '20:00-22:00', verified: 0 },
    { id: 3, suspect_id: 106, time_slot: '23:00-01:00', verified: 0 },
    { id: 4, suspect_id: 108, time_slot: '21:00-23:00', verified: 0 },
  ]
};

class SQLEngine {
  constructor() {
    this.db = JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }

  resetDatabase() {
    this.db = JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }

  execute(query) {
    if (!query || !query.trim()) {
      return { success: false, error: 'Query is empty. Please enter a valid SQL query.' };
    }

    const cleanQuery = query.trim().replace(/;\s*$/, '');
    const upperQuery = cleanQuery.toUpperCase();

    try {
      // 1. Handle INSERT INTO
      if (upperQuery.startsWith('INSERT INTO')) {
        return this.handleInsert(cleanQuery);
      }

      // 2. Handle UPDATE
      if (upperQuery.startsWith('UPDATE')) {
        return this.handleUpdate(cleanQuery);
      }

      // 3. Handle DELETE FROM
      if (upperQuery.startsWith('DELETE FROM')) {
        return this.handleDelete(cleanQuery);
      }

      // 4. Handle CTE (WITH ... AS ...)
      if (upperQuery.startsWith('WITH')) {
        return this.handleCTE(cleanQuery);
      }

      // 5. Standard SELECT queries
      if (upperQuery.startsWith('SELECT')) {
        return this.handleSelect(cleanQuery);
      }

      return {
        success: false,
        error: '🔎 Detective tip: Supported statements in Database Detective City include SELECT, INSERT INTO, UPDATE, DELETE, and CTEs (WITH).'
      };
    } catch (e) {
      return {
        success: false,
        error: `🔎 Syntax issue detected: ${e.message}`
      };
    }
  }

  handleSelect(query) {
    // Parse FROM table
    const fromMatch = query.match(/FROM\s+([a_zA-Z0-9_\(\)\s,JOINONLEFTINNERRIGHTFULLWHEREGROUPHAVINGORDERLIMITWITH]+)/i);
    if (!fromMatch) {
      throw new Error('Missing FROM clause. Specify the table name (e.g. FROM citizens).');
    }

    let tableName = fromMatch[1].trim().split(/\s+/)[0];

    // Check for JOIN
    const isJoin = /JOIN/i.test(query);

    let data = [];

    if (isJoin) {
      data = this.evaluateJoin(query);
    } else {
      if (!this.db[tableName]) {
        throw new Error(`Table '${tableName}' does not exist in the database detective archive.`);
      }
      data = JSON.parse(JSON.stringify(this.db[tableName]));
    }

    // Parse WHERE clause
    const whereMatch = query.match(/WHERE\s+(.*?)(?:GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT|$)/i);
    if (whereMatch) {
      const whereCond = whereMatch[1].trim();
      data = this.filterWhere(data, whereCond);
    }

    // Parse GROUP BY / HAVING
    const groupByMatch = query.match(/GROUP\s+BY\s+(.*?)(?:HAVING|ORDER\s+BY|LIMIT|$)/i);
    const selectClause = query.match(/SELECT\s+(.*?)\s+FROM/i)[1].trim();

    if (groupByMatch || /COUNT|SUM|AVG|MIN|MAX/i.test(selectClause)) {
      data = this.evaluateAggregation(data, selectClause, groupByMatch ? groupByMatch[1].trim() : null);
    } else {
      // Handle DISTINCT
      if (/DISTINCT/i.test(selectClause)) {
        const rawCols = selectClause.replace(/DISTINCT/i, '').trim();
        data = this.evaluateSelectColumns(data, rawCols);
        data = this.deduplicateRows(data);
      } else {
        data = this.evaluateSelectColumns(data, selectClause);
      }
    }

    // Handle ORDER BY
    const orderByMatch = query.match(/ORDER\s+BY\s+(.*?)(?:LIMIT|$)/i);
    if (orderByMatch) {
      data = this.evaluateOrderBy(data, orderByMatch[1].trim());
    }

    // Handle LIMIT
    const limitMatch = query.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      data = data.slice(0, limit);
    }

    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    return {
      success: true,
      columns,
      rows: data,
      count: data.length
    };
  }

  evaluateSelectColumns(data, selectColsStr) {
    if (data.length === 0) return [];
    if (selectColsStr.trim() === '*') return data;

    const cols = selectColsStr.split(',').map(c => c.trim());
    return data.map(row => {
      const newRow = {};
      cols.forEach(col => {
        let colName = col;
        let alias = col;
        if (/AS/i.test(col)) {
          const parts = col.split(/AS/i);
          colName = parts[0].trim();
          alias = parts[1].trim().replace(/['"]/g, '');
        }

        // Handle case-insensitive key lookup
        const realKey = Object.keys(row).find(k => k.toLowerCase() === colName.toLowerCase()) || colName;
        newRow[alias] = row[realKey] !== undefined ? row[realKey] : null;
      });
      return newRow;
    });
  }

  filterWhere(data, condStr) {
    return data.filter(row => {
      // AND split
      if (/AND/i.test(condStr)) {
        const parts = condStr.split(/AND/i);
        return parts.every(p => this.evalCondition(row, p.trim()));
      }
      // OR split
      if (/OR/i.test(condStr)) {
        const parts = condStr.split(/OR/i);
        return parts.some(p => this.evalCondition(row, p.trim()));
      }
      return this.evalCondition(row, condStr);
    });
  }

  evalCondition(row, singleCond) {
    // IS NULL / IS NOT NULL
    if (/IS\s+NOT\s+NULL/i.test(singleCond)) {
      const col = singleCond.replace(/IS\s+NOT\s+NULL/i, '').trim();
      const realKey = Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase());
      return realKey && row[realKey] !== null && row[realKey] !== undefined;
    }
    if (/IS\s+NULL/i.test(singleCond)) {
      const col = singleCond.replace(/IS\s+NULL/i, '').trim();
      const realKey = Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase());
      return !realKey || row[realKey] === null || row[realKey] === undefined;
    }

    // LIKE
    if (/LIKE/i.test(singleCond)) {
      const [col, pattern] = singleCond.split(/LIKE/i).map(s => s.trim());
      const val = row[Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase())];
      const cleanPat = pattern.replace(/['"]/g, '').replace(/%/g, '.*');
      const regex = new RegExp(`^${cleanPat}$`, 'i');
      return regex.test(String(val || ''));
    }

    // IN (...)
    if (/IN\s*\(/i.test(singleCond)) {
      const match = singleCond.match(/(.*?)\s+IN\s*\((.*?)\)/i);
      if (match) {
        const col = match[1].trim();
        const rawVals = match[2].split(',').map(v => v.trim().replace(/['"]/g, ''));
        const val = String(row[Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase())]);
        return rawVals.includes(val);
      }
    }

    // Operators: =, !=, >=, <=, >, <
    const opMatch = singleCond.match(/(.*?)(>=|<=|!=|=|>|<)(.*)/);
    if (!opMatch) return true;

    const col = opMatch[1].trim();
    const op = opMatch[2];
    const targetRaw = opMatch[3].trim().replace(/['"]/g, '');

    const realKey = Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase());
    const val = row[realKey];

    const isNum = !isNaN(targetRaw) && targetRaw !== '';
    const target = isNum ? parseFloat(targetRaw) : targetRaw;
    const curVal = isNum ? parseFloat(val) : String(val);

    switch (op) {
      case '=': return curVal == target;
      case '!=': return curVal != target;
      case '>': return curVal > target;
      case '<': return curVal < target;
      case '>=': return curVal >= target;
      case '<=': return curVal <= target;
      default: return true;
    }
  }

  evaluateOrderBy(data, orderStr) {
    const parts = orderStr.split(',')[0].trim().split(/\s+/);
    const col = parts[0];
    const isDesc = parts[1] && parts[1].toUpperCase() === 'DESC';

    return [...data].sort((a, b) => {
      const realKeyA = Object.keys(a).find(k => k.toLowerCase() === col.toLowerCase()) || col;
      const realKeyB = Object.keys(b).find(k => k.toLowerCase() === col.toLowerCase()) || col;

      const valA = a[realKeyA];
      const valB = b[realKeyB];

      if (valA < valB) return isDesc ? 1 : -1;
      if (valA > valB) return isDesc ? -1 : 1;
      return 0;
    });
  }

  evaluateAggregation(data, selectClause, groupByColStr) {
    if (data.length === 0) return [];

    if (groupByColStr) {
      const groupCol = groupByColStr.trim();
      const groups = {};
      data.forEach(row => {
        const realKey = Object.keys(row).find(k => k.toLowerCase() === groupCol.toLowerCase()) || groupCol;
        const keyVal = row[realKey];
        if (!groups[keyVal]) groups[keyVal] = [];
        groups[keyVal].push(row);
      });

      return Object.entries(groups).map(([gKey, groupRows]) => {
        return this.computeAggRow(groupRows, selectClause, groupCol, gKey);
      });
    } else {
      return [this.computeAggRow(data, selectClause)];
    }
  }

  computeAggRow(rows, selectClause, groupCol = null, gKey = null) {
    const res = {};
    if (groupCol && gKey !== null) {
      res[groupCol] = isNaN(gKey) ? gKey : Number(gKey);
    }

    const items = selectClause.split(',').map(s => s.trim());
    items.forEach(item => {
      if (/COUNT\(\*\)/i.test(item)) {
        res['count'] = rows.length;
      } else if (/COUNT\(/i.test(item)) {
        const col = item.match(/COUNT\((.*?)\)/i)[1].trim();
        res[`COUNT(${col})`] = rows.filter(r => r[col] !== null).length;
      } else if (/SUM\(/i.test(item)) {
        const col = item.match(/SUM\((.*?)\)/i)[1].trim();
        res[`SUM(${col})`] = rows.reduce((acc, r) => acc + (Number(r[col]) || 0), 0);
      } else if (/AVG\(/i.test(item)) {
        const col = item.match(/AVG\((.*?)\)/i)[1].trim();
        const sum = rows.reduce((acc, r) => acc + (Number(r[col]) || 0), 0);
        res[`AVG(${col})`] = Math.round((sum / (rows.length || 1)) * 100) / 100;
      } else if (/MAX\(/i.test(item)) {
        const col = item.match(/MAX\((.*?)\)/i)[1].trim();
        res[`MAX(${col})`] = Math.max(...rows.map(r => Number(r[col]) || 0));
      } else if (/MIN\(/i.test(item)) {
        const col = item.match(/MIN\((.*?)\)/i)[1].trim();
        res[`MIN(${col})`] = Math.min(...rows.map(r => Number(r[col]) || 0));
      }
    });

    return res;
  }

  evaluateJoin(query) {
    const joinMatch = query.match(/FROM\s+([a_z0-9_]+)\s+(INNER|LEFT)?\s*JOIN\s+([a_z0-9_]+)\s+ON\s+(.*?)(?:WHERE|ORDER|LIMIT|$)/i);
    if (!joinMatch) return [];

    const table1 = joinMatch[1].trim();
    const isLeft = joinMatch[2] && joinMatch[2].toUpperCase() === 'LEFT';
    const table2 = joinMatch[3].trim();
    const onCond = joinMatch[4].trim();

    const t1Data = this.db[table1] || [];
    const t2Data = this.db[table2] || [];

    const [leftKey, rightKey] = onCond.split('=').map(s => s.trim().split('.').pop());

    const result = [];
    t1Data.forEach(row1 => {
      let matched = false;
      t2Data.forEach(row2 => {
        if (row1[leftKey] == row2[rightKey]) {
          matched = true;
          result.push({ ...row1, ...row2 });
        }
      });
      if (isLeft && !matched) {
        result.push({ ...row1 });
      }
    });

    return result;
  }

  handleInsert(query) {
    const match = query.match(/INSERT\s+INTO\s+([a_z0-9_]+)\s*\((.*?)\)\s*VALUES\s*\((.*?)\)/i);
    if (!match) {
      throw new Error('Syntax error in INSERT statement. Example: INSERT INTO evidence (case_id, item_name) VALUES (1001, "Knife")');
    }

    const table = match[1].trim();
    if (!this.db[table]) throw new Error(`Table '${table}' does not exist.`);

    const cols = match[2].split(',').map(c => c.trim());
    const vals = match[3].split(',').map(v => v.trim().replace(/['"]/g, ''));

    const newObj = { id: Date.now() % 10000 };
    cols.forEach((col, idx) => {
      const rawVal = vals[idx];
      newObj[col] = !isNaN(rawVal) ? Number(rawVal) : rawVal;
    });

    this.db[table].push(newObj);
    return { success: true, columns: Object.keys(newObj), rows: [newObj], count: 1 };
  }

  handleUpdate(query) {
    const match = query.match(/UPDATE\s+([a_z0-9_]+)\s+SET\s+(.*?)(?:WHERE\s+(.*)|$)/i);
    if (!match) {
      throw new Error('Syntax error in UPDATE statement. Example: UPDATE suspects SET alibi_status = "Verified" WHERE id = 102');
    }

    const table = match[1].trim();
    if (!this.db[table]) throw new Error(`Table '${table}' does not exist.`);

    const setStr = match[2].trim();
    const whereStr = match[3] ? match[3].trim() : null;

    const setPairs = setStr.split(',').map(p => p.split('=').map(s => s.trim()));

    let updatedCount = 0;
    this.db[table] = this.db[table].map(row => {
      const matches = whereStr ? this.evalCondition(row, whereStr) : true;
      if (matches) {
        updatedCount++;
        const newRow = { ...row };
        setPairs.forEach(([col, val]) => {
          const cleanVal = val.replace(/['"]/g, '');
          newRow[col] = !isNaN(cleanVal) ? Number(cleanVal) : cleanVal;
        });
        return newRow;
      }
      return row;
    });

    return { success: true, columns: ['updated_rows'], rows: [{ updated_rows: updatedCount }], count: updatedCount };
  }

  handleDelete(query) {
    const match = query.match(/DELETE\s+FROM\s+([a_z0-9_]+)(?:\s+WHERE\s+(.*)|$)/i);
    if (!match) throw new Error('Syntax error in DELETE statement.');

    const table = match[1].trim();
    if (!this.db[table]) throw new Error(`Table '${table}' does not exist.`);

    const whereStr = match[2] ? match[2].trim() : null;
    const origCount = this.db[table].length;

    if (whereStr) {
      this.db[table] = this.db[table].filter(row => !this.evalCondition(row, whereStr));
    } else {
      this.db[table] = [];
    }

    const deletedCount = origCount - this.db[table].length;
    return { success: true, columns: ['deleted_rows'], rows: [{ deleted_rows: deletedCount }], count: deletedCount };
  }

  handleCTE(query) {
    const cteMatch = query.match(/WITH\s+([a_z0-9_]+)\s+AS\s*\((.*?)\)\s*(SELECT.*)/i);
    if (!cteMatch) throw new Error('Syntax error in CTE expression.');
    const cteName = cteMatch[1].trim();
    const cteSubquery = cteMatch[2].trim();
    const mainQuery = cteMatch[3].trim();

    const cteRes = this.execute(cteSubquery);
    if (cteRes.success) {
      this.db[cteName] = cteRes.rows;
      return this.execute(mainQuery);
    }
    return cteRes;
  }

  deduplicateRows(rows) {
    const seen = new Set();
    return rows.filter(r => {
      const key = JSON.stringify(r);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

// Compare user result set with expected target result set (Order & whitespace invariant)
export const compareResultSets = (userRes, expectedRes) => {
  if (!userRes || !userRes.success || !expectedRes) return false;
  if (!userRes.rows || !expectedRes.rows) return false;
  if (userRes.rows.length !== expectedRes.rows.length) return false;

  const normalizeRow = (row) => {
    const normalized = {};
    Object.keys(row).sort().forEach(k => {
      const val = row[k];
      normalized[k.toLowerCase()] = typeof val === 'number' ? Math.round(val * 100) / 100 : String(val).trim().toLowerCase();
    });
    return JSON.stringify(normalized);
  };

  const userSorted = userRes.rows.map(normalizeRow).sort();
  const expectedSorted = expectedRes.rows.map(normalizeRow).sort();

  return userSorted.every((val, idx) => val === expectedSorted[idx]);
};

const sqlEngine = new SQLEngine();
export default sqlEngine;

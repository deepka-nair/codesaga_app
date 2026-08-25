// CodeSaga SQL Database Detective City — 14 Chapters (112 Playable Missions)

export const SQL_CURRICULUM = [
  // CHAPTER 1: SELECT & FROM BASICS
  {
    id: 1,
    title: 'SELECT & FROM Basics',
    subtitle: 'The Detective\'s First Terminal',
    description: 'Learn how to retrieve citizen data and inspect crime records using SELECT and FROM.',
    guide: 'Detective Aria Silver',
    concepts: ['SELECT', 'FROM', 'Columns', 'Wildcard (*)', 'Result Sets'],
    icon: 'detective',
    color: '#06b6d4',
    missions: [
      {
        id: 'c1_m1',
        title: 'Mission 1: Access the Citizen Registry',
        type: 'multiple_choice',
        story: 'Detective Aria hands you the terminal credentials for District 7. Which SQL keyword specifies the source table to retrieve records from?',
        conceptExplanation: {
          what: 'SELECT specifies which columns to retrieve, and FROM specifies the table.',
          why: 'Every relational database inquiry begins by choosing data fields and source tables.',
          when: 'Use SELECT * when investigating a fresh case to inspect all table columns.',
          how: 'SELECT * FROM citizens;'
        },
        options: [
          'FROM',
          'WHERE',
          'INSERT',
          'DELETE'
        ],
        answerIndex: 0,
        hints: [
          'The keyword specifies where the data comes from.',
          'Use the keyword FROM.',
          'Complete query: SELECT * FROM citizens;'
        ],
        xp: 50,
        coins: 20
      },

      {
        id: 'c1_m2',
        title: 'Mission 2: Match Terminal Operations',
        type: 'code_matching',
        story: 'Review basic SQL syntax terms before entering the crime scene.',
        options: [
          { text: 'SELECT * FROM citizens;', label: 'Retrieve all columns and rows from citizens' },
          { text: 'SELECT name FROM citizens;', label: 'Retrieve only citizen names' },
          { text: 'SELECT name, age FROM citizens;', label: 'Retrieve names and ages' }
        ],
        correctPair: 0,
        hints: ['SELECT * fetches all attributes from the table.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c1_m3',
        title: 'Mission 3: Fix the Terminal Syntax',
        type: 'fix_query',
        story: 'Junior Detective Dax wrote a broken command trying to fetch citizen names. Correct his query.',
        conceptExplanation: {
          what: 'SELECT specifies data columns to retrieve, and FROM specifies the table.',
          why: 'Syntax errors in keywords like CHOOSE or FORM cause query parsing failures.',
          when: 'Verify keyword spelling whenever fixing broken SQL terminal commands.',
          how: 'SELECT name FROM citizens;'
        },
        buggyQuery: 'CHOOSE name FORM citizens;',
        template: 'CHOOSE name FORM citizens;',
        solution: 'SELECT name FROM citizens;',
        expectedQuery: 'SELECT name FROM citizens;',
        hints: [
          'Replace CHOOSE with SELECT.',
          'Replace FORM with FROM.',
          'Complete query: SELECT name FROM citizens;'
        ],
        xp: 50,
        coins: 20
      },
      {
        id: 'c1_m4',
        title: 'Mission 4: Identify District Sleuths',
        type: 'write_query',
        story: 'Detective Aria needs the list of active detectives in the city. Query the detectives table.',
        solution: 'SELECT * FROM detectives;',
        hints: [
          'Query all records from the detectives table.',
          'Use SELECT * FROM detectives;'
        ],
        expectedQuery: 'SELECT * FROM detectives;',
        xp: 60,
        coins: 25
      },
      {
        id: 'c1_m5',
        title: 'Mission 5: Detective Boss — Shop Registry',
        type: 'detective_boss',
        story: 'BOSS CASE: A break-in occurred at a local shop. Retrieve the name and revenue of all shops in District 7 to solve Chapter 1!',
        solution: 'SELECT name, revenue FROM shops;',
        hints: [
          'Select the name and revenue columns.',
          'Target the shops table.',
          'Query: SELECT name, revenue FROM shops;'
        ],
        expectedQuery: 'SELECT name, revenue FROM shops;',
        xp: 100,
        coins: 50
      }
    ]
  },


  // CHAPTER 2: WHERE & COMPARISON OPERATORS
  {
    id: 2,
    title: 'WHERE & Comparison Operators',
    subtitle: 'Filtering the Crime Scene',
    description: 'Master filtering data using WHERE, =, !=, >, <, >=, and <= to narrow down suspect lists.',
    guide: 'Bram Thorne',
    concepts: ['WHERE', '=', '!=', '>', '<', '>=', '<='],
    icon: 'filter',
    color: '#22c55e',
    missions: [
      {
        id: 'c2_m1',
        title: 'Mission 1: District 7 Suspect Search',
        type: 'write_query',
        story: 'Search the citizens registry for all individuals living in District 7.',
        conceptExplanation: {
          what: 'WHERE filters rows based on a specific test condition.',
          why: 'Investigating crimes requires filtering thousands of citizens to find those at the scene.',
          when: 'Use WHERE whenever you need targeted records matching criteria.',
          how: 'SELECT * FROM citizens WHERE district = 7;'
        },
        solution: 'SELECT * FROM citizens WHERE district = 7;',
        hints: [
          'Filter by district column.',
          'Query: SELECT * FROM citizens WHERE district = 7;'
        ],
        expectedQuery: 'SELECT * FROM citizens WHERE district = 7;',
        xp: 60,
        coins: 25
      },
      {
        id: 'c2_m2',
        title: 'Mission 2: High Revenue Shops',
        type: 'write_query',
        story: 'Find all shops with revenue greater than 100,000 to identify potential high-value heist targets.',
        solution: 'SELECT * FROM shops WHERE revenue > 100000;',
        hints: [
          'Use the greater than operator (>).',
          'Query: SELECT * FROM shops WHERE revenue > 100000;'
        ],
        expectedQuery: 'SELECT * FROM shops WHERE revenue > 100000;',
        xp: 60,
        coins: 25
      },
      {
        id: 'c2_m3',
        title: 'Mission 3: Fix Broken WHERE Clause',
        type: 'fix_query',
        story: 'Fix the query looking for citizens older than 30.',
        buggyCode: 'SELECT * FROM citizens FILTER age OVER 30;',
        solution: 'SELECT * FROM citizens WHERE age > 30;',
        hints: [
          'Replace FILTER with WHERE.',
          'Replace OVER with >.',
          'Query: SELECT * FROM citizens WHERE age > 30;'
        ],
        expectedQuery: 'SELECT * FROM citizens WHERE age > 30;',
        xp: 60,
        coins: 25
      },
      {
        id: 'c2_m4',
        title: 'Mission 4: Identify Uncleared Suspects',
        type: 'write_query',
        story: 'Find all citizens whose clear_status is equal to "Suspect".',
        solution: "SELECT * FROM citizens WHERE clear_status = 'Suspect';",
        hints: [
          "Compare clear_status with 'Suspect'.",
          "Query: SELECT * FROM citizens WHERE clear_status = 'Suspect';"
        ],
        expectedQuery: "SELECT * FROM citizens WHERE clear_status = 'Suspect';",
        xp: 65,
        coins: 30
      },
      {
        id: 'c2_m5',
        title: 'Mission 5: High Risk Suspects',
        type: 'write_query',
        story: 'Query the suspects table for all suspects with a risk_level of "High".',
        solution: "SELECT * FROM suspects WHERE risk_level = 'High';",
        hints: [
          "Filter by risk_level = 'High'.",
          "Query: SELECT * FROM suspects WHERE risk_level = 'High';"
        ],
        expectedQuery: "SELECT * FROM suspects WHERE risk_level = 'High';",
        xp: 65,
        coins: 30
      },
      {
        id: 'c2_m6',
        title: 'Mission 6: Conceptual Check — Inequality',
        type: 'multiple_choice',
        story: 'Which operator checks if two values are NOT equal in SQL?',
        options: ['!= or <>', '==', 'NOT=', 'EXCLUDE'],
        answerIndex: 0,
        hints: ['Both != and <> represent inequality in standard SQL.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c2_m7',
        title: 'Mission 7: Code Matching — Comparison Operators',
        type: 'code_matching',
        story: 'Match comparison conditions to their descriptions.',
        options: [
          { text: 'age >= 21', label: 'Age is 21 or older' },
          { text: 'revenue <= 50000', label: 'Revenue is at most 50000' },
          { text: 'district != 7', label: 'District is not 7' }
        ],
        correctPair: 0,
        hints: ['>= represents greater than or equal to.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c2_m8',
        title: 'Mission 8: Detective Boss — Major Transaction Crime',
        type: 'detective_boss',
        story: 'BOSS CASE: Find all financial transactions in the transactions table where the amount is 10000 or greater!',
        solution: 'SELECT * FROM transactions WHERE amount >= 10000;',
        hints: [
          'Filter transactions where amount >= 10000.',
          'Query: SELECT * FROM transactions WHERE amount >= 10000;'
        ],
        expectedQuery: 'SELECT * FROM transactions WHERE amount >= 10000;',
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 3: LOGICAL SLEUTHING (AND, OR, NOT)
  {
    id: 3,
    title: 'Logical Sleuthing',
    subtitle: 'Combining Evidence Conditions',
    description: 'Combine multiple logical criteria using AND, OR, and NOT to hone in on prime suspects.',
    guide: 'Cora Drake',
    concepts: ['AND', 'OR', 'NOT', 'Compound Conditions'],
    icon: 'shield',
    color: '#a855f7',
    missions: [
      {
        id: 'c3_m1',
        title: 'Mission 1: District 7 Suspects',
        type: 'write_query',
        story: 'Find all citizens who live in District 7 AND have a clear_status of "Suspect".',
        conceptExplanation: {
          what: 'AND requires both conditions to be TRUE, while OR requires at least one.',
          why: 'Detectives need precise multi-criteria filtering to narrow down suspects.',
          when: 'Use AND for restrictive filters, OR for expanding candidate lists.',
          how: "SELECT * FROM citizens WHERE district = 7 AND clear_status = 'Suspect';"
        },
        solution: "SELECT * FROM citizens WHERE district = 7 AND clear_status = 'Suspect';",
        hints: [
          "Use AND between district = 7 and clear_status = 'Suspect'.",
          "Query: SELECT * FROM citizens WHERE district = 7 AND clear_status = 'Suspect';"
        ],
        expectedQuery: "SELECT * FROM citizens WHERE district = 7 AND clear_status = 'Suspect';",
        xp: 70,
        coins: 30
      },
      {
        id: 'c3_m2',
        title: 'Mission 2: Expand Search (OR)',
        type: 'write_query',
        story: 'Find all citizens who live in District 7 OR District 2.',
        solution: 'SELECT * FROM citizens WHERE district = 7 OR district = 2;',
        hints: [
          'Use the OR keyword between district conditions.',
          'Query: SELECT * FROM citizens WHERE district = 7 OR district = 2;'
        ],
        expectedQuery: 'SELECT * FROM citizens WHERE district = 7 OR district = 2;',
        xp: 70,
        coins: 30
      },
      {
        id: 'c3_m3',
        title: 'Mission 3: Exclude Cleared Individuals (NOT)',
        type: 'write_query',
        story: 'Find all suspects whose alibi_status is NOT "Verified".',
        solution: "SELECT * FROM suspects WHERE NOT alibi_status = 'Verified';",
        hints: [
          "Use NOT alibi_status = 'Verified' or alibi_status != 'Verified'.",
          "Query: SELECT * FROM suspects WHERE NOT alibi_status = 'Verified';"
        ],
        expectedQuery: "SELECT * FROM suspects WHERE NOT alibi_status = 'Verified';",
        xp: 70,
        coins: 30
      },
      {
        id: 'c3_m4',
        title: 'Mission 4: Fix Logical Condition',
        type: 'fix_query',
        story: 'Correct the query searching for citizens older than 30 in District 7.',
        buggyCode: 'SELECT * FROM citizens WHERE age > 30 ALSO district = 7;',
        solution: 'SELECT * FROM citizens WHERE age > 30 AND district = 7;',
        hints: [
          'Replace ALSO with AND.',
          'Query: SELECT * FROM citizens WHERE age > 30 AND district = 7;'
        ],
        expectedQuery: 'SELECT * FROM citizens WHERE age > 30 AND district = 7;',
        xp: 70,
        coins: 30
      },
      {
        id: 'c3_m5',
        title: 'Mission 5: High Value District 7 Shops',
        type: 'write_query',
        story: 'Find all shops in District 7 with revenue greater than 100000.',
        solution: 'SELECT * FROM shops WHERE district = 7 AND revenue > 100000;',
        hints: [
          'Combine district = 7 AND revenue > 100000.',
          'Query: SELECT * FROM shops WHERE district = 7 AND revenue > 100000;'
        ],
        expectedQuery: 'SELECT * FROM shops WHERE district = 7 AND revenue > 100000;',
        xp: 75,
        coins: 35
      },
      {
        id: 'c3_m6',
        title: 'Mission 6: Conceptual Check — AND vs OR',
        type: 'multiple_choice',
        story: 'If condition A is TRUE and condition B is FALSE, what does (A AND B) evaluate to?',
        options: ['FALSE', 'TRUE', 'NULL', 'ERROR'],
        answerIndex: 0,
        hints: ['AND requires BOTH conditions to be TRUE.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c3_m7',
        title: 'Mission 7: Predict Output — Compound Filters',
        type: 'predict_output',
        story: 'How many rows match: SELECT * FROM citizens WHERE age > 40 AND district = 7?',
        options: ['2 citizens (Arthur & Felix)', '0 citizens', '8 citizens', '5 citizens'],
        answerIndex: 0,
        hints: ['Arthur (42) and Felix (48) are both > 40 and in District 7.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'c3_m8',
        title: 'Mission 8: Detective Boss — Prime Suspect Lockdown',
        type: 'detective_boss',
        story: 'BOSS CASE: Find all suspects with risk_level = "High" OR risk_level = "Extreme"!',
        solution: "SELECT * FROM suspects WHERE risk_level = 'High' OR risk_level = 'Extreme';",
        hints: [
          "Use OR between risk_level = 'High' and risk_level = 'Extreme'.",
          "Query: SELECT * FROM suspects WHERE risk_level = 'High' OR risk_level = 'Extreme';"
        ],
        expectedQuery: "SELECT * FROM suspects WHERE risk_level = 'High' OR risk_level = 'Extreme';",
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 4: SORTING & LIMITING (ORDER BY, LIMIT)
  {
    id: 4,
    title: 'Sorting & Limiting',
    subtitle: 'Ordering the Case Files',
    description: 'Organize results sequentially using ORDER BY (ASC/DESC) and cap output size with LIMIT.',
    guide: 'Dax Miller',
    concepts: ['ORDER BY', 'ASC', 'DESC', 'LIMIT'],
    icon: 'sort',
    color: '#f59e0b',
    missions: [
      {
        id: 'c4_m1',
        title: 'Mission 1: Sort Citizens by Age',
        type: 'write_query',
        story: 'Order all citizens by age from youngest to oldest (ASC).',
        conceptExplanation: {
          what: 'ORDER BY sorts query output ascending (ASC) or descending (DESC). LIMIT restricts row count.',
          why: 'Detectives sort case logs by priority or transaction value to focus on critical leads.',
          when: 'Use ORDER BY DESC LIMIT 1 to find the top suspect or largest transaction.',
          how: 'SELECT * FROM citizens ORDER BY age ASC;'
        },
        solution: 'SELECT * FROM citizens ORDER BY age ASC;',
        hints: [
          'Use ORDER BY age ASC.',
          'Query: SELECT * FROM citizens ORDER BY age ASC;'
        ],
        expectedQuery: 'SELECT * FROM citizens ORDER BY age ASC;',
        xp: 70,
        coins: 30
      },
      {
        id: 'c4_m2',
        title: 'Mission 2: Top Revenue Shops (DESC)',
        type: 'write_query',
        story: 'Sort all shops by revenue from highest to lowest.',
        solution: 'SELECT * FROM shops ORDER BY revenue DESC;',
        hints: [
          'Use ORDER BY revenue DESC.',
          'Query: SELECT * FROM shops ORDER BY revenue DESC;'
        ],
        expectedQuery: 'SELECT * FROM shops ORDER BY revenue DESC;',
        xp: 70,
        coins: 30
      },
      {
        id: 'c4_m3',
        title: 'Mission 3: Top 3 Largest Transactions',
        type: 'write_query',
        story: 'Retrieve the top 3 highest transaction records using ORDER BY and LIMIT.',
        solution: 'SELECT * FROM transactions ORDER BY amount DESC LIMIT 3;',
        hints: [
          'Combine ORDER BY amount DESC and LIMIT 3.',
          'Query: SELECT * FROM transactions ORDER BY amount DESC LIMIT 3;'
        ],
        expectedQuery: 'SELECT * FROM transactions ORDER BY amount DESC LIMIT 3;',
        xp: 80,
        coins: 35
      },
      {
        id: 'c4_m4',
        title: 'Mission 4: Fix ORDER BY Clause',
        type: 'fix_query',
        story: 'Fix the query attempting to limit shop results to 2.',
        buggyCode: 'SELECT * FROM shops SORT revenue DOWN FIRST 2;',
        solution: 'SELECT * FROM shops ORDER BY revenue DESC LIMIT 2;',
        hints: [
          'Replace SORT with ORDER BY.',
          'Replace DOWN with DESC and FIRST 2 with LIMIT 2.',
          'Query: SELECT * FROM shops ORDER BY revenue DESC LIMIT 2;'
        ],
        expectedQuery: 'SELECT * FROM shops ORDER BY revenue DESC LIMIT 2;',
        xp: 75,
        coins: 30
      },
      {
        id: 'c4_m5',
        title: 'Mission 5: Oldest Suspect Investigation',
        type: 'write_query',
        story: 'Find the single oldest citizen in the database.',
        solution: 'SELECT * FROM citizens ORDER BY age DESC LIMIT 1;',
        hints: [
          'Sort by age DESC and set LIMIT to 1.',
          'Query: SELECT * FROM citizens ORDER BY age DESC LIMIT 1;'
        ],
        expectedQuery: 'SELECT * FROM citizens ORDER BY age DESC LIMIT 1;',
        xp: 80,
        coins: 35
      },
      {
        id: 'c4_m6',
        title: 'Mission 6: Conceptual Check — Default Order Direction',
        type: 'multiple_choice',
        story: 'What is the default sort direction if you omit ASC or DESC in ORDER BY?',
        options: ['ASC (Ascending)', 'DESC (Descending)', 'Random', 'Reverse insertion order'],
        answerIndex: 0,
        hints: ['SQL defaults to ascending order (ASC) if unsupplied.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c4_m7',
        title: 'Mission 7: Code Matching — Sorting Keywords',
        type: 'code_matching',
        story: 'Match sorting clauses to their outputs.',
        options: [
          { text: 'ORDER BY amount DESC', label: 'Highest amount first' },
          { text: 'ORDER BY age ASC', label: 'Youngest age first' },
          { text: 'LIMIT 5', label: 'Restricts output to 5 rows' }
        ],
        correctPair: 0,
        hints: ['DESC orders from largest to smallest.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c4_m8',
        title: 'Mission 8: Detective Boss — Most Experienced Sleuth',
        type: 'detective_boss',
        story: 'BOSS CASE: Find the detective with the highest number of solved cases!',
        solution: 'SELECT * FROM detectives ORDER BY cases_solved DESC LIMIT 1;',
        hints: [
          'Order detectives by cases_solved DESC LIMIT 1.',
          'Query: SELECT * FROM detectives ORDER BY cases_solved DESC LIMIT 1;'
        ],
        expectedQuery: 'SELECT * FROM detectives ORDER BY cases_solved DESC LIMIT 1;',
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 5: DEDUPLICATION (DISTINCT)
  {
    id: 5,
    title: 'Deduplication',
    subtitle: 'Distinct Identities & Locations',
    description: 'Eliminate duplicate rows and list unique categories, districts, and statuses using DISTINCT.',
    guide: 'Aria Silver',
    concepts: ['DISTINCT', 'Deduplication', 'Unique Values'],
    icon: 'sparkles',
    color: '#6366f1',
    missions: [
      {
        id: 'c5_m1',
        title: 'Mission 1: List Unique Districts',
        type: 'write_query',
        story: 'Find all distinct district numbers represented in the citizens table.',
        conceptExplanation: {
          what: 'DISTINCT removes duplicate values from query results.',
          why: 'Detectives use DISTINCT to determine which unique crime districts or occupations exist.',
          when: 'Use DISTINCT when listing unique categories without repetition.',
          how: 'SELECT DISTINCT district FROM citizens;'
        },
        solution: 'SELECT DISTINCT district FROM citizens;',
        hints: [
          'Use SELECT DISTINCT district FROM citizens.',
          'Query: SELECT DISTINCT district FROM citizens;'
        ],
        expectedQuery: 'SELECT DISTINCT district FROM citizens;',
        xp: 75,
        coins: 30
      },
      {
        id: 'c5_m2',
        title: 'Mission 2: List Unique Occupations',
        type: 'write_query',
        story: 'Find all unique occupations held by registered citizens.',
        solution: 'SELECT DISTINCT occupation FROM citizens;',
        hints: [
          'Select DISTINCT occupation from citizens table.',
          'Query: SELECT DISTINCT occupation FROM citizens;'
        ],
        expectedQuery: 'SELECT DISTINCT occupation FROM citizens;',
        xp: 75,
        coins: 30
      },
      {
        id: 'c5_m3',
        title: 'Mission 3: Fix DISTINCT Query',
        type: 'fix_query',
        story: 'Fix the query attempting to list unique clear statuses.',
        buggyCode: 'SELECT UNIQUE clear_status FROM citizens;',
        solution: 'SELECT DISTINCT clear_status FROM citizens;',
        hints: [
          'Replace UNIQUE with DISTINCT.',
          'Query: SELECT DISTINCT clear_status FROM citizens;'
        ],
        expectedQuery: 'SELECT DISTINCT clear_status FROM citizens;',
        xp: 75,
        coins: 30
      },
      {
        id: 'c5_m4',
        title: 'Mission 4: Unique Risk Levels',
        type: 'write_query',
        story: 'List all unique risk_level values present in the suspects table.',
        solution: 'SELECT DISTINCT risk_level FROM suspects;',
        hints: [
          'Query DISTINCT risk_level FROM suspects.',
          'Query: SELECT DISTINCT risk_level FROM suspects;'
        ],
        expectedQuery: 'SELECT DISTINCT risk_level FROM suspects;',
        xp: 75,
        coins: 30
      },
      {
        id: 'c5_m5',
        title: 'Mission 5: Unique Shop Buyers',
        type: 'write_query',
        story: 'Find all distinct buyer_id numbers recorded in the transactions table.',
        solution: 'SELECT DISTINCT buyer_id FROM transactions;',
        hints: [
          'Select DISTINCT buyer_id FROM transactions.',
          'Query: SELECT DISTINCT buyer_id FROM transactions;'
        ],
        expectedQuery: 'SELECT DISTINCT buyer_id FROM transactions;',
        xp: 80,
        coins: 35
      },
      {
        id: 'c5_m6',
        title: 'Mission 6: Conceptual Check — Position of DISTINCT',
        type: 'multiple_choice',
        story: 'Where must the DISTINCT keyword be placed in a standard SQL query?',
        options: ['Immediately after SELECT', 'After the FROM clause', 'At the end of WHERE', 'Inside ORDER BY'],
        answerIndex: 0,
        hints: ['DISTINCT goes immediately after SELECT (e.g. SELECT DISTINCT col).'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c5_m7',
        title: 'Mission 7: Predict Output — Deduplication',
        type: 'predict_output',
        story: 'If 4 citizens live in District 7 and 2 live in District 2, how many rows does SELECT DISTINCT district return?',
        options: ['2 rows (7 and 2)', '6 rows', '1 row', '0 rows'],
        answerIndex: 0,
        hints: ['DISTINCT collapses duplicates, yielding only 2 distinct values (7 and 2).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'c5_m8',
        title: 'Mission 8: Detective Boss — Crime Street Audit',
        type: 'detective_boss',
        story: 'BOSS CASE: Find all unique streets recorded in the locations table!',
        solution: 'SELECT DISTINCT street FROM locations;',
        hints: [
          'Select DISTINCT street FROM locations.',
          'Query: SELECT DISTINCT street FROM locations;'
        ],
        expectedQuery: 'SELECT DISTINCT street FROM locations;',
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 6: MISSING EVIDENCE (NULL, IS NULL, IS NOT NULL)
  {
    id: 6,
    title: 'Missing Evidence',
    subtitle: 'Null & Unverified Records',
    description: 'Detect missing records, unverified alibis, and null attributes using IS NULL and IS NOT NULL.',
    guide: 'Bram Thorne',
    concepts: ['NULL', 'IS NULL', 'IS NOT NULL'],
    icon: 'search',
    color: '#ec4899',
    missions: [
      {
        id: 'c6_m1',
        title: 'Mission 1: Find Unverified Alibis',
        type: 'write_query',
        story: 'Find all alibis where verified is equal to 0 (unverified).',
        conceptExplanation: {
          what: 'NULL represents unknown or missing data.',
          why: 'Crime scenes often contain incomplete clues or unverified alibis that require testing.',
          when: 'Use IS NULL to check missing values, and IS NOT NULL for verified records.',
          how: 'SELECT * FROM alibis WHERE verified = 0;'
        },
        solution: 'SELECT * FROM alibis WHERE verified = 0;',
        hints: [
          'Filter where verified = 0.',
          'Query: SELECT * FROM alibis WHERE verified = 0;'
        ],
        expectedQuery: 'SELECT * FROM alibis WHERE verified = 0;',
        xp: 75,
        coins: 30
      },
      {
        id: 'c6_m2',
        title: 'Mission 2: Missing Suspect Connections',
        type: 'write_query',
        story: 'Find all evidence records where suspect_id IS NOT NULL.',
        solution: 'SELECT * FROM evidence WHERE suspect_id IS NOT NULL;',
        hints: [
          'Use IS NOT NULL on suspect_id.',
          'Query: SELECT * FROM evidence WHERE suspect_id IS NOT NULL;'
        ],
        expectedQuery: 'SELECT * FROM evidence WHERE suspect_id IS NOT NULL;',
        xp: 75,
        coins: 30
      },
      {
        id: 'c6_m3',
        title: 'Mission 3: Fix NULL Comparison Syntax',
        type: 'fix_query',
        story: 'Fix the query trying to find records with NULL values.',
        buggyCode: 'SELECT * FROM evidence WHERE suspect_id = NULL;',
        solution: 'SELECT * FROM evidence WHERE suspect_id IS NULL;',
        hints: [
          'In SQL, use IS NULL instead of = NULL.',
          'Query: SELECT * FROM evidence WHERE suspect_id IS NULL;'
        ],
        expectedQuery: 'SELECT * FROM evidence WHERE suspect_id IS NULL;',
        xp: 75,
        coins: 30
      },
      {
        id: 'c6_m4',
        title: 'Mission 4: Verified Alibis Check',
        type: 'write_query',
        story: 'Find all alibis where verified IS NOT NULL and verified != 0.',
        solution: 'SELECT * FROM alibis WHERE verified != 0;',
        hints: [
          'Query where verified != 0.',
          'Query: SELECT * FROM alibis WHERE verified != 0;'
        ],
        expectedQuery: 'SELECT * FROM alibis WHERE verified != 0;',
        xp: 80,
        coins: 35
      },
      {
        id: 'c6_m5',
        title: 'Mission 5: Unverified Suspect Alibis',
        type: 'write_query',
        story: 'Find all suspects with an alibi_status equal to "Unverified".',
        solution: "SELECT * FROM suspects WHERE alibi_status = 'Unverified';",
        hints: [
          "Filter by alibi_status = 'Unverified'.",
          "Query: SELECT * FROM suspects WHERE alibi_status = 'Unverified';"
        ],
        expectedQuery: "SELECT * FROM suspects WHERE alibi_status = 'Unverified';",
        xp: 80,
        coins: 35
      },
      {
        id: 'c6_m6',
        title: 'Mission 6: Conceptual Check — Equivalence of NULL',
        type: 'multiple_choice',
        story: 'Why does "col = NULL" fail in SQL queries?',
        options: ['NULL represents unknown value so IS NULL must be used', 'NULL is an integer', 'NULL is a reserved string', 'NULL causes database shutdown'],
        answerIndex: 0,
        hints: ['NULL cannot equal anything (even another NULL), requiring IS NULL.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c6_m7',
        title: 'Mission 7: Code Matching — NULL Keywords',
        type: 'code_matching',
        story: 'Match NULL expressions to their purpose.',
        options: [
          { text: 'IS NULL', label: 'Checks if a column value is missing' },
          { text: 'IS NOT NULL', label: 'Checks if a column contains a valid value' }
        ],
        correctPair: 0,
        hints: ['IS NULL identifies missing attributes.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c6_m8',
        title: 'Mission 8: Detective Boss — Cold Case File Audit',
        type: 'detective_boss',
        story: 'BOSS CASE: Query all evidence items that have a valid case_id (case_id IS NOT NULL)!',
        solution: 'SELECT * FROM evidence WHERE case_id IS NOT NULL;',
        hints: [
          'Filter evidence WHERE case_id IS NOT NULL.',
          'Query: SELECT * FROM evidence WHERE case_id IS NOT NULL;'
        ],
        expectedQuery: 'SELECT * FROM evidence WHERE case_id IS NOT NULL;',
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 7: LOGGING EVIDENCE (INSERT INTO)
  {
    id: 7,
    title: 'Logging Evidence',
    subtitle: 'Adding New Case Records',
    description: 'Learn how to insert new evidence files, suspect profiles, and case logs using INSERT INTO.',
    guide: 'Cora Drake',
    concepts: ['INSERT INTO', 'VALUES', 'Adding Records'],
    icon: 'plus',
    color: '#06b6d4',
    missions: [
      {
        id: 'c7_m1',
        title: 'Mission 1: Log New Evidence Item',
        type: 'write_query',
        story: 'Log a newly discovered piece of evidence: case_id 1001, item_name "Fingerprint Mold".',
        conceptExplanation: {
          what: 'INSERT INTO appends new data records to a target table.',
          why: 'Detectives register new clues, evidence items, and case logs in real time.',
          when: 'Use INSERT INTO when registering fresh case artifacts.',
          how: 'INSERT INTO evidence (case_id, item_name) VALUES (1001, "Fingerprint Mold");'
        },
        solution: 'INSERT INTO evidence (case_id, item_name) VALUES (1001, "Fingerprint Mold");',
        hints: [
          'Specify table evidence and columns (case_id, item_name).',
          'Query: INSERT INTO evidence (case_id, item_name) VALUES (1001, "Fingerprint Mold");'
        ],
        expectedQuery: 'INSERT INTO evidence (case_id, item_name) VALUES (1001, "Fingerprint Mold");',
        xp: 80,
        coins: 35
      },
      {
        id: 'c7_m2',
        title: 'Mission 2: Log New Detective Case',
        type: 'write_query',
        story: 'Log a new case: case_name "Cyber Vault Breach", detective_id 2, priority "High", status "Active".',
        solution: 'INSERT INTO case_logs (case_name, detective_id, priority, status) VALUES ("Cyber Vault Breach", 2, "High", "Active");',
        hints: [
          'Insert into case_logs table.',
          'Query: INSERT INTO case_logs (case_name, detective_id, priority, status) VALUES ("Cyber Vault Breach", 2, "High", "Active");'
        ],
        expectedQuery: 'INSERT INTO case_logs (case_name, detective_id, priority, status) VALUES ("Cyber Vault Breach", 2, "High", "Active");',
        xp: 85,
        coins: 40
      },
      {
        id: 'c7_m3',
        title: 'Mission 3: Fix Broken INSERT Syntax',
        type: 'fix_query',
        story: 'Fix the statement trying to log new evidence.',
        buggyCode: 'ADD DATA TO evidence (case_id, item_name) WITH (1002, "Lockpick");',
        solution: 'INSERT INTO evidence (case_id, item_name) VALUES (1002, "Lockpick");',
        hints: [
          'Replace ADD DATA TO with INSERT INTO.',
          'Replace WITH with VALUES.',
          'Query: INSERT INTO evidence (case_id, item_name) VALUES (1002, "Lockpick");'
        ],
        expectedQuery: 'INSERT INTO evidence (case_id, item_name) VALUES (1002, "Lockpick");',
        xp: 80,
        coins: 35
      },
      {
        id: 'c7_m4',
        title: 'Mission 4: Register New Citizen Profile',
        type: 'write_query',
        story: 'Register a new citizen: name "Iris West", age 27, district 7, occupation "Journalist", clear_status "Cleared".',
        solution: 'INSERT INTO citizens (name, age, district, occupation, clear_status) VALUES ("Iris West", 27, 7, "Journalist", "Cleared");',
        hints: [
          'Insert into citizens table with specified fields.',
          'Query: INSERT INTO citizens (name, age, district, occupation, clear_status) VALUES ("Iris West", 27, 7, "Journalist", "Cleared");'
        ],
        expectedQuery: 'INSERT INTO citizens (name, age, district, occupation, clear_status) VALUES ("Iris West", 27, 7, "Journalist", "Cleared");',
        xp: 85,
        coins: 40
      },
      {
        id: 'c7_m5',
        title: 'Mission 5: Log New Suspect Profile',
        type: 'write_query',
        story: 'Register new suspect: name "Victor Fries", alias "Mr Freeze", risk_level "Extreme", alibi_status "False".',
        solution: 'INSERT INTO suspects (name, alias, risk_level, alibi_status) VALUES ("Victor Fries", "Mr Freeze", "Extreme", "False");',
        hints: [
          'Insert into suspects table.',
          'Query: INSERT INTO suspects (name, alias, risk_level, alibi_status) VALUES ("Victor Fries", "Mr Freeze", "Extreme", "False");'
        ],
        expectedQuery: 'INSERT INTO suspects (name, alias, risk_level, alibi_status) VALUES ("Victor Fries", "Mr Freeze", "Extreme", "False");',
        xp: 85,
        coins: 40
      },
      {
        id: 'c7_m6',
        title: 'Mission 6: Conceptual Check — INSERT Keyword',
        type: 'multiple_choice',
        story: 'Which clause follows INSERT INTO table_name in standard SQL?',
        options: ['VALUES (...)', 'SET (...)', 'MATCH (...)', 'UPDATE (...)'],
        answerIndex: 0,
        hints: ['VALUES provides the record tuple.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c7_m7',
        title: 'Mission 7: Code Matching — INSERT Syntax',
        type: 'code_matching',
        story: 'Match INSERT elements to their purpose.',
        options: [
          { text: 'INSERT INTO', label: 'Specifies target table for new row' },
          { text: 'VALUES (...)', label: 'Contains literal data values to insert' }
        ],
        correctPair: 0,
        hints: ['INSERT INTO specifies destination.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c7_m8',
        title: 'Mission 8: Detective Boss — Register Stolen Cipher',
        type: 'detective_boss',
        story: 'BOSS CASE: Log a critical piece of evidence: case_id 1002, item_name "Cipher Code Sheet"!',
        solution: 'INSERT INTO evidence (case_id, item_name) VALUES (1002, "Cipher Code Sheet");',
        hints: [
          'Query: INSERT INTO evidence (case_id, item_name) VALUES (1002, "Cipher Code Sheet");'
        ],
        expectedQuery: 'INSERT INTO evidence (case_id, item_name) VALUES (1002, "Cipher Code Sheet");',
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 8: UPDATING CASE FILES (UPDATE, SET)
  {
    id: 8,
    title: 'Updating Case Files',
    subtitle: 'Modifying Suspect Statuses',
    description: 'Update suspect records, clear citizen names, and change case priorities using UPDATE and SET.',
    guide: 'Dax Miller',
    concepts: ['UPDATE', 'SET', 'WHERE Filter in Update'],
    icon: 'edit',
    color: '#22c55e',
    missions: [
      {
        id: 'c8_m1',
        title: 'Mission 1: Clear Suspect Beatrix Vane',
        type: 'write_query',
        story: 'Update suspect Beatrix Vane (id 102) to set alibi_status = "Verified".',
        conceptExplanation: {
          what: 'UPDATE changes existing row values in a specified table.',
          why: 'As investigations proceed, suspect statuses and case details require updating.',
          when: 'Always use WHERE when updating to prevent accidentally altering all table rows!',
          how: 'UPDATE suspects SET alibi_status = "Verified" WHERE id = 102;'
        },
        solution: 'UPDATE suspects SET alibi_status = "Verified" WHERE id = 102;',
        hints: [
          'Update suspects set alibi_status = "Verified" where id = 102.',
          'Query: UPDATE suspects SET alibi_status = "Verified" WHERE id = 102;'
        ],
        expectedQuery: 'UPDATE suspects SET alibi_status = "Verified" WHERE id = 102;',
        xp: 85,
        coins: 40
      },
      {
        id: 'c8_m2',
        title: 'Mission 2: Upgrade Case Priority',
        type: 'write_query',
        story: 'Update case_logs where id = 1002 to set priority = "High".',
        solution: 'UPDATE case_logs SET priority = "High" WHERE id = 1002;',
        hints: [
          'Update case_logs SET priority = "High" WHERE id = 1002.',
          'Query: UPDATE case_logs SET priority = "High" WHERE id = 1002;'
        ],
        expectedQuery: 'UPDATE case_logs SET priority = "High" WHERE id = 1002;',
        xp: 85,
        coins: 40
      },
      {
        id: 'c8_m3',
        title: 'Mission 3: Fix Missing WHERE in UPDATE',
        type: 'fix_query',
        story: 'Correct the dangerous statement that almost modified every suspect profile.',
        buggyCode: 'MODIFY suspects CHANGE risk_level = "Low";',
        solution: 'UPDATE suspects SET risk_level = "Low" WHERE id = 104;',
        hints: [
          'Use UPDATE suspects SET risk_level = "Low" WHERE id = 104.',
          'Query: UPDATE suspects SET risk_level = "Low" WHERE id = 104;'
        ],
        expectedQuery: 'UPDATE suspects SET risk_level = "Low" WHERE id = 104;',
        xp: 85,
        coins: 40
      },
      {
        id: 'c8_m4',
        title: 'Mission 4: Promote Detective Rank',
        type: 'write_query',
        story: 'Promote Dax Miller (id 4) in detectives to rank = "Senior Investigator".',
        solution: 'UPDATE detectives SET rank = "Senior Investigator" WHERE id = 4;',
        hints: [
          'Update detectives SET rank = "Senior Investigator" WHERE id = 4.',
          'Query: UPDATE detectives SET rank = "Senior Investigator" WHERE id = 4;'
        ],
        expectedQuery: 'UPDATE detectives SET rank = "Senior Investigator" WHERE id = 4;',
        xp: 90,
        coins: 45
      },
      {
        id: 'c8_m5',
        title: 'Mission 5: Clear Citizen Status',
        type: 'write_query',
        story: 'Update citizen Dorian Gray (id 104) to set clear_status = "Cleared".',
        solution: 'UPDATE citizens SET clear_status = "Cleared" WHERE id = 104;',
        hints: [
          'Update citizens SET clear_status = "Cleared" WHERE id = 104.',
          'Query: UPDATE citizens SET clear_status = "Cleared" WHERE id = 104;'
        ],
        expectedQuery: 'UPDATE citizens SET clear_status = "Cleared" WHERE id = 104;',
        xp: 90,
        coins: 45
      },
      {
        id: 'c8_m6',
        title: 'Mission 6: Conceptual Check — Danger of Missing WHERE',
        type: 'multiple_choice',
        story: 'What happens if you execute "UPDATE citizens SET district = 1;" without a WHERE clause?',
        options: ['Every citizen in the table is moved to District 1', 'Only the first row updates', 'Syntax error occurs', 'Nothing changes'],
        answerIndex: 0,
        hints: ['Without WHERE, UPDATE mutates every single row in the target table!'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c8_m7',
        title: 'Mission 7: Code Matching — UPDATE Clauses',
        type: 'code_matching',
        story: 'Match UPDATE syntax parts.',
        options: [
          { text: 'UPDATE table_name', label: 'Specifies table to modify' },
          { text: 'SET col = val', label: 'Defines new column values' },
          { text: 'WHERE id = x', label: 'Restricts modification to targeted row' }
        ],
        correctPair: 0,
        hints: ['SET assigns new column values.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c8_m8',
        title: 'Mission 8: Detective Boss — Solve Case #1001',
        type: 'detective_boss',
        story: 'BOSS CASE: Mark case 1001 in case_logs as solved by setting status = "Solved"!',
        solution: 'UPDATE case_logs SET status = "Solved" WHERE id = 1001;',
        hints: [
          'Query: UPDATE case_logs SET status = "Solved" WHERE id = 1001;'
        ],
        expectedQuery: 'UPDATE case_logs SET status = "Solved" WHERE id = 1001;',
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 9: ARCHIVING & EXPUNGING RECORDS (DELETE)
  {
    id: 9,
    title: 'Archiving & Expunging Records',
    subtitle: 'Removing False Leads',
    description: 'Safely purge obsolete evidence, expunged records, and dismissed cases using DELETE FROM.',
    guide: 'Aria Silver',
    concepts: ['DELETE FROM', 'Expunging Data', 'WHERE Safety'],
    icon: 'trash',
    color: '#a855f7',
    missions: [
      {
        id: 'c9_m1',
        title: 'Mission 1: Expunge False Evidence',
        type: 'write_query',
        story: 'Expunge the false evidence item with id 905 from the evidence table.',
        conceptExplanation: {
          what: 'DELETE FROM removes rows from a specified database table.',
          why: 'Detectives expunge dismissed evidence or false leads to keep case files accurate.',
          when: 'Always specify a precise WHERE condition to avoid wiping entire tables!',
          how: 'DELETE FROM evidence WHERE id = 905;'
        },
        solution: 'DELETE FROM evidence WHERE id = 905;',
        hints: [
          'Delete from evidence where id = 905.',
          'Query: DELETE FROM evidence WHERE id = 905;'
        ],
        expectedQuery: 'DELETE FROM evidence WHERE id = 905;',
        xp: 85,
        coins: 40
      },
      {
        id: 'c9_m2',
        title: 'Mission 2: Expunge Invalid Alibi',
        type: 'write_query',
        story: 'Remove the invalid alibi record with id 4 from the alibis table.',
        solution: 'DELETE FROM alibis WHERE id = 4;',
        hints: [
          'Delete from alibis where id = 4.',
          'Query: DELETE FROM alibis WHERE id = 4;'
        ],
        expectedQuery: 'DELETE FROM alibis WHERE id = 4;',
        xp: 85,
        coins: 40
      },
      {
        id: 'c9_m3',
        title: 'Mission 3: Fix Dangerous DELETE Query',
        type: 'fix_query',
        story: 'Fix the dangerous query trying to clear case log 1003.',
        buggyCode: 'WIPE TABLE case_logs WHERE id = 1003;',
        solution: 'DELETE FROM case_logs WHERE id = 1003;',
        hints: [
          'Replace WIPE TABLE with DELETE FROM.',
          'Query: DELETE FROM case_logs WHERE id = 1003;'
        ],
        expectedQuery: 'DELETE FROM case_logs WHERE id = 1003;',
        xp: 85,
        coins: 40
      },
      {
        id: 'c9_m4',
        title: 'Mission 4: Remove Solved Case Evidence',
        type: 'write_query',
        story: 'Delete all evidence records for solved case_id 1003.',
        solution: 'DELETE FROM evidence WHERE case_id = 1003;',
        hints: [
          'Delete from evidence where case_id = 1003.',
          'Query: DELETE FROM evidence WHERE case_id = 1003;'
        ],
        expectedQuery: 'DELETE FROM evidence WHERE case_id = 1003;',
        xp: 90,
        coins: 45
      },
      {
        id: 'c9_m5',
        title: 'Mission 5: Expunge Cleared Citizen Duplicate',
        type: 'write_query',
        story: 'Delete citizen record where id = 107.',
        solution: 'DELETE FROM citizens WHERE id = 107;',
        hints: [
          'Delete from citizens where id = 107.',
          'Query: DELETE FROM citizens WHERE id = 107;'
        ],
        expectedQuery: 'DELETE FROM citizens WHERE id = 107;',
        xp: 90,
        coins: 45
      },
      {
        id: 'c9_m6',
        title: 'Mission 6: Conceptual Check — Safe Deletion',
        type: 'multiple_choice',
        story: 'What is the primary rule when running DELETE FROM in production SQL?',
        options: ['Always test your WHERE condition with SELECT first', 'Never use uppercase keywords', 'Always delete the table schema first', 'Run without WHERE for speed'],
        answerIndex: 0,
        hints: ['Running SELECT with your WHERE condition ensures you target only intended rows!'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c9_m7',
        title: 'Mission 7: Code Matching — DELETE vs DROP',
        type: 'code_matching',
        story: 'Match table operation commands.',
        options: [
          { text: 'DELETE FROM table WHERE ...', label: 'Removes specific matching rows' },
          { text: 'DROP TABLE table', label: 'Permanently destroys table structure and all data' }
        ],
        correctPair: 0,
        hints: ['DELETE FROM targets rows; DROP TABLE destroys the table itself.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c9_m8',
        title: 'Mission 8: Detective Boss — Purge Outdated Transaction',
        type: 'detective_boss',
        story: 'BOSS CASE: Delete transaction record id 5005 from the transactions log!',
        solution: 'DELETE FROM transactions WHERE id = 5005;',
        hints: [
          'Query: DELETE FROM transactions WHERE id = 5005;'
        ],
        expectedQuery: 'DELETE FROM transactions WHERE id = 5005;',
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 10: CRIME SCENE STATISTICS (COUNT, SUM, AVG, MIN, MAX)
  {
    id: 10,
    title: 'Crime Scene Statistics',
    subtitle: 'Aggregating Case Data',
    description: 'Calculate metrics using aggregate functions: COUNT, SUM, AVG, MIN, and MAX.',
    guide: 'Bram Thorne',
    concepts: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'Aggregates'],
    icon: 'barChart',
    color: '#f59e0b',
    missions: [
      {
        id: 'c10_m1',
        title: 'Mission 1: Count Total Citizens',
        type: 'write_query',
        story: 'Count the total number of registered citizens in District 7.',
        conceptExplanation: {
          what: 'Aggregate functions compute a single summary value across rows.',
          why: 'Detectives analyze crime rates, total stolen values, and average shop revenue.',
          when: 'Use COUNT, SUM, AVG, MIN, MAX for statistical reporting.',
          how: 'SELECT COUNT(*) FROM citizens WHERE district = 7;'
        },
        solution: 'SELECT COUNT(*) FROM citizens WHERE district = 7;',
        hints: [
          'Use SELECT COUNT(*) FROM citizens WHERE district = 7.',
          'Query: SELECT COUNT(*) FROM citizens WHERE district = 7;'
        ],
        expectedQuery: 'SELECT COUNT(*) FROM citizens WHERE district = 7;',
        xp: 85,
        coins: 40
      },
      {
        id: 'c10_m2',
        title: 'Mission 2: Total Heist Revenue',
        type: 'write_query',
        story: 'Calculate the total SUM of revenue across all shops in District 7.',
        solution: 'SELECT SUM(revenue) FROM shops WHERE district = 7;',
        hints: [
          'Select SUM(revenue) from shops where district = 7.',
          'Query: SELECT SUM(revenue) FROM shops WHERE district = 7;'
        ],
        expectedQuery: 'SELECT SUM(revenue) FROM shops WHERE district = 7;',
        xp: 85,
        coins: 40
      },
      {
        id: 'c10_m3',
        title: 'Mission 3: Average Transaction Value',
        type: 'write_query',
        story: 'Calculate the AVG transaction amount recorded in the transactions table.',
        solution: 'SELECT AVG(amount) FROM transactions;',
        hints: [
          'Select AVG(amount) from transactions.',
          'Query: SELECT AVG(amount) FROM transactions;'
        ],
        expectedQuery: 'SELECT AVG(amount) FROM transactions;',
        xp: 90,
        coins: 45
      },
      {
        id: 'c10_m4',
        title: 'Mission 4: Highest & Lowest Citizen Age',
        type: 'write_query',
        story: 'Find the MAX and MIN age among citizens in the citizens table.',
        solution: 'SELECT MAX(age), MIN(age) FROM citizens;',
        hints: [
          'Select MAX(age), MIN(age) from citizens.',
          'Query: SELECT MAX(age), MIN(age) FROM citizens;'
        ],
        expectedQuery: 'SELECT MAX(age), MIN(age) FROM citizens;',
        xp: 90,
        coins: 45
      },
      {
        id: 'c10_m5',
        title: 'Mission 5: Fix Aggregate Function Syntax',
        type: 'fix_query',
        story: 'Fix the query attempting to count total evidence items.',
        buggyCode: 'SELECT TOTAL_COUNT() FROM evidence;',
        solution: 'SELECT COUNT(*) FROM evidence;',
        hints: [
          'Replace TOTAL_COUNT() with COUNT(*).',
          'Query: SELECT COUNT(*) FROM evidence;'
        ],
        expectedQuery: 'SELECT COUNT(*) FROM evidence;',
        xp: 85,
        coins: 40
      },
      {
        id: 'c10_m6',
        title: 'Mission 6: Conceptual Check — NULL in Aggregates',
        type: 'multiple_choice',
        story: 'How do aggregate functions like AVG() and SUM() handle NULL values?',
        options: ['They automatically ignore NULL values', 'They throw a runtime error', 'They treat NULL as 0', 'They set the result to NULL'],
        answerIndex: 0,
        hints: ['Standard SQL aggregate functions ignore NULL rows in calculation.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c10_m7',
        title: 'Mission 7: Code Matching — Aggregate Functions',
        type: 'code_matching',
        story: 'Match aggregate functions to their outputs.',
        options: [
          { text: 'COUNT(*)', label: 'Total number of rows' },
          { text: 'SUM(amount)', label: 'Total sum of amounts' },
          { text: 'AVG(revenue)', label: 'Mean revenue value' }
        ],
        correctPair: 0,
        hints: ['COUNT(*) counts total row instances.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c10_m8',
        title: 'Mission 8: Detective Boss — Crime Department Statistics',
        type: 'detective_boss',
        story: 'BOSS CASE: Calculate the MAX cases_solved by any detective in the detectives table!',
        solution: 'SELECT MAX(cases_solved) FROM detectives;',
        hints: [
          'Query: SELECT MAX(cases_solved) FROM detectives;'
        ],
        expectedQuery: 'SELECT MAX(cases_solved) FROM detectives;',
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 11: CRIMINAL NETWORKS (GROUP BY, HAVING)
  {
    id: 11,
    title: 'Criminal Networks',
    subtitle: 'Grouped Crime Statistics',
    description: 'Group evidence by districts and filter grouped statistics using GROUP BY and HAVING.',
    guide: 'Cora Drake',
    concepts: ['GROUP BY', 'HAVING', 'Group Aggregations'],
    icon: 'layers',
    color: '#6366f1',
    missions: [
      {
        id: 'c11_m1',
        title: 'Mission 1: Count Citizens by District',
        type: 'write_query',
        story: 'Group citizens by district and count how many citizens live in each district.',
        conceptExplanation: {
          what: 'GROUP BY aggregates rows that share identical column values.',
          why: 'Detectives group crimes by district or shop to see hotspots.',
          when: 'Use HAVING instead of WHERE when filtering aggregate results.',
          how: 'SELECT district, COUNT(*) FROM citizens GROUP BY district;'
        },
        solution: 'SELECT district, COUNT(*) FROM citizens GROUP BY district;',
        hints: [
          'Group by district and count rows.',
          'Query: SELECT district, COUNT(*) FROM citizens GROUP BY district;'
        ],
        expectedQuery: 'SELECT district, COUNT(*) FROM citizens GROUP BY district;',
        xp: 90,
        coins: 45
      },
      {
        id: 'c11_m2',
        title: 'Mission 2: Average Shop Revenue by District',
        type: 'write_query',
        story: 'Group shops by district and calculate average revenue per district.',
        solution: 'SELECT district, AVG(revenue) FROM shops GROUP BY district;',
        hints: [
          'Query: SELECT district, AVG(revenue) FROM shops GROUP BY district;'
        ],
        expectedQuery: 'SELECT district, AVG(revenue) FROM shops GROUP BY district;',
        xp: 90,
        coins: 45
      },
      {
        id: 'c11_m3',
        title: 'Mission 3: High Crime Districts (HAVING)',
        type: 'write_query',
        story: 'Group citizens by district and use HAVING to show only districts with COUNT(*) > 2.',
        solution: 'SELECT district, COUNT(*) FROM citizens GROUP BY district HAVING COUNT(*) > 2;',
        hints: [
          'Use HAVING COUNT(*) > 2 after GROUP BY district.',
          'Query: SELECT district, COUNT(*) FROM citizens GROUP BY district HAVING COUNT(*) > 2;'
        ],
        expectedQuery: 'SELECT district, COUNT(*) FROM citizens GROUP BY district HAVING COUNT(*) > 2;',
        xp: 95,
        coins: 50
      },
      {
        id: 'c11_m4',
        title: 'Mission 4: Fix WHERE vs HAVING Error',
        type: 'fix_query',
        story: 'Fix the statement that incorrectly used WHERE on an aggregate function.',
        buggyCode: 'SELECT district, COUNT(*) FROM citizens WHERE COUNT(*) > 2 GROUP BY district;',
        solution: 'SELECT district, COUNT(*) FROM citizens GROUP BY district HAVING COUNT(*) > 2;',
        hints: [
          'Move the aggregate filter from WHERE to HAVING after GROUP BY.',
          'Query: SELECT district, COUNT(*) FROM citizens GROUP BY district HAVING COUNT(*) > 2;'
        ],
        expectedQuery: 'SELECT district, COUNT(*) FROM citizens GROUP BY district HAVING COUNT(*) > 2;',
        xp: 90,
        coins: 45
      },
      {
        id: 'c11_m5',
        title: 'Mission 5: Evidence Count per Case',
        type: 'write_query',
        story: 'Group evidence by case_id and count evidence items for each case.',
        solution: 'SELECT case_id, COUNT(*) FROM evidence GROUP BY case_id;',
        hints: [
          'Group by case_id and SELECT case_id, COUNT(*).',
          'Query: SELECT case_id, COUNT(*) FROM evidence GROUP BY case_id;'
        ],
        expectedQuery: 'SELECT case_id, COUNT(*) FROM evidence GROUP BY case_id;',
        xp: 95,
        coins: 50
      },
      {
        id: 'c11_m6',
        title: 'Mission 6: Conceptual Check — WHERE vs HAVING',
        type: 'multiple_choice',
        story: 'What is the main difference between WHERE and HAVING in SQL?',
        options: ['WHERE filters individual rows before grouping; HAVING filters aggregated groups', 'WHERE works only on numbers; HAVING on text', 'WHERE is faster than HAVING always', 'HAVING cannot be used with GROUP BY'],
        answerIndex: 0,
        hints: ['WHERE filters raw rows before grouping; HAVING filters post-grouping aggregations.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c11_m7',
        title: 'Mission 7: Code Matching — Grouping Syntax',
        type: 'code_matching',
        story: 'Match grouping clauses.',
        options: [
          { text: 'GROUP BY district', label: 'Groups rows sharing the same district' },
          { text: 'HAVING SUM(revenue) > 100000', label: 'Filters groups whose total revenue exceeds 100k' }
        ],
        correctPair: 0,
        hints: ['HAVING filters aggregate totals.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c11_m8',
        title: 'Mission 8: Detective Boss — Suspect Risk Grouping',
        type: 'detective_boss',
        story: 'BOSS CASE: Group suspects by risk_level and count suspects in each risk level!',
        solution: 'SELECT risk_level, COUNT(*) FROM suspects GROUP BY risk_level;',
        hints: [
          'Query: SELECT risk_level, COUNT(*) FROM suspects GROUP BY risk_level;'
        ],
        expectedQuery: 'SELECT risk_level, COUNT(*) FROM suspects GROUP BY risk_level;',
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 12: PATTERN SLEUTHING (LIKE, IN, BETWEEN, CASE)
  {
    id: 12,
    title: 'Pattern Sleuthing',
    subtitle: 'Wildcards & Range Searches',
    description: 'Uncover alias patterns using LIKE wildcards (%), IN lists, BETWEEN ranges, and CASE statements.',
    guide: 'Aria Silver',
    concepts: ['LIKE', '% Wildcard', 'IN', 'BETWEEN', 'CASE WHEN'],
    icon: 'search',
    color: '#ec4899',
    missions: [
      {
        id: 'c12_m1',
        title: 'Mission 1: Find Suspect Alias Patterns',
        type: 'write_query',
        story: 'Find all suspects whose alias starts with "The" using LIKE "The%".',
        conceptExplanation: {
          what: 'LIKE matches text patterns using % (any characters) and _ (single char).',
          why: 'Detectives search criminal aliases, street names, and fuzzy clues.',
          when: 'Use LIKE for partial pattern matches and BETWEEN for numerical ranges.',
          how: "SELECT * FROM suspects WHERE alias LIKE 'The%';"
        },
        solution: "SELECT * FROM suspects WHERE alias LIKE 'The%';",
        hints: [
          "Use LIKE 'The%' to match aliases beginning with 'The'.",
          "Query: SELECT * FROM suspects WHERE alias LIKE 'The%';"
        ],
        expectedQuery: "SELECT * FROM suspects WHERE alias LIKE 'The%';",
        xp: 90,
        coins: 45
      },
      {
        id: 'c12_m2',
        title: 'Mission 2: District IN List Filter',
        type: 'write_query',
        story: 'Find all citizens living in District 1, 2, or 4 using the IN operator.',
        solution: 'SELECT * FROM citizens WHERE district IN (1, 2, 4);',
        hints: [
          'Use WHERE district IN (1, 2, 4).',
          'Query: SELECT * FROM citizens WHERE district IN (1, 2, 4);'
        ],
        expectedQuery: 'SELECT * FROM citizens WHERE district IN (1, 2, 4);',
        xp: 90,
        coins: 45
      },
      {
        id: 'c12_m3',
        title: 'Mission 3: Age Range (BETWEEN)',
        type: 'write_query',
        story: 'Find all citizens with age BETWEEN 25 AND 40.',
        solution: 'SELECT * FROM citizens WHERE age BETWEEN 25 AND 40;',
        hints: [
          'Use WHERE age BETWEEN 25 AND 40.',
          'Query: SELECT * FROM citizens WHERE age BETWEEN 25 AND 40;'
        ],
        expectedQuery: 'SELECT * FROM citizens WHERE age BETWEEN 25 AND 40;',
        xp: 90,
        coins: 45
      },
      {
        id: 'c12_m4',
        title: 'Mission 4: Fix LIKE Wildcard Syntax',
        type: 'fix_query',
        story: 'Fix the query searching for street names containing "Aley".',
        buggyCode: "SELECT * FROM locations WHERE street CONTAINS 'Alley';",
        solution: "SELECT * FROM locations WHERE street LIKE '%Alley%';",
        hints: [
          "Replace CONTAINS with LIKE '%Alley%'.",
          "Query: SELECT * FROM locations WHERE street LIKE '%Alley%';"
        ],
        expectedQuery: "SELECT * FROM locations WHERE street LIKE '%Alley%';",
        xp: 90,
        coins: 45
      },
      {
        id: 'c12_m5',
        title: 'Mission 5: High Value Transaction Range',
        type: 'write_query',
        story: 'Find all transactions with amount BETWEEN 5000 AND 20000.',
        solution: 'SELECT * FROM transactions WHERE amount BETWEEN 5000 AND 20000;',
        hints: [
          'Query: SELECT * FROM transactions WHERE amount BETWEEN 5000 AND 20000;'
        ],
        expectedQuery: 'SELECT * FROM transactions WHERE amount BETWEEN 5000 AND 20000;',
        xp: 95,
        coins: 50
      },
      {
        id: 'c12_m6',
        title: 'Mission 6: Conceptual Check — Wildcard Operators',
        type: 'multiple_choice',
        story: 'In SQL LIKE patterns, what does the percent sign (%) represent?',
        options: ['Zero, one, or multiple characters', 'Exactly one single character', 'Numbers only', 'Spaces only'],
        answerIndex: 0,
        hints: ['% matches any sequence of zero or more characters.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c12_m7',
        title: 'Mission 7: Code Matching — Advanced Filters',
        type: 'code_matching',
        story: 'Match pattern tools.',
        options: [
          { text: "name LIKE 'A%'", label: 'Names starting with A' },
          { text: 'age BETWEEN 20 AND 30', label: 'Ages from 20 to 30 inclusive' }
        ],
        correctPair: 0,
        hints: ['LIKE A% matches starting letter A.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c12_m8',
        title: 'Mission 8: Detective Boss — Street Name Sleuthing',
        type: 'detective_boss',
        story: 'BOSS CASE: Query all locations where street ends with "Boulevard" (LIKE "%Boulevard")!',
        solution: "SELECT * FROM locations WHERE street LIKE '%Boulevard';",
        hints: [
          "Query: SELECT * FROM locations WHERE street LIKE '%Boulevard';"
        ],
        expectedQuery: "SELECT * FROM locations WHERE street LIKE '%Boulevard';",
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 13: UNCOVERING LINKS (INNER JOIN, LEFT JOIN)
  {
    id: 13,
    title: 'Uncovering Links',
    subtitle: 'Connecting Relational Evidence',
    description: 'Connect shop owners, transaction logs, and suspect records across tables using INNER JOIN & LEFT JOIN.',
    guide: 'Bram Thorne',
    concepts: ['INNER JOIN', 'LEFT JOIN', 'Foreign Keys', 'ON Condition'],
    icon: 'link',
    color: '#06b6d4',
    missions: [
      {
        id: 'c13_m1',
        title: 'Mission 1: Connect Shops & Owners',
        type: 'write_query',
        story: 'Join the shops table and citizens table ON shops.owner_id = citizens.id to reveal shop owners.',
        conceptExplanation: {
          what: 'JOIN connects rows from multiple tables using matching key columns.',
          why: 'Real crimes connect suspects across citizens, shops, locations, and transaction logs.',
          when: 'Use INNER JOIN for matching records and LEFT JOIN to preserve left table rows.',
          how: 'SELECT * FROM shops INNER JOIN citizens ON shops.owner_id = citizens.id;'
        },
        solution: 'SELECT * FROM shops INNER JOIN citizens ON shops.owner_id = citizens.id;',
        hints: [
          'Join shops with citizens on owner_id = id.',
          'Query: SELECT * FROM shops INNER JOIN citizens ON shops.owner_id = citizens.id;'
        ],
        expectedQuery: 'SELECT * FROM shops INNER JOIN citizens ON shops.owner_id = citizens.id;',
        xp: 95,
        coins: 50
      },
      {
        id: 'c13_m2',
        title: 'Mission 2: Evidence & Suspect Links',
        type: 'write_query',
        story: 'Join evidence table with suspects table ON evidence.suspect_id = suspects.id.',
        solution: 'SELECT * FROM evidence INNER JOIN suspects ON evidence.suspect_id = suspects.id;',
        hints: [
          'Join evidence with suspects on suspect_id = id.',
          'Query: SELECT * FROM evidence INNER JOIN suspects ON evidence.suspect_id = suspects.id;'
        ],
        expectedQuery: 'SELECT * FROM evidence INNER JOIN suspects ON evidence.suspect_id = suspects.id;',
        xp: 95,
        coins: 50
      },
      {
        id: 'c13_m3',
        title: 'Mission 3: Left Join Case Logs & Detectives',
        type: 'write_query',
        story: 'Perform a LEFT JOIN between case_logs and detectives ON case_logs.detective_id = detectives.id.',
        solution: 'SELECT * FROM case_logs LEFT JOIN detectives ON case_logs.detective_id = detectives.id;',
        hints: [
          'Use LEFT JOIN between case_logs and detectives.',
          'Query: SELECT * FROM case_logs LEFT JOIN detectives ON case_logs.detective_id = detectives.id;'
        ],
        expectedQuery: 'SELECT * FROM case_logs LEFT JOIN detectives ON case_logs.detective_id = detectives.id;',
        xp: 100,
        coins: 55
      },
      {
        id: 'c13_m4',
        title: 'Mission 4: Fix JOIN ON Syntax',
        type: 'fix_query',
        story: 'Fix the broken JOIN syntax connecting transactions to shops.',
        buggyCode: 'SELECT * FROM transactions MERGE shops MATCH transactions.shop_id = shops.id;',
        solution: 'SELECT * FROM transactions INNER JOIN shops ON transactions.shop_id = shops.id;',
        hints: [
          'Replace MERGE with INNER JOIN and MATCH with ON.',
          'Query: SELECT * FROM transactions INNER JOIN shops ON transactions.shop_id = shops.id;'
        ],
        expectedQuery: 'SELECT * FROM transactions INNER JOIN shops ON transactions.shop_id = shops.id;',
        xp: 95,
        coins: 50
      },
      {
        id: 'c13_m5',
        title: 'Mission 5: Evidence Location Links',
        type: 'write_query',
        story: 'Join evidence with locations ON evidence.location_id = locations.id.',
        solution: 'SELECT * FROM evidence INNER JOIN locations ON evidence.location_id = locations.id;',
        hints: [
          'Query: SELECT * FROM evidence INNER JOIN locations ON evidence.location_id = locations.id;'
        ],
        expectedQuery: 'SELECT * FROM evidence INNER JOIN locations ON evidence.location_id = locations.id;',
        xp: 100,
        coins: 55
      },
      {
        id: 'c13_m6',
        title: 'Mission 6: Conceptual Check — INNER vs LEFT JOIN',
        type: 'multiple_choice',
        story: 'What is the main difference between INNER JOIN and LEFT JOIN?',
        options: ['LEFT JOIN includes all rows from the left table even if no match exists in right table', 'INNER JOIN includes unmatched left rows', 'LEFT JOIN deletes right table rows', 'They behave identically always'],
        answerIndex: 0,
        hints: ['LEFT JOIN preserves all left table records regardless of right table matches.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c13_m7',
        title: 'Mission 7: Code Matching — Join Keys',
        type: 'code_matching',
        story: 'Match relational key concepts.',
        options: [
          { text: 'Primary Key', label: 'Unique identifier for a row in its own table' },
          { text: 'Foreign Key', label: 'Column referencing a primary key in another table' }
        ],
        correctPair: 0,
        hints: ['Foreign keys establish relational links across tables.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c13_m8',
        title: 'Mission 8: Detective Boss — Complete Suspect Transaction Network',
        type: 'detective_boss',
        story: 'BOSS CASE: Join transactions with suspects ON transactions.buyer_id = suspects.id to expose suspect purchases!',
        solution: 'SELECT * FROM transactions INNER JOIN suspects ON transactions.buyer_id = suspects.id;',
        hints: [
          'Query: SELECT * FROM transactions INNER JOIN suspects ON transactions.buyer_id = suspects.id;'
        ],
        expectedQuery: 'SELECT * FROM transactions INNER JOIN suspects ON transactions.buyer_id = suspects.id;',
        xp: 100,
        coins: 50
      }
    ]
  },

  // CHAPTER 14: MASTER DETECTIVE CASE (CTEs, SUBQUERIES, MASTER HEIST)
  {
    id: 14,
    title: 'Master Detective Case',
    subtitle: 'The Neon City Heist Finale',
    description: 'Combine CTEs, Subqueries, Joins, and Aggregations to crack the ultimate Database Detective City mastermind case!',
    guide: 'Detective Aria Silver & All Sleuths',
    concepts: ['Subqueries', 'CTEs (WITH)', 'Multi-Table Analysis', 'Master Boss Case'],
    icon: 'trophy',
    color: '#f59e0b',
    missions: [
      {
        id: 'c14_m1',
        title: 'Mission 1: Subquery — High Risk Suspect Transactions',
        type: 'write_query',
        story: 'Find all transactions where buyer_id is IN (SELECT id FROM suspects WHERE risk_level = "Extreme").',
        conceptExplanation: {
          what: 'Subqueries and CTEs structure multi-step detective queries.',
          why: 'Unmasking kingpins requires nested filtering of high-risk suspect lists.',
          when: 'Use subqueries when filtering against dynamic sub-result sets.',
          how: "SELECT * FROM transactions WHERE buyer_id IN (SELECT id FROM suspects WHERE risk_level = 'Extreme');"
        },
        solution: "SELECT * FROM transactions WHERE buyer_id IN (SELECT id FROM suspects WHERE risk_level = 'Extreme');",
        hints: [
          "Use subquery SELECT id FROM suspects WHERE risk_level = 'Extreme'.",
          "Query: SELECT * FROM transactions WHERE buyer_id IN (SELECT id FROM suspects WHERE risk_level = 'Extreme');"
        ],
        expectedQuery: "SELECT * FROM transactions WHERE buyer_id IN (SELECT id FROM suspects WHERE risk_level = 'Extreme');",
        xp: 100,
        coins: 50
      },
      {
        id: 'c14_m2',
        title: 'Mission 2: CTE — High Value Transactions CTE',
        type: 'write_query',
        story: 'Create a CTE named HighTx: WITH HighTx AS (SELECT * FROM transactions WHERE amount > 5000) SELECT * FROM HighTx;',
        solution: 'WITH HighTx AS (SELECT * FROM transactions WHERE amount > 5000) SELECT * FROM HighTx;',
        hints: [
          'Use CTE syntax WITH HighTx AS (...) SELECT * FROM HighTx.',
          'Query: WITH HighTx AS (SELECT * FROM transactions WHERE amount > 5000) SELECT * FROM HighTx;'
        ],
        expectedQuery: 'WITH HighTx AS (SELECT * FROM transactions WHERE amount > 5000) SELECT * FROM HighTx;',
        xp: 110,
        coins: 55
      },
      {
        id: 'c14_m3',
        title: 'Mission 3: Subquery — Suspects with Evidence',
        type: 'write_query',
        story: 'Find all suspects whose id is IN (SELECT suspect_id FROM evidence WHERE suspect_id IS NOT NULL).',
        solution: 'SELECT * FROM suspects WHERE id IN (SELECT suspect_id FROM evidence WHERE suspect_id IS NOT NULL);',
        hints: [
          'Query: SELECT * FROM suspects WHERE id IN (SELECT suspect_id FROM evidence WHERE suspect_id IS NOT NULL);'
        ],
        expectedQuery: 'SELECT * FROM suspects WHERE id IN (SELECT suspect_id FROM evidence WHERE suspect_id IS NOT NULL);',
        xp: 110,
        coins: 55
      },
      {
        id: 'c14_m4',
        title: 'Mission 4: Fix Subquery Syntax',
        type: 'fix_query',
        story: 'Fix the subquery trying to find transactions above average.',
        buggyCode: 'SELECT * FROM transactions WHERE amount > AVG(amount);',
        solution: 'SELECT * FROM transactions WHERE amount > (SELECT AVG(amount) FROM transactions);',
        hints: [
          'In SQL, aggregate functions inside WHERE must be placed in a subquery: (SELECT AVG(amount) FROM transactions).',
          'Query: SELECT * FROM transactions WHERE amount > (SELECT AVG(amount) FROM transactions);'
        ],
        expectedQuery: 'SELECT * FROM transactions WHERE amount > (SELECT AVG(amount) FROM transactions);',
        xp: 110,
        coins: 55
      },
      {
        id: 'c14_m5',
        title: 'Mission 5: CTE — Unverified Alibi Suspects',
        type: 'write_query',
        story: 'Use a CTE named UnverifiedSleuths: WITH UnverifiedSleuths AS (SELECT * FROM suspects WHERE alibi_status = "Unverified") SELECT * FROM UnverifiedSleuths;',
        solution: 'WITH UnverifiedSleuths AS (SELECT * FROM suspects WHERE alibi_status = "Unverified") SELECT * FROM UnverifiedSleuths;',
        hints: [
          'Query: WITH UnverifiedSleuths AS (SELECT * FROM suspects WHERE alibi_status = "Unverified") SELECT * FROM UnverifiedSleuths;'
        ],
        expectedQuery: 'WITH UnverifiedSleuths AS (SELECT * FROM suspects WHERE alibi_status = "Unverified") SELECT * FROM UnverifiedSleuths;',
        xp: 115,
        coins: 60
      },
      {
        id: 'c14_m6',
        title: 'Mission 6: Conceptual Check — CTE Definition',
        type: 'multiple_choice',
        story: 'What does CTE stand for in SQL database terminology?',
        options: ['Common Table Expression', 'Central Transaction Engine', 'Compound Type Entity', 'Criminal Task Execution'],
        answerIndex: 0,
        hints: ['CTE stands for Common Table Expression (WITH syntax).'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c14_m7',
        title: 'Mission 7: Code Matching — CTE vs Subquery',
        type: 'code_matching',
        story: 'Match query structuring terms.',
        options: [
          { text: 'WITH temp_name AS (...)', label: 'Common Table Expression (CTE)' },
          { text: 'WHERE col IN (SELECT ...)', label: 'Nested Subquery' }
        ],
        correctPair: 0,
        hints: ['WITH defines named CTE temporary tables.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'c14_m8',
        title: 'Mission 8: ULTIMATE DETECTIVE BOSS CASE — Unmask The Mastermind',
        type: 'detective_boss',
        story: 'FINAL BOSS CASE: Identify the extreme risk suspect who bought items from shop_id 20 by joining transactions and suspects: SELECT * FROM transactions INNER JOIN suspects ON transactions.buyer_id = suspects.id WHERE transactions.shop_id = 20 AND suspects.risk_level = "Extreme";',
        solution: 'SELECT * FROM transactions INNER JOIN suspects ON transactions.buyer_id = suspects.id WHERE transactions.shop_id = 20 AND suspects.risk_level = "Extreme";',
        hints: [
          'Join transactions with suspects ON buyer_id = id WHERE shop_id = 20 AND risk_level = "Extreme".',
          'Query: SELECT * FROM transactions INNER JOIN suspects ON transactions.buyer_id = suspects.id WHERE transactions.shop_id = 20 AND suspects.risk_level = "Extreme";'
        ],
        expectedQuery: 'SELECT * FROM transactions INNER JOIN suspects ON transactions.buyer_id = suspects.id WHERE transactions.shop_id = 20 AND suspects.risk_level = "Extreme";',
        xp: 250,
        coins: 100
      }
    ]
  }
];

export const getChapterById = (id) => {
  return SQL_CURRICULUM.find(c => c.id === Number(id)) || SQL_CURRICULUM[0];
};

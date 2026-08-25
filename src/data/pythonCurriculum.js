// CodeSaga Python Valley Curriculum — 12 Complete Chapters & 96+ Playable Missions

export const PYTHON_CURRICULUM = [
  // ---------------- CHAPTER 1: PYTHON AWAKENING ---------------- //
  {
    id: 1,
    title: 'Python Awakening',
    subtitle: 'System Boot & Syntax Fundamentals',
    icon: '🐍',
    color: '#22c55e',
    guide: 'Aiden',
    zone: 'Python Valley Core',
    description: 'Awaken the Valley Core terminals and master basic Python syntax, print statements, and comments.',
    missions: [
      {
        id: 'py_1_1',
        title: 'Activate the Terminal',
        type: 'write_query',
        story: 'Welcome to Python Valley! The central diagnostic terminal is offline. Run your first Python print command to awaken the power grid.',
        conceptExplanation: {
          what: 'print() displays text or values onto the console screen.',
          why: 'Essential for diagnostic output, debugging, and user communication.',
          when: 'Used whenever you need to inspect outputs or send messages.',
          how: 'print("Hello, Python Valley!")'
        },
        template: '# Write your Python script here...\n',
        solution: 'print("Hello, Python Valley!")',
        expectedOutput: ['Hello, Python Valley!'],
        hints: ['Call print("Hello, Python Valley!") exactly as shown.', 'Ensure double quotes enclose your text.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_1_2',
        title: 'Robot Activation Signal',
        type: 'write_query',
        story: 'Send an activation signal to Scout Robot RX-9 using the print command.',
        template: '# Write your Python script here...\n',
        solution: 'print("Robot RX-9 Online")',
        expectedOutput: ['Robot RX-9 Online'],
        hints: ['Use print("Robot RX-9 Online") to signal the robot.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_1_3',
        title: 'Adding Diagnostic Comments',
        type: 'predict_output',
        story: 'Python comments start with # and are ignored during execution. What will this script print?',
        options: [
          'System Operational',
          '# This is a comment',
          'System Operational # This is a comment',
          'Error: Unexpected comment'
        ],
        answerIndex: 0,
        hints: ['Comments starting with # do not print.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_1_4',
        title: 'Creating Your First Variable',
        type: 'write_query',
        story: 'Assign the string "Scout" to a variable named robot_name, then print it.',
        template: '# Write your Python script here...\n',
        solution: 'robot_name = "Scout"\nprint(robot_name)',
        expectedOutput: ['Scout'],
        hints: ['Assign robot_name = "Scout" on the first line.', 'Print robot_name on the second line.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_1_5',
        title: 'Repairing Syntax Errors',
        type: 'fix_query',
        story: 'The diagnostic script has missing quotes around the string message. Fix it!',
        buggyCode: 'print(System Boot Completed)',
        solution: 'print("System Boot Completed")',
        expectedOutput: ['System Boot Completed'],
        hints: ['Add double quotes around System Boot Completed.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_1_6',
        title: 'Multi-Line Diagnostics',
        type: 'write_query',
        story: 'Print two diagnostic status lines sequentially.',
        template: '# Write your Python script here...\n',
        solution: 'print("Status: Green")\nprint("Core: Active")',
        expectedOutput: ['Status: Green', 'Core: Active'],
        hints: ['Execute two separate print statements on new lines.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_1_7',
        title: 'Python Philosophy Check',
        type: 'multiple_choice',
        story: 'What is Python’s design philosophy regarding code readability?',
        options: [
          'Readability counts and code should be clear and clean',
          'Code should be written as fast as possible without spaces',
          'Braces and semicolons are required on every line',
          'Python code can only run inside a web browser'
        ],
        answerIndex: 0,
        hints: ['Python emphasizes clean, readable code and clear syntax.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_1_8',
        title: 'Boss: Awaken the Valley Core',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Combine your knowledge of print statements, variables, and comments to awaken the entire Python Valley Core!',
        template: '# Awaken Python Valley Core\ncore_status = "ONLINE"\nprint("VALLEY CORE STATUS:")\nprint(core_status)',
        solution: '# Awaken Python Valley Core\ncore_status = "ONLINE"\nprint("VALLEY CORE STATUS:")\nprint(core_status)',
        expectedOutput: ['VALLEY CORE STATUS:', 'ONLINE'],
        hints: ['Define core_status = "ONLINE"', 'Print "VALLEY CORE STATUS:" first, then print(core_status)'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 2: VARIABLES & DATA TYPES ---------------- //
  {
    id: 2,
    title: 'Variables & Data Types',
    subtitle: 'Data Inspection & Type Conversion',
    icon: '📊',
    color: '#0ea5e9',
    guide: 'Bianca',
    zone: 'Data Village Archives',
    description: 'Master integers, floats, strings, booleans, type checking, and explicit type conversion.',
    missions: [
      {
        id: 'py_2_1',
        title: 'Robot Energy Reading',
        type: 'write_query',
        story: 'Store energy level as an integer 95 in variable energy, then print it.',
        template: '# Write your Python script here...\n',
        solution: 'energy = 95\nprint(energy)',
        expectedOutput: ['95'],
        hints: ['Define energy = 95', 'Print energy'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_2_2',
        title: 'Temperature Precision Float',
        type: 'write_query',
        story: 'Record core temperature as float 36.6 in variable temp, then print it.',
        template: '# Write your Python script here...\n',
        solution: 'temp = 36.6\nprint(temp)',
        expectedOutput: ['36.6'],
        hints: ['Assign float value 36.6 to temp.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_2_3',
        title: 'Boolean Security Status',
        type: 'write_query',
        story: 'Set security_active to True and print it.',
        template: '# Write your Python script here...\n',
        solution: 'security_active = True\nprint(security_active)',
        expectedOutput: ['True'],
        hints: ['Python Booleans are capitalized: True or False.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_2_4',
        title: 'Type Checking with type()',
        type: 'multiple_choice',
        story: 'What will type("100") return in Python?',
        options: [
          '<class \'str\'>',
          '<class \'int\'>',
          '<class \'float\'>',
          '<class \'bool\'>'
        ],
        answerIndex: 0,
        hints: ['Enclosing digits in quotes creates a string.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_2_5',
        title: 'String to Integer Conversion',
        type: 'write_query',
        story: 'Convert code_str = "42" into an integer using int() and print it.',
        template: '# Write your Python script here...\n',
        solution: 'code_str = "42"\ncode_num = int(code_str)\nprint(code_num)',
        expectedOutput: ['42'],
        hints: ['Use int(code_str) to convert a string of digits into a number.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_2_6',
        title: 'Float to Integer Truncation',
        type: 'predict_output',
        story: 'What is the output of print(int(9.99))?',
        options: [
          '9',
          '10',
          '9.99',
          'Error'
        ],
        answerIndex: 0,
        hints: ['int() truncates decimal digits without rounding up.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_2_7',
        title: 'String Concatenation',
        type: 'write_query',
        story: 'Combine prefix = "ID-" and num = "500" into full_id and print it.',
        template: '# Write your Python script here...\n',
        solution: 'prefix = "ID-"\nnum = "500"\nfull_id = prefix + num\nprint(full_id)',
        expectedOutput: ['ID-500'],
        hints: ['Use the + operator to join string variables together.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_2_8',
        title: 'Boss: Restore Robot Data',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Reconstruct the corrupted robot telemetry record using proper data types and conversion!',
        template: 'name = "Scout-X"\nlevel = 5\nstatus = True\nprint(name)\nprint(level)\nprint(status)',
        solution: 'name = "Scout-X"\nlevel = 5\nstatus = True\nprint(name)\nprint(level)\nprint(status)',
        expectedOutput: ['Scout-X', '5', 'True'],
        hints: ['Define name, level, and status then print each on a new line.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 3: OPERATORS ---------------- //
  {
    id: 3,
    title: 'Operators & Arithmetic',
    subtitle: 'Calculations & Logical Comparisons',
    icon: '⚡',
    color: '#f59e0b',
    guide: 'Cyrus',
    zone: 'Power Grid Generator',
    description: 'Master arithmetic (+, -, *, /, %, //), comparison (==, !=, >, <), and logical (and, or, not) operators.',
    missions: [
      {
        id: 'py_3_1',
        title: 'Energy Grid Addition',
        type: 'write_query',
        story: 'Calculate total energy by adding power1 = 40 and power2 = 60.',
        template: '# Write your Python script here...\n',
        solution: 'power1 = 40\npower2 = 60\ntotal = power1 + power2\nprint(total)',
        expectedOutput: ['100'],
        hints: ['Use total = power1 + power2.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_3_2',
        title: 'Modulo Remainder Calculation',
        type: 'write_query',
        story: 'Calculate the remainder when 17 is divided by 5 using the % operator.',
        template: '# Write your Python script here...\n',
        solution: 'rem = 17 % 5\nprint(rem)',
        expectedOutput: ['2'],
        hints: ['17 % 5 calculates 17 mod 5 = 2.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_3_3',
        title: 'Floor Division Operator //',
        type: 'predict_output',
        story: 'What is the output of print(19 // 4)?',
        options: [
          '4',
          '4.75',
          '3',
          '5'
        ],
        answerIndex: 0,
        hints: ['Floor division // divides and discards fractional parts.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_3_4',
        title: 'Power Grid Exponentiation',
        type: 'write_query',
        story: 'Calculate 2 raised to the power of 8 (2**8) and print the result.',
        template: '# Write your Python script here...\n',
        solution: 'res = 2 ** 8\nprint(res)',
        expectedOutput: ['256'],
        hints: ['Use ** for power exponentiation.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_3_5',
        title: 'Comparison Equality Operator ==',
        type: 'write_query',
        story: 'Check if score = 100 is equal to target = 100 using == and print the boolean result.',
        template: '# Write your Python script here...\n',
        solution: 'score = 100\ntarget = 100\nis_equal = (score == target)\nprint(is_equal)',
        expectedOutput: ['True'],
        hints: ['== checks for equality and returns True or False.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_3_6',
        title: 'Logical AND Operator',
        type: 'predict_output',
        story: 'What is the output of print(True and False)?',
        options: [
          'False',
          'True',
          'None',
          'Error'
        ],
        answerIndex: 0,
        hints: ['AND requires BOTH operands to be True.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_3_7',
        title: 'Logical NOT Operator',
        type: 'write_query',
        story: 'Invert is_locked = True using the not operator and print it.',
        template: '# Write your Python script here...\n',
        solution: 'is_locked = True\nis_unlocked = not is_locked\nprint(is_unlocked)',
        expectedOutput: ['False'],
        hints: ['not True becomes False.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_3_8',
        title: 'Boss: Power Grid Override',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Override the generator power grid by validating energy limits and logical locks!',
        template: 'grid_a = 50\ngrid_b = 50\ntotal_grid = grid_a + grid_b\nis_powered = total_grid >= 100\nprint(total_grid)\nprint(is_powered)',
        solution: 'grid_a = 50\ngrid_b = 50\ntotal_grid = grid_a + grid_b\nis_powered = total_grid >= 100\nprint(total_grid)\nprint(is_powered)',
        expectedOutput: ['100', 'True'],
        hints: ['Add grid_a and grid_b, check if >= 100, then print total and status.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 4: CONDITIONS ---------------- //
  {
    id: 4,
    title: 'Conditions & Control Flow',
    subtitle: 'If, Elif, Else & Indentation Rules',
    icon: '🛡️',
    color: '#a855f7',
    guide: 'Cora',
    zone: 'Security Gate Chamber',
    description: 'Master conditional branching (if, elif, else), comparison logic, and Python indentation rules.',
    missions: [
      {
        id: 'py_4_1',
        title: 'Security Gate Check',
        type: 'write_query',
        story: 'Write an if statement to print "ACCESS GRANTED" if keycard_valid is True.',
        template: '# Write your Python script here...\n',
        solution: 'keycard_valid = True\nif keycard_valid:\n    print("ACCESS GRANTED")',
        expectedOutput: ['ACCESS GRANTED'],
        hints: ['Indent the print statement under the if condition with 4 spaces or a tab.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_4_2',
        title: 'If-Else Energy Alarm',
        type: 'write_query',
        story: 'Check if energy < 20. If true print "WARNING", else print "STABLE".',
        template: '# Write your Python script here...\n',
        solution: 'energy = 15\nif energy < 20:\n    print("WARNING")\nelse:\n    print("STABLE")',
        expectedOutput: ['WARNING'],
        hints: ['Use if energy < 20: and else: block.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_4_3',
        title: 'Elif Clearance Classifier',
        type: 'write_query',
        story: 'Classify level: level >= 3 -> "TOP SECRET", level >= 2 -> "RESTRICTED", else -> "PUBLIC".',
        template: '# Write your Python script here...\n',
        solution: 'level = 2\nif level >= 3:\n    print("TOP SECRET")\nelif level >= 2:\n    print("RESTRICTED")\nelse:\n    print("PUBLIC")',
        expectedOutput: ['RESTRICTED'],
        hints: ['Use elif for middle level evaluation.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_4_4',
        title: 'Indentation Error Fix',
        type: 'fix_query',
        story: 'Fix the IndentationError in the security gate script.',
        buggyCode: 'clearance = True\nif clearance:\nprint("PASSED")',
        solution: 'clearance = True\nif clearance:\n    print("PASSED")',
        expectedOutput: ['PASSED'],
        hints: ['Add 4 spaces of indentation before print("PASSED").'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_4_5',
        title: 'Nested Condition Check',
        type: 'predict_output',
        story: 'What is the output of this nested security check?',
        options: [
          'AUTHORIZED',
          'DENIED',
          'LOCKED',
          'Error'
        ],
        answerIndex: 0,
        hints: ['Both outer and inner conditions evaluate to True.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_4_6',
        title: 'Multiple Conditions with AND',
        type: 'write_query',
        story: 'Grant access if has_badge is True AND passcode is 999.',
        template: '# Write your Python script here...\n',
        solution: 'has_badge = True\npasscode = 999\nif has_badge and passcode == 999:\n    print("GRANTED")',
        expectedOutput: ['GRANTED'],
        hints: ['Use if has_badge and passcode == 999:'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_4_7',
        title: 'Python Indentation Rule',
        type: 'multiple_choice',
        story: 'Why does Python use indentation (spaces/tabs)?',
        options: [
          'To define code blocks instead of using curly braces {}',
          'It is optional and only affects text alignment',
          'To make code compile faster on servers',
          'To automatically convert variables to integers'
        ],
        answerIndex: 0,
        hints: ['Python relies on indentation for scope and block structure.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_4_8',
        title: 'Boss: Unlock Security Gate',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct the master security gate clearance protocol!',
        template: 'user_role = "DETECTIVE"\nclearance_level = 5\nif user_role == "DETECTIVE" and clearance_level >= 5:\n    print("GATE UNLOCKED")\nelse:\n    print("ACCESS DENIED")',
        solution: 'user_role = "DETECTIVE"\nclearance_level = 5\nif user_role == "DETECTIVE" and clearance_level >= 5:\n    print("GATE UNLOCKED")\nelse:\n    print("ACCESS DENIED")',
        expectedOutput: ['GATE UNLOCKED'],
        hints: ['Check if user_role == "DETECTIVE" and clearance_level >= 5.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 5: LOOPS ---------------- //
  {
    id: 5,
    title: 'Loops & Iteration',
    subtitle: 'For, While & Range Iterations',
    icon: '🔄',
    color: '#6366f1',
    guide: 'Evan',
    zone: 'Loop Forest Station',
    description: 'Master for loops, while loops, range() iterations, break, and continue statements.',
    missions: [
      {
        id: 'py_5_1',
        title: 'Range Scan Loop',
        type: 'write_query',
        story: 'Iterate from 1 to 3 using range(1, 4) and print each number.',
        template: '# Write your Python script here...\n',
        solution: 'for i in range(1, 4):\n    print(i)',
        expectedOutput: ['1', '2', '3'],
        hints: ['range(1, 4) generates numbers 1, 2, 3.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_5_2',
        title: 'Scanning Evidence Clues',
        type: 'write_query',
        story: 'Iterate through clues list ["photo", "receipt"] and print each item.',
        template: '# Write your Python script here...\n',
        solution: 'clues = ["photo", "receipt"]\nfor clue in clues:\n    print(clue)',
        expectedOutput: ['photo', 'receipt'],
        hints: ['for clue in clues: print(clue)'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_5_3',
        title: 'While Loop Counter',
        type: 'write_query',
        story: 'Use a while loop to count down from count = 3 to 1 and print count.',
        template: '# Write your Python script here...\n',
        solution: 'count = 3\nwhile count > 0:\n    print(count)\n    count -= 1',
        expectedOutput: ['3', '2', '1'],
        hints: ['Decrement count -= 1 inside the loop to avoid infinite loops.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_5_4',
        title: 'Loop Control Break Statement',
        type: 'predict_output',
        story: 'What numbers will be printed by this loop with a break statement?',
        options: [
          '1 then 2',
          '1 then 2 then 3',
          '3 only',
          'Infinite loop'
        ],
        answerIndex: 0,
        hints: ['break terminates the loop immediately when i == 3.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_5_5',
        title: 'Loop Control Continue Statement',
        type: 'write_query',
        story: 'Skip number 2 using continue inside a range(1, 4) loop.',
        template: '# Write your Python script here...\n',
        solution: 'for i in range(1, 4):\n    if i == 2:\n        continue\n    print(i)',
        expectedOutput: ['1', '3'],
        hints: ['if i == 2: continue skips printing 2.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_5_6',
        title: 'Infinite Loop Risk',
        type: 'multiple_choice',
        story: 'What causes a while loop to become an infinite loop?',
        options: [
          'The loop condition never becomes False',
          'Using range() inside a for loop',
          'Using double quotes in string variables',
          'Importing the math module'
        ],
        answerIndex: 0,
        hints: ['If the while condition remains True forever, the loop never terminates.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_5_7',
        title: 'Summing Numbers in Loop',
        type: 'write_query',
        story: 'Calculate total sum of numbers 1 to 3 using a loop.',
        template: '# Write your Python script here...\n',
        solution: 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
        expectedOutput: ['6'],
        hints: ['total += i adds 1 + 2 + 3 = 6.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_5_8',
        title: 'Boss: Robot Swarm Control',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Execute the robot swarm calibration sequence across all units!',
        template: 'for robot_id in range(101, 104):\n    print("ROBOT", robot_id, "CALIBRATED")',
        solution: 'for robot_id in range(101, 104):\n    print("ROBOT", robot_id, "CALIBRATED")',
        expectedOutput: ['ROBOT 101 CALIBRATED', 'ROBOT 102 CALIBRATED', 'ROBOT 103 CALIBRATED'],
        hints: ['Iterate for robot_id in range(101, 104) and print calibration status.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 6: COLLECTIONS ---------------- //
  {
    id: 6,
    title: 'Collections & Dictionaries',
    subtitle: 'Lists, Tuples, Sets & Hash Maps',
    icon: '📂',
    color: '#ec4899',
    guide: 'Finn',
    zone: 'The Data Vault',
    description: 'Master Lists [], Tuples (), Sets {}, and Dictionaries {} for managing evidence datasets.',
    missions: [
      {
        id: 'py_6_1',
        title: 'Building an Evidence List',
        type: 'write_query',
        story: 'Create evidence = ["key", "badge"], append "file", and print evidence.',
        template: '# Write your Python script here...\n',
        solution: 'evidence = ["key", "badge"]\nevidence.append("file")\nprint(len(evidence))',
        expectedOutput: ['3'],
        hints: ['append() adds items to the end of a list.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_6_2',
        title: 'List Indexing Access',
        type: 'write_query',
        story: 'Print the first item in items = ["alpha", "beta", "gamma"].',
        template: '# Write your Python script here...\n',
        solution: 'items = ["alpha", "beta", "gamma"]\nprint(items[0])',
        expectedOutput: ['alpha'],
        hints: ['Python list indexing starts at 0.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_6_3',
        title: 'Immutable Tuple Check',
        type: 'multiple_choice',
        story: 'Which Python collection is immutable (cannot be modified after creation)?',
        options: [
          'Tuple ()',
          'List []',
          'Dictionary {}',
          'Set {}'
        ],
        answerIndex: 0,
        hints: ['Tuples () cannot have items appended or changed.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_6_4',
        title: 'Robot Dictionary Mapping',
        type: 'write_query',
        story: 'Create robot = {"name": "RX-9", "battery": 100} and print robot["name"].',
        template: '# Write your Python script here...\n',
        solution: 'robot = {"name": "RX-9", "battery": 100}\nprint(robot["name"])',
        expectedOutput: ['RX-9'],
        hints: ['Access dictionary values using key string in brackets.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_6_5',
        title: 'Dictionary Key Modification',
        type: 'write_query',
        story: 'Update robot["battery"] = 80 and print it.',
        template: '# Write your Python script here...\n',
        solution: 'robot = {"battery": 100}\nrobot["battery"] = 80\nprint(robot["battery"])',
        expectedOutput: ['80'],
        hints: ['Assigning to an existing key updates its value.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_6_6',
        title: 'Set Unique Items Filtering',
        type: 'write_query',
        story: 'Convert duplicates = [1, 1, 2, 3] to a set and print len().',
        template: '# Write your Python script here...\n',
        solution: 'duplicates = [1, 1, 2, 3]\nunique_set = set(duplicates)\nprint(len(unique_set))',
        expectedOutput: ['3'],
        hints: ['Sets automatically remove duplicate values.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_6_7',
        title: 'Dictionary Iteration Keys',
        type: 'predict_output',
        story: 'What will print(list(data.keys())) output for data = {"a": 1, "b": 2}?',
        options: [
          '[\'a\', \'b\']',
          '[1, 2]',
          '{\'a\': 1}',
          'Error'
        ],
        answerIndex: 0,
        hints: ['data.keys() returns the dictionary keys.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_6_8',
        title: 'Boss: The Data Vault',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Reorganize the Data Vault archive dictionary!',
        template: 'vault = {"status": "SECURE", "file_count": 50}\nprint("STATUS:", vault["status"])\nprint("FILES:", vault["file_count"])',
        solution: 'vault = {"status": "SECURE", "file_count": 50}\nprint("STATUS:", vault["status"])\nprint("FILES:", vault["file_count"])',
        expectedOutput: ['STATUS: SECURE', 'FILES: 50'],
        hints: ['Print vault["status"] and vault["file_count"].'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 7: FUNCTIONS ---------------- //
  {
    id: 7,
    title: 'Functions & Modular Code',
    subtitle: 'Def, Parameters, Arguments & Return Values',
    icon: '⚙️',
    color: '#10b981',
    guide: 'Aria',
    zone: 'Automation Factory',
    description: 'Master reusable functions (def, return), parameters, positional arguments, and scope concepts.',
    missions: [
      {
        id: 'py_7_1',
        title: 'Defining First Function',
        type: 'write_query',
        story: 'Define function greet() that prints "HELLOO" and call it.',
        template: '# Write your Python script here...\n',
        solution: 'def greet():\n    print("HELLOO")\ngreet()',
        expectedOutput: ['HELLOO'],
        hints: ['Use def greet(): then indent print("HELLOO"), then call greet().'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_7_2',
        title: 'Function with Parameter',
        type: 'write_query',
        story: 'Define function ping(unit) that prints unit, and call ping("ROBOT-1").',
        template: '# Write your Python script here...\n',
        solution: 'def ping(unit):\n    print(unit)\nping("ROBOT-1")',
        expectedOutput: ['ROBOT-1'],
        hints: ['Pass "ROBOT-1" as parameter to ping.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_7_3',
        title: 'Returning Values with return',
        type: 'write_query',
        story: 'Define add(a, b) that returns a + b. Print result of add(10, 20).',
        template: '# Write your Python script here...\n',
        solution: 'def add(a, b):\n    return a + b\nres = add(10, 20)\nprint(res)',
        expectedOutput: ['30'],
        hints: ['return sends values back to caller.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_7_4',
        title: 'Default Parameter Values',
        type: 'predict_output',
        story: 'What is the output of print(power(5)) if default exponent is 2?',
        options: [
          '25',
          '5',
          '10',
          'Error'
        ],
        answerIndex: 0,
        hints: ['5 ** 2 = 25.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_7_5',
        title: 'Function Return Scope',
        type: 'multiple_choice',
        story: 'What happens when a function hits a return statement?',
        options: [
          'It immediately exits the function and passes back the result',
          'It continues executing lines below return inside the function',
          'It deletes all global variables',
          'It opens a new terminal window'
        ],
        answerIndex: 0,
        hints: ['return immediately terminates function execution.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_7_6',
        title: 'Calculating Evidence Score Function',
        type: 'write_query',
        story: 'Define calc_score(clues, multiplier=10) returning clues * multiplier. Print calc_score(5).',
        template: '# Write your Python script here...\n',
        solution: 'def calc_score(clues, multiplier=10):\n    return clues * multiplier\nprint(calc_score(5))',
        expectedOutput: ['50'],
        hints: ['5 * 10 = 50.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_7_7',
        title: 'Fixing Broken Function Syntax',
        type: 'fix_query',
        story: 'Fix def keyword typo in function definition.',
        buggyCode: 'function check_status():\n    return "OK"\nprint(check_status())',
        solution: 'def check_status():\n    return "OK"\nprint(check_status())',
        expectedOutput: ['OK'],
        hints: ['Replace "function" keyword with Python "def".'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_7_8',
        title: 'Boss: Automation Factory',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct the Master Factory Assembly Function!',
        template: 'def assemble_unit(part1, part2):\n    return part1 + "-" + part2\nresult = assemble_unit("CORE", "700")\nprint(result)',
        solution: 'def assemble_unit(part1, part2):\n    return part1 + "-" + part2\nresult = assemble_unit("CORE", "700")\nprint(result)',
        expectedOutput: ['CORE-700'],
        hints: ['Concatenate part1, "-", and part2 in assemble_unit.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 8: STRINGS & DATA PROCESSING ---------------- //
  {
    id: 8,
    title: 'Strings & Data Processing',
    subtitle: 'F-Strings, Slicing & Parsing Methods',
    icon: '📝',
    color: '#38bdf8',
    guide: 'Elara',
    zone: 'Signal Station Office',
    description: 'Master f-strings, string slicing [start:end], split(), join(), upper(), lower(), and replace().',
    missions: [
      {
        id: 'py_8_1',
        title: 'Modern F-String Formatting',
        type: 'write_query',
        story: 'Use f-string to format name = "Aiden" and code = 101 into "Agent Aiden (101)".',
        template: '# Write your Python script here...\n',
        solution: 'name = "Aiden"\ncode = 101\nprint(f"Agent {name} ({code})")',
        expectedOutput: ['Agent Aiden (101)'],
        hints: ['Prefix string with f and use {name} and {code} placeholders.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_8_2',
        title: 'String Slicing Substring',
        type: 'write_query',
        story: 'Extract first 3 characters from code = "PYTHON" using slicing code[:3] and print it.',
        template: '# Write your Python script here...\n',
        solution: 'code = "PYTHON"\nprint(code[:3])',
        expectedOutput: ['PYT'],
        hints: ['code[:3] slices characters from index 0 to 2.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_8_3',
        title: 'String Upper & Lower Case',
        type: 'write_query',
        story: 'Convert msg = "warning" to uppercase using msg.upper() and print it.',
        template: '# Write your Python script here...\n',
        solution: 'msg = "warning"\nprint(msg.upper())',
        expectedOutput: ['WARNING'],
        hints: ['msg.upper() converts to uppercase.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_8_4',
        title: 'Splitting String Log Entry',
        type: 'write_query',
        story: 'Split log = "ERR,DB,500" by comma using log.split(",") and print len(parts).',
        template: '# Write your Python script here...\n',
        solution: 'log = "ERR,DB,500"\nparts = log.split(",")\nprint(len(parts))',
        expectedOutput: ['3'],
        hints: ['split(",") splits a string into a list of substrings.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_8_5',
        title: 'Joining Words with join()',
        type: 'write_query',
        story: 'Join items = ["A", "B", "C"] with hyphen "-" using "-".join(items) and print it.',
        template: '# Write your Python script here...\n',
        solution: 'items = ["A", "B", "C"]\nres = "-".join(items)\nprint(res)',
        expectedOutput: ['A-B-C'],
        hints: ['"-".join(items) joins list elements with hyphen.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_8_6',
        title: 'String Replace Substring',
        type: 'write_query',
        story: 'Replace "BUG" with "FIX" in text = "SYSTEM BUG" and print it.',
        template: '# Write your Python script here...\n',
        solution: 'text = "SYSTEM BUG"\nclean = text.replace("BUG", "FIX")\nprint(clean)',
        expectedOutput: ['SYSTEM FIX'],
        hints: ['replace("BUG", "FIX") replaces substrings.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_8_7',
        title: 'String StartsWith Check',
        type: 'predict_output',
        story: 'What is the output of print("PYTHON".startswith("PY"))?',
        options: [
          'True',
          'False',
          'None',
          'Error'
        ],
        answerIndex: 0,
        hints: ['startswith("PY") returns True if prefix matches.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_8_8',
        title: 'Boss: Decode Valley Signal',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Parse and clean the incoming encrypted Valley Signal transmission!',
        template: 'raw = " signal:online "\nclean = raw.strip().upper()\nprint(clean)',
        solution: 'raw = " signal:online "\nclean = raw.strip().upper()\nprint(clean)',
        expectedOutput: ['SIGNAL:ONLINE'],
        hints: ['Use raw.strip().upper() to strip whitespace and convert to uppercase.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 9: FILES & EXCEPTIONS ---------------- //
  {
    id: 9,
    title: 'Files & Exception Handling',
    subtitle: 'File I/O & Safe Try-Except Blocks',
    icon: '🔒',
    color: '#ef4444',
    guide: 'Mira',
    zone: 'Log Recovery Center',
    description: 'Master file reading/writing (with open) and safe exception handling (try, except, finally).',
    missions: [
      {
        id: 'py_9_1',
        title: 'Safe Try-Except Block',
        type: 'write_query',
        story: 'Handle zero division division 10 / 0 inside a try-except block and print "HANDLED".',
        template: '# Write your Python script here...\n',
        solution: 'try:\n    res = 10 / 0\nexcept ZeroDivisionError:\n    print("HANDLED")',
        expectedOutput: ['HANDLED'],
        hints: ['Catch ZeroDivisionError inside except block.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_9_2',
        title: 'Try-Except ValueError Check',
        type: 'write_query',
        story: 'Attempt converting "invalid" to int inside try-except and print "INVALID NUM".',
        template: '# Write your Python script here...\n',
        solution: 'try:\n    val = int("invalid")\nexcept ValueError:\n    print("INVALID NUM")',
        expectedOutput: ['INVALID NUM'],
        hints: ['int("invalid") throws ValueError.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_9_3',
        title: 'Finally Block Cleanup',
        type: 'predict_output',
        story: 'Does a finally block execute even if an exception occurs?',
        options: [
          'Yes, finally ALWAYS executes',
          'No, finally executes only on success',
          'Only if specified in settings',
          'Error'
        ],
        answerIndex: 0,
        hints: ['finally executes regardless of exceptions.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_9_4',
        title: 'Reading File Modes Explanation',
        type: 'multiple_choice',
        story: 'What is the purpose of the "w" mode in open(filename, "w")?',
        options: [
          'Write mode (overwrites file or creates new file)',
          'Read-only mode',
          'Append mode without deleting',
          'Binary audio mode'
        ],
        answerIndex: 0,
        hints: ['"w" mode opens file for writing and overwrites contents.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_9_5',
        title: 'Append Mode "a" Check',
        type: 'multiple_choice',
        story: 'Which file mode appends new lines to the end of an existing file?',
        options: [
          '"a"',
          '"r"',
          '"w"',
          '"x"'
        ],
        answerIndex: 0,
        hints: ['"a" mode appends without deleting existing lines.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_9_6',
        title: 'Simulated Log File Read',
        type: 'write_query',
        story: 'Simulate reading lines from log_data = ["LINE1\\n", "LINE2\\n"] and print count of lines.',
        template: '# Write your Python script here...\n',
        solution: 'log_data = ["LINE1\\n", "LINE2\\n"]\nprint(len(log_data))',
        expectedOutput: ['2'],
        hints: ['len(log_data) counts number of file lines.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_9_7',
        title: 'Catching Generic Exceptions',
        type: 'write_query',
        story: 'Catch any general Exception and print "ERROR CAUGHT".',
        template: '# Write your Python script here...\n',
        solution: 'try:\n    x = 1 / 0\nexcept Exception:\n    print("ERROR CAUGHT")',
        expectedOutput: ['ERROR CAUGHT'],
        hints: ['except Exception: catches any general runtime error.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_9_8',
        title: 'Boss: Recover Lost Logs',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Recover corrupted log files safely using try-except-finally handling!',
        template: 'try:\n    status = "READING LOGS"\n    print(status)\nexcept Exception:\n    print("FAILED")\nfinally:\n    print("LOG RECOVERY COMPLETE")',
        solution: 'try:\n    status = "READING LOGS"\n    print(status)\nexcept Exception:\n    print("FAILED")\nfinally:\n    print("LOG RECOVERY COMPLETE")',
        expectedOutput: ['READING LOGS', 'LOG RECOVERY COMPLETE'],
        hints: ['Print "READING LOGS" in try, then print "LOG RECOVERY COMPLETE" in finally.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 10: OBJECT-ORIENTED PYTHON ---------------- //
  {
    id: 10,
    title: 'Object-Oriented Python',
    subtitle: 'Classes, Objects, __init__ & Methods',
    icon: '🤖',
    color: '#8b5cf6',
    guide: 'Nova',
    zone: 'Robot Academy Lab',
    description: 'Master OOP principles: classes, objects, attributes, methods, self, and __init__ constructors.',
    missions: [
      {
        id: 'py_10_1',
        title: 'Defining Robot Class',
        type: 'write_query',
        story: 'Define class Robot with __init__(self, name) setting self.name = name.',
        template: '# Write your Python script here...\n',
        solution: 'class Robot:\n    def __init__(self, name):\n        self.name = name\nr = Robot("RX-9")\nprint(r.name)',
        expectedOutput: ['RX-9'],
        hints: ['Use class Robot: and __init__(self, name).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_10_2',
        title: 'Adding Robot Method',
        type: 'write_query',
        story: 'Add method speak(self) to Robot that prints self.name.',
        template: '# Write your Python script here...\n',
        solution: 'class Robot:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        print(self.name)\nr = Robot("Aiden-Bot")\nr.speak()',
        expectedOutput: ['Aiden-Bot'],
        hints: ['Call r.speak() to execute the instance method.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_10_3',
        title: 'What does self represent?',
        type: 'multiple_choice',
        story: 'In Python OOP, what does the parameter self represent inside class methods?',
        options: [
          'The current instance object of the class',
          'The global system operating system',
          'A mandatory keyword reserved for math calculations',
          'The parent file directory name'
        ],
        answerIndex: 0,
        hints: ['self refers to the specific instance object being called.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_10_4',
        title: 'Multiple Robot Instances',
        type: 'write_query',
        story: 'Create two Robot objects r1 = Robot("A") and r2 = Robot("B") and print r1.name + r2.name.',
        template: '# Write your Python script here...\n',
        solution: 'class Robot:\n    def __init__(self, name):\n        self.name = name\nr1 = Robot("A")\nr2 = Robot("B")\nprint(r1.name + r2.name)',
        expectedOutput: ['AB'],
        hints: ['Concatenate r1.name and r2.name.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_10_5',
        title: 'Class Attribute vs Instance Attribute',
        type: 'predict_output',
        story: 'What will print(r.category) output if class Robot has category = "AUTOMATION"?',
        options: [
          'AUTOMATION',
          'None',
          'Robot',
          'Error'
        ],
        answerIndex: 0,
        hints: ['Class attributes are shared across all instances.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_10_6',
        title: 'Updating Instance Attribute Method',
        type: 'write_query',
        story: 'Add charge(self, amount) method updating self.battery += amount.',
        template: '# Write your Python script here...\n',
        solution: 'class Robot:\n    def __init__(self):\n        self.battery = 50\n    def charge(self, amount):\n        self.battery += amount\nr = Robot()\nr.charge(30)\nprint(r.battery)',
        expectedOutput: ['80'],
        hints: ['50 + 30 = 80.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_10_7',
        title: 'Basic Class Inheritance',
        type: 'multiple_choice',
        story: 'How do you create a subclass Drone that inherits from class Robot?',
        options: [
          'class Drone(Robot):',
          'class Drone extends Robot:',
          'class Drone inherits Robot:',
          'def Drone(Robot):'
        ],
        answerIndex: 0,
        hints: ['Python inheritance uses parentheses: class Subclass(ParentClass):'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_10_8',
        title: 'Boss: Rebuild Robot Army',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct the Master Robot Commander Class for Python Valley!',
        template: 'class Commander:\n    def __init__(self, title):\n        self.title = title\n    def status(self):\n        return "COMMANDER: " + self.title\nc = Commander("ALPHA")\nprint(c.status())',
        solution: 'class Commander:\n    def __init__(self, title):\n        self.title = title\n    def status(self):\n        return "COMMANDER: " + self.title\nc = Commander("ALPHA")\nprint(c.status())',
        expectedOutput: ['COMMANDER: ALPHA'],
        hints: ['Define Commander class, instantiate c = Commander("ALPHA"), print c.status().'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 11: MODULES & PRACTICAL SCRIPTS ---------------- //
  {
    id: 11,
    title: 'Modules & Practical Scripts',
    subtitle: 'Importing Standard Libraries & Utilities',
    icon: '📦',
    color: '#06b6d4',
    guide: 'Bram',
    zone: 'Module Station Hub',
    description: 'Master importing modules (import math, random), standard libraries, and script organization.',
    missions: [
      {
        id: 'py_11_1',
        title: 'Importing Math Module',
        type: 'write_query',
        story: 'Import math and print int(math.sqrt(16)).',
        template: '# Write your Python script here...\n',
        solution: 'import math\nprint(int(math.sqrt(16)))',
        expectedOutput: ['4'],
        hints: ['math.sqrt(16) calculates square root = 4.0.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_11_2',
        title: 'Importing Specific Function',
        type: 'write_query',
        story: 'Import ceil from math using from math import ceil and print ceil(4.2).',
        template: '# Write your Python script here...\n',
        solution: 'from math import ceil\nprint(ceil(4.2))',
        expectedOutput: ['5'],
        hints: ['ceil(4.2) rounds up to 5.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_11_3',
        title: 'Random Choice Selection',
        type: 'write_query',
        story: 'Simulate selecting item from list items = ["ALPHA"] using random choices.',
        template: '# Write your Python script here...\n',
        solution: 'items = ["ALPHA"]\nprint(items[0])',
        expectedOutput: ['ALPHA'],
        hints: ['Select index 0 from items.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_11_4',
        title: 'Module Alias with AS',
        type: 'predict_output',
        story: 'What is the syntax to import module math with alias m?',
        options: [
          'import math as m',
          'using math as m',
          'include math as m',
          'alias math m'
        ],
        answerIndex: 0,
        hints: ['import module as alias is standard Python syntax.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_11_5',
        title: 'Module Search Path',
        type: 'multiple_choice',
        story: 'Where does Python look when you execute an import statement?',
        options: [
          'Current directory, standard library, and sys.path directories',
          'Web browser cache only',
          'SQL database indexes',
          'CSS stylesheet files'
        ],
        answerIndex: 0,
        hints: ['Python searches current script folder and standard library paths.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'py_11_6',
        title: 'Practical Automation Script',
        type: 'write_query',
        story: 'Build automation utility calc_tax(val) returning val * 1.1. Print int(calc_tax(100)).',
        template: '# Write your Python script here...\n',
        solution: 'def calc_tax(val):\n    return val * 1.1\nprint(int(calc_tax(100)))',
        expectedOutput: ['110'],
        hints: ['100 * 1.1 = 110.0 -> int is 110.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_11_7',
        title: 'Fixing Import Syntax Error',
        type: 'fix_query',
        story: 'Fix import statement typo.',
        buggyCode: 'include math\nprint(math.floor(3.9))',
        solution: 'import math\nprint(math.floor(3.9))',
        expectedOutput: ['3'],
        hints: ['Replace "include" with "import".'],
        xp: 60,
        coins: 25
      },
      {
        id: 'py_11_8',
        title: 'Boss: Restart Automation Network',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Restart the Python Valley Automation Network with modular functions!',
        template: 'def network_status():\n    return "NETWORK: ONLINE"\nprint(network_status())',
        solution: 'def network_status():\n    return "NETWORK: ONLINE"\nprint(network_status())',
        expectedOutput: ['NETWORK: ONLINE'],
        hints: ['Define network_status() returning "NETWORK: ONLINE" and print.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 12: FINAL AUTOMATION CORE ---------------- //
  {
    id: 12,
    title: 'Final Automation Core & Project',
    subtitle: 'Full Python Valley Capstone System',
    icon: '🏆',
    color: '#E6A93D',
    guide: 'Aiden',
    zone: 'Python Valley Core Engine',
    description: 'Combine all Python skills (Variables, Conditions, Loops, Collections, OOP, Exceptions) to build the Robot Management System Capstone.',
    missions: [
      {
        id: 'py_12_1',
        title: 'Robot Class Blueprint',
        type: 'write_query',
        story: 'Stage 1: Define class Robot with name and energy attributes.',
        template: '# Write your Python script here...\n',
        solution: 'class Robot:\n    def __init__(self, name, energy=100):\n        self.name = name\n        self.energy = energy\nr = Robot("Unit-1")\nprint(r.name)\nprint(r.energy)',
        expectedOutput: ['Unit-1', '100'],
        hints: ['Define Robot class with name and default energy=100.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'py_12_2',
        title: 'Adding Robot Mission Method',
        type: 'write_query',
        story: 'Stage 2: Add perform_task(cost) method that subtracts cost from energy.',
        template: '# Write your Python script here...\n',
        solution: 'class Robot:\n    def __init__(self, name, energy=100):\n        self.name = name\n        self.energy = energy\n    def perform_task(self, cost):\n        self.energy -= cost\nr = Robot("Unit-1")\nr.perform_task(30)\nprint(r.energy)',
        expectedOutput: ['70'],
        hints: ['100 - 30 = 70.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'py_12_3',
        title: 'Robot Roster Collection',
        type: 'write_query',
        story: 'Stage 3: Store 2 Robot objects in a list roster and print count.',
        template: '# Write your Python script here...\n',
        solution: 'class Robot:\n    def __init__(self, name):\n        self.name = name\nroster = [Robot("R1"), Robot("R2")]\nprint(len(roster))',
        expectedOutput: ['2'],
        hints: ['Store instantiated objects inside list roster.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'py_12_4',
        title: 'Iterating Roster Status',
        type: 'write_query',
        story: 'Stage 4: Loop through roster and print each robot name.',
        template: '# Write your Python script here...\n',
        solution: 'class Robot:\n    def __init__(self, name):\n        self.name = name\nroster = [Robot("R1"), Robot("R2")]\nfor r in roster:\n    print(r.name)',
        expectedOutput: ['R1', 'R2'],
        hints: ['Iterate for r in roster: print(r.name).'],
        xp: 70,
        coins: 30
      },
      {
        id: 'py_12_5',
        title: 'Energy Guard Condition',
        type: 'write_query',
        story: 'Stage 5: Print "READY" if robot energy >= 50 else "RECHARGE".',
        template: '# Write your Python script here...\n',
        solution: 'energy = 60\nif energy >= 50:\n    print("READY")\nelse:\n    print("RECHARGE")',
        expectedOutput: ['READY'],
        hints: ['Check if energy >= 50.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'py_12_6',
        title: 'Safe Task Exception Handling',
        type: 'write_query',
        story: 'Stage 6: Wrap energy assignment in try-except block.',
        template: '# Write your Python script here...\n',
        solution: 'try:\n    energy = int("100")\n    print("VALID ENERGY")\nexcept ValueError:\n    print("INVALID")',
        expectedOutput: ['VALID ENERGY'],
        hints: ['Use try-except ValueError.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'py_12_7',
        title: 'Python Valley Certification Checkpoint',
        type: 'multiple_choice',
        story: 'What defines a complete Python Valley Automation System capstone program?',
        options: [
          'Combining OOP, functions, data structures, exception handling, and clear logic',
          'Only writing 1 line print statements',
          'Using external CSS styles inside Python code',
          'Deleting all diagnostic logs'
        ],
        answerIndex: 0,
        hints: ['Capstone systems integrate multiple Python concepts into cohesive applications.'],
        xp: 80,
        coins: 35
      },
      {
        id: 'py_12_8',
        title: 'FINAL BOSS: Restore Python Valley Automation Core',
        type: 'detective_boss',
        story: 'FINAL CAPSTONE BOSS: Fully restore Python Valley by initializing the Master Robot Automation System!',
        template: 'class SystemCore:\n    def __init__(self, name):\n        self.name = name\n    def activate(self):\n        return f"SYSTEM {self.name}: 100% OPERATIONAL"\ncore = SystemCore("PYTHON VALLEY")\nprint(core.activate())',
        solution: 'class SystemCore:\n    def __init__(self, name):\n        self.name = name\n    def activate(self):\n        return f"SYSTEM {self.name}: 100% OPERATIONAL"\ncore = SystemCore("PYTHON VALLEY")\nprint(core.activate())',
        expectedOutput: ['SYSTEM PYTHON VALLEY: 100% OPERATIONAL'],
        hints: ['Define SystemCore class, instantiate core, and print core.activate().'],
        xp: 300,
        coins: 100
      }
    ]
  }
];

export const getPythonChapterById = (id) => {
  return PYTHON_CURRICULUM.find((c) => c.id === Number(id)) || PYTHON_CURRICULUM[0];
};

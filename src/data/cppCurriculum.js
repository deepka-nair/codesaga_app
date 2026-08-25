// CodeSaga C++ Cyber Arena Curriculum — 12 Complete Chapters & 96 Playable Missions

export const CPP_CURRICULUM = [
  // ---------------- CHAPTER 1: C++ AWAKENING ---------------- //
  {
    id: 1,
    title: 'C++ Awakening',
    subtitle: 'Compilation, Main Function & I/O Streams',
    icon: '⚡',
    color: '#a855f7',
    guide: 'Vector',
    zone: 'Cyber Arena High Core',
    description: 'Awaken the C++ Cyber Arena and master compilation, main functions, std::cout, and comments.',
    missions: [
      {
        id: 'cpp_1_1',
        title: 'Meet C++',
        type: 'multiple_choice',
        story: 'Welcome to C++ Cyber Arena! Before entering the Arena, confirm the language known for high performance in game engines, OS kernels, and embedded systems.',
        conceptExplanation: {
          what: 'C++ is a high-performance compiled language created by Bjarne Stroustrup.',
          why: 'Famous for low-level memory control, speed, and widespread use in Unreal Engine and operating systems.',
          when: 'Used whenever system execution speed and direct hardware memory access are critical.',
          how: 'Source code (.cpp) -> C++ Compiler (g++/clang) -> Machine Code Executable (.exe).'
        },
        options: ['Python', 'C++', 'Java', 'SQL'],
        answerIndex: 1,
        hints: ['C++ is renowned for performance and direct memory access.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_1_2',
        title: 'Your First C++ Program',
        type: 'write_query',
        story: 'Write a C++ program that prints "Hello C++!".',
        conceptExplanation: {
          what: 'Every C++ application starts execution inside the main() function.',
          why: '#include <iostream> provides input and output stream operations.',
          when: 'Always required to create standalone C++ executables.',
          how: '#include <iostream>\nint main() {\n    std::cout << "Hello C++!";\n    return 0;\n}'
        },
        template: '// Write your C++ code here...\n',
        solution: '#include <iostream>\nint main() {\n    std::cout << "Hello C++!";\n    return 0;\n}',
        expectedOutput: ['Hello C++!'],
        hints: ['Use std::cout << "Hello C++!"; inside main().'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_1_3',
        title: 'std::cout Output Stream',
        type: 'write_query',
        story: 'Print "Welcome to CodeSaga!" using std::cout.',
        template: '// Write your C++ code here...\n',
        solution: 'std::cout << "Welcome to CodeSaga!";',
        expectedOutput: ['Welcome to CodeSaga!'],
        hints: ['std::cout << "Welcome to CodeSaga!"; sends text to console stream.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_1_4',
        title: 'Multiple Lines & std::endl',
        type: 'write_query',
        story: 'Print three sequential status lines: "C++", "is", "powerful!".',
        template: '// Write your C++ code here...\n',
        solution: 'std::cout << "C++" << std::endl;\nstd::cout << "is" << std::endl;\nstd::cout << "powerful!";',
        expectedOutput: ['C++', 'is', 'powerful!'],
        hints: ['Use std::endl or "\\n" to insert newlines between lines.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_1_5',
        title: 'C++ Comments',
        type: 'multiple_choice',
        story: 'Which symbol is used for single-line comments in C++?',
        options: ['//', '/*', '#', '<!--'],
        answerIndex: 0,
        hints: ['Single-line comments in C++ start with //.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_1_6',
        title: 'main() Function',
        type: 'multiple_choice',
        story: 'What is the return type of the main() entry function in standard C++?',
        options: ['int', 'void', 'double', 'std::string'],
        answerIndex: 0,
        hints: ['int main() returns integer exit code 0 to OS on success.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_1_7',
        title: 'Compilation Pipeline',
        type: 'predict_output',
        story: 'What transforms human-readable C++ source code into direct machine code executables?',
        options: ['Compiler', 'Database Indexer', 'Browser DOM Engine', 'Operating System Shell'],
        answerIndex: 0,
        hints: ['A C++ compiler translates source code into machine code.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_1_8',
        title: 'Boss: C++ Awakening Core',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Combine main(), std::cout, and comments to activate the C++ Cyber Core!',
        template: '// Write your C++ code here...\n',
        solution: '// Cyber Core Activation\nstd::cout << "C++ CYBER CORE:" << std::endl;\nstd::cout << "ONLINE";',
        expectedOutput: ['C++ CYBER CORE:', 'ONLINE'],
        hints: ['Print "C++ CYBER CORE:" first, then print "ONLINE".'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 2: VARIABLES & DATA TYPES ---------------- //
  {
    id: 2,
    title: 'Variables & Data Types',
    subtitle: 'Primitives, Strings & Constants',
    icon: '📦',
    color: '#0ea5e9',
    guide: 'Vector',
    zone: 'Memory Vault',
    description: 'Master int, double, float, char, bool, std::string, and const variables in C++.',
    missions: [
      {
        id: 'cpp_2_1',
        title: 'Variables Concept',
        type: 'write_query',
        story: 'Declare an integer variable age with value 20 and print it.',
        template: '// Write your C++ code here...\n',
        solution: 'int age = 20;\nstd::cout << age;',
        expectedOutput: ['20'],
        hints: ['Declare int age = 20; then std::cout << age;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_2_2',
        title: 'Whole Numbers int',
        type: 'write_query',
        story: 'Declare score = 100 and year = 2026 and print score.',
        template: '// Write your C++ code here...\n',
        solution: 'int score = 100;\nint year = 2026;\nstd::cout << score;',
        expectedOutput: ['100'],
        hints: ['Declare int score = 100;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_2_3',
        title: 'Decimal Numbers double & float',
        type: 'write_query',
        story: 'Store price = 99.50 as a double and print it.',
        template: '// Write your C++ code here...\n',
        solution: 'double price = 99.50;\nstd::cout << price;',
        expectedOutput: ['99.5'],
        hints: ['Use double price = 99.50;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_2_4',
        title: 'Single Character char',
        type: 'multiple_choice',
        story: 'How are char literals enclosed in C++?',
        options: ["Single quotes 'A'", 'Double quotes "A"', 'Backticks `A`', 'No quotes'],
        answerIndex: 0,
        hints: ['char literals use single quotes like \'A\'.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_2_5',
        title: 'Boolean State bool',
        type: 'write_query',
        story: 'Set bool isLoggedIn = true; and print it.',
        template: '// Write your C++ code here...\n',
        solution: 'bool isLoggedIn = true;\nstd::cout << isLoggedIn;',
        expectedOutput: ['true'],
        hints: ['std::cout outputs boolean true as 1 or true.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_2_6',
        title: 'Text Object std::string',
        type: 'write_query',
        story: 'Declare std::string name = "Alex"; and print it.',
        template: '// Write your C++ code here...\n',
        solution: 'std::string name = "Alex";\nstd::cout << name;',
        expectedOutput: ['Alex'],
        hints: ['std::string uses double quotes.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_2_7',
        title: 'Constants const',
        type: 'write_query',
        story: 'Declare const double PI = 3.14159; and print PI.',
        template: '// Write your C++ code here...\n',
        solution: 'const double PI = 3.14159;\nstd::cout << PI;',
        expectedOutput: ['3.14159'],
        hints: ['const prevents modifying variable values after declaration.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_2_8',
        title: 'Boss: Player Profile Record',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Reconstruct the player profile using std::string, int, double, char, and bool!',
        template: '// Write your C++ code here...\n',
        solution: 'std::string name = "Alex";\nint level = 5;\nstd::cout << name << std::endl;\nstd::cout << level;',
        expectedOutput: ['Alex', '5'],
        hints: ['Declare name and level then print each on a new line.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 3: INPUT & OPERATORS ---------------- //
  {
    id: 3,
    title: 'Input & Operators',
    subtitle: 'cin, Arithmetic, Assignment & Logic',
    icon: '🎮',
    color: '#f59e0b',
    guide: 'Vector',
    zone: 'I/O Substation',
    description: 'Master user input (std::cin), arithmetic (+, -, *, /, %), assignment (+=, -=), and logical (&&, ||, !) operators.',
    missions: [
      {
        id: 'cpp_3_1',
        title: 'User Input std::cin',
        type: 'multiple_choice',
        story: 'Which operator is used with std::cin to receive input stream values into variables?',
        options: ['>> (Extraction operator)', '<< (Insertion operator)', '+=', '=='],
        answerIndex: 0,
        hints: ['std::cin >> variable extracts input.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_3_2',
        title: 'Arithmetic Addition',
        type: 'write_query',
        story: 'Calculate total by adding a = 40 and b = 60, then print total.',
        template: '// Write your C++ code here...\n',
        solution: 'int a = 40;\nint b = 60;\nint total = a + b;\nstd::cout << total;',
        expectedOutput: ['100'],
        hints: ['int total = a + b;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_3_3',
        title: 'Division & Modulus %',
        type: 'predict_output',
        story: 'What is the output of std::cout << (10 % 3);?',
        options: ['1', '3', '0', '3.33'],
        answerIndex: 0,
        hints: ['10 % 3 returns the remainder 1.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_3_4',
        title: 'Comparison Operators',
        type: 'write_query',
        story: 'Check if score = 100 is equal to target = 100 using == and print result.',
        template: '// Write your C++ code here...\n',
        solution: 'int score = 100;\nint target = 100;\nstd::cout << (score == target);',
        expectedOutput: ['true'],
        hints: ['Use (score == target).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_3_5',
        title: 'Logical AND &&',
        type: 'predict_output',
        story: 'What is the result of std::cout << (true && false);?',
        options: ['false', 'true', 'null', 'Error'],
        answerIndex: 0,
        hints: ['&& requires both operands to be true.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_3_6',
        title: 'Assignment Operators +=',
        type: 'write_query',
        story: 'Increment points = 50 by 20 using += and print points.',
        template: '// Write your C++ code here...\n',
        solution: 'int points = 50;\npoints += 20;\nstd::cout << points;',
        expectedOutput: ['70'],
        hints: ['points += 20 adds 20 to points.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_3_7',
        title: 'Expression Prediction',
        type: 'predict_output',
        story: 'What is the output of std::cout << (5 + 2 * 3);?',
        options: ['11', '21', '30', '10'],
        answerIndex: 0,
        hints: ['Multiplication operator * takes precedence over +.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_3_8',
        title: 'Boss: C++ Calculator',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Build the master score calculation and validation script!',
        template: '// Write your C++ code here...\n',
        solution: 'int base = 80;\nint bonus = 20;\nint total = base + bonus;\nstd::cout << total << std::endl;\nstd::cout << (total >= 100);',
        expectedOutput: ['100', 'true'],
        hints: ['Calculate total and check if total >= 100.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 4: DECISIONS & CONDITIONS ---------------- //
  {
    id: 4,
    title: 'Decisions & Conditions',
    subtitle: 'If, Else, Switch & Ternary',
    icon: '🔀',
    color: '#6366f1',
    guide: 'Vector',
    zone: 'Decision Control Center',
    description: 'Master conditional branching (if, else if, else), switch statements, and ternary operators.',
    missions: [
      {
        id: 'cpp_4_1',
        title: 'Conditional if Statement',
        type: 'write_query',
        story: 'Write an if statement to print "PASSED" if score >= 50.',
        template: '// Write your C++ code here...\n',
        solution: 'int score = 75;\nif (score >= 50) {\n    std::cout << "PASSED";\n}',
        expectedOutput: ['PASSED'],
        hints: ['Use if (score >= 50) { ... }.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_4_2',
        title: 'If-Else Positive Checker',
        type: 'write_query',
        story: 'Check if val > 0. If true print "POSITIVE", else print "NEGATIVE".',
        template: '// Write your C++ code here...\n',
        solution: 'int val = 10;\nif (val > 0) {\n    std::cout << "POSITIVE";\n} else {\n    std::cout << "NEGATIVE";\n}',
        expectedOutput: ['POSITIVE'],
        hints: ['Use if-else block.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_4_3',
        title: 'Else-If Grade Classifier',
        type: 'write_query',
        story: 'Classify score: score >= 90 -> "GRADE A", score >= 80 -> "GRADE B", else -> "GRADE C".',
        template: '// Write your C++ code here...\n',
        solution: 'int score = 85;\nif (score >= 90) {\n    std::cout << "GRADE A";\n} else if (score >= 80) {\n    std::cout << "GRADE B";\n} else {\n    std::cout << "GRADE C";\n}',
        expectedOutput: ['GRADE B'],
        hints: ['Use else if (score >= 80).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_4_4',
        title: 'Nested if Statements',
        type: 'predict_output',
        story: 'What is the output of this nested security clearance check?',
        options: ['AUTHORIZED', 'DENIED', 'LOCKED', 'Error'],
        answerIndex: 0,
        hints: ['Both outer and inner conditions evaluate to true.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_4_5',
        title: 'Combining Conditions with && and ||',
        type: 'write_query',
        story: 'Grant access if hasKey is true AND passcode is 999.',
        template: '// Write your C++ code here...\n',
        solution: 'bool hasKey = true;\nint passcode = 999;\nif (hasKey && passcode == 999) {\n    std::cout << "GRANTED";\n}',
        expectedOutput: ['GRANTED'],
        hints: ['Use if (hasKey && passcode == 999).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_4_6',
        title: 'Switch Statement',
        type: 'write_query',
        story: 'Use switch statement for option = 1 printing "START".',
        template: '// Write your C++ code here...\n',
        solution: 'int option = 1;\nswitch (option) {\n    case 1:\n        std::cout << "START";\n        break;\n}',
        expectedOutput: ['START'],
        hints: ['Use switch (option) { case 1: ... break; }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_4_7',
        title: 'Ternary Operator ? :',
        type: 'predict_output',
        story: 'What is the output of std::string res = age >= 18 ? "Adult" : "Minor"; if age is 20?',
        options: ['Adult', 'Minor', '18', 'Error'],
        answerIndex: 0,
        hints: ['Since 20 >= 18 is true, the first expression "Adult" is selected.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_4_8',
        title: 'Boss: Security Gate Clearance',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct the security gate clearance protocol using if-else logic!',
        template: '// Write your C++ code here...\n',
        solution: 'int clearance = 5;\nif (clearance >= 5) {\n    std::cout << "ACCESS GRANTED";\n} else {\n    std::cout << "ACCESS DENIED";\n}',
        expectedOutput: ['ACCESS GRANTED'],
        hints: ['Check if clearance >= 5 and print ACCESS GRANTED.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 5: LOOPS ---------------- //
  {
    id: 5,
    title: 'Loops & Iteration',
    subtitle: 'For, While & Do-While',
    icon: '🔁',
    color: '#10b981',
    guide: 'Vector',
    zone: 'Loop Railway Station',
    description: 'Master for loops, while loops, do-while loops, break, and continue statements.',
    missions: [
      {
        id: 'cpp_5_1',
        title: 'Why Loops?',
        type: 'multiple_choice',
        story: 'What is the primary advantage of using loops in C++?',
        options: [
          'To execute a block of code repeatedly without writing duplicate statements',
          'To convert strings to double numbers automatically',
          'To delete files from hard disk drives',
          'To change web page CSS colors'
        ],
        answerIndex: 0,
        hints: ['Loops eliminate repetitive manual code execution.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_5_2',
        title: 'For Loop Counter',
        type: 'write_query',
        story: 'Write a for loop to print numbers 1 to 3.',
        template: '// Write your C++ code here...\n',
        solution: 'for (int i = 1; i <= 3; i++) {\n    std::cout << i << std::endl;\n}',
        expectedOutput: ['1', '2', '3'],
        hints: ['for (int i = 1; i <= 3; i++) { std::cout << i << std::endl; }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_5_3',
        title: 'While Loop Counter',
        type: 'write_query',
        story: 'Use a while loop to count down count = 3 down to 1.',
        template: '// Write your C++ code here...\n',
        solution: 'int count = 3;\nwhile (count > 0) {\n    std::cout << count << std::endl;\n    count--;\n}',
        expectedOutput: ['3', '2', '1'],
        hints: ['Decrement count-- inside while loop.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_5_4',
        title: 'Do-While Loop Execution',
        type: 'predict_output',
        story: 'Does a do-while loop execute its body at least once even if the condition is false?',
        options: ['Yes, always at least once', 'No, never', 'Only on Sundays', 'Error'],
        answerIndex: 0,
        hints: ['do-while evaluates its condition AFTER executing the body.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_5_5',
        title: 'Break Statement',
        type: 'predict_output',
        story: 'What numbers are printed when for loop breaks at i == 3?',
        options: ['1 then 2', '1 then 2 then 3', '3 only', 'Infinite loop'],
        answerIndex: 0,
        hints: ['break terminates loop execution immediately.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_5_6',
        title: 'Continue Statement',
        type: 'write_query',
        story: 'Skip number 2 using continue inside for (int i = 1; i <= 3; i++).',
        template: '// Write your C++ code here...\n',
        solution: 'for (int i = 1; i <= 3; i++) {\n    if (i == 2) continue;\n    std::cout << i << std::endl;\n}',
        expectedOutput: ['1', '3'],
        hints: ['if (i == 2) continue;.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_5_7',
        title: 'Nested Loops Pattern',
        type: 'write_query',
        story: 'Print 2x2 grid using nested loops.',
        template: '// Write your C++ code here...\n',
        solution: 'for (int i = 1; i <= 2; i++) {\n    for (int j = 1; j <= 2; j++) {\n        std::cout << i << std::endl;\n    }\n}',
        expectedOutput: ['1', '1', '2', '2'],
        hints: ['Outer loop runs 2 times, inner loop runs 2 times.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_5_8',
        title: 'Boss: Number Guessing Game',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Execute the robot calibration sequence across 3 units!',
        template: '// Write your C++ code here...\n',
        solution: 'for (int unit = 1; unit <= 3; unit++) {\n    std::cout << "UNIT " << unit << " CALIBRATED" << std::endl;\n}',
        expectedOutput: ['UNIT 1 CALIBRATED', 'UNIT 2 CALIBRATED', 'UNIT 3 CALIBRATED'],
        hints: ['Iterate unit 1 to 3 and print calibration status.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 6: ARRAYS & VECTORS ---------------- //
  {
    id: 6,
    title: 'Arrays & Vectors',
    subtitle: 'Raw Arrays & std::vector',
    icon: '🧩',
    color: '#06b6d4',
    guide: 'Vector',
    zone: 'Vector Array Lab',
    description: 'Master fixed arrays (int scores[5]), 0-based indexing, array loops, and dynamic std::vector.',
    missions: [
      {
        id: 'cpp_6_1',
        title: 'Fixed Array Basics',
        type: 'write_query',
        story: 'Declare an array int scores[] = {90, 80, 70}; and print scores[0].',
        template: '// Write your C++ code here...\n',
        solution: 'int scores[] = {90, 80, 70};\nstd::cout << scores[0];',
        expectedOutput: ['90'],
        hints: ['Array indexing starts at 0.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_6_2',
        title: 'Array Initialization',
        type: 'write_query',
        story: 'Print second element scores[1] from scores = {90, 80}.',
        template: '// Write your C++ code here...\n',
        solution: 'int scores[] = {90, 80};\nstd::cout << scores[1];',
        expectedOutput: ['80'],
        hints: ['scores[1] retrieves the second item.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_6_3',
        title: 'Updating Array Values',
        type: 'write_query',
        story: 'Update scores[0] = 100; and print scores[0].',
        template: '// Write your C++ code here...\n',
        solution: 'int scores[] = {90, 80};\nscores[0] = 100;\nstd::cout << scores[0];',
        expectedOutput: ['100'],
        hints: ['Assign scores[0] = 100;.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_6_4',
        title: 'Looping Through Arrays',
        type: 'write_query',
        story: 'Iterate through scores = {10, 20} using a for loop and print each.',
        template: '// Write your C++ code here...\n',
        solution: 'int scores[] = {10, 20};\nfor (int i = 0; i < 2; i++) {\n    std::cout << scores[i] << std::endl;\n}',
        expectedOutput: ['10', '20'],
        hints: ['Loop from i = 0 to i < 2.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_6_5',
        title: 'Find Largest Value',
        type: 'predict_output',
        story: 'What is the maximum value in int vals[] = {5, 45, 12}?',
        options: ['45', '5', '12', '0'],
        answerIndex: 0,
        hints: ['45 is the largest number in the array.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_6_6',
        title: 'Dynamic std::vector Container',
        type: 'multiple_choice',
        story: 'Which standard C++ container dynamically resizes as elements are added?',
        options: ['std::vector', 'Raw Array int[]', 'std::string', 'char'],
        answerIndex: 0,
        hints: ['std::vector automatically grows in memory.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_6_7',
        title: 'vector push_back() Method',
        type: 'write_query',
        story: 'Simulate vector scores; scores.push_back(100); and print size.',
        template: '// Write your C++ code here...\n',
        solution: 'std::vector<int> scores;\nscores.push_back(100);\nstd::cout << scores.size();',
        expectedOutput: ['1'],
        hints: ['push_back() appends elements to vectors.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_6_8',
        title: 'Boss: Student Score Analyzer',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Reorganize and display the student score records using vector size!',
        template: '// Write your C++ code here...\n',
        solution: 'std::vector<int> marks;\nmarks.push_back(95);\nmarks.push_back(85);\nstd::cout << "TOTAL RECORDS: " << marks.size();',
        expectedOutput: ['TOTAL RECORDS: 2'],
        hints: ['Push 95 and 85 to marks and print size.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 7: STRINGS & FUNCTIONS ---------------- //
  {
    id: 7,
    title: 'Strings & Functions',
    subtitle: 'String Methods & Functions',
    icon: '🧵',
    color: '#ef4444',
    guide: 'Vector',
    zone: 'Function Signal Tower',
    description: 'Master std::string operations (.length(), indexing), functions, parameters, and return values.',
    missions: [
      {
        id: 'cpp_7_1',
        title: 'std::string Basics',
        type: 'write_query',
        story: 'Declare std::string msg = "CODESAGA"; and print it.',
        template: '// Write your C++ code here...\n',
        solution: 'std::string msg = "CODESAGA";\nstd::cout << msg;',
        expectedOutput: ['CODESAGA'],
        hints: ['std::string msg = "CODESAGA";.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_7_2',
        title: 'String length() Method',
        type: 'write_query',
        story: 'Print length of str = "CODE".',
        template: '// Write your C++ code here...\n',
        solution: 'std::string str = "CODE";\nstd::cout << str.length();',
        expectedOutput: ['4'],
        hints: ['Use str.length().'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_7_3',
        title: 'Accessing Characters with Indexing',
        type: 'write_query',
        story: 'Extract first character str[0] from "CODESAGA" and print it.',
        template: '// Write your C++ code here...\n',
        solution: 'std::string str = "CODESAGA";\nstd::cout << str[0];',
        expectedOutput: ['C'],
        hints: ['str[0] returns char at index 0.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_7_4',
        title: 'Defining Functions void',
        type: 'write_query',
        story: 'Define void greet() printing "HELLO" and call it.',
        template: '// Write your C++ code here...\n',
        solution: 'void greet() {\n    std::cout << "HELLO";\n}\ngreet();',
        expectedOutput: ['HELLO'],
        hints: ['Define void greet() { ... } then call greet();.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_7_5',
        title: 'Function Parameters',
        type: 'write_query',
        story: 'Define show(std::string msg) printing msg, call show("SIGNAL").',
        template: '// Write your C++ code here...\n',
        solution: 'void show(std::string msg) {\n    std::cout << msg;\n}\nshow("SIGNAL");',
        expectedOutput: ['SIGNAL'],
        hints: ['Pass "SIGNAL" to show.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_7_6',
        title: 'Function Return Values',
        type: 'write_query',
        story: 'Define int add(int a, int b) returning a + b. Print result of add(15, 15).',
        template: '// Write your C++ code here...\n',
        solution: 'int add(int a, int b) {\n    return a + b;\n}\nstd::cout << add(15, 15);',
        expectedOutput: ['30'],
        hints: ['Use return a + b; inside add.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_7_7',
        title: 'void vs Return Type',
        type: 'multiple_choice',
        story: 'What does the void keyword signify in a function declaration?',
        options: [
          'The function does not return any value',
          'The function accepts no parameters',
          'The function is private',
          'The function runs inside a background thread'
        ],
        answerIndex: 0,
        hints: ['void means no return value.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_7_8',
        title: 'Boss: Modular Calculator',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct modular functions computing system status!',
        template: '// Write your C++ code here...\n',
        solution: 'std::string getStatus() {\n    return "SYSTEM OPERATIONAL";\n}\nstd::cout << getStatus();',
        expectedOutput: ['SYSTEM OPERATIONAL'],
        hints: ['Define getStatus() returning "SYSTEM OPERATIONAL" and print.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 8: POINTERS & REFERENCES ---------------- //
  {
    id: 8,
    title: 'Pointers & References',
    subtitle: 'Addresses, Pointers & Dereferencing',
    icon: '🧠',
    color: '#8b5cf6',
    guide: 'Vector',
    zone: 'Memory Pointer Architecture Lab',
    description: 'Master memory addresses (&), pointer variables (int* ptr), dereferencing (*ptr), and references (int& ref).',
    missions: [
      {
        id: 'cpp_8_1',
        title: 'What Is a Memory Address?',
        type: 'multiple_choice',
        story: 'In C++, what does a variable memory address represent?',
        options: [
          'The physical location in RAM where variable bytes are stored',
          'A web socket URL address',
          'A file path on hard disk',
          'An SQL database table index'
        ],
        answerIndex: 0,
        hints: ['Memory addresses locate variables in computer RAM.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_8_2',
        title: 'Address-of Operator &',
        type: 'write_query',
        story: 'Retrieve address of age = 20 using &age and confirm concept.',
        template: '// Write your C++ code here...\n',
        solution: 'int age = 20;\nstd::cout << "ADDRESS RETRIEVED";',
        expectedOutput: ['ADDRESS RETRIEVED'],
        hints: ['The & operator retrieves the RAM memory address of a variable.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_8_3',
        title: 'Pointer Variables int* ptr',
        type: 'multiple_choice',
        story: 'What data does a pointer variable (e.g. int* ptr = &age;) hold?',
        options: [
          'The RAM memory address of another variable',
          'A double float value',
          'A string text block',
          'An HTTP response code'
        ],
        answerIndex: 0,
        hints: ['A pointer variable stores a memory address.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_8_4',
        title: 'Dereferencing Operator *',
        type: 'write_query',
        story: 'Dereference pointer *ptr to access target value 20.',
        template: '// Write your C++ code here...\n',
        solution: 'int age = 20;\nint* ptr = &age;\nstd::cout << *ptr;',
        expectedOutput: ['20'],
        hints: ['*ptr dereferences the pointer to read the value.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_8_5',
        title: 'Changing Values Through Pointers',
        type: 'write_query',
        story: 'Change age value to 30 via pointer assignment *ptr = 30; and print age.',
        template: '// Write your C++ code here...\n',
        solution: 'int age = 20;\nint* ptr = &age;\n*ptr = 30;\nstd::cout << age;',
        expectedOutput: ['30'],
        hints: ['Assign *ptr = 30; to mutate original variable.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_8_6',
        title: 'References int& ref',
        type: 'write_query',
        story: 'Create reference int& ref = val; where val = 50 and print ref.',
        template: '// Write your C++ code here...\n',
        solution: 'int val = 50;\nint& ref = val;\nstd::cout << ref;',
        expectedOutput: ['50'],
        hints: ['int& ref acts as an alias to original variable.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_8_7',
        title: 'Pointers vs References',
        type: 'multiple_choice',
        story: 'What is a key operational difference between C++ pointers and references?',
        options: [
          'Pointers can be reassigned to point to different memory addresses, whereas references cannot be reassigned after binding',
          'References take 1GB RAM memory',
          'Pointers cannot be used in functions',
          'There is no difference'
        ],
        answerIndex: 0,
        hints: ['Pointers can be reassigned or set to nullptr, references remain bound.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_8_8',
        title: 'Boss: Reference Modifier Function',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Modify variable value inside function using reference parameter int& score!',
        template: '// Write your C++ code here...\n',
        solution: 'void boost(int& val) {\n    val += 50;\n}\nint score = 50;\nboost(score);\nstd::cout << score;',
        expectedOutput: ['100'],
        hints: ['Pass score by reference int& val and add 50.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 9: OBJECT-ORIENTED C++ ---------------- //
  {
    id: 9,
    title: 'Object-Oriented C++',
    subtitle: 'Classes, Objects & Constructors',
    icon: '🧱',
    color: '#06b6d4',
    guide: 'Vector',
    zone: 'Object Architecture Center',
    description: 'Master C++ classes, objects, member functions, constructors, this pointer, and encapsulation.',
    missions: [
      {
        id: 'cpp_9_1',
        title: 'What Is a Class?',
        type: 'multiple_choice',
        story: 'In Object-Oriented Programming, what is a class?',
        options: [
          'A blueprint or template for creating objects',
          'A database backup file',
          'A browser cookie',
          'A CSS layout grid'
        ],
        answerIndex: 0,
        hints: ['Classes serve as blueprints for objects.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_9_2',
        title: 'Defining a Class & Object',
        type: 'write_query',
        story: 'Define class Student with field std::string name = "Alex"; and print s.name.',
        template: '// Write your C++ code here...\n',
        solution: 'class Student {\npublic:\n    std::string name = "Alex";\n};\nStudent s;\nstd::cout << s.name;',
        expectedOutput: ['Alex'],
        hints: ['Use public: section inside class Student.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_9_3',
        title: 'Member Functions',
        type: 'write_query',
        story: 'Add speak() member function printing "HERO ONLINE".',
        template: '// Write your C++ code here...\n',
        solution: 'class Hero {\npublic:\n    void speak() {\n        std::cout << "HERO ONLINE";\n    }\n};\nHero h;\nh.speak();',
        expectedOutput: ['HERO ONLINE'],
        hints: ['Call h.speak();.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_9_4',
        title: 'Class Constructors',
        type: 'predict_output',
        story: 'When is a class constructor automatically executed in C++?',
        options: [
          'Automatically when an object instance of the class is created',
          'Only when the program shuts down',
          'Whenever a loop finishes',
          'Never'
        ],
        answerIndex: 0,
        hints: ['Constructors execute automatically upon object instantiation.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_9_5',
        title: 'this Pointer',
        type: 'multiple_choice',
        story: 'What does the this pointer refer to inside an instance member function?',
        options: [
          'The pointer holding the address of the current calling object instance',
          'The operating system kernel',
          'The parent file directory',
          'The main function'
        ],
        answerIndex: 0,
        hints: ['this points to the current calling object.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_9_6',
        title: 'Encapsulation private & Getters',
        type: 'write_query',
        story: 'Create private field name and public getName() getter method.',
        template: '// Write your C++ code here...\n',
        solution: 'class User {\nprivate:\n    std::string name = "Aiden";\npublic:\n    std::string getName() {\n        return name;\n    }\n};\nUser u;\nstd::cout << u.getName();',
        expectedOutput: ['Aiden'],
        hints: ['Use public getter std::string getName() { return name; }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_9_7',
        title: 'Access Specifiers public vs private',
        type: 'multiple_choice',
        story: 'Why are member variables typically declared private in C++ classes?',
        options: [
          'To enforce encapsulation and prevent unauthorized external modification',
          'To format text headers',
          'To speed up CPU clock rate',
          'To automatically encrypt passwords'
        ],
        answerIndex: 0,
        hints: ['private protects internal state from arbitrary mutation.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_9_8',
        title: 'Boss: CodeSaga Character Class',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct the Master CodeSaga Character Class blueprint!',
        template: '// Write your C++ code here...\n',
        solution: 'class Character {\npublic:\n    std::string name = "Aria";\n    int xp = 500;\n};\nCharacter c;\nstd::cout << c.name << std::endl;\nstd::cout << c.xp;',
        expectedOutput: ['Aria', '500'],
        hints: ['Define Character class, instantiate c, and print name and xp.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 10: INHERITANCE & POLYMORPHISM ---------------- //
  {
    id: 10,
    title: 'Inheritance & Polymorphism',
    subtitle: 'Public Inheritance & Virtual Functions',
    icon: '🧬',
    color: '#38bdf8',
    guide: 'Vector',
    zone: 'Inheritance Citadel',
    description: 'Master class inheritance (class Child : public Parent), virtual functions, method overriding, and polymorphism.',
    missions: [
      {
        id: 'cpp_10_1',
        title: 'Class Inheritance public',
        type: 'write_query',
        story: 'Create class Dog : public Animal inheriting sound = "WOOF".',
        template: '// Write your C++ code here...\n',
        solution: 'class Animal {\npublic:\n    std::string sound = "WOOF";\n};\nclass Dog : public Animal {};\nDog d;\nstd::cout << d.sound;',
        expectedOutput: ['WOOF'],
        hints: ['Use class Dog : public Animal.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_10_2',
        title: 'Parent & Child Classes',
        type: 'predict_output',
        story: 'If class Warrior : public Character, which class is the child subclass?',
        options: ['Warrior', 'Character', 'Both', 'Neither'],
        answerIndex: 0,
        hints: ['Warrior is the child subclass inheriting from parent Character.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_10_3',
        title: 'protected Access Specifier',
        type: 'multiple_choice',
        story: 'What is the scope of protected class members in C++?',
        options: [
          'Accessible within the class itself and any derived child subclasses',
          'Publicly accessible everywhere',
          'Only accessible by main()',
          'Not accessible by anyone'
        ],
        answerIndex: 0,
        hints: ['protected allows child subclasses to access parent fields.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_10_4',
        title: 'Method Overriding',
        type: 'write_query',
        story: 'Override action() in subclass to print "SUPER MOVE".',
        template: '// Write your C++ code here...\n',
        solution: 'class Hero {\npublic:\n    void action() {\n        std::cout << "MOVE";\n    }\n};\nclass Warrior : public Hero {\npublic:\n    void action() {\n        std::cout << "SUPER MOVE";\n    }\n};\nWarrior w;\nw.action();',
        expectedOutput: ['SUPER MOVE'],
        hints: ['Override action() inside Warrior to print SUPER MOVE.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_10_5',
        title: 'Virtual Functions virtual',
        type: 'multiple_choice',
        story: 'Why is the virtual keyword declared before a parent method in C++?',
        options: [
          'Enables dynamic runtime dispatch so overriding child methods execute through parent pointers',
          'Speeds up CPU calculation',
          'Deletes class variables',
          'Prevents code compilation'
        ],
        answerIndex: 0,
        hints: ['virtual enables dynamic runtime method dispatch.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_10_6',
        title: 'Polymorphism Concept',
        type: 'predict_output',
        story: 'Can a parent pointer Hero* h = new Warrior(); hold a derived child object?',
        options: ['Yes, this is Polymorphism', 'No, C++ forbids this', 'Only for integers', 'Error'],
        answerIndex: 0,
        hints: ['Polymorphism allows parent pointers to hold derived child instances.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_10_7',
        title: 'Abstract Classes virtual ... = 0',
        type: 'multiple_choice',
        story: 'What is a pure virtual function (e.g. virtual void attack() = 0)?',
        options: [
          'A function with no parent body that makes the class abstract, requiring child implementations',
          'A function that deletes memory',
          'A web browser extension',
          'A loop keyword'
        ],
        answerIndex: 0,
        hints: ['Pure virtual functions force derived classes to implement them.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_10_8',
        title: 'Boss: RPG Class Hierarchy',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct the Master CodeSaga RPG Class Hierarchy!',
        template: '// Write your C++ code here...\n',
        solution: 'class Character {\npublic:\n    std::string role = "HERO";\n};\nclass Mage : public Character {\npublic:\n    void cast() {\n        std::cout << role << " CASTS SPELL";\n    }\n};\nMage m;\nm.cast();',
        expectedOutput: ['HERO CASTS SPELL'],
        hints: ['Inherit Character and call m.cast().'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 11: STL, EXCEPTIONS & FILES ---------------- //
  {
    id: 11,
    title: 'STL, Exceptions & Files',
    subtitle: 'Vectors, Maps, Sets & Streams',
    icon: '🧰',
    color: '#ec4899',
    guide: 'Vector',
    zone: 'STL Library Hub',
    description: 'Master C++ Standard Template Library (std::vector, std::map, std::set), try-catch exceptions, and fstream files.',
    missions: [
      {
        id: 'cpp_11_1',
        title: 'What Is the STL?',
        type: 'multiple_choice',
        story: 'What does STL stand for in standard C++ development?',
        options: ['Standard Template Library', 'System Test Logic', 'Sequential Table Layer', 'Storage Transport Line'],
        answerIndex: 0,
        hints: ['STL stands for Standard Template Library.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_11_2',
        title: 'std::map Key-Value Store',
        type: 'multiple_choice',
        story: 'Which STL container stores sorted key-value pairs?',
        options: ['std::map', 'std::vector', 'std::set', 'std::list'],
        answerIndex: 0,
        hints: ['std::map stores key-value pairs.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_11_3',
        title: 'std::set Unique Collection',
        type: 'multiple_choice',
        story: 'Which STL container automatically enforces unique elements without duplicates?',
        options: ['std::set', 'std::vector', 'std::map', 'std::deque'],
        answerIndex: 0,
        hints: ['std::set automatically ignores duplicate entries.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_11_4',
        title: 'STL Algorithms std::sort()',
        type: 'write_query',
        story: 'Simulate sorting elements and print "SORTED".',
        template: '// Write your C++ code here...\n',
        solution: 'std::cout << "SORTED";',
        expectedOutput: ['SORTED'],
        hints: ['Print "SORTED".'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_11_5',
        title: 'Exception Handling try-catch',
        type: 'write_query',
        story: 'Catch exception inside try-catch and print "HANDLED".',
        template: '// Write your C++ code here...\n',
        solution: 'try {\n    throw 404;\n} catch (...) {\n    std::cout << "HANDLED";\n}',
        expectedOutput: ['HANDLED'],
        hints: ['Use try { throw 404; } catch (...) { std::cout << "HANDLED"; }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_11_6',
        title: 'File Handling <fstream>',
        type: 'multiple_choice',
        story: 'Which standard header file provides C++ file stream operations (std::ifstream, std::ofstream)?',
        options: ['<fstream>', '<iostream>', '<vector>', '<string>'],
        answerIndex: 0,
        hints: ['<fstream> provides file stream operations.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'cpp_11_7',
        title: 'Exception Debugging Challenge',
        type: 'write_query',
        story: 'Safely handle error and print "OUT OF BOUNDS".',
        template: '// Write your C++ code here...\n',
        solution: 'try {\n    throw "OUT OF BOUNDS";\n} catch (const char* msg) {\n    std::cout << msg;\n}',
        expectedOutput: ['OUT OF BOUNDS'],
        hints: ['Catch const char* msg and print msg.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'cpp_11_8',
        title: 'Boss: Inventory Manager Challenge',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Initialize inventory data records safely!',
        template: '// Write your C++ code here...\n',
        solution: 'std::cout << "INVENTORY: INITIALIZED" << std::endl;\nstd::cout << "CLEANUP COMPLETE";',
        expectedOutput: ['INVENTORY: INITIALIZED', 'CLEANUP COMPLETE'],
        hints: ['Print INVENTORY: INITIALIZED then CLEANUP COMPLETE.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 12: C++ FINAL BOSS ---------------- //
  {
    id: 12,
    title: 'C++ Final Boss',
    subtitle: 'Player Management System Capstone',
    icon: '⚔️',
    color: '#E6A93D',
    guide: 'Vector',
    zone: 'Cyber Arena High Citadel',
    description: 'Combine variables, operators, conditions, loops, arrays, vectors, pointers, references, classes, STL, and file streams to build the Player Management System Capstone.',
    missions: [
      {
        id: 'cpp_12_1',
        title: 'C++ Master Review',
        type: 'multiple_choice',
        story: 'What is the mandatory entry function required in every standalone executable C++ application?',
        options: [
          'int main()',
          'void start()',
          'int init()',
          'class Main()'
        ],
        answerIndex: 0,
        hints: ['int main() is mandatory.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'cpp_12_2',
        title: 'Debugging C++ Code',
        type: 'write_query',
        story: 'Fix print statement syntax and print "DEBUGGED".',
        template: '// Write your C++ code here...\n',
        solution: 'std::cout << "DEBUGGED";',
        expectedOutput: ['DEBUGGED'],
        hints: ['Print "DEBUGGED".'],
        xp: 70,
        coins: 30
      },
      {
        id: 'cpp_12_3',
        title: 'Output Prediction Challenge',
        type: 'predict_output',
        story: 'What is the output of std::cout << (10 + 20);?',
        options: ['30', '1020', '30C++', 'Error'],
        answerIndex: 0,
        hints: ['10 + 20 evaluates to integer 30.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'cpp_12_4',
        title: 'Memory Challenge & Pointers',
        type: 'write_query',
        story: 'Access target value via dereferenced pointer and print it.',
        template: '// Write your C++ code here...\n',
        solution: 'int val = 99;\nint* ptr = &val;\nstd::cout << *ptr;',
        expectedOutput: ['99'],
        hints: ['Dereference *ptr to read 99.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'cpp_12_5',
        title: 'OOP Class Blueprint',
        type: 'write_query',
        story: 'Create class Player with name and score fields.',
        template: '// Write your C++ code here...\n',
        solution: 'class Player {\npublic:\n    std::string name = "Alex";\n    int score = 90;\n};\nPlayer p;\nstd::cout << p.name << std::endl;\nstd::cout << p.score;',
        expectedOutput: ['Alex', '90'],
        hints: ['Instantiate Player p and print name and score.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'cpp_12_6',
        title: 'STL Vector Capstone',
        type: 'write_query',
        story: 'Loop through vector marks {90, 80} and print each.',
        template: '// Write your C++ code here...\n',
        solution: 'std::vector<int> marks;\nmarks.push_back(90);\nmarks.push_back(80);\nfor (size_t i = 0; i < marks.size(); i++) {\n    std::cout << marks[i] << std::endl;\n}',
        expectedOutput: ['90', '80'],
        hints: ['Loop through marks vector.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'cpp_12_7',
        title: 'Player System Capstone',
        type: 'write_query',
        story: 'Build player calculator computing total for m1 = 85, m2 = 95.',
        template: '// Write your C++ code here...\n',
        solution: 'int m1 = 85;\nint m2 = 95;\nint total = m1 + m2;\nstd::cout << "TOTAL SCORE: " << total;',
        expectedOutput: ['TOTAL SCORE: 180'],
        hints: ['85 + 95 = 180.'],
        xp: 100,
        coins: 40
      },
      {
        id: 'cpp_12_8',
        title: 'C++ FINAL BOSS ⚔️',
        type: 'detective_boss',
        story: 'C++ FINAL BOSS: Fully conquer the C++ Cyber Arena by executing the Master Player Management System!',
        template: '// Write your C++ code here...\n',
        solution: 'class PlayerManager {\npublic:\n    void execute() {\n        std::cout << "C++ MASTERED";\n    }\n};\nPlayerManager pm;\npm.execute();',
        expectedOutput: ['C++ MASTERED'],
        hints: ['Instantiate PlayerManager pm and call pm.execute().'],
        xp: 300,
        coins: 100
      }
    ]
  }
];

export const getCppChapterById = (id) => {
  return CPP_CURRICULUM.find((c) => c.id === Number(id)) || CPP_CURRICULUM[0];
};

// CodeSaga Java Kingdom Curriculum — 12 Complete Chapters & 96 Playable Missions

export const JAVA_CURRICULUM = [
  // ---------------- CHAPTER 1: JAVA AWAKENING ---------------- //
  {
    id: 1,
    title: 'Java Awakening',
    subtitle: 'System Boot & Main Method Syntax',
    icon: '☕',
    color: '#f59e0b',
    guide: 'Jax',
    zone: 'Java Kingdom Citadel',
    description: 'Awaken the Java Kingdom Citadel and master classes, main methods, System.out.println(), and comments.',
    missions: [
      {
        id: 'java_1_1',
        title: 'Meet Java',
        type: 'multiple_choice',
        story: 'Welcome to Java Kingdom! Before entering the Citadel, confirm the programming language powered by the Java Virtual Machine (JVM).',
        conceptExplanation: {
          what: 'Java is a high-level, class-based, object-oriented programming language.',
          why: 'Famous for "Write Once, Run Anywhere" portability across servers, mobiles, and enterprise apps.',
          when: 'Used worldwide for web backends, Android apps, and large scale enterprise systems.',
          how: 'Compiled Java source code (.java) produces Bytecode (.class) executed by the JVM.'
        },
        options: ['Python', 'Java', 'SQL', 'C++'],
        answerIndex: 1,
        hints: ['Java is powered by the Java Virtual Machine.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_1_2',
        title: 'Your First Java Program',
        type: 'write_query',
        story: 'Construct a Java main class program that prints "Hello Java!".',
        conceptExplanation: {
          what: 'Every Java application requires a public class and main method.',
          why: 'public static void main(String[] args) is the entry point execution method.',
          when: 'Always required to start executing Java programs.',
          how: 'public class Main { public static void main(String[] args) { System.out.println("Hello Java!"); } }'
        },
        template: '// Write your Java code here...\n',
        solution: 'public class Main { public static void main(String[] args) { System.out.println("Hello Java!"); } }',
        expectedOutput: ['Hello Java!'],
        hints: ['Use System.out.println("Hello Java!"); inside main method.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_1_3',
        title: 'System.out.println()',
        type: 'write_query',
        story: 'Print "Welcome to CodeSaga!" to the Kingdom terminal screen.',
        template: '// Write your Java code here...\n',
        solution: 'System.out.println("Welcome to CodeSaga!");',
        expectedOutput: ['Welcome to CodeSaga!'],
        hints: ['System.out.println() prints output and moves to a new line.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_1_4',
        title: 'Multiple Outputs',
        type: 'write_query',
        story: 'Print three sequential status lines: "Java", "is", "awesome!".',
        template: '// Write your Java code here...\n',
        solution: 'System.out.println("Java");\nSystem.out.println("is");\nSystem.out.println("awesome!");',
        expectedOutput: ['Java', 'is', 'awesome!'],
        hints: ['Call System.out.println() three times.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_1_5',
        title: 'print() vs println()',
        type: 'predict_output',
        story: 'What is the output of System.out.print("Hello "); System.out.println("Java");?',
        options: ['Hello Java', 'Hello\\nJava', 'Java Hello', 'Error'],
        answerIndex: 0,
        hints: ['System.out.print() does not start a new line after printing.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_1_6',
        title: 'Java Comments',
        type: 'multiple_choice',
        story: 'Which symbol is used for single-line comments in Java?',
        options: ['//', '/*', '#', '<!--'],
        answerIndex: 0,
        hints: ['Single-line comments in Java start with //.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_1_7',
        title: 'How Java Runs',
        type: 'predict_output',
        story: 'What is Java source code compiled into before the JVM executes it?',
        options: ['Bytecode (.class files)', 'HTML files', 'PNG images', 'SQL tables'],
        answerIndex: 0,
        hints: ['Java source code is compiled into JVM Bytecode.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_1_8',
        title: 'Boss: Java Awakening Core',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Combine your knowledge of main methods, println(), and comments to awaken the Java Kingdom Core!',
        template: '// Write your Java code here...\n',
        solution: 'System.out.println("JAVA KINGDOM CORE:");\nSystem.out.println("ONLINE");',
        expectedOutput: ['JAVA KINGDOM CORE:', 'ONLINE'],
        hints: ['Print "JAVA KINGDOM CORE:" first, then print "ONLINE".'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 2: VARIABLES & DATA TYPES ---------------- //
  {
    id: 2,
    title: 'Variables & Data Types',
    subtitle: 'Primitives & Strings',
    icon: '📦',
    color: '#0ea5e9',
    guide: 'Jax',
    zone: 'Archives Vault',
    description: 'Master int, double, char, boolean, and String variables in Java.',
    missions: [
      {
        id: 'java_2_1',
        title: 'Variables Concept',
        type: 'write_query',
        story: 'Declare an integer variable score with value 100 and print it.',
        template: '// Write your Java code here...\n',
        solution: 'int score = 100;\nSystem.out.println(score);',
        expectedOutput: ['100'],
        hints: ['Declare int score = 100; then System.out.println(score);'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_2_2',
        title: 'Integer Data Type int',
        type: 'write_query',
        story: 'Declare age = 20 and year = 2026 and print age.',
        template: '// Write your Java code here...\n',
        solution: 'int age = 20;\nint year = 2026;\nSystem.out.println(age);',
        expectedOutput: ['20'],
        hints: ['Declare int age = 20;'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_2_3',
        title: 'Floating Point double',
        type: 'write_query',
        story: 'Store price = 99.50 as a double and print it.',
        template: '// Write your Java code here...\n',
        solution: 'double price = 99.50;\nSystem.out.println(price);',
        expectedOutput: ['99.5'],
        hints: ['Use double price = 99.50;'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_2_4',
        title: 'Single Character char',
        type: 'multiple_choice',
        story: 'How are char literals enclosed in Java?',
        options: ["Single quotes 'A'", 'Double quotes "A"', 'Backticks `A`', 'No quotes'],
        answerIndex: 0,
        hints: ['char literals use single quotes like \'A\'.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_2_5',
        title: 'Boolean State boolean',
        type: 'write_query',
        story: 'Set boolean isLoggedIn = true; and print it.',
        template: '// Write your Java code here...\n',
        solution: 'boolean isLoggedIn = true;\nSystem.out.println(isLoggedIn);',
        expectedOutput: ['true'],
        hints: ['Java booleans are lowercase: true or false.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_2_6',
        title: 'Text Object String',
        type: 'write_query',
        story: 'Declare String name = "Alex"; and print it.',
        template: '// Write your Java code here...\n',
        solution: 'String name = "Alex";\nSystem.out.println(name);',
        expectedOutput: ['Alex'],
        hints: ['String starts with capital S and uses double quotes.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_2_7',
        title: 'Correct Data Type Classifier',
        type: 'multiple_choice',
        story: 'Which data type is best for storing a user\'s account balance like 450.75?',
        options: ['double', 'int', 'boolean', 'char'],
        answerIndex: 0,
        hints: ['Decimal numbers use double or float.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_2_8',
        title: 'Boss: Student Profile Record',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Reconstruct the student profile record using String, int, and boolean data types!',
        template: '// Write your Java code here...\n',
        solution: 'String name = "Alex";\nint level = 5;\nboolean active = true;\nSystem.out.println(name);\nSystem.out.println(level);\nSystem.out.println(active);',
        expectedOutput: ['Alex', '5', 'true'],
        hints: ['Declare name, level, and active then print each.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 3: OPERATORS ---------------- //
  {
    id: 3,
    title: 'Operators & Calculations',
    subtitle: 'Arithmetic, Logical & Comparison',
    icon: '⚡',
    color: '#f59e0b',
    guide: 'Jax',
    zone: 'Power Generator Substation',
    description: 'Master arithmetic (+, -, *, /, %), comparison (==, !=, >, <), and logical (&&, ||, !) operators.',
    missions: [
      {
        id: 'java_3_1',
        title: 'Arithmetic Addition',
        type: 'write_query',
        story: 'Calculate total by adding a = 40 and b = 60, then print total.',
        template: '// Write your Java code here...\n',
        solution: 'int a = 40;\nint b = 60;\nint total = a + b;\nSystem.out.println(total);',
        expectedOutput: ['100'],
        hints: ['int total = a + b;'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_3_2',
        title: 'Shopping Total Addition',
        type: 'write_query',
        story: 'Calculate total price for item1 = 25 and item2 = 35.',
        template: '// Write your Java code here...\n',
        solution: 'int item1 = 25;\nint item2 = 35;\nSystem.out.println(item1 + item2);',
        expectedOutput: ['60'],
        hints: ['Print item1 + item2.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_3_3',
        title: 'Division & Modulus %',
        type: 'predict_output',
        story: 'What is the output of System.out.println(10 % 3)?',
        options: ['1', '3', '0', '3.33'],
        answerIndex: 0,
        hints: ['10 % 3 returns the remainder 1.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_3_4',
        title: 'Comparison Operators',
        type: 'write_query',
        story: 'Check if score = 100 is equal to target = 100 using == and print result.',
        template: '// Write your Java code here...\n',
        solution: 'int score = 100;\nint target = 100;\nSystem.out.println(score == target);',
        expectedOutput: ['true'],
        hints: ['Use score == target.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_3_5',
        title: 'Logical AND &&',
        type: 'predict_output',
        story: 'What is the result of System.out.println(true && false)?',
        options: ['false', 'true', 'null', 'Error'],
        answerIndex: 0,
        hints: ['&& requires both operands to be true.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_3_6',
        title: 'Assignment Operators +=',
        type: 'write_query',
        story: 'Increment points = 50 by 20 using += and print points.',
        template: '// Write your Java code here...\n',
        solution: 'int points = 50;\npoints += 20;\nSystem.out.println(points);',
        expectedOutput: ['70'],
        hints: ['points += 20 adds 20 to points.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_3_7',
        title: 'Expression Prediction',
        type: 'predict_output',
        story: 'What is the output of System.out.println(5 + 2 * 3)?',
        options: ['11', '21', '30', '10'],
        answerIndex: 0,
        hints: ['Multiplication operator * takes precedence over +.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_3_8',
        title: 'Boss: Score Calculator',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Build the master score calculation and validation script!',
        template: '// Write your Java code here...\n',
        solution: 'int base = 80;\nint bonus = 20;\nint total = base + bonus;\nboolean isPassed = total >= 100;\nSystem.out.println(total);\nSystem.out.println(isPassed);',
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
    color: '#a855f7',
    guide: 'Jax',
    zone: 'Security Gate Hub',
    description: 'Master conditional branching (if, else if, else), switch statements, and ternary operators.',
    missions: [
      {
        id: 'java_4_1',
        title: 'Conditional if Statement',
        type: 'write_query',
        story: 'Write an if statement to print "PASSED" if score >= 50.',
        template: '// Write your Java code here...\n',
        solution: 'int score = 75;\nif (score >= 50) {\n    System.out.println("PASSED");\n}',
        expectedOutput: ['PASSED'],
        hints: ['Use if (score >= 50) { ... }'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_4_2',
        title: 'If-Else Positive Checker',
        type: 'write_query',
        story: 'Check if val > 0. If true print "POSITIVE", else print "NEGATIVE".',
        template: '// Write your Java code here...\n',
        solution: 'int val = 10;\nif (val > 0) {\n    System.out.println("POSITIVE");\n} else {\n    System.out.println("NEGATIVE");\n}',
        expectedOutput: ['POSITIVE'],
        hints: ['Use if-else block.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_4_3',
        title: 'Else-If Grade Classifier',
        type: 'write_query',
        story: 'Classify score: score >= 90 -> "GRADE A", score >= 80 -> "GRADE B", else -> "GRADE C".',
        template: '// Write your Java code here...\n',
        solution: 'int score = 85;\nif (score >= 90) {\n    System.out.println("GRADE A");\n} else if (score >= 80) {\n    System.out.println("GRADE B");\n} else {\n    System.out.println("GRADE C");\n}',
        expectedOutput: ['GRADE B'],
        hints: ['Use else if (score >= 80).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_4_4',
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
        id: 'java_4_5',
        title: 'Combining Conditions with && and ||',
        type: 'write_query',
        story: 'Grant access if hasKey is true AND passcode is 999.',
        template: '// Write your Java code here...\n',
        solution: 'boolean hasKey = true;\nint passcode = 999;\nif (hasKey && passcode == 999) {\n    System.out.println("GRANTED");\n}',
        expectedOutput: ['GRANTED'],
        hints: ['Use if (hasKey && passcode == 999)'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_4_6',
        title: 'Switch Statement',
        type: 'write_query',
        story: 'Use switch statement for option = 1 printing "START".',
        template: '// Write your Java code here...\n',
        solution: 'int option = 1;\nswitch (option) {\n    case 1:\n        System.out.println("START");\n        break;\n}',
        expectedOutput: ['START'],
        hints: ['Use switch (option) { case 1: ... break; }'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_4_7',
        title: 'Ternary Operator ? :',
        type: 'predict_output',
        story: 'What is the output of String res = age >= 18 ? "Adult" : "Minor"; if age is 20?',
        options: ['Adult', 'Minor', '18', 'Error'],
        answerIndex: 0,
        hints: ['Since 20 >= 18 is true, the first expression "Adult" is selected.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_4_8',
        title: 'Boss: Security Gate Clearance',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct the security gate clearance protocol using if-else logic!',
        template: '// Write your Java code here...\n',
        solution: 'int clearance = 5;\nif (clearance >= 5) {\n    System.out.println("ACCESS GRANTED");\n} else {\n    System.out.println("ACCESS DENIED");\n}',
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
    color: '#6366f1',
    guide: 'Jax',
    zone: 'Looping Railway Station',
    description: 'Master for loops, while loops, do-while loops, break, and continue statements.',
    missions: [
      {
        id: 'java_5_1',
        title: 'Why Loops?',
        type: 'multiple_choice',
        story: 'What is the primary advantage of using loops in programming?',
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
        id: 'java_5_2',
        title: 'For Loop Counter',
        type: 'write_query',
        story: 'Write a for loop to print numbers 1 to 3.',
        template: '// Write your Java code here...\n',
        solution: 'for (int i = 1; i <= 3; i++) {\n    System.out.println(i);\n}',
        expectedOutput: ['1', '2', '3'],
        hints: ['for (int i = 1; i <= 3; i++) { System.out.println(i); }'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_5_3',
        title: 'While Loop Counter',
        type: 'write_query',
        story: 'Use a while loop to count down count = 3 down to 1.',
        template: '// Write your Java code here...\n',
        solution: 'int count = 3;\nwhile (count > 0) {\n    System.out.println(count);\n    count--;\n}',
        expectedOutput: ['3', '2', '1'],
        hints: ['Decrement count-- inside while loop.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_5_4',
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
        id: 'java_5_5',
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
        id: 'java_5_6',
        title: 'Continue Statement',
        type: 'write_query',
        story: 'Skip number 2 using continue inside for (int i = 1; i <= 3; i++).',
        template: '// Write your Java code here...\n',
        solution: 'for (int i = 1; i <= 3; i++) {\n    if (i == 2) continue;\n    System.out.println(i);\n}',
        expectedOutput: ['1', '3'],
        hints: ['if (i == 2) continue;'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_5_7',
        title: 'Nested Loops Pattern',
        type: 'write_query',
        story: 'Print 2x2 grid using nested loops.',
        template: '// Write your Java code here...\n',
        solution: 'for (int i = 1; i <= 2; i++) {\n    for (int j = 1; j <= 2; j++) {\n        System.out.println(i);\n    }\n}',
        expectedOutput: ['1', '1', '2', '2'],
        hints: ['Outer loop runs 2 times, inner loop runs 2 times.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_5_8',
        title: 'Boss: Number Loop Challenge',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Execute the robot calibration sequence across 3 units!',
        template: '// Write your Java code here...\n',
        solution: 'for (int unit = 1; unit <= 3; unit++) {\n    System.out.println("UNIT " + unit + " CALIBRATED");\n}',
        expectedOutput: ['UNIT 1 CALIBRATED', 'UNIT 2 CALIBRATED', 'UNIT 3 CALIBRATED'],
        hints: ['Iterate unit 1 to 3 and print calibration status.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 6: ARRAYS ---------------- //
  {
    id: 6,
    title: 'Arrays & Data Collections',
    subtitle: 'Indexed Arrays & Iteration',
    icon: '🧩',
    color: '#ec4899',
    guide: 'Jax',
    zone: 'The Data Vault',
    description: 'Master array creation, 0-based indexing, array iteration, and element searches.',
    missions: [
      {
        id: 'java_6_1',
        title: 'What is an Array?',
        type: 'write_query',
        story: 'Declare an array int[] scores = {90, 80, 70}; and print length.',
        template: '// Write your Java code here...\n',
        solution: 'int[] scores = {90, 80, 70};\nSystem.out.println(scores.length);',
        expectedOutput: ['3'],
        hints: ['scores.length returns the size of the array.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_6_2',
        title: 'Zero-Based Indexing',
        type: 'write_query',
        story: 'Print the first element of items = {"Alpha", "Beta"}.',
        template: '// Write your Java code here...\n',
        solution: 'String[] items = {"Alpha", "Beta"};\nSystem.out.println(items[0]);',
        expectedOutput: ['Alpha'],
        hints: ['Array indexing starts at 0.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_6_3',
        title: 'Updating Array Elements',
        type: 'write_query',
        story: 'Update scores[0] = 100; and print scores[0].',
        template: '// Write your Java code here...\n',
        solution: 'int[] scores = {90, 80};\nscores[0] = 100;\nSystem.out.println(scores[0]);',
        expectedOutput: ['100'],
        hints: ['Assign scores[0] = 100;'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_6_4',
        title: 'Array length Property',
        type: 'predict_output',
        story: 'What is the output of int[] arr = {10, 20, 30, 40}; System.out.println(arr.length);?',
        options: ['4', '3', '5', '0'],
        answerIndex: 0,
        hints: ['arr.length counts total element slots.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_6_5',
        title: 'Looping Through Arrays',
        type: 'write_query',
        story: 'Iterate through scores = {10, 20} using a for loop and print each value.',
        template: '// Write your Java code here...\n',
        solution: 'int[] scores = {10, 20};\nfor (int i = 0; i < scores.length; i++) {\n    System.out.println(scores[i]);\n}',
        expectedOutput: ['10', '20'],
        hints: ['Loop from i = 0 to i < scores.length.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_6_6',
        title: 'Find Largest Value',
        type: 'predict_output',
        story: 'What is the maximum value in int[] vals = {5, 45, 12}?',
        options: ['45', '5', '12', '0'],
        answerIndex: 0,
        hints: ['45 is the largest number in the array.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_6_7',
        title: 'Array Search Method',
        type: 'predict_output',
        story: 'What index position is item "Beta" at in String[] items = {"Alpha", "Beta", "Gamma"}?',
        options: ['1', '0', '2', '3'],
        answerIndex: 0,
        hints: ['"Alpha" is index 0, "Beta" is index 1.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_6_8',
        title: 'Boss: Student Score Analyzer',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Reorganize and display the student score records!',
        template: '// Write your Java code here...\n',
        solution: 'int[] marks = {95, 85};\nSystem.out.println("TOTAL RECORDS: " + marks.length);\nfor (int i = 0; i < marks.length; i++) {\n    System.out.println(marks[i]);\n}',
        expectedOutput: ['TOTAL RECORDS: 2', '95', '85'],
        hints: ['Print total records first, then loop through marks.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 7: STRINGS ---------------- //
  {
    id: 7,
    title: 'Strings & Text Processing',
    subtitle: 'Methods, Length & Equals',
    icon: '🧵',
    color: '#38bdf8',
    guide: 'Jax',
    zone: 'Text Signal Tower',
    description: 'Master Java String methods (.length(), .charAt(), .toUpperCase(), .equals(), .substring()).',
    missions: [
      {
        id: 'java_7_1',
        title: 'String Object Basics',
        type: 'write_query',
        story: 'Declare String msg = "JAVA"; and print it.',
        template: '// Write your Java code here...\n',
        solution: 'String msg = "JAVA";\nSystem.out.println(msg);',
        expectedOutput: ['JAVA'],
        hints: ['String msg = "JAVA";'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_7_2',
        title: 'String length() Method',
        type: 'write_query',
        story: 'Print length of str = "CODE".',
        template: '// Write your Java code here...\n',
        solution: 'String str = "CODE";\nSystem.out.println(str.length());',
        expectedOutput: ['4'],
        hints: ['Use str.length().'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_7_3',
        title: 'charAt() Character Extraction',
        type: 'write_query',
        story: 'Extract first character charAt(0) from "JAVA" and print it.',
        template: '// Write your Java code here...\n',
        solution: 'String str = "JAVA";\nSystem.out.println(str.charAt(0));',
        expectedOutput: ['J'],
        hints: ['str.charAt(0) returns char at index 0.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_7_4',
        title: 'toUpperCase() Conversion',
        type: 'write_query',
        story: 'Convert text = "hello" to uppercase and print it.',
        template: '// Write your Java code here...\n',
        solution: 'String text = "hello";\nSystem.out.println(text.toUpperCase());',
        expectedOutput: ['HELLO'],
        hints: ['Use text.toUpperCase().'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_7_5',
        title: 'toLowerCase() Conversion',
        type: 'write_query',
        story: 'Convert text = "WORLD" to lowercase and print it.',
        template: '// Write your Java code here...\n',
        solution: 'String text = "WORLD";\nSystem.out.println(text.toLowerCase());',
        expectedOutput: ['world'],
        hints: ['Use text.toLowerCase().'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_7_6',
        title: 'Content Equality equals()',
        type: 'multiple_choice',
        story: 'Why should String values be compared using .equals() instead of == in Java?',
        options: [
          '.equals() compares string text content, whereas == compares memory reference address',
          '.equals() converts strings to integers',
          '== is not supported in Java',
          'There is no difference'
        ],
        answerIndex: 0,
        hints: ['.equals() checks actual string character content.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_7_7',
        title: 'Substring Extraction substring()',
        type: 'predict_output',
        story: 'What is the output of "PYTHON".substring(0, 3)?',
        options: ['PYT', 'PYTHON', 'YTH', 'Error'],
        answerIndex: 0,
        hints: ['substring(0, 3) extracts characters from index 0 to 2.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_7_8',
        title: 'Boss: Username Analyzer',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Clean and format incoming user registration strings!',
        template: '// Write your Java code here...\n',
        solution: 'String raw = "agent_aria";\nString clean = raw.toUpperCase();\nSystem.out.println(clean);\nSystem.out.println("LEN: " + clean.length());',
        expectedOutput: ['AGENT_ARIA', 'LEN: 10'],
        hints: ['Convert to uppercase and print length.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 8: METHODS ---------------- //
  {
    id: 8,
    title: 'Methods & Modular Functions',
    subtitle: 'Static Methods, Parameters & Returns',
    icon: '🛠️',
    color: '#10b981',
    guide: 'Jax',
    zone: 'Modular Workshop',
    description: 'Master reusable methods, void vs return, parameters, and method invocation.',
    missions: [
      {
        id: 'java_8_1',
        title: 'What is a Method?',
        type: 'multiple_choice',
        story: 'What is a method in Java?',
        options: [
          'A block of reusable code that runs when called',
          'A database table index',
          'A web browser extension',
          'A graphic pixel format'
        ],
        answerIndex: 0,
        hints: ['Methods organize code into reusable functional blocks.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_8_2',
        title: 'Creating a Void Method',
        type: 'write_query',
        story: 'Define static void greet() printing "HELLO" and call it.',
        template: '// Write your Java code here...\n',
        solution: 'static void greet() {\n    System.out.println("HELLO");\n}\ngreet();',
        expectedOutput: ['HELLO'],
        hints: ['Define static void greet() { ... } then call greet();'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_8_3',
        title: 'Calling Methods',
        type: 'write_query',
        story: 'Call method ping() printing "PING".',
        template: '// Write your Java code here...\n',
        solution: 'static void ping() {\n    System.out.println("PING");\n}\nping();',
        expectedOutput: ['PING'],
        hints: ['Invoke ping();'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_8_4',
        title: 'Single Parameter Methods',
        type: 'write_query',
        story: 'Define show(String msg) printing msg, call show("SIGNAL").',
        template: '// Write your Java code here...\n',
        solution: 'static void show(String msg) {\n    System.out.println(msg);\n}\nshow("SIGNAL");',
        expectedOutput: ['SIGNAL'],
        hints: ['Pass "SIGNAL" to show.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_8_5',
        title: 'Multiple Parameters',
        type: 'write_query',
        story: 'Define printSum(int a, int b) printing a + b. Call printSum(10, 20).',
        template: '// Write your Java code here...\n',
        solution: 'static void printSum(int a, int b) {\n    System.out.println(a + b);\n}\nprintSum(10, 20);',
        expectedOutput: ['30'],
        hints: ['Pass 10 and 20 to printSum.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_8_6',
        title: 'Return Value Methods',
        type: 'write_query',
        story: 'Define static int add(int a, int b) returning a + b. Print result of add(15, 15).',
        template: '// Write your Java code here...\n',
        solution: 'static int add(int a, int b) {\n    return a + b;\n}\nSystem.out.println(add(15, 15));',
        expectedOutput: ['30'],
        hints: ['Use return a + b; inside add.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_8_7',
        title: 'void vs return Data Type',
        type: 'multiple_choice',
        story: 'What does the void keyword signify in a method declaration?',
        options: [
          'The method does not return any value',
          'The method accepts no parameters',
          'The method is private to the class',
          'The method runs inside a background thread'
        ],
        answerIndex: 0,
        hints: ['void means no return value.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_8_8',
        title: 'Boss: Method Calculator',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct modular methods to compute and return system status!',
        template: '// Write your Java code here...\n',
        solution: 'static String getStatus() {\n    return "SYSTEM OPERATIONAL";\n}\nSystem.out.println(getStatus());',
        expectedOutput: ['SYSTEM OPERATIONAL'],
        hints: ['Define getStatus() returning "SYSTEM OPERATIONAL" and print.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 9: OBJECT-ORIENTED JAVA ---------------- //
  {
    id: 9,
    title: 'Object-Oriented Java',
    subtitle: 'Classes, Objects & Constructors',
    icon: '🧱',
    color: '#8b5cf6',
    guide: 'Jax',
    zone: 'Object Architecture Lab',
    description: 'Master Java OOP principles: classes, objects, fields, instance methods, constructors, and this keyword.',
    missions: [
      {
        id: 'java_9_1',
        title: 'What is OOP?',
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
        id: 'java_9_2',
        title: 'Defining a Class',
        type: 'write_query',
        story: 'Define class Student with field String name = "Alex"; and instantiate it.',
        template: '// Write your Java code here...\n',
        solution: 'class Student {\n    String name = "Alex";\n}\nStudent s = new Student();\nSystem.out.println(s.name);',
        expectedOutput: ['Alex'],
        hints: ['Instantiate s = new Student(); and print s.name.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_9_3',
        title: 'Instantiating Objects with new',
        type: 'write_query',
        story: 'Instantiate Student object s1 and print s1.name.',
        template: '// Write your Java code here...\n',
        solution: 'class Student {\n    String name = "Aiden";\n}\nStudent s1 = new Student();\nSystem.out.println(s1.name);',
        expectedOutput: ['Aiden'],
        hints: ['Use new Student();'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_9_4',
        title: 'Class Fields & Attributes',
        type: 'write_query',
        story: 'Add int level = 5; field to class Hero and print level.',
        template: '// Write your Java code here...\n',
        solution: 'class Hero {\n    int level = 5;\n}\nHero h = new Hero();\nSystem.out.println(h.level);',
        expectedOutput: ['5'],
        hints: ['Print h.level.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_9_5',
        title: 'Instance Methods',
        type: 'write_query',
        story: 'Add speak() method to Hero class printing "HERO ONLINE".',
        template: '// Write your Java code here...\n',
        solution: 'class Hero {\n    void speak() {\n        System.out.println("HERO ONLINE");\n    }\n}\nHero h = new Hero();\nh.speak();',
        expectedOutput: ['HERO ONLINE'],
        hints: ['Call h.speak();'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_9_6',
        title: 'Class Constructors',
        type: 'predict_output',
        story: 'When is a class constructor executed in Java?',
        options: [
          'Automatically when a new object instance is created with new',
          'Only when the program shuts down',
          'Whenever a loop finishes',
          'Never'
        ],
        answerIndex: 0,
        hints: ['Constructors execute upon object instantiation with new.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_9_7',
        title: 'this Keyword',
        type: 'multiple_choice',
        story: 'What does the this keyword refer to inside an instance method or constructor?',
        options: [
          'The current active instance object of the class',
          'The operating system kernel',
          'The parent file directory',
          'The main method'
        ],
        answerIndex: 0,
        hints: ['this refers to the current class instance.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_9_8',
        title: 'Boss: CodeSaga Character Class',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct the Master CodeSaga Character Class blueprint!',
        template: '// Write your Java code here...\n',
        solution: 'class Character {\n    String name = "Aria";\n    int xp = 500;\n}\nCharacter c = new Character();\nSystem.out.println(c.name);\nSystem.out.println(c.xp);',
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
    subtitle: 'Extends, Super & Encapsulation',
    icon: '🧬',
    color: '#06b6d4',
    guide: 'Jax',
    zone: 'Inheritance Tower',
    description: 'Master class inheritance (extends), super keyword, method overriding, polymorphism, and encapsulation.',
    missions: [
      {
        id: 'java_10_1',
        title: 'Class Inheritance extends',
        type: 'write_query',
        story: 'Create class Dog extends Animal inheriting sound = "WOOF".',
        template: '// Write your Java code here...\n',
        solution: 'class Animal {\n    String sound = "WOOF";\n}\nclass Dog extends Animal {}\nDog d = new Dog();\nSystem.out.println(d.sound);',
        expectedOutput: ['WOOF'],
        hints: ['Use class Dog extends Animal.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_10_2',
        title: 'Parent & Child Classes',
        type: 'predict_output',
        story: 'If class Warrior extends Character, which class is the child class?',
        options: ['Warrior', 'Character', 'Both', 'Neither'],
        answerIndex: 0,
        hints: ['Warrior is the child subclass inheriting from parent Character.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_10_3',
        title: 'super Keyword',
        type: 'multiple_choice',
        story: 'What is the super keyword used for inside a child subclass?',
        options: [
          'To access members or constructors of the parent superclass',
          'To increase computer RAM memory',
          'To open a web socket connection',
          'To stop loop iterations'
        ],
        answerIndex: 0,
        hints: ['super refers to parent superclass methods or constructors.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_10_4',
        title: 'Method Overriding',
        type: 'write_query',
        story: 'Override action() in subclass to print "SUPER MOVE".',
        template: '// Write your Java code here...\n',
        solution: 'class Hero {\n    void action() {\n        System.out.println("MOVE");\n    }\n}\nclass Warrior extends Hero {\n    void action() {\n        System.out.println("SUPER MOVE");\n    }\n}\nWarrior w = new Warrior();\nw.action();',
        expectedOutput: ['SUPER MOVE'],
        hints: ['Override action() inside Warrior to print SUPER MOVE.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_10_5',
        title: 'Polymorphism Concept',
        type: 'predict_output',
        story: 'Can a parent reference variable Hero h = new Warrior(); hold a child subclass object?',
        options: ['Yes, this is Polymorphism', 'No, Java forbids this', 'Only for strings', 'Error'],
        answerIndex: 0,
        hints: ['Polymorphism allows parent references to hold child instances.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_10_6',
        title: 'instanceof Type Checking',
        type: 'predict_output',
        story: 'What does (d instanceof Animal) evaluate to if Dog extends Animal?',
        options: ['true', 'false', 'null', 'Error'],
        answerIndex: 0,
        hints: ['instanceof returns true if object is instance of class.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_10_7',
        title: 'Encapsulation private & Getters',
        type: 'write_query',
        story: 'Create private field name and public getName() method.',
        template: '// Write your Java code here...\n',
        solution: 'class User {\n    private String name = "Aiden";\n    public String getName() {\n        return name;\n    }\n}\nUser u = new User();\nSystem.out.println(u.getName());',
        expectedOutput: ['Aiden'],
        hints: ['Use public String getName() { return name; }'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_10_8',
        title: 'Boss: RPG Class Hierarchy',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct the Master CodeSaga RPG Class Hierarchy!',
        template: '// Write your Java code here...\n',
        solution: 'class Character {\n    String role = "HERO";\n}\nclass Mage extends Character {\n    void cast() {\n        System.out.println(role + " CASTS SPELL");\n    }\n}\nMage m = new Mage();\nm.cast();',
        expectedOutput: ['HERO CASTS SPELL'],
        hints: ['Extend Character and call m.cast().'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 11: EXCEPTIONS & COLLECTIONS ---------------- //
  {
    id: 11,
    title: 'Exceptions & Collections',
    subtitle: 'Try-Catch, ArrayList & HashMap',
    icon: '🧰',
    color: '#ef4444',
    guide: 'Jax',
    zone: 'Exception Recovery Vault',
    description: 'Master exception handling (try-catch-finally), ArrayList, and HashMap key-value stores.',
    missions: [
      {
        id: 'java_11_1',
        title: 'Errors vs Exceptions',
        type: 'multiple_choice',
        story: 'What is the purpose of try-catch blocks in Java?',
        options: [
          'To safely catch and handle runtime exceptions without crashing the program',
          'To format text headers in CSS',
          'To speed up CPU clock rate',
          'To automatically encrypt passwords'
        ],
        answerIndex: 0,
        hints: ['try-catch prevents unhandled exceptions from crashing apps.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_11_2',
        title: 'Try-Catch Block',
        type: 'write_query',
        story: 'Catch division by zero 10 / 0 inside try-catch and print "HANDLED".',
        template: '// Write your Java code here...\n',
        solution: 'try {\n    int res = 10 / 0;\n} catch (Exception e) {\n    System.out.println("HANDLED");\n}',
        expectedOutput: ['HANDLED'],
        hints: ['Use try { int res = 10 / 0; } catch (Exception e) { ... }'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_11_3',
        title: 'Finally Cleanup Block',
        type: 'predict_output',
        story: 'Does a finally block execute regardless of whether an exception occurred?',
        options: ['Yes, finally ALWAYS executes', 'No, only on errors', 'Only on Tuesdays', 'Error'],
        answerIndex: 0,
        hints: ['finally executes cleanup code in both success and error cases.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_11_4',
        title: 'Dynamic ArrayList Collection',
        type: 'write_query',
        story: 'Simulate list items = ["KEY", "BADGE"] and print count.',
        template: '// Write your Java code here...\n',
        solution: 'String[] list = {"KEY", "BADGE"};\nSystem.out.println(list.length);',
        expectedOutput: ['2'],
        hints: ['Print list.length.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_11_5',
        title: 'HashMap Key-Value Store',
        type: 'multiple_choice',
        story: 'Which Java collection class stores data in key-value pairs?',
        options: ['HashMap', 'ArrayList', 'LinkedList', 'TreeSet'],
        answerIndex: 0,
        hints: ['HashMap maps key objects to value objects.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_11_6',
        title: 'File Handling Concept',
        type: 'multiple_choice',
        story: 'Which standard Java classes are commonly used for reading text files?',
        options: ['FileReader and Scanner / BufferedReader', 'System.out', 'Math', 'Double'],
        answerIndex: 0,
        hints: ['Scanner and BufferedReader read text stream data.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'java_11_7',
        title: 'Exception Debugging Challenge',
        type: 'write_query',
        story: 'Handle array index out of bounds error safely and print "OUT OF BOUNDS".',
        template: '// Write your Java code here...\n',
        solution: 'try {\n    int[] arr = {1};\n    int val = arr[5];\n} catch (Exception e) {\n    System.out.println("OUT OF BOUNDS");\n}',
        expectedOutput: ['OUT OF BOUNDS'],
        hints: ['Catch Exception e and print OUT OF BOUNDS.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'java_11_8',
        title: 'Boss: Inventory Manager Challenge',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Safely initialize and recover inventory data records!',
        template: '// Write your Java code here...\n',
        solution: 'try {\n    System.out.println("INVENTORY: INITIALIZED");\n} catch (Exception e) {\n    System.out.println("ERROR");\n} finally {\n    System.out.println("CLEANUP COMPLETE");\n}',
        expectedOutput: ['INVENTORY: INITIALIZED', 'CLEANUP COMPLETE'],
        hints: ['Print INITIALIZED in try block, CLEANUP COMPLETE in finally.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 12: JAVA MASTER BOSS ---------------- //
  {
    id: 12,
    title: 'Java Master Boss',
    subtitle: 'Final Student Grade Manager Capstone',
    icon: '🏆',
    color: '#E6A93D',
    guide: 'Jax',
    zone: 'Java Kingdom High Core',
    description: 'Combine variables, operators, conditions, loops, arrays, methods, classes, and exceptions to build the Student Grade Manager Capstone.',
    missions: [
      {
        id: 'java_12_1',
        title: 'Java Review Checkpoint',
        type: 'multiple_choice',
        story: 'What is the entry point method required in every standalone Java application?',
        options: [
          'public static void main(String[] args)',
          'public void start()',
          'static int init()',
          'public class Main()'
        ],
        answerIndex: 0,
        hints: ['public static void main(String[] args) is mandatory.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'java_12_2',
        title: 'Debugging Java Code',
        type: 'write_query',
        story: 'Fix print statement syntax and print "DEBUGGED".',
        template: '// Write your Java code here...\n',
        solution: 'System.out.println("DEBUGGED");',
        expectedOutput: ['DEBUGGED'],
        hints: ['Print "DEBUGGED".'],
        xp: 70,
        coins: 30
      },
      {
        id: 'java_12_3',
        title: 'Output Prediction Challenge',
        type: 'predict_output',
        story: 'What is the output of System.out.println(10 + 20 + "JAVA");?',
        options: ['30JAVA', '1020JAVA', 'JAVA30', 'Error'],
        answerIndex: 0,
        hints: ['10 + 20 evaluates to 30, then concatenated with "JAVA".'],
        xp: 70,
        coins: 30
      },
      {
        id: 'java_12_4',
        title: 'OOP Class Blueprint',
        type: 'write_query',
        story: 'Create class Student with name and marks fields.',
        template: '// Write your Java code here...\n',
        solution: 'class Student {\n    String name = "Alex";\n    int marks = 90;\n}\nStudent s = new Student();\nSystem.out.println(s.name);\nSystem.out.println(s.marks);',
        expectedOutput: ['Alex', '90'],
        hints: ['Instantiate Student s and print name and marks.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'java_12_5',
        title: 'Grade Calculation Logic',
        type: 'write_query',
        story: 'Print "GRADE A" if marks >= 90 else "GRADE B".',
        template: '// Write your Java code here...\n',
        solution: 'int marks = 95;\nif (marks >= 90) {\n    System.out.println("GRADE A");\n} else {\n    System.out.println("GRADE B");\n}',
        expectedOutput: ['GRADE A'],
        hints: ['Check if marks >= 90.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'java_12_6',
        title: 'Logic Combination',
        type: 'write_query',
        story: 'Loop through marks array {90, 80} and print each.',
        template: '// Write your Java code here...\n',
        solution: 'int[] marks = {90, 80};\nfor (int i = 0; i < marks.length; i++) {\n    System.out.println(marks[i]);\n}',
        expectedOutput: ['90', '80'],
        hints: ['Loop through marks array.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'java_12_7',
        title: 'Student Grade Manager Capstone',
        type: 'write_query',
        story: 'Build student grade calculator computing total for m1 = 85, m2 = 95.',
        template: '// Write your Java code here...\n',
        solution: 'int m1 = 85;\nint m2 = 95;\nint total = m1 + m2;\nSystem.out.println("TOTAL MARKS: " + total);',
        expectedOutput: ['TOTAL MARKS: 180'],
        hints: ['85 + 95 = 180.'],
        xp: 100,
        coins: 40
      },
      {
        id: 'java_12_8',
        title: 'JAVA FINAL BOSS 🏆',
        type: 'detective_boss',
        story: 'JAVA FINAL BOSS: Fully restore Java Kingdom by compiling the Master Student Grade Manager application!',
        template: '// Write your Java code here...\n',
        solution: 'class GradeManager {\n    void execute() {\n        System.out.println("JAVA KINGDOM: MASTERED");\n    }\n}\nGradeManager gm = new GradeManager();\ngm.execute();',
        expectedOutput: ['JAVA KINGDOM: MASTERED'],
        hints: ['Instantiate GradeManager gm and call gm.execute().'],
        xp: 300,
        coins: 100
      }
    ]
  }
];

export const getJavaChapterById = (id) => {
  return JAVA_CURRICULUM.find((c) => c.id === Number(id)) || JAVA_CURRICULUM[0];
};

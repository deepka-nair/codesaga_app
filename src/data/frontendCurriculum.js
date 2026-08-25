// CodeSaga Web Creator City Curriculum — 12 Complete Chapters & 96 Playable Missions

export const FRONTEND_CURRICULUM = [
  // ---------------- CHAPTER 1: WEB AWAKENING ---------------- //
  {
    id: 1,
    title: 'Web Awakening',
    subtitle: 'HTML Structure & Document Architecture',
    icon: '🌐',
    color: '#0ea5e9',
    guide: 'Pixel',
    zone: 'Web Creator City Gateway',
    description: 'Awaken the digital city and master client-server browser architecture, HTML tags, headings, and document structure.',
    missions: [
      {
        id: 'fe_1_1',
        title: 'What Is the Web?',
        type: 'multiple_choice',
        story: 'Welcome to Web Creator City! Before building webpages, confirm which software application sends requests to servers and displays websites to users.',
        conceptExplanation: {
          what: 'The Web is an interconnected system of digital documents accessed over the Internet.',
          why: 'Browsers act as clients that send HTTP requests to servers and render HTML/CSS/JS responses.',
          when: 'Whenever a user visits a URL (e.g. https://codesaga.dev).',
          how: 'Client Browser -> HTTP Request -> Web Server -> HTTP Response (HTML/CSS/JS) -> Rendered Webpage.'
        },
        options: ['Browser', 'Compiler', 'Database', 'Operating System'],
        answerIndex: 0,
        hints: ['Browsers like Chrome, Firefox, and Safari display websites.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_1_2',
        title: 'Meet HTML',
        type: 'multiple_choice',
        story: 'HTML stands for HyperText Markup Language. What is the primary role of HTML on a webpage?',
        options: ['Providing webpage structure and content markup', 'Styling font colors and margins', 'Connecting to SQL databases', 'Playing background MP3 music'],
        answerIndex: 0,
        hints: ['HTML provides the structural skeleton of web documents.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_1_3',
        title: 'Your First Webpage',
        type: 'write_query',
        story: 'Create a webpage heading saying "Hello, CodeSaga!".',
        conceptExplanation: {
          what: '<h1> represents the main top-level heading element of a webpage.',
          why: 'Headings provide clear structural hierarchy for users and search engines.',
          when: 'Use <h1> once per page for the primary document title.',
          how: '<h1>Hello, CodeSaga!</h1>'
        },
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<h1>Hello, CodeSaga!</h1>',
        expectedTag: 'h1',
        expectedText: 'Hello, CodeSaga!',
        hints: ['Enclose text inside <h1> and </h1> tags.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_1_4',
        title: 'HTML Headings h1 to h6',
        type: 'write_query',
        story: 'Create a main heading <h1>Title</h1> and a secondary subheading <h2>Subtitle</h2>.',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<h1>Title</h1>\n<h2>Subtitle</h2>',
        expectedTag: 'h2',
        expectedText: 'Subtitle',
        hints: ['Use <h1> for main title and <h2> for subtitle.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_1_5',
        title: 'Paragraphs with <p>',
        type: 'write_query',
        story: 'Create a paragraph <p>Welcome to Web Creator City!</p>.',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<p>Welcome to Web Creator City!</p>',
        expectedTag: 'p',
        expectedText: 'Welcome to Web Creator City!',
        hints: ['Enclose text inside <p> and </p> tags.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_1_6',
        title: 'HTML Comments',
        type: 'multiple_choice',
        story: 'Which syntax represents an HTML comment that is ignored by browsers during rendering?',
        options: ['<!-- This is a comment -->', '// This is a comment', '# This is a comment', '/* This is a comment */'],
        answerIndex: 0,
        hints: ['HTML comments start with <!-- and end with -->.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_1_7',
        title: 'HTML Document Structure',
        type: 'predict_output',
        story: 'Which HTML section contains invisible metadata, document title, and stylesheet links?',
        options: ['<head>', '<body>', '<footer>', '<section>'],
        answerIndex: 0,
        hints: ['The <head> section stores document metadata and external links.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_1_8',
        title: 'Boss: Personal Intro Page',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a personal introduction page with a heading <h1>Agent</h1> and paragraph <p>Web Developer</p>!',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<h1>Agent</h1>\n<p>Web Developer</p>',
        expectedTag: 'p',
        expectedText: 'Web Developer',
        hints: ['Create an <h1> heading and a <p> paragraph.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 2: HTML BUILDING BLOCKS ---------------- //
  {
    id: 2,
    title: 'HTML Building Blocks',
    subtitle: 'Links, Images, Lists & Forms',
    icon: '🧱',
    color: '#0284c7',
    guide: 'Pixel',
    zone: 'Component Factory',
    description: 'Master anchor links <a>, images <img>, lists, tables, buttons, forms, and semantic HTML tags.',
    missions: [
      {
        id: 'fe_2_1',
        title: 'Hypertext Links <a>',
        type: 'write_query',
        story: 'Create a hyperlink <a href="https://codesaga.dev">CodeSaga</a>.',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<a href="https://codesaga.dev">CodeSaga</a>',
        expectedTag: 'a',
        expectedText: 'CodeSaga',
        hints: ['Use <a href="...">Link Text</a>.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_2_2',
        title: 'Images <img> & Alt Text',
        type: 'write_query',
        story: 'Insert an image element <img src="hero.jpg" alt="Hero Avatar">.',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<img src="hero.jpg" alt="Hero Avatar">',
        expectedTag: 'img',
        hints: ['Use <img src="..." alt="...">.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_2_3',
        title: 'Lists <ul> & <ol>',
        type: 'write_query',
        story: 'Create an unordered list <ul> containing one item <li>HTML</li>.',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<ul>\n  <li>HTML</li>\n</ul>',
        expectedTag: 'li',
        expectedText: 'HTML',
        hints: ['Wrap <li>HTML</li> inside <ul>.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_2_4',
        title: 'Data Tables <table>',
        type: 'predict_output',
        story: 'Which HTML tag defines a table row inside a <table>?',
        options: ['<tr>', '<td>', '<th>', '<row>'],
        answerIndex: 0,
        hints: ['<tr> stands for Table Row.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_2_5',
        title: 'Interactive Buttons <button>',
        type: 'write_query',
        story: 'Create an action button <button>Submit</button>.',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<button>Submit</button>',
        expectedTag: 'button',
        expectedText: 'Submit',
        hints: ['Enclose text inside <button>Submit</button>.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_2_6',
        title: 'Forms <form> & Inputs',
        type: 'write_query',
        story: 'Create a text input field <input type="text" placeholder="Username">.',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<input type="text" placeholder="Username">',
        expectedTag: 'input',
        hints: ['Use <input type="text" placeholder="...">.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_2_7',
        title: 'Semantic HTML Elements',
        type: 'multiple_choice',
        story: 'Why is semantic HTML (e.g. <header>, <main>, <footer>) preferred over plain <div> elements?',
        options: [
          'Improves accessibility for screen readers and SEO search engines',
          'Automatically changes font color to gold',
          'Prevents SQL injection attacks on servers',
          'Speeds up internet download speeds'
        ],
        answerIndex: 0,
        hints: ['Semantic tags convey meaning and structure to browsers and accessibility tools.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_2_8',
        title: 'Boss: Profile Component Page',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Assemble a profile component featuring a heading <h1>Profile</h1> and button <button>Edit</button>!',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<h1>Profile</h1>\n<button>Edit</button>',
        expectedTag: 'button',
        expectedText: 'Edit',
        hints: ['Combine <h1> and <button> elements.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 3: CSS AWAKENING ---------------- //
  {
    id: 3,
    title: 'CSS Awakening',
    subtitle: 'Styling, Colors, Fonts & Selectors',
    icon: '🎨',
    color: '#ec4899',
    guide: 'Pixel',
    zone: 'Style Studio',
    description: 'Master CSS selectors (element, .class, #id), color, background-color, font-size, and text-align.',
    missions: [
      {
        id: 'fe_3_1',
        title: 'What Is CSS?',
        type: 'multiple_choice',
        story: 'What does CSS stand for in web development?',
        options: ['Cascading Style Sheets', 'Computer System Syntax', 'Creative Sheet Styling', 'Central Service Software'],
        answerIndex: 0,
        hints: ['CSS stands for Cascading Style Sheets.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_3_2',
        title: 'Connecting CSS Stylesheets',
        type: 'multiple_choice',
        story: 'Which HTML tag links an external CSS file inside the <head> section?',
        options: ['<link rel="stylesheet" href="style.css">', '<style src="style.css">', '<css href="style.css">', '<script src="style.css">'],
        answerIndex: 0,
        hints: ['Use <link rel="stylesheet" href="...">.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_3_3',
        title: 'CSS Class Selector .class',
        type: 'write_query',
        story: 'Write a CSS rule targeting class .title to set color: blue;.',
        template: '/* Write your CSS code here... */\n',
        solution: '.title {\n  color: blue;\n}',
        expectedCss: 'color:\\s*blue',
        hints: ['Use .title { color: blue; }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_3_4',
        title: 'Background Colors',
        type: 'write_query',
        story: 'Set background-color: #0f172a; for body element.',
        template: '/* Write your CSS code here... */\n',
        solution: 'body {\n  background-color: #0f172a;\n}',
        expectedCss: 'background-color:\\s*#0f172a',
        hints: ['Use body { background-color: #0f172a; }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_3_5',
        title: 'Typography & Font Size',
        type: 'write_query',
        story: 'Set font-size: 24px; for h1 headings.',
        template: '/* Write your CSS code here... */\n',
        solution: 'h1 {\n  font-size: 24px;\n}',
        expectedCss: 'font-size:\\s*24px',
        hints: ['Use h1 { font-size: 24px; }.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_3_6',
        title: 'Text Alignment text-align',
        type: 'write_query',
        story: 'Center text alignment for .header class using text-align: center;.',
        template: '/* Write your CSS code here... */\n',
        solution: '.header {\n  text-align: center;\n}',
        expectedCss: 'text-align:\\s*center',
        hints: ['Use .header { text-align: center; }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_3_7',
        title: 'Border Radius border-radius',
        type: 'write_query',
        story: 'Round element corners using border-radius: 8px; for .card.',
        template: '/* Write your CSS code here... */\n',
        solution: '.card {\n  border-radius: 8px;\n}',
        expectedCss: 'border-radius:\\s*8px',
        hints: ['Use .card { border-radius: 8px; }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_3_8',
        title: 'Boss: Style Profile Page',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Style the profile page component with gold text color: #f59e0b;!',
        template: '/* Write your CSS code here... */\n',
        solution: 'h1 {\n  color: #f59e0b;\n}',
        expectedCss: 'color:\\s*#f59e0b',
        hints: ['Target h1 and set color: #f59e0b;.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 4: THE CSS BOX MODEL ---------------- //
  {
    id: 4,
    title: 'The CSS Box Model',
    subtitle: 'Padding, Margin, Border & Sizing',
    icon: '📦',
    color: '#a855f7',
    guide: 'Pixel',
    zone: 'Box Model Dimension Lab',
    description: 'Master padding, margin, border, width, height, and box-sizing: border-box.',
    missions: [
      {
        id: 'fe_4_1',
        title: 'Box Model Layers',
        type: 'multiple_choice',
        story: 'In the CSS Box Model, which layer represents space inside the element border?',
        options: ['Padding', 'Margin', 'Outline', 'Border'],
        answerIndex: 0,
        hints: ['Padding creates inner space between content and border.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_4_2',
        title: 'Width & Height',
        type: 'write_query',
        story: 'Set width: 300px; and height: 200px; for .box.',
        template: '/* Write your CSS code here... */\n',
        solution: '.box {\n  width: 300px;\n  height: 200px;\n}',
        expectedCss: 'width:\\s*300px',
        hints: ['Set width: 300px; and height: 200px;.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_4_3',
        title: 'Inner Space Padding',
        type: 'write_query',
        story: 'Add padding: 16px; inside .card elements.',
        template: '/* Write your CSS code here... */\n',
        solution: '.card {\n  padding: 16px;\n}',
        expectedCss: 'padding:\\s*16px',
        hints: ['Use padding: 16px;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_4_4',
        title: 'Outer Space Margin',
        type: 'write_query',
        story: 'Add margin: 20px; outside .container elements.',
        template: '/* Write your CSS code here... */\n',
        solution: '.container {\n  margin: 20px;\n}',
        expectedCss: 'margin:\\s*20px',
        hints: ['Use margin: 20px;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_4_5',
        title: 'Border Styling',
        type: 'write_query',
        story: 'Apply border: 2px solid #334155; to .panel.',
        template: '/* Write your CSS code here... */\n',
        solution: '.panel {\n  border: 2px solid #334155;\n}',
        expectedCss: 'border:\\s*2px\\s+solid',
        hints: ['Use border: 2px solid #334155;.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_4_6',
        title: 'box-sizing: border-box',
        type: 'multiple_choice',
        story: 'Why is box-sizing: border-box universally applied in modern CSS layouts?',
        options: [
          'Includes padding and border within the element specified width and height',
          'Increases font size automatically on mobile devices',
          'Prevents images from loading',
          'Deletes external JavaScript links'
        ],
        answerIndex: 0,
        hints: ['border-box includes padding and border in total width calculations.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_4_7',
        title: 'Inspect & Debug Spacing',
        type: 'predict_output',
        story: 'What is total element width if content width is 100px, padding is 10px, and box-sizing is border-box?',
        options: ['100px', '120px', '110px', '200px'],
        answerIndex: 0,
        hints: ['With border-box, total width equals specified width 100px.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_4_8',
        title: 'Boss: CodeSaga Character Card',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a styled character card with padding: 1rem; and border: 2px solid #f59e0b;!',
        template: '/* Write your CSS code here... */\n',
        solution: '.card {\n  padding: 1rem;\n  border: 2px solid #f59e0b;\n}',
        expectedCss: 'border:\\s*2px\\s+solid\\s+#f59e0b',
        hints: ['Set padding: 1rem; and border: 2px solid #f59e0b;.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 5: CSS LAYOUT LAB ---------------- //
  {
    id: 5,
    title: 'CSS Layout Lab',
    subtitle: 'Display, Flexbox & Alignment',
    icon: '🧭',
    color: '#6366f1',
    guide: 'Pixel',
    zone: 'Flexbox Alignment Hub',
    description: 'Master display properties, Flexbox (display: flex), justify-content, align-items, and gap.',
    missions: [
      {
        id: 'fe_5_1',
        title: 'Display Property',
        type: 'multiple_choice',
        story: 'Which display property causes an element to start on a new line and take up full width?',
        options: ['block', 'inline', 'none', 'table-cell'],
        answerIndex: 0,
        hints: ['block elements start on new lines.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_5_2',
        title: 'Flexbox Container',
        type: 'write_query',
        story: 'Enable Flexbox layout on .navbar using display: flex;.',
        template: '/* Write your CSS code here... */\n',
        solution: '.navbar {\n  display: flex;\n}',
        expectedCss: 'display:\\s*flex',
        hints: ['Use display: flex;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_5_3',
        title: 'flex-direction Axis',
        type: 'write_query',
        story: 'Stack flex items vertically using flex-direction: column;.',
        template: '/* Write your CSS code here... */\n',
        solution: '.menu {\n  display: flex;\n  flex-direction: column;\n}',
        expectedCss: 'flex-direction:\\s*column',
        hints: ['Use flex-direction: column;.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_5_4',
        title: 'justify-content Alignment',
        type: 'write_query',
        story: 'Space flex items evenly using justify-content: space-between;.',
        template: '/* Write your CSS code here... */\n',
        solution: '.header {\n  display: flex;\n  justify-content: space-between;\n}',
        expectedCss: 'justify-content:\\s*space-between',
        hints: ['Use justify-content: space-between;.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_5_5',
        title: 'align-items Cross-Axis',
        type: 'write_query',
        story: 'Vertically center flex items using align-items: center;.',
        template: '/* Write your CSS code here... */\n',
        solution: '.nav {\n  display: flex;\n  align-items: center;\n}',
        expectedCss: 'align-items:\\s*center',
        hints: ['Use align-items: center;.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_5_6',
        title: 'Flex Gap Spacing',
        type: 'write_query',
        story: 'Add gap: 1rem; between flex items.',
        template: '/* Write your CSS code here... */\n',
        solution: '.row {\n  display: flex;\n  gap: 1rem;\n}',
        expectedCss: 'gap:\\s*1rem',
        hints: ['Use gap: 1rem;.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_5_7',
        title: 'Flexbox Navigation Bar',
        type: 'write_query',
        story: 'Create a centered flex row navigation bar.',
        template: '/* Write your CSS code here... */\n',
        solution: '.nav {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
        expectedCss: 'justify-content:\\s*center',
        hints: ['Combine display: flex;, justify-content: center;, align-items: center;.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_5_8',
        title: 'Boss: Character Card Row',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a flex container for character cards with display: flex; and gap: 1.5rem;!',
        template: '/* Write your CSS code here... */\n',
        solution: '.card-grid {\n  display: flex;\n  gap: 1.5rem;\n}',
        expectedCss: 'gap:\\s*1\\.5rem',
        hints: ['Set display: flex; and gap: 1.5rem;.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 6: CSS GRID & RESPONSIVE DESIGN ---------------- //
  {
    id: 6,
    title: 'CSS Grid & Responsive Design',
    subtitle: 'Grids & Media Queries',
    icon: '📐',
    color: '#10b981',
    guide: 'Pixel',
    zone: 'Grid Architecture Center',
    description: 'Master CSS Grid (display: grid), grid-template-columns, and media queries (@media) for responsive layouts.',
    missions: [
      {
        id: 'fe_6_1',
        title: 'CSS Grid Container',
        type: 'write_query',
        story: 'Enable CSS Grid on .grid using display: grid;.',
        template: '/* Write your CSS code here... */\n',
        solution: '.grid {\n  display: grid;\n}',
        expectedCss: 'display:\\s*grid',
        hints: ['Use display: grid;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_6_2',
        title: 'Grid Template Columns',
        type: 'write_query',
        story: 'Define 3 equal grid columns using grid-template-columns: repeat(3, 1fr);.',
        template: '/* Write your CSS code here... */\n',
        solution: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}',
        expectedCss: 'grid-template-columns:\\s*repeat\\(3,\\s*1fr\\)',
        hints: ['Use grid-template-columns: repeat(3, 1fr);.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_6_3',
        title: 'Grid Gap Spacing',
        type: 'write_query',
        story: 'Set gap: 20px; between grid items.',
        template: '/* Write your CSS code here... */\n',
        solution: '.grid {\n  display: grid;\n  gap: 20px;\n}',
        expectedCss: 'gap:\\s*20px',
        hints: ['Use gap: 20px;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_6_4',
        title: 'Responsive Design Concept',
        type: 'multiple_choice',
        story: 'What is the goal of responsive web design?',
        options: [
          'Ensuring websites adapt seamlessly to different viewport sizes (mobile, tablet, desktop)',
          'Converting CSS files to SQL queries automatically',
          'Disabling images on mobile phones',
          'Forcing desktop screens to render mobile layouts'
        ],
        answerIndex: 0,
        hints: ['Responsive design adapts layouts smoothly across all screen devices.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_6_5',
        title: 'Media Queries @media',
        type: 'write_query',
        story: 'Write a media query for max-width: 768px screens.',
        template: '/* Write your CSS code here... */\n',
        solution: '@media (max-width: 768px) {\n  .container {\n    padding: 10px;\n  }\n}',
        expectedCss: '@media\\s*\\(max-width:\\s*768px\\)',
        hints: ['Use @media (max-width: 768px) { ... }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_6_6',
        title: 'Mobile Layout Transition',
        type: 'predict_output',
        story: 'Which media query breakpoint targets smartphones under 600px width?',
        options: ['(max-width: 600px)', '(min-width: 1200px)', '(max-height: 100px)', '(color: blue)'],
        answerIndex: 0,
        hints: ['(max-width: 600px) targets small mobile viewports.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_6_7',
        title: 'Responsive Images max-width',
        type: 'write_query',
        story: 'Make images responsive using max-width: 100%;.',
        template: '/* Write your CSS code here... */\n',
        solution: 'img {\n  max-width: 100%;\n}',
        expectedCss: 'max-width:\\s*100%',
        hints: ['Use max-width: 100%; for img.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_6_8',
        title: 'Boss: Responsive Character Grid',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Build a responsive grid layout with grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));!',
        template: '/* Write your CSS code here... */\n',
        solution: '.roster {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n}',
        expectedCss: 'grid-template-columns:\\s*repeat\\(auto-fit',
        hints: ['Use repeat(auto-fit, minmax(200px, 1fr)).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 7: JAVASCRIPT AWAKENING ---------------- //
  {
    id: 7,
    title: 'JavaScript Awakening',
    subtitle: 'Variables, Types, Operators & Functions',
    icon: '⚡',
    color: '#f59e0b',
    guide: 'Pixel',
    zone: 'Script Engine Core',
    description: 'Master JavaScript variables (let, const), data types, operators (===, !==), conditions, and functions.',
    missions: [
      {
        id: 'fe_7_1',
        title: 'What Is JavaScript?',
        type: 'multiple_choice',
        story: 'What is the main role of JavaScript on a webpage?',
        options: ['Controlling dynamic interactive behavior and logic', 'Defining text font families', 'Creating HTML database tables', 'Storing image files'],
        answerIndex: 0,
        hints: ['JavaScript adds interactive behavior and logic.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_7_2',
        title: 'Variables let & const',
        type: 'write_query',
        story: 'Declare variable const score = 100;.',
        template: '// Write your JavaScript code here...\n',
        solution: 'const score = 100;',
        expectedJs: 'const\\s+score\\s*=\\s*100',
        hints: ['Use const score = 100;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_7_3',
        title: 'Data Types',
        type: 'multiple_choice',
        story: 'Which JavaScript type represents true or false values?',
        options: ['boolean', 'string', 'number', 'undefined'],
        answerIndex: 0,
        hints: ['Booleans store true or false.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_7_4',
        title: 'Strict Equality ===',
        type: 'multiple_choice',
        story: 'Why is === (strict equality) preferred over == in JavaScript?',
        options: [
          '=== compares both value and data type without implicit coercion',
          '=== runs faster on web servers',
          '== is not valid JavaScript',
          '=== only works for numbers'
        ],
        answerIndex: 0,
        hints: ['=== checks value and type equality.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_7_5',
        title: 'Conditional Branching',
        type: 'write_query',
        story: 'Write an if statement checking score >= 50.',
        template: '// Write your JavaScript code here...\n',
        solution: 'let score = 75;\nif (score >= 50) {\n  console.log("PASSED");\n}',
        expectedJs: 'if\\s*\\(score\\s*>=',
        hints: ['Use if (score >= 50) { ... }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_7_6',
        title: 'Declaring Functions',
        type: 'write_query',
        story: 'Define function greet() returning "HELLO".',
        template: '// Write your JavaScript code here...\n',
        solution: 'function greet() {\n  return "HELLO";\n}',
        expectedJs: 'function\\s+greet',
        hints: ['Use function greet() { return "HELLO"; }.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_7_7',
        title: 'User Dialog alert()',
        type: 'write_query',
        story: 'Trigger alert dialog saying "CodeSaga!".',
        template: '// Write your JavaScript code here...\n',
        solution: 'alert("CodeSaga!");',
        expectedJs: 'alert\\("CodeSaga!"\\)',
        hints: ['Call alert("CodeSaga!");.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_7_8',
        title: 'Boss: JavaScript Quiz Engine',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a quiz score evaluation function returning "WIN" if score === 100!',
        template: '// Write your JavaScript code here...\n',
        solution: 'function evaluateScore(score) {\n  if (score === 100) return "WIN";\n}',
        expectedJs: 'score\\s*===\s*100',
        hints: ['Check if (score === 100) return "WIN";.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 8: DOM MAGIC ---------------- //
  {
    id: 8,
    title: 'DOM Magic',
    subtitle: 'Selectors, Events & Dynamic Updates',
    icon: '🪄',
    color: '#06b6d4',
    guide: 'Pixel',
    zone: 'DOM Manipulation Chamber',
    description: 'Master document.querySelector(), textContent, style updates, createElement(), and addEventListener("click").',
    missions: [
      {
        id: 'fe_8_1',
        title: 'What Is the DOM?',
        type: 'multiple_choice',
        story: 'What does DOM stand for in frontend development?',
        options: ['Document Object Model', 'Data Output Mechanism', 'Digital Operating Module', 'Domain Object Memory'],
        answerIndex: 0,
        hints: ['DOM stands for Document Object Model.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_8_2',
        title: 'Selecting Elements querySelector()',
        type: 'write_query',
        story: 'Select element with ID #title using document.querySelector("#title").',
        template: '// Write your JavaScript code here...\n',
        solution: 'const title = document.querySelector("#title");',
        expectedJs: 'document\\.querySelector\\("#title"\\)',
        hints: ['Use document.querySelector("#title").'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_8_3',
        title: 'Updating Text textContent',
        type: 'write_query',
        story: 'Update title.textContent = "Welcome!";.',
        template: '// Write your JavaScript code here...\n',
        solution: 'const el = document.querySelector("#title");\nel.textContent = "Welcome!";',
        expectedJs: 'textContent\\s*=\\s*"Welcome!"',
        hints: ['Assign textContent = "Welcome!";.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_8_4',
        title: 'Modifying Inline Styles style',
        type: 'write_query',
        story: 'Change element text color using el.style.color = "gold";.',
        template: '// Write your JavaScript code here...\n',
        solution: 'const el = document.querySelector("#title");\nel.style.color = "gold";',
        expectedJs: 'style\\.color\\s*=\\s*"gold"',
        hints: ['Use el.style.color = "gold";.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_8_5',
        title: 'Creating Elements createElement()',
        type: 'write_query',
        story: 'Create a new paragraph element using document.createElement("p").',
        template: '// Write your JavaScript code here...\n',
        solution: 'const p = document.createElement("p");',
        expectedJs: 'document\\.createElement\\("p"\\)',
        hints: ['Use document.createElement("p").'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_8_6',
        title: 'Event Listeners addEventListener',
        type: 'write_query',
        story: 'Attach a click event listener to btn using btn.addEventListener("click", handleClick).',
        template: '// Write your JavaScript code here...\n',
        solution: 'btn.addEventListener("click", handleClick);',
        expectedJs: 'addEventListener\\("click"',
        hints: ['Use btn.addEventListener("click", ...).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_8_7',
        title: 'Interactive Button Action',
        type: 'predict_output',
        story: 'What DOM method attaches user interaction handlers without overwriting existing handlers?',
        options: ['addEventListener()', 'onclick', 'innerHTML', 'setAttribute()'],
        answerIndex: 0,
        hints: ['addEventListener allows multiple event handlers.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_8_8',
        title: 'Boss: Interactive Counter',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct an event listener incrementing count when button #inc is clicked!',
        template: '// Write your JavaScript code here...\n',
        solution: 'const btn = document.querySelector("#inc");\nbtn.addEventListener("click", () => {\n  count++;\n});',
        expectedJs: 'addEventListener\\("click"',
        hints: ['Select #inc and attach click listener.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 9: FORMS & USER INTERACTION ---------------- //
  {
    id: 9,
    title: 'Forms & User Interaction',
    subtitle: 'Inputs, Validation & Events',
    icon: '📝',
    color: '#ef4444',
    guide: 'Pixel',
    zone: 'Form Validation Laboratory',
    description: 'Master form submission events, input types, event.preventDefault(), reading input values, and validation.',
    missions: [
      {
        id: 'fe_9_1',
        title: 'Form Structure <form>',
        type: 'multiple_choice',
        story: 'Which event is triggered when a user submits an HTML <form>?',
        options: ['submit', 'click', 'change', 'load'],
        answerIndex: 0,
        hints: ['The submit event fires when a form is submitted.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_9_2',
        title: 'Input Types',
        type: 'write_query',
        story: 'Create an email input field <input type="email" required>.',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<input type="email" required>',
        expectedTag: 'input',
        hints: ['Use <input type="email" required>.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_9_3',
        title: 'Prevent Default Submission',
        type: 'write_query',
        story: 'Stop page reload on form submit using e.preventDefault();.',
        template: '// Write your JavaScript code here...\n',
        solution: 'form.addEventListener("submit", (e) => {\n  e.preventDefault();\n});',
        expectedJs: 'e\\.preventDefault\\(\\)',
        hints: ['Use e.preventDefault(); inside submit handler.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_9_4',
        title: 'Reading Input Values',
        type: 'write_query',
        story: 'Read value from input element input.value.',
        template: '// Write your JavaScript code here...\n',
        solution: 'const val = input.value;',
        expectedJs: 'input\\.value',
        hints: ['Use input.value.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_9_5',
        title: 'Input Trim Validation',
        type: 'write_query',
        story: 'Trim whitespace from input using input.value.trim().',
        template: '// Write your JavaScript code here...\n',
        solution: 'const clean = input.value.trim();',
        expectedJs: 'trim\\(\\)',
        hints: ['Use .trim().'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_9_6',
        title: 'Error Message Feedback',
        type: 'write_query',
        story: 'Display error message errorEl.textContent = "Field required";.',
        template: '// Write your JavaScript code here...\n',
        solution: 'errorEl.textContent = "Field required";',
        expectedJs: 'textContent\\s*=\\s*"Field required"',
        hints: ['Assign errorEl.textContent = "Field required";.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_9_7',
        title: 'Checkbox Checked State',
        type: 'predict_output',
        story: 'Which boolean property checks if an input type="checkbox" is selected?',
        options: ['checked', 'selected', 'active', 'value'],
        answerIndex: 0,
        hints: ['input.checked returns true if checked.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_9_8',
        title: 'Boss: Registration Form',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct form submit handler calling e.preventDefault() and checking username.value!',
        template: '// Write your JavaScript code here...\n',
        solution: 'form.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const u = username.value;\n});',
        expectedJs: 'preventDefault\\(\\)',
        hints: ['Call e.preventDefault() inside submit handler.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 10: MODERN FRONTEND & APIS ---------------- //
  {
    id: 10,
    title: 'Modern Frontend & APIs',
    subtitle: 'JSON, Fetch, Promises & Async/Await',
    icon: '🔌',
    color: '#8b5cf6',
    guide: 'Pixel',
    zone: 'API Communications Hub',
    description: 'Master JSON formats, fetch() HTTP requests, Promises, async/await, and dynamic data rendering.',
    missions: [
      {
        id: 'fe_10_1',
        title: 'What Is an API?',
        type: 'multiple_choice',
        story: 'What does API stand for in software architecture?',
        options: ['Application Programming Interface', 'Automated Program Integration', 'Advanced Pixel Index', 'Array Parameter Protocol'],
        answerIndex: 0,
        hints: ['API stands for Application Programming Interface.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_10_2',
        title: 'JSON Data Format',
        type: 'multiple_choice',
        story: 'Which method converts a JSON string into a JavaScript object?',
        options: ['JSON.parse()', 'JSON.stringify()', 'Object.toJSON()', 'parse.JSON()'],
        answerIndex: 0,
        hints: ['JSON.parse() converts JSON strings into JS objects.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_10_3',
        title: 'fetch() API Requests',
        type: 'write_query',
        story: 'Initiate a fetch request fetch("https://api.codesaga.dev/data").',
        template: '// Write your JavaScript code here...\n',
        solution: 'fetch("https://api.codesaga.dev/data");',
        expectedJs: 'fetch\\("https://api\\.codesaga\\.dev/data"\\)',
        hints: ['Call fetch("https://api.codesaga.dev/data").'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_10_4',
        title: 'JavaScript Promises',
        type: 'predict_output',
        story: 'Which method handles resolved data returned by a JavaScript Promise?',
        options: ['.then()', '.catch()', '.finally()', '.stop()'],
        answerIndex: 0,
        hints: ['.then() receives resolved promise values.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_10_5',
        title: 'async / await Syntax',
        type: 'write_query',
        story: 'Define an async function fetchData() using const res = await fetch(url);.',
        template: '// Write your JavaScript code here...\n',
        solution: 'async function fetchData(url) {\n  const res = await fetch(url);\n}',
        expectedJs: 'async\\s+function.*await\\s+fetch',
        hints: ['Use async function and await fetch(url).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_10_6',
        title: 'Parsing Response res.json()',
        type: 'write_query',
        story: 'Parse response data using const data = await res.json();.',
        template: '// Write your JavaScript code here...\n',
        solution: 'const data = await res.json();',
        expectedJs: 'await\\s+res\\.json\\(\\)',
        hints: ['Use await res.json().'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_10_7',
        title: 'Displaying API Data',
        type: 'write_query',
        story: 'Render API username into container container.textContent = data.name;.',
        template: '// Write your JavaScript code here...\n',
        solution: 'container.textContent = data.name;',
        expectedJs: 'textContent\\s*=\\s*data\\.name',
        hints: ['Assign container.textContent = data.name;.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_10_8',
        title: 'Boss: API Info Card',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct an async function fetching profile data and parsing res.json()!',
        template: '// Write your JavaScript code here...\n',
        solution: 'async function loadProfile() {\n  const res = await fetch("/api/profile");\n  const data = await res.json();\n}',
        expectedJs: 'await\\s+res\\.json\\(\\)',
        hints: ['Await fetch and await res.json().'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 11: PROFESSIONAL FRONTEND ---------------- //
  {
    id: 11,
    title: 'Professional Frontend',
    subtitle: 'Accessibility, DevTools & Clean Code',
    icon: '🧑💻',
    color: '#06b6d4',
    guide: 'Pixel',
    zone: 'DevTools Operations Station',
    description: 'Master accessibility (alt text, ARIA), UI loading/error states, browser DevTools debugging, and clean code.',
    missions: [
      {
        id: 'fe_11_1',
        title: 'Web Accessibility (a11y)',
        type: 'multiple_choice',
        story: 'Why is alt attribute text mandatory on <img> elements for web accessibility?',
        options: [
          'Describes image context for visually impaired users using screen readers',
          'Speeds up CSS grid compilation',
          'Prevents memory leaks in JavaScript',
          'Required for database indexing'
        ],
        answerIndex: 0,
        hints: ['alt text describes images for screen readers and accessibility tools.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_11_2',
        title: 'Responsive Layout Review',
        type: 'write_query',
        story: 'Ensure images fit container bounds with width: 100%; height: auto;.',
        template: '/* Write your CSS code here... */\n',
        solution: 'img {\n  width: 100%;\n  height: auto;\n}',
        expectedCss: 'height:\\s*auto',
        hints: ['Use width: 100%; height: auto;.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_11_3',
        title: 'UI Loading & Error States',
        type: 'write_query',
        story: 'Show loading spinner state statusEl.textContent = "Loading...";.',
        template: '// Write your JavaScript code here...\n',
        solution: 'statusEl.textContent = "Loading...";',
        expectedJs: 'textContent\\s*=\\s*"Loading\\.\\.\\."',
        hints: ['Assign statusEl.textContent = "Loading...";.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_11_4',
        title: 'Browser DevTools Debugging',
        type: 'multiple_choice',
        story: 'Which tab in browser DevTools displays JavaScript console logs and error stack traces?',
        options: ['Console', 'Elements', 'Network', 'Application'],
        answerIndex: 0,
        hints: ['The Console tab displays logs and stack traces.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_11_5',
        title: 'Frontend Performance Basics',
        type: 'multiple_choice',
        story: 'Which practice optimizes webpage loading speed?',
        options: [
          'Compressing image asset file sizes and minifying CSS/JS',
          'Adding 50 unused external font files',
          'Executing infinite loops in JavaScript',
          'Disabling browser HTTP caching'
        ],
        answerIndex: 0,
        hints: ['Image compression and code minification speed up page loads.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_11_6',
        title: 'Clean Code Practices',
        type: 'multiple_choice',
        story: 'Why is avoiding duplicated code (DRY principle) important in frontend applications?',
        options: [
          'Simplifies code maintenance and reduces bug surfaces',
          'Forces browsers to use dark theme mode',
          'Automatically translates HTML to Spanish',
          'Increases server RAM size'
        ],
        answerIndex: 0,
        hints: ['DRY (Don\'t Repeat Yourself) simplifies maintenance.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'fe_11_7',
        title: 'Frontend Debugging Challenge',
        type: 'write_query',
        story: 'Fix broken selector syntax and select #main-heading.',
        template: '// Write your JavaScript code here...\n',
        solution: 'const el = document.querySelector("#main-heading");',
        expectedJs: 'querySelector\\("#main-heading"\\)',
        hints: ['Use document.querySelector("#main-heading").'],
        xp: 60,
        coins: 25
      },
      {
        id: 'fe_11_8',
        title: 'Boss: Responsive Dashboard',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a clean responsive dashboard layout with display: grid; and gap: 1rem;!',
        template: '/* Write your CSS code here... */\n',
        solution: '.dashboard {\n  display: grid;\n  gap: 1rem;\n}',
        expectedCss: 'display:\\s*grid',
        hints: ['Use display: grid; and gap: 1rem;.'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 12: FRONTEND FINAL BOSS ---------------- //
  {
    id: 12,
    title: 'Frontend Final Boss',
    subtitle: 'CodeSaga Developer Dashboard Capstone',
    icon: '🏆',
    color: '#E6A93D',
    guide: 'Pixel',
    zone: 'Web Creator High Citadel',
    description: 'Combine HTML, CSS, Flexbox, Grid, JavaScript, DOM events, and API fetch to build the CodeSaga Developer Dashboard Capstone.',
    missions: [
      {
        id: 'fe_12_1',
        title: 'Project Planning',
        type: 'multiple_choice',
        story: 'What is the recommended first step when building a new frontend application?',
        options: [
          'Planning document structure, components, styles, and data flow',
          'Randomly typing CSS styles without HTML',
          'Deleting all image assets',
          'Shutting down web servers'
        ],
        answerIndex: 0,
        hints: ['Planning component structure and layout precedes coding.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'fe_12_2',
        title: 'HTML Structure Capstone',
        type: 'write_query',
        story: 'Create capstone container <main class="dashboard"><h1>CodeSaga Dashboard</h1></main>.',
        template: '<!-- Write your HTML code here... -->\n',
        solution: '<main class="dashboard">\n  <h1>CodeSaga Dashboard</h1>\n</main>',
        expectedTag: 'main',
        expectedText: 'CodeSaga Dashboard',
        hints: ['Wrap <h1> inside <main class="dashboard">.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'fe_12_3',
        title: 'Style Dashboard Interface',
        type: 'write_query',
        story: 'Style .dashboard with display: grid; gap: 1.5rem; background-color: #0f172a;.',
        template: '/* Write your CSS code here... */\n',
        solution: '.dashboard {\n  display: grid;\n  gap: 1.5rem;\n  background-color: #0f172a;\n}',
        expectedCss: 'background-color:\\s*#0f172a',
        hints: ['Use display: grid;, gap: 1.5rem;, background-color: #0f172a;.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'fe_12_4',
        title: 'JS Interaction Capstone',
        type: 'write_query',
        story: 'Attach click handler to #refresh-btn calling loadDashboard().',
        template: '// Write your JavaScript code here...\n',
        solution: 'const btn = document.querySelector("#refresh-btn");\nbtn.addEventListener("click", loadDashboard);',
        expectedJs: 'addEventListener\\("click"',
        hints: ['Attach click listener to #refresh-btn.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'fe_12_5',
        title: 'Form Validation Capstone',
        type: 'write_query',
        story: 'Stop form submit e.preventDefault() and check input value.',
        template: '// Write your JavaScript code here...\n',
        solution: 'form.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const val = input.value.trim();\n});',
        expectedJs: 'preventDefault\\(\\)',
        hints: ['Call e.preventDefault().'],
        xp: 70,
        coins: 30
      },
      {
        id: 'fe_12_6',
        title: 'API Data Integration',
        type: 'write_query',
        story: 'Fetch dashboard data using const res = await fetch("/api/stats");.',
        template: '// Write your JavaScript code here...\n',
        solution: 'const res = await fetch("/api/stats");\nconst data = await res.json();',
        expectedJs: 'await\\s+fetch',
        hints: ['Use await fetch("/api/stats").'],
        xp: 70,
        coins: 30
      },
      {
        id: 'fe_12_7',
        title: 'Debug & Polish Capstone',
        type: 'write_query',
        story: 'Update dashboard title textContent = "CodeSaga Master Dashboard";.',
        template: '// Write your JavaScript code here...\n',
        solution: 'titleEl.textContent = "CodeSaga Master Dashboard";',
        expectedJs: 'textContent\\s*=\\s*"CodeSaga Master Dashboard"',
        hints: ['Assign textContent = "CodeSaga Master Dashboard";.'],
        xp: 100,
        coins: 40
      },
      {
        id: 'fe_12_8',
        title: 'FRONTEND FINAL BOSS 🏆',
        type: 'detective_boss',
        story: 'FRONTEND FINAL BOSS: Complete Web Creator City by rendering the CodeSaga Master Developer Dashboard!',
        template: '// Write your JavaScript code here...\n',
        solution: 'function initDashboard() {\n  const main = document.querySelector("main");\n  main.innerHTML = "<h1>FRONTEND MASTERED</h1>";\n}\ninitDashboard();',
        expectedJs: 'FRONTEND MASTERED',
        hints: ['Set main.innerHTML = "<h1>FRONTEND MASTERED</h1>";.'],
        xp: 300,
        coins: 100
      }
    ]
  }
];

export const getFrontendChapterById = (id) => {
  return FRONTEND_CURRICULUM.find((c) => c.id === Number(id)) || FRONTEND_CURRICULUM[0];
};

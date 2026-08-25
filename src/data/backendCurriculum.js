// CodeSaga Server Fortress Curriculum — 12 Complete Chapters & 96 Playable Missions

export const BACKEND_CURRICULUM = [
  // ---------------- CHAPTER 1: ENTER THE BACKEND ---------------- //
  {
    id: 1,
    title: 'Enter the Backend',
    subtitle: 'Server Architecture, HTTP & JSON',
    icon: '🖥️',
    color: '#ef4444',
    guide: 'Server',
    zone: 'Server Fortress Gateway',
    description: 'Enter the Server Fortress and master client-server request flows, HTTP methods, status codes, and JSON payloads.',
    missions: [
      {
        id: 'be_1_1',
        title: 'What Is Backend?',
        type: 'multiple_choice',
        story: 'Welcome to Server Fortress! Before building APIs, confirm which layer of a web application handles server-side logic and database operations.',
        conceptExplanation: {
          what: 'The Backend is the server-side infrastructure operating behind the scenes.',
          why: 'Handles business logic, data persistence, authentication, and secure API responses.',
          when: 'Whenever a client sends an HTTP request requiring data processing.',
          how: 'Client (Frontend) -> HTTP Request -> Backend Server -> Database -> HTTP Response -> Client.'
        },
        options: ['Backend', 'Frontend', 'Browser DOM', 'CSS Engine'],
        answerIndex: 0,
        hints: ['The Backend handles server-side processing and database access.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_1_2',
        title: 'Client vs Server',
        type: 'multiple_choice',
        story: 'In the client-server web model, which entity initiates HTTP requests?',
        options: ['Client (Browser/Mobile App)', 'Web Server', 'Database Table', 'Hardware Router'],
        answerIndex: 0,
        hints: ['Clients send requests; servers process requests.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_1_3',
        title: 'What Is a Server?',
        type: 'multiple_choice',
        story: 'What is the loopback hostname representing your local computer server during development?',
        options: ['localhost (127.0.0.1)', 'google.com', '0.0.0.0', '192.168.1.1'],
        answerIndex: 0,
        hints: ['localhost resolves to 127.0.0.1.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_1_4',
        title: 'HTTP Basics',
        type: 'multiple_choice',
        story: 'What does HTTP stand for in web communications?',
        options: ['HyperText Transfer Protocol', 'High Technical Transport Process', 'Hardware Terminal Text Protocol', 'Hybrid Protocol'],
        answerIndex: 0,
        hints: ['HTTP stands for HyperText Transfer Protocol.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_1_5',
        title: 'HTTP Methods GET & POST',
        type: 'multiple_choice',
        story: 'Which HTTP method is used to retrieve data from a server without modifying server state?',
        options: ['GET', 'POST', 'DELETE', 'PUT'],
        answerIndex: 0,
        hints: ['GET retrieves data from servers.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_1_6',
        title: 'HTTP Status Codes',
        type: 'multiple_choice',
        story: 'Which HTTP status code represents a successful server response (OK)?',
        options: ['200', '404', '500', '401'],
        answerIndex: 0,
        hints: ['200 OK signifies HTTP success.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_1_7',
        title: 'JSON Data Format',
        type: 'predict_output',
        story: 'What data format is standard for exchanging structured data in modern web APIs?',
        options: ['JSON', 'HTML', 'PNG', 'PDF'],
        answerIndex: 0,
        hints: ['JSON (JavaScript Object Notation) is the universal API payload format.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_1_8',
        title: 'Boss: Request/Response Flow',
        type: 'multiple_choice',
        story: 'BOSS ENCOUNTER: Which Express endpoint handler correctly returns an HTTP status code 200 with JSON payload { message: "Hello World" }?',
        options: [
          'app.get("/hello", (req, res) => { res.status(200).json({ message: "Hello World" }); });',
          'app.get("/hello", () => { print("Hello World"); });',
          'SELECT * FROM hello_world;',
          'console.log("Hello World");'
        ],
        answerIndex: 0,
        hints: ['Express route handlers use res.status(200).json({ message: "Hello World" }).'],
        xp: 150,
        coins: 50
      }
    ]
  },


  // ---------------- CHAPTER 2: YOUR FIRST SERVER ---------------- //
  {
    id: 2,
    title: 'Your First Server',
    subtitle: 'Node.js, Express & Route Handler',
    icon: '🚀',
    color: '#0ea5e9',
    guide: 'Server',
    zone: 'Node Engine Lab',
    description: 'Master Node.js runtime, npm package management, Express server creation, routes, and route parameters.',
    missions: [
      {
        id: 'be_2_1',
        title: 'Meet Node.js',
        type: 'multiple_choice',
        story: 'What is Node.js?',
        options: [
          'A JavaScript runtime environment built on Chrome V8 engine for server-side code',
          'A CSS styling framework',
          'A SQL database engine',
          'A browser extension'
        ],
        answerIndex: 0,
        hints: ['Node.js runs JavaScript on the server outside the browser.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_2_2',
        title: 'npm Package Manager',
        type: 'multiple_choice',
        story: 'Which file stores a Node.js project manifest and dependency list?',
        options: ['package.json', 'index.html', 'server.sql', 'style.css'],
        answerIndex: 0,
        hints: ['package.json tracks project packages and scripts.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_2_3',
        title: 'Creating an Express Endpoint',
        type: 'write_query',
        story: 'Create a GET endpoint at "/" returning res.json({ status: "ONLINE" }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/", (req, res) => {\n  res.json({ status: "ONLINE" });\n});',
        expectedOutput: ['"status": "ONLINE"'],
        hints: ['Use app.get("/", (req, res) => res.json(...)).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_2_4',
        title: 'localhost Ports',
        type: 'predict_output',
        story: 'What is a common development port for Node.js Express servers (e.g. localhost:3000)?',
        options: ['3000', '80', '443', '21'],
        answerIndex: 0,
        hints: ['Port 3000 or 5000 are standard development ports.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_2_5',
        title: 'Request & Response Objects',
        type: 'multiple_choice',
        story: 'In Express handlers (req, res) => {}, which object sends data back to the client?',
        options: ['res (Response object)', 'req (Request object)', 'next', 'app'],
        answerIndex: 0,
        hints: ['res represents the HTTP response.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_2_6',
        title: 'Defining Routes /users',
        type: 'write_query',
        story: 'Define GET route "/users" returning res.json({ users: [] }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/users", (req, res) => {\n  res.json({ users: [] });\n});',
        expectedOutput: ['"users": []'],
        hints: ['Use app.get("/users", ...).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_2_7',
        title: 'Route Parameters /users/:id',
        type: 'write_query',
        story: 'Read ID parameter from req.params.id and return it in res.json({ id: req.params.id }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/users/:id", (req, res) => {\n  res.json({ id: req.params.id });\n});',
        expectedOutput: ['"id": "10"'],
        hints: ['Access req.params.id.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_2_8',
        title: 'Boss: Multi-Route Server',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a multi-route server exposing GET /api/status returning res.json({ active: true })!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/status", (req, res) => {\n  res.json({ active: true });\n});',
        expectedOutput: ['"active": true'],
        hints: ['Use app.get("/api/status", ...).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 3: REST APIS ---------------- //
  {
    id: 3,
    title: 'REST APIs',
    subtitle: 'Resources, Endpoints & HTTP Verbs',
    icon: '🔌',
    color: '#8b5cf6',
    guide: 'Server',
    zone: 'REST API Hub',
    description: 'Master REST architectural principles, resource routes, GET, POST, PUT, PATCH, and DELETE endpoints.',
    missions: [
      {
        id: 'be_3_1',
        title: 'What Is REST?',
        type: 'multiple_choice',
        story: 'What does REST stand for in web API design?',
        options: [
          'Representational State Transfer',
          'Remote Execution Server Test',
          'Relational Storage Technique',
          'Realtime Session Transfer'
        ],
        answerIndex: 0,
        hints: ['REST stands for Representational State Transfer.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_3_2',
        title: 'REST Resource Endpoints',
        type: 'multiple_choice',
        story: 'Which URI pattern follows standard REST naming conventions for retrieving all projects?',
        options: ['GET /projects', 'GET /getAllProjectsFromDatabase', 'POST /fetch_projects_list', 'GET /do_get?type=projects'],
        answerIndex: 0,
        hints: ['REST uses plural nouns like GET /projects.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_3_3',
        title: 'GET API Endpoint',
        type: 'write_query',
        story: 'Build GET /projects returning res.json([{ id: 1, title: "CodeSaga" }]).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/projects", (req, res) => {\n  res.json([{ id: 1, title: "CodeSaga" }]);\n});',
        expectedOutput: ['"title": "CodeSaga"'],
        hints: ['Use app.get("/projects", ...).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_3_4',
        title: 'POST API Endpoint',
        type: 'write_query',
        story: 'Build POST /projects returning status 201 created.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.post("/projects", (req, res) => {\n  res.status(201).json({ created: true });\n});',
        expectedOutput: ['"created": true'],
        hints: ['Use app.post("/projects", ...) and res.status(201).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_3_5',
        title: 'PUT vs PATCH',
        type: 'multiple_choice',
        story: 'What is the key difference between PUT and PATCH HTTP methods in REST APIs?',
        options: [
          'PUT replaces the entire resource entity, whereas PATCH performs partial updates',
          'PUT is for deleting data',
          'PATCH is only for images',
          'There is no difference'
        ],
        answerIndex: 0,
        hints: ['PUT replaces full resources; PATCH applies partial updates.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_3_6',
        title: 'DELETE API Endpoint',
        type: 'write_query',
        story: 'Build DELETE /projects/:id returning res.json({ deleted: true }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.delete("/projects/:id", (req, res) => {\n  res.json({ deleted: true });\n});',
        expectedOutput: ['"deleted": true'],
        hints: ['Use app.delete("/projects/:id", ...).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_3_7',
        title: 'REST API Best Practices',
        type: 'multiple_choice',
        story: 'Which endpoint URI is properly formatted for updating user profile 10?',
        options: ['PATCH /users/10', 'POST /update_user_profile_10', 'GET /users?action=update&id=10', 'PUT /changeUser10'],
        answerIndex: 0,
        hints: ['PATCH /users/10 uses clean HTTP verbs and noun URIs.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_3_8',
        title: 'Boss: Project API System',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct the complete REST endpoint for GET /api/v1/projects!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/v1/projects", (req, res) => {\n  res.status(200).json({ count: 1, data: [{ name: "CodeSaga" }] });\n});',
        expectedOutput: ['"count": 1'],
        hints: ['Return res.status(200).json({ count: 1, ... }).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 4: DATABASES FROM THE BACKEND ---------------- //
  {
    id: 4,
    title: 'Databases from the Backend',
    subtitle: 'Persistence, Drivers & CRUD Operations',
    icon: '🗄️',
    color: '#06b6d4',
    guide: 'Server',
    zone: 'Database Fortress Substation',
    description: 'Master backend database connections, database drivers, CRUD operations, models, and relationships.',
    missions: [
      {
        id: 'be_4_1',
        title: 'Why Backend Needs Databases',
        type: 'multiple_choice',
        story: 'Why do backend applications connect to databases?',
        options: [
          'To persist user accounts, content, and transactions across server restarts',
          'To format CSS font styles',
          'To render web page HTML buttons',
          'To speed up CPU clock cycles'
        ],
        answerIndex: 0,
        hints: ['Databases provide durable data persistence.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_4_2',
        title: 'Database Drivers',
        type: 'multiple_choice',
        story: 'What is a database driver in a Node.js backend?',
        options: [
          'A software library enabling Node.js to communicate over network sockets with a database engine',
          'A computer graphics card',
          'A browser plugin',
          'An operating system printer'
        ],
        answerIndex: 0,
        hints: ['Drivers enable code to query database servers.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_4_3',
        title: 'CRUD Operations',
        type: 'multiple_choice',
        story: 'What does the acronym CRUD represent in database operations?',
        options: ['Create, Read, Update, Delete', 'Connect, Run, Undo, Disconnect', 'Compile, Read, Upload, Download', 'Cache, Render, Use, Display'],
        answerIndex: 0,
        hints: ['CRUD = Create, Read, Update, Delete.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_4_4',
        title: 'Querying Data via Backend',
        type: 'write_query',
        story: 'Simulate database query returning res.json({ db: "CONNECTED", count: 5 }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/db/test", (req, res) => {\n  res.json({ db: "CONNECTED", count: 5 });\n});',
        expectedOutput: ['"db": "CONNECTED"'],
        hints: ['Return res.json({ db: "CONNECTED", count: 5 }).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_4_5',
        title: 'Backend Models (ORM/ODM)',
        type: 'multiple_choice',
        story: 'What is the purpose of a Database Model in backend frameworks?',
        options: [
          'Defines data schema structure and business rules for database entities',
          'Styles frontend navigation bars',
          'Compresses image files',
          'Generates CSS grid templates'
        ],
        answerIndex: 0,
        hints: ['Models define entity schemas and database interactions.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_4_6',
        title: 'Database Relationships',
        type: 'predict_output',
        story: 'Which relationship type connects one User to multiple Projects in a backend database?',
        options: ['One-to-Many', 'One-to-One', 'Many-to-Many', 'None'],
        answerIndex: 0,
        hints: ['One User can own Many Projects.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_4_7',
        title: 'Handling Database Connection Errors',
        type: 'write_query',
        story: 'Return status 500 error if database connection fails.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/db/query", (req, res) => {\n  res.status(500).json({ error: "Database Connection Failed" });\n});',
        expectedOutput: ['"error": "Database Connection Failed"'],
        hints: ['Use res.status(500).json(...).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_4_8',
        title: 'Boss: Project/Task Data System',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct database query endpoint GET /api/tasks returning task records!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/tasks", (req, res) => {\n  res.status(200).json({ tasks: [{ id: 1, name: "Deploy Server" }] });\n});',
        expectedOutput: ['"name": "Deploy Server"'],
        hints: ['Return res.status(200).json({ tasks: [...] }).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 5: REQUEST DATA & VALIDATION ---------------- //
  {
    id: 5,
    title: 'Request Data & Validation',
    subtitle: 'Body Parsing, Parameters & Validation',
    icon: '📝',
    color: '#f59e0b',
    guide: 'Server',
    zone: 'Request Validation Chamber',
    description: 'Master req.body parsing, query parameters (?lang=js), route parameters, and input validation rules.',
    missions: [
      {
        id: 'fe_5_1',
        title: 'Request Body req.body',
        type: 'write_query',
        story: 'Read username from req.body and return res.json({ username: req.body.username }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.post("/login", (req, res) => {\n  res.json({ username: req.body.username });\n});',
        expectedOutput: ['"username": "agent"'],
        hints: ['Access req.body.username.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_5_2',
        title: 'Query Parameters req.query',
        type: 'write_query',
        story: 'Read query parameter req.query.lang and return res.json({ lang: req.query.lang }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/search", (req, res) => {\n  res.json({ lang: req.query.lang });\n});',
        expectedOutput: ['"lang": "js"'],
        hints: ['Access req.query.lang.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_5_3',
        title: 'Route Parameters vs Query Parameters',
        type: 'multiple_choice',
        story: 'When should Route Parameters (/users/:id) be used instead of Query Parameters (?sort=asc)?',
        options: [
          'Route parameters identify specific resources; query parameters filter, sort, or paginate',
          'Query parameters are secret',
          'Route parameters are only for images',
          'There is no difference'
        ],
        answerIndex: 0,
        hints: ['Route params identify resources; query params filter/sort.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_5_4',
        title: 'Why Backend Validation Is Mandatory',
        type: 'multiple_choice',
        story: 'Why must input validation ALWAYS be performed on the backend server even if frontend validation exists?',
        options: [
          'Frontend validation can be bypassed by malicious actors sending raw HTTP requests directly to the API',
          'To make the browser load faster',
          'To automatically translate code to Python',
          'Required by CSS stylesheets'
        ],
        answerIndex: 0,
        hints: ['Frontend validation can be bypassed; backend validation guarantees data integrity.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_5_5',
        title: 'Validating Required Fields',
        type: 'write_query',
        story: 'If req.body.email is missing, return status 400 with error "Email is required".',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.post("/register", (req, res) => {\n  if (!req.body.email) {\n    return res.status(400).json({ error: "Email is required" });\n  }\n  res.json({ success: true });\n});',
        expectedOutput: ['"error": "Email is required"'],
        hints: ['Check if (!req.body.email) and return res.status(400).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_5_6',
        title: 'Data Constraints & Sanitization',
        type: 'predict_output',
        story: 'What HTTP status code should be returned when input payload validation fails?',
        options: ['400 Bad Request', '200 OK', '500 Server Error', '404 Not Found'],
        answerIndex: 0,
        hints: ['400 Bad Request is standard for payload validation failures.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_5_7',
        title: 'Structured Validation Errors',
        type: 'write_query',
        story: 'Return structured error response with status 400.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.post("/validate", (req, res) => {\n  res.status(400).json({ valid: false, field: "password" });\n});',
        expectedOutput: ['"valid": false'],
        hints: ['Return res.status(400).json({ valid: false, ... }).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_5_8',
        title: 'Boss: Validated Registration Endpoint',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a registration endpoint validating username and returning status 201!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.post("/api/register", (req, res) => {\n  if (req.body.username) {\n    return res.status(201).json({ registered: true });\n  }\n});',
        expectedOutput: ['"registered": true'],
        hints: ['Return res.status(201).json({ registered: true }).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 6: AUTHENTICATION ---------------- //
  {
    id: 6,
    title: 'Authentication & Security',
    subtitle: 'Auth vs Authorization, Hashing & JWT',
    icon: '🔐',
    color: '#10b981',
    guide: 'Server',
    zone: 'Auth Citadel',
    description: 'Master Authentication vs Authorization, password hashing, JWT session tokens, and protected API routes.',
    missions: [
      {
        id: 'be_6_1',
        title: 'Authentication vs Authorization',
        type: 'multiple_choice',
        story: 'What is the distinction between Authentication and Authorization?',
        options: [
          'Authentication verifies WHO you are; Authorization verifies WHAT permissions you have',
          'Authentication is for databases; Authorization is for CSS',
          'They mean the exact same thing',
          'Authorization is only for mobile apps'
        ],
        answerIndex: 0,
        hints: ['Authentication = Identity check; Authorization = Permission check.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_6_2',
        title: 'Password Security & Hashing',
        type: 'multiple_choice',
        story: 'Why must user passwords NEVER be stored as plain text in backend databases?',
        options: [
          'Database leaks or unauthorized access would expose raw user credentials to attackers',
          'Plain text passwords take up too much RAM memory',
          'Node.js forbids plain text strings',
          'SQL queries cannot process plain text'
        ],
        answerIndex: 0,
        hints: ['Passwords must be securely hashed (e.g. bcrypt/argon2) to protect users.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_6_3',
        title: 'One-Way Cryptographic Hashing',
        type: 'predict_output',
        story: 'Is password hashing a one-way irreversible mathematical function?',
        options: ['Yes, hashes cannot be reversed back into plain text', 'No, anyone can decrypt hashes easily', 'Only on Linux', 'Error'],
        answerIndex: 0,
        hints: ['Cryptographic hashing is one-way and irreversible.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_6_4',
        title: 'User Login Endpoint',
        type: 'write_query',
        story: 'Construct POST /login endpoint returning token "jwt_token_abc123".',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.post("/login", (req, res) => {\n  res.status(200).json({ token: "jwt_token_abc123" });\n});',
        expectedOutput: ['"token": "jwt_token_abc123"'],
        hints: ['Return res.status(200).json({ token: "..." }).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_6_5',
        title: 'JSON Web Tokens (JWT)',
        type: 'multiple_choice',
        story: 'What is a JSON Web Token (JWT)?',
        options: [
          'A compact, URL-safe means of representing claims to be transferred between two parties statelessly',
          'A database backup file format',
          'A CSS stylesheet library',
          'A hardware USB key'
        ],
        answerIndex: 0,
        hints: ['JWTs transmit cryptographically signed identity tokens statelessly.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_6_6',
        title: 'Protected Routes',
        type: 'write_query',
        story: 'If authorization header is missing, return status 401 Unauthorized.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/profile", (req, res) => {\n  if (!req.headers.authorization) {\n    return res.status(401).json({ error: "Unauthorized" });\n  }\n  res.json({ user: "agent" });\n});',
        expectedOutput: ['"user": "agent"'],
        hints: ['Check req.headers.authorization and return user profile.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_6_7',
        title: 'Authorization Header Format',
        type: 'predict_output',
        story: 'What standard prefix precedes JWT tokens in the HTTP Authorization header?',
        options: ['Bearer', 'Token', 'Secret', 'Basic'],
        answerIndex: 0,
        hints: ['Authorization: Bearer <jwt_token> is standard.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_6_8',
        title: 'Boss: Protected Profile API',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a protected profile endpoint returning user account data!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/me", (req, res) => {\n  res.status(200).json({ authenticated: true, role: "ADMIN" });\n});',
        expectedOutput: ['"authenticated": true'],
        hints: ['Return res.status(200).json({ authenticated: true, ... }).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 7: MIDDLEWARE & ERROR HANDLING ---------------- //
  {
    id: 7,
    title: 'Middleware & Error Handling',
    subtitle: 'Pipelines, Logging & Centralized Errors',
    icon: '🛠️',
    color: '#38bdf8',
    guide: 'Server',
    zone: 'Middleware Pipeline Center',
    description: 'Master Express middleware pipelines (req, res, next), request logging, 404 handling, and centralized error handling.',
    missions: [
      {
        id: 'be_7_1',
        title: 'What Is Middleware?',
        type: 'multiple_choice',
        story: 'What is a middleware function in Express?',
        options: [
          'A function that has access to req, res, and next, executing during the request-response cycle',
          'A database backup script',
          'A browser stylesheet renderer',
          'A hardware power supply'
        ],
        answerIndex: 0,
        hints: ['Middleware intercept and process incoming HTTP requests.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_7_2',
        title: 'next() Function Execution',
        type: 'multiple_choice',
        story: 'Why must middleware functions call next() when processing is finished?',
        options: [
          'To pass execution control to the next handler in the pipeline',
          'To reboot the web server',
          'To delete temporary files',
          'To render HTML CSS'
        ],
        answerIndex: 0,
        hints: ['next() passes control to the next pipeline handler.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_7_3',
        title: 'Request Logging Middleware',
        type: 'write_query',
        story: 'Register global logger middleware app.use((req, res, next) => { next(); }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.use((req, res, next) => {\n  next();\n});',
        expectedOutput: ['"message": "Server operational"'],
        hints: ['Use app.use((req, res, next) => { next(); }).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_7_4',
        title: 'Authentication Middleware',
        type: 'write_query',
        story: 'Create auth middleware checking token and calling next().',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'const checkAuth = (req, res, next) => { next(); };\napp.get("/secure", checkAuth, (req, res) => {\n  res.json({ secure: true });\n});',
        expectedOutput: ['"secure": true'],
        hints: ['Pass checkAuth middleware into app.get("/secure", checkAuth, ...).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_7_5',
        title: 'Handling 404 Not Found',
        type: 'write_query',
        story: 'Catch unregistered routes and return status 404 with error "Route Not Found".',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.use((req, res) => {\n  res.status(404).json({ error: "Route Not Found" });\n});',
        expectedOutput: ['"error": "Route Not Found"'],
        hints: ['Use app.use((req, res) => res.status(404).json(...)).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_7_6',
        title: 'Handling 500 Internal Errors',
        type: 'predict_output',
        story: 'Which HTTP status code represents unhandled server-side internal errors?',
        options: ['500 Internal Server Error', '200 OK', '400 Bad Request', '403 Forbidden'],
        answerIndex: 0,
        hints: ['500 represents server-side internal runtime failures.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_7_7',
        title: 'Centralized Error Middleware',
        type: 'multiple_choice',
        story: 'How many arguments does an Express error-handling middleware function accept (err, req, res, next)?',
        options: ['4 arguments', '2 arguments', '1 argument', '0 arguments'],
        answerIndex: 0,
        hints: ['Express error handlers require exactly 4 parameters: (err, req, res, next).'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_7_8',
        title: 'Boss: Protected Middleware Pipeline',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a protected route pipeline returning status 200 and data payload!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/data", (req, res) => {\n  res.status(200).json({ pipeline: "PASSED" });\n});',
        expectedOutput: ['"pipeline": "PASSED"'],
        hints: ['Return res.status(200).json({ pipeline: "PASSED" }).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 8: REAL-WORLD API DEVELOPMENT ---------------- //
  {
    id: 8,
    title: 'Real-World API Development',
    subtitle: 'Controllers, Services & Environment Vars',
    icon: '🌐',
    color: '#a855f7',
    guide: 'Server',
    zone: 'Architecture Operations Station',
    description: 'Master layered API architecture (Routes -> Controllers -> Services -> Data), environment variables (.env), and configuration.',
    missions: [
      {
        id: 'be_8_1',
        title: 'Layered API Architecture',
        type: 'multiple_choice',
        story: 'In clean backend architecture, what is the separation of responsibilities between Controllers and Services?',
        options: [
          'Controllers handle HTTP request/response parsing; Services implement core business logic',
          'Controllers access databases; Services render HTML',
          'There is no difference',
          'Services are for CSS files'
        ],
        answerIndex: 0,
        hints: ['Controllers parse HTTP requests; Services execute business logic.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_8_2',
        title: 'Role of Controllers',
        type: 'multiple_choice',
        story: 'What is the primary job of an API Controller method?',
        options: [
          'Extract req parameters, invoke service methods, and return HTTP status/json responses',
          'Style web page buttons',
          'Connect hardware monitor displays',
          'Compile C++ code'
        ],
        answerIndex: 0,
        hints: ['Controllers bridge HTTP requests to application services.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_8_3',
        title: 'Role of Services',
        type: 'multiple_choice',
        story: 'Where should core business logic (e.g. calculating discounts, processing payments) reside?',
        options: ['Service Layer', 'HTML Tags', 'CSS Stylesheets', 'Browser DOM'],
        answerIndex: 0,
        hints: ['Business logic belongs in decoupled Service layers.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_8_4',
        title: 'Environment Variables .env',
        type: 'write_query',
        story: 'Read PORT from environment variable process.env.PORT || 3000.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'const PORT = process.env.PORT || 3000;\napp.get("/config", (req, res) => {\n  res.json({ port: PORT });\n});',
        expectedOutput: ['"port": 3000'],
        hints: ['Use process.env.PORT || 3000.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_8_5',
        title: 'Why Hardcoding Secrets Is Dangerous',
        type: 'multiple_choice',
        story: 'Why should secret keys, API credentials, and database passwords NEVER be hardcoded in source code files?',
        options: [
          'Committing hardcoded secrets to git repositories exposes credentials publicly to security scanners and attackers',
          'Hardcoded secrets slow down CPU speed',
          'Node.js throws compiler errors',
          'Prevents images from loading'
        ],
        answerIndex: 0,
        hints: ['Secrets must be loaded securely from environment variables.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_8_6',
        title: 'Configuration Management',
        type: 'predict_output',
        story: 'Which file stores local environment variables during development without being committed to git?',
        options: ['.env', 'package.json', 'README.md', 'index.html'],
        answerIndex: 0,
        hints: ['.env holds local environment variables.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_8_7',
        title: 'API Documentation (Swagger/OpenAPI)',
        type: 'multiple_choice',
        story: 'What is the purpose of OpenAPI / Swagger specifications in backend engineering?',
        options: [
          'Standardizes API endpoint contracts, schemas, parameters, and interactive testing documentation',
          'Formats CSS colors',
          'Manages computer RAM',
          'Deletes database records'
        ],
        answerIndex: 0,
        hints: ['OpenAPI standardizes interactive API documentation contracts.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_8_8',
        title: 'Boss: CodeSaga Architecture Endpoint',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a clean architecture endpoint returning system status!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/v1/health", (req, res) => {\n  res.status(200).json({ status: "HEALTHY", uptime: 100 });\n});',
        expectedOutput: ['"status": "HEALTHY"'],
        hints: ['Return res.status(200).json({ status: "HEALTHY", ... }).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 9: SECURITY LAB ---------------- //
  {
    id: 9,
    title: 'Security Lab',
    subtitle: 'SQL Injection, CORS & Rate Limiting',
    icon: '🛡️',
    color: '#ec4899',
    guide: 'Server',
    zone: 'Security Defense Chamber',
    description: 'Master parameterized queries against SQL injection, XSS protection, CORS headers, and rate limiting.',
    missions: [
      {
        id: 'be_9_1',
        title: 'Why Backend Security Matters',
        type: 'multiple_choice',
        story: 'Why is backend security the primary defense line for web applications?',
        options: [
          'The backend enforces authorization boundaries and protects sensitive user data from unauthorized access',
          'Backend security speeds up font rendering',
          'Prevents CSS errors',
          'Required by web browsers'
        ],
        answerIndex: 0,
        hints: ['The backend safeguards user data and enforces security controls.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_9_2',
        title: 'Preventing SQL Injection with Parameterized Queries',
        type: 'multiple_choice',
        story: 'How do Parameterized Queries (Prepared Statements) prevent SQL Injection attacks?',
        options: [
          'Treats user input strictly as data values rather than executable SQL command strings',
          'Encrypts the database hard disk',
          'Deletes all input strings',
          'Converts SQL to JSON'
        ],
        answerIndex: 0,
        hints: ['Parameterized queries separate SQL instructions from user data.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_9_3',
        title: 'Cross-Origin Resource Sharing (CORS)',
        type: 'multiple_choice',
        story: 'What is the function of CORS headers (Access-Control-Allow-Origin) in backend servers?',
        options: [
          'Controls which external domain origins are permitted to make HTTP requests to the API',
          'Compresses JSON responses',
          'Hashes passwords',
          'Formats HTML pages'
        ],
        answerIndex: 0,
        hints: ['CORS restricts cross-origin request permissions.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_9_4',
        title: 'Rate Limiting Protection',
        type: 'write_query',
        story: 'If request rate limit is exceeded, return status 429 Too Many Requests.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/limited", (req, res) => {\n  res.status(429).json({ error: "Too Many Requests" });\n});',
        expectedOutput: ['"error": "Too Many Requests"'],
        hints: ['Use res.status(429).json(...).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_9_5',
        title: 'HTTP Rate Limit Status Code 429',
        type: 'predict_output',
        story: 'Which HTTP status code is returned when a client exceeds API rate limits?',
        options: ['429 Too Many Requests', '200 OK', '500 Server Error', '404 Not Found'],
        answerIndex: 0,
        hints: ['429 Too Many Requests signifies rate limiting.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_9_6',
        title: 'Hiding Internal Stack Traces in Production',
        type: 'multiple_choice',
        story: 'Why should raw internal stack traces and database errors be hidden from production error responses?',
        options: [
          'Detailed stack traces reveal internal file paths, database schemas, and vulnerability clues to attackers',
          'Stack traces corrupt JSON responses',
          'Node.js crashes when printing errors',
          'Browsers refuse to render stack traces'
        ],
        answerIndex: 0,
        hints: ['Hiding stack traces prevents exposing internal implementation details.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_9_7',
        title: 'Secure Response Headers (Helmet)',
        type: 'write_query',
        story: 'Return secure JSON payload without leaking server version headers.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/secure-data", (req, res) => {\n  res.status(200).json({ secure: true });\n});',
        expectedOutput: ['"secure": true'],
        hints: ['Return res.status(200).json({ secure: true }).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_9_8',
        title: 'Boss: Secure Endpoint Audit',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a secure endpoint returning status 200 and audit confirmation!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/security/audit", (req, res) => {\n  res.status(200).json({ audited: true, status: "SECURE" });\n});',
        expectedOutput: ['"audited": true'],
        hints: ['Return res.status(200).json({ audited: true, ... }).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 10: ADVANCED BACKEND CONCEPTS ---------------- //
  {
    id: 10,
    title: 'Advanced Backend Concepts',
    subtitle: 'Async, Caching & Pagination',
    icon: '⚙️',
    color: '#06b6d4',
    guide: 'Server',
    zone: 'High Scale Processing Lab',
    description: 'Master async/await database operations, Redis caching, API pagination (?page=2&limit=20), and filtering.',
    missions: [
      {
        id: 'be_10_1',
        title: 'Asynchronous Programming in Node.js',
        type: 'multiple_choice',
        story: 'Why is non-blocking asynchronous I/O critical for high-concurrency Node.js web servers?',
        options: [
          'Allows the single-threaded event loop to handle thousands of concurrent requests while waiting for I/O operations',
          'Automatically doubles computer RAM',
          'Prevents database queries',
          'Styles CSS fonts'
        ],
        answerIndex: 0,
        hints: ['Non-blocking I/O keeps the event loop responsive under high request load.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_10_2',
        title: 'Async / Await Handlers',
        type: 'write_query',
        story: 'Write an async route handler returning res.json({ async: true }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/async-data", async (req, res) => {\n  res.json({ async: true });\n});',
        expectedOutput: ['"async": true'],
        hints: ['Use app.get("/async-data", async (req, res) => ...).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_10_3',
        title: 'Backend Caching (Redis)',
        type: 'multiple_choice',
        story: 'How does caching frequent database responses in an in-memory store (e.g. Redis) benefit backend performance?',
        options: [
          'Reduces database query load and decreases API response latency',
          'Formats HTML pages',
          'Encrypts passwords',
          'Generates CSS rules'
        ],
        answerIndex: 0,
        hints: ['In-memory caching serves data instantly without repeated database hits.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_10_4',
        title: 'API Pagination ?page=2&limit=20',
        type: 'write_query',
        story: 'Read query params page and limit, returning res.json({ page: 2, limit: 20 }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/items", (req, res) => {\n  res.json({ page: Number(req.query.page) || 1, limit: 20 });\n});',
        expectedOutput: ['"limit": 20'],
        hints: ['Return page and limit in res.json.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_10_5',
        title: 'Searching & Filtering APIs',
        type: 'write_query',
        story: 'Filter items by search query parameter.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/search-items", (req, res) => {\n  res.json({ search: req.query.q || "all" });\n});',
        expectedOutput: ['"search": "all"'],
        hints: ['Return search parameter in res.json.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_10_6',
        title: 'Concurrency & Event Loop',
        type: 'predict_output',
        story: 'Does Node.js handle concurrent HTTP requests using an event loop architecture?',
        options: ['Yes, Node.js uses an event loop for concurrent I/O', 'No, Node.js creates 1000 OS threads', 'Only on Sundays', 'Error'],
        answerIndex: 0,
        hints: ['Node.js relies on an event loop for scalable I/O concurrency.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_10_7',
        title: 'Sorting Query Parameters',
        type: 'write_query',
        story: 'Return res.json({ sort: req.query.sort || "desc" }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/sorted", (req, res) => {\n  res.json({ sort: req.query.sort || "desc" });\n});',
        expectedOutput: ['"sort": "desc"'],
        hints: ['Return sort query parameter.'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_10_8',
        title: 'Boss: Scalable API System',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Build a paginated search API endpoint returning status 200 and result data!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/v1/search", (req, res) => {\n  res.status(200).json({ page: 1, total: 100, results: [] });\n});',
        expectedOutput: ['"total": 100'],
        hints: ['Return res.status(200).json({ page: 1, total: 100, ... }).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 11: TESTING & DEPLOYMENT ---------------- //
  {
    id: 11,
    title: 'Testing & Deployment',
    subtitle: 'Unit Tests, Integration & Cloud Deploy',
    icon: '🚀',
    color: '#10b981',
    guide: 'Server',
    zone: 'Deployment Operations Station',
    description: 'Master backend unit testing, API integration testing, environment configurations, and cloud deployment pipelines.',
    missions: [
      {
        id: 'be_11_1',
        title: 'Why Test Backend APIs?',
        type: 'multiple_choice',
        story: 'What is the primary benefit of automated unit and API integration testing?',
        options: [
          'Verifies endpoint contracts and prevents regressions before deploying to production',
          'Formats CSS styles',
          'Deletes database tables automatically',
          'Speeds up internet connection'
        ],
        answerIndex: 0,
        hints: ['Automated tests catch regressions before production deployment.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_11_2',
        title: 'API Integration Testing (Supertest/Jest)',
        type: 'multiple_choice',
        story: 'What does an API Integration Test verify?',
        options: [
          'Verifies complete HTTP request-response cycles, status codes, payload schemas, and database updates',
          'Verifies monitor display resolution',
          'Verifies keyboard typing speed',
          'Verifies image background colors'
        ],
        answerIndex: 0,
        hints: ['Integration tests evaluate full HTTP request-response workflows.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_11_3',
        title: 'Environment Configurations (Development vs Production)',
        type: 'multiple_choice',
        story: 'How should process.env.NODE_ENV differ between local development and cloud production?',
        options: [
          'Development enables verbose debug logging; Production enables performance optimizations and security controls',
          'No difference',
          'Production deletes database data',
          'Development is for CSS'
        ],
        answerIndex: 0,
        hints: ['NODE_ENV=production enables performance optimizations and security features.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_11_4',
        title: 'Cloud Deployment Pipelines (Docker/PaaS)',
        type: 'multiple_choice',
        story: 'What is a container image (e.g. Docker) in backend deployment?',
        options: [
          'A standardized package containing application code, runtime, system tools, and libraries to run consistently anywhere',
          'An image photo format',
          'A database backup file',
          'A web browser extension'
        ],
        answerIndex: 0,
        hints: ['Docker containers package code and dependencies for consistent execution.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_11_5',
        title: 'Backend Monitoring & Logging',
        type: 'multiple_choice',
        story: 'Why is centralized log monitoring essential for production backend applications?',
        options: [
          'Tracks system health, error rates, performance metrics, and alerts engineers to production outages',
          'Formats HTML buttons',
          'Encrypts passwords',
          'Speeds up CPU'
        ],
        answerIndex: 0,
        hints: ['Monitoring alerts engineers to outages and performance degradation.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_11_6',
        title: 'Health Check Endpoint /healthz',
        type: 'write_query',
        story: 'Build health check endpoint GET /healthz returning status 200 OK.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/healthz", (req, res) => {\n  res.status(200).json({ status: "OK" });\n});',
        expectedOutput: ['"status": "OK"'],
        hints: ['Use app.get("/healthz", ...).'],
        xp: 60,
        coins: 25
      },
      {
        id: 'be_11_7',
        title: 'Graceful Server Shutdown',
        type: 'predict_output',
        story: 'What is the purpose of graceful server shutdown on SIGTERM signals?',
        options: [
          'Stops accepting new requests while finishing inflight requests and closing database connections safely',
          'Reboots operating system immediately',
          'Deletes source code files',
          'Error'
        ],
        answerIndex: 0,
        hints: ['Graceful shutdown finishes active requests before closing database sockets.'],
        xp: 50,
        coins: 20
      },
      {
        id: 'be_11_8',
        title: 'Boss: Deployment Readiness Checklist',
        type: 'detective_boss',
        story: 'BOSS ENCOUNTER: Construct a production health check endpoint returning status 200 and version info!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/ready", (req, res) => {\n  res.status(200).json({ ready: true, version: "1.0.0" });\n});',
        expectedOutput: ['"ready": true'],
        hints: ['Return res.status(200).json({ ready: true, ... }).'],
        xp: 150,
        coins: 50
      }
    ]
  },

  // ---------------- CHAPTER 12: BACKEND FINAL BOSS ---------------- //
  {
    id: 12,
    title: 'Backend Final Boss',
    subtitle: 'CodeSaga Platform Backend Capstone',
    icon: '⚔️',
    color: '#E6A93D',
    guide: 'Server',
    zone: 'Server Fortress High Citadel',
    description: 'Combine HTTP, Express routing, REST APIs, database CRUD, input validation, authentication, middleware, security, and deployment to build the CodeSaga Platform Backend Capstone.',
    missions: [
      {
        id: 'be_12_1',
        title: 'Backend Architecture Review',
        type: 'multiple_choice',
        story: 'What layer handles HTTP request parsing and response formatting in layered API architecture?',
        options: ['Controller Layer', 'Database Table', 'CSS Stylesheet', 'HTML Form'],
        answerIndex: 0,
        hints: ['Controller layer handles HTTP request-response processing.'],
        xp: 70,
        coins: 30
      },
      {
        id: 'be_12_2',
        title: 'API Route Design Capstone',
        type: 'write_query',
        story: 'Build GET /api/v1/courses returning res.json([{ id: 1, name: "Backend" }]).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/v1/courses", (req, res) => {\n  res.json([{ id: 1, name: "Backend" }]);\n});',
        expectedOutput: ['"name": "Backend"'],
        hints: ['Use app.get("/api/v1/courses", ...).'],
        xp: 70,
        coins: 30
      },
      {
        id: 'be_12_3',
        title: 'Database Data Model Capstone',
        type: 'write_query',
        story: 'Return user data record with status 200.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/v1/user", (req, res) => {\n  res.status(200).json({ id: 1, username: "agent" });\n});',
        expectedOutput: ['"username": "agent"'],
        hints: ['Return res.status(200).json({ id: 1, ... }).'],
        xp: 70,
        coins: 30
      },
      {
        id: 'be_12_4',
        title: 'Auth & Protected Route Capstone',
        type: 'write_query',
        story: 'Protect route and return res.json({ profile: "SECRET" }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/v1/profile", (req, res) => {\n  res.json({ profile: "SECRET" });\n});',
        expectedOutput: ['"profile": "SECRET"'],
        hints: ['Return res.json({ profile: "SECRET" }).'],
        xp: 70,
        coins: 30
      },
      {
        id: 'be_12_5',
        title: 'Security Audit Capstone',
        type: 'write_query',
        story: 'Validate request body and return status 200.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.post("/api/v1/secure", (req, res) => {\n  res.status(200).json({ validated: true });\n});',
        expectedOutput: ['"validated": true'],
        hints: ['Return res.status(200).json({ validated: true }).'],
        xp: 70,
        coins: 30
      },
      {
        id: 'be_12_6',
        title: 'Debugging Backend Endpoint',
        type: 'write_query',
        story: 'Fix route syntax and return res.json({ fixed: true }).',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/v1/debug", (req, res) => {\n  res.json({ fixed: true });\n});',
        expectedOutput: ['"fixed": true'],
        hints: ['Return res.json({ fixed: true }).'],
        xp: 70,
        coins: 30
      },
      {
        id: 'be_12_7',
        title: 'CodeSaga Platform Backend Project',
        type: 'write_query',
        story: 'Build platform status API returning status 200.',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/v1/platform", (req, res) => {\n  res.status(200).json({ platform: "CodeSaga", active: true });\n});',
        expectedOutput: ['"platform": "CodeSaga"'],
        hints: ['Return res.status(200).json({ platform: "CodeSaga", ... }).'],
        xp: 100,
        coins: 40
      },
      {
        id: 'be_12_8',
        title: 'BACKEND FINAL BOSS ⚔️',
        type: 'detective_boss',
        story: 'BACKEND FINAL BOSS: Fully conquer the Server Fortress by deploying the CodeSaga Master Platform Backend!',
        template: '// Write your Backend Node.js code here...\n',
        solution: 'app.get("/api/v1/master", (req, res) => {\n  res.status(200).json({ result: "BACKEND MASTERED" });\n});',
        expectedOutput: ['"result": "BACKEND MASTERED"'],
        hints: ['Return res.status(200).json({ result: "BACKEND MASTERED" }).'],
        xp: 300,
        coins: 100
      }
    ]
  }
];

export const getBackendChapterById = (id) => {
  return BACKEND_CURRICULUM.find((c) => c.id === Number(id)) || BACKEND_CURRICULUM[0];
};

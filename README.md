# TaskMaster - Task Management Application

Welcome to the TaskMaster project! This is a TypeScript-based Express.js application designed to manage tasks through a RESTful API. The application supports full CRUD operations, input validation, error handling, and includes comprehensive unit and integration tests.

## Features

- **RESTful API**: Create, read, update, and delete tasks.
- **Input Validation**: Ensures that task data meets specified criteria.
- **Error Handling**: Gracefully handles errors and returns appropriate HTTP status codes.
- **Unit Testing**: Comprehensive tests for business logic.
- **Integration Testing**: Tests for API endpoints to ensure they behave as expected.
- **Swagger Documentation**: Automatically generated API documentation for easy reference.

## Project Structure

The project is organized as follows:

```
TaskMaster
├── src
│   ├── index.ts               # Entry point of the application
│   ├── app.ts                  # Express app configuration
│   ├── config
│   │   └── index.ts            # Configuration settings
│   ├── controllers
│   │   └── taskController.ts    # Task request handlers
│   ├── routes
│   │   └── taskRoutes.ts        # API endpoint definitions
│   ├── services
│   │   └── taskService.ts       # Business logic for tasks
│   ├── repositories
│   │   └── taskRepository.ts     # In-memory task storage
│   ├── models
│   │   └── task.ts              # Task data model
│   ├── validators
│   │   └── taskValidator.ts      # Input validation functions
│   ├── middlewares
│   │   ├── errorHandler.ts       # Error handling middleware
│   │   └── validateRequest.ts     # Request validation middleware
│   ├── docs
│   │   ├── swagger.ts            # Swagger setup for API documentation
│   │   └── openapi.yaml          # OpenAPI specification
│   ├── utils
│   │   └── logger.ts             # Logging utility
│   └── types
│       └── index.ts              # Custom types and interfaces
├── tests
│   ├── unit
│   │   └── taskService.test.ts   # Unit tests for TaskService
│   └── integration
│       └── taskRoutes.test.ts    # Integration tests for task routes
├── package.json                  # npm configuration
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .gitignore                    # Git ignore file
└── README.md                     # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (recommended: Node 22.x LTS)
- npm (Node package manager)

Note: This project was developed and tested on Node v22.15.0 (LTS, codename "Jod"). The project includes an `.nvmrc` file that pins the major Node version to `22`. If you use nvm, run `nvm use` in the project root to switch to the correct version.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TaskMaster
   ```

2. Use the recommended Node version (optional but recommended):

   - If you use nvm:
     ```bash
     nvm install
     nvm use
     ```

   - Or install Node 22.x using your platform package manager.

3. Install dependencies:
   ```bash
   npm install
   ```

   Alternatively, to both install (prefer `npm ci` when a lockfile exists) and run the bundler in one copy/pasteable command (useful when handing the project to someone), run:

   ```bash
   if [ -f package-lock.json ]; then npm ci; else npm install; fi && npm run bundle
   ```

   Or use the included helper script (recommended) which does the same and is easier to share:

   ```bash
   # make the script executable once
   chmod +x scripts/bootstrap.sh

   # run the bootstrap script from the project root
   ./scripts/bootstrap.sh
   ```

   This will:
   - run `npm ci` if `package-lock.json` exists (deterministic CI-style install), otherwise fall back to `npm install`
      - run the `bundle` script to produce `dist/index.js`

   Recommended (cross-platform): use the npm helper which delegates to a Node-based bootstrapper:

   ```bash
   npm run bootstrap
   ```

   Direct wrappers (if needed):

   - Unix/macOS (shell wrapper):
      ```bash
      bash ./scripts/bootstrap.sh
      # or if executable: ./scripts/bootstrap.sh
      ```

   - Windows PowerShell (wrapper):
      ```powershell
      pwsh ./scripts/bootstrap.ps1
      # or: .\scripts\bootstrap.ps1
      ```

### Running the Application

To start the application, run the following command:

```bash
npm start
```

The API will be available at `http://localhost:3000`.

If you'd like to produce a single bundled artifact (recommended when distributing the app to an environment where installing dev tooling isn't desirable), you can bundle the app using a bundler such as `esbuild`.

Example (esbuild):

1. Install esbuild as a dev dependency:

```bash
npm install --save-dev esbuild
```

2. Add a script to `package.json` (example):

```json
"scripts": {
   "bundle": "esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js --external:express --target=node22"
}
```

3. Run the bundler and then run the bundled artifact:

```bash
npm run bundle
node dist/index.js
```

Notes about bundling:

- Bundling produces a single `dist/index.js` file that you can run with Node. It reduces deployment friction but does not remove the need to ensure the runtime Node version is compatible with the target (here: Node 22).
- When bundling, consider marking native dependencies as external (see `--external`) or using a packaging tool that includes native binaries if needed.
- If you need a fully standalone executable, consider tools like `pkg` or `nexe`; those have their own compatibility and size trade-offs.

### API Documentation

API documentation is available at `/api-docs` when the application is running. You can also find the OpenAPI specification in the `src/docs/openapi.yaml` file.

### Running Tests

To run the unit and integration tests, use the following command:

```
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Feel free to explore and modify the TaskMaster application to suit your needs!
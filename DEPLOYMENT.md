# CI & Deployment (TaskMaster)

This document describes the recommended CI and deployment approach for TaskMaster.

Important: This repository enforces a bundled-artifact deployment model (Option A). Do NOT use the "Option B" workflow (compile with `tsc` then deploy compiled JS plus `node_modules`) — that approach is intentionally forbidden for this project.

Recommended overall flow
1. CI (Jenkins) checks out the repo and installs dependencies (including devDependencies).
2. CI runs the bundling step (esbuild) to produce a self-contained `dist/index.js`.
3. CI archives the `dist/` artifact or builds a Docker image containing the artifact.
4. Deploy the artifact or image to EC2 and run the bundled artifact directly with Node (no `npm ci` on the server).

Why this approach?
- Keeps production images/artifacts small and reproducible.
- Avoids shipping `node_modules` or devDependencies to production.
- Ensures the exact build tool versions (from `devDependencies`) are used in CI to produce the artifact.

Jenkins example (declarative)
```groovy
pipeline {
  agent any
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install')  { steps { sh 'npm ci' } }
    stage('Build')    { steps { sh 'npm run bundle' } }
    stage('Archive')  { steps { archiveArtifacts artifacts: 'dist/**', fingerprint: true } }
    stage('Deploy')   { steps {
      // upload and deploy dist/ to your server or artifact store
    }}
  }
}
```

Docker multi-stage (included)
- The repo includes a `Dockerfile` that builds (bundles) in the first stage and copies only `dist/` into the runtime image. The runtime image does not run `npm ci` and does not include `node_modules`.

Local Docker build/run
```bash
docker build -t taskmaster:latest .
docker run -p 3000:3000 taskmaster:latest
```

EC2 deployment options
- Deploy the bundled `dist/` and run `node dist/index.js` directly (no npm install on server).
- Or deploy the Docker image built in CI and run the container on EC2.

Notes
- Keep TypeScript and build tools as devDependencies. CI installs them, builds the artifact, and the production host does not need devDependencies.
- Ensure the Node runtime in production matches the targeted Node version (see `.nvmrc` and `package.json` `engines`).

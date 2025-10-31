#!/usr/bin/env bash
# Cross-platform wrapper: delegate to the Node bootstrapper.
# This is intentionally a thin shim; the real logic lives in scripts/bootstrap.js

if command -v node >/dev/null 2>&1; then
  node "$(dirname "$0")/bootstrap.js" "$@"
else
  echo "Node.js is required to run this script. Please install Node 22.x and try again." >&2
  exit 2
fi

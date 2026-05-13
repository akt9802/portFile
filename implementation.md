# Phase 1 Implementation Details: Core Registry (MVP)

This document tracks the steps taken to implement Phase 1 of Portfile to serve as a reference for future work and interview prep.

## 1. Database Connection (`src/lib/db.js`)
We chose `better-sqlite3` as the database driver, which is synchronous and very fast, avoiding promise overhead for a CLI tool.
- A directory is created at `~/.portfile/` automatically if it doesn't exist.
- The `registry.db` is stored inside `~/.portfile/`.
- We defined a single table `ports` with:
  - `port INTEGER PRIMARY KEY`
  - `project TEXT NOT NULL`
  - `projectPath TEXT NOT NULL`
  - `description TEXT`
- Built helper functions: `getPort()`, `registerPort()`, `releasePort()`, `releaseAllPorts()`, and `listPorts()`. Conflict handling is managed via `ON CONFLICT(port) DO UPDATE`.

## 2. CLI Entry Point
- **`bin/portfile.js`**: A basic entry point containing `#!/usr/bin/env node` and requiring `cli.js`. This allows running `npm link` to execute `portfile` globally.
- **`src/cli.js`**: Uses `commander` to describe the application, wire up the version from `package.json`, and register our individual command scripts.

## 3. The `register` Command (`src/commands/register.js`)
- `portfile register <port> [description]`
- Reads `isNaN()` explicitly to ensure a valid port number. 
- Uses Node's builtin `path.basename(process.cwd())` to guess the project name, and `process.cwd()` to securely identify the project path.
- **Conflict Handling**: Before calling the database, we query if the port is registered to a *different* `projectPath`. If so, we use `readline` to prompt the user whether to Overwrite or Cancel.

## 4. The `release` Command (`src/commands/release.js`)
- `portfile release <port>` or `portfile release --all`
- Checks whether to drop a single port row or all rows that match the currently executing `projectPath`.
- Includes a warning if the developer tries to release a port owned by a different project (though it still allows it, useful for force cleaning).

## 5. The `list` Command (`src/commands/list.js`)
- `portfile list`
- Uses `cli-table3` to print a clean terminal output with Chalk for colored headers and values.
- *Note:* In Phase 1, we haven't implemented "Live" detection (the `STATUS` column). We will add `STATUS` (live detection) in Phase 2 using Node.js's `net` module.

## Summary
The Core Registry is fully operational. We can now store port assignments globally on this machine that track back directly to their original project directories. 

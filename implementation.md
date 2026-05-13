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

# Phase 2 Implementation Details: Live Detection + Check

## 1. Live Port Detection (`src/lib/detect.js`)
- Implemented node `net` module-based live port detection by attempting TCP connections (client side).
- Created `isPortLive(port)` mapping which safely checks both `127.0.0.1` and `0.0.0.0` to verify if external or internal services are listening.

## 2. Updated the `list` Command (`src/commands/list.js`)
- Made the command async.
- Appended a new `STATUS` column using the `cli-table3` implementation.
- Now loops through ports synchronously awaiting `isPortLive()` and uses Chalk colorings (`bgGreen` for LIVE, `gray` for idle) to make reading processes instantly understandable.

## 3. The `check` Command (`src/commands/check.js`)
- `portfile check`
- Implemented as a pre-flight scan for your current project.
- Scans `process.cwd()` to limit to currently assigned project ports from the SQLite DB.
- Outputs a cleanly formatted `cli-table3` grid containing `PORT`, `DESCRIPTION`, `STATUS`, and `CONFLICTS`.
- Ready to be upgraded in Phase 3 alongside `.portfile` configurations.

# Phase 3 Implementation Details: Project Config (`.portfile`)

## 1. Project Config File (`src/lib/config.js`)
- Built helper methods `readConfig` and `writeConfig` to parse and save the `.portfile` schema.
- Uses standard `fs` (synchronously) to avoid promise chains for simple CLI operations.

## 2. Interactive `init` Command (`src/commands/init.js`)
- Implemented `portfile init` to create the `.portfile` in a project interactively.
- Leverages Node's builtin `readline` module for prompt inputs.
- Asks for `Project name` (defaulting to folder name), `Port` numbers, and `Description`s.
- Automatically creates the file AND immediately registers those bindings into the global SQLite registry.

## 3. Smarter `check` Command (`src/commands/check.js`)
- Rewrote the check command to read strictly from the `.portfile` config (as the defining source of truth/contract for the project), rather than querying by path.
- Enhanced conflict detection:
  - Warns you if a declared port is globally owned by a **different** project.
  - Warns you if a declared port is missing from the global registry (e.g., cloned repos).
- Maintains the visual live probing logic out of Phase 2. 
# Phase 4 Implementation Details: Doctor + Scan

## 1. The `doctor` Command (`src/commands/doctor.js`)
- Created `portfile doctor` to maintain registry hygiene.
- It iterates through all globally registered ports and checks `fs.existsSync` against the `projectPath`.
- Outputs a clean table of any "Stale entries" — ports tied to projects/folders you have since deleted from your machine.

## 2. The `scan` Command (`src/commands/scan.js`)
- Created `portfile scan --range <range>` to discover untracked live processes.
- Operates concurrently (batched by 100 ports at a time using `Promise.all` logic) to prevent `EMFILE` and max socket exceptions.
- Scans `1024-9999` by default.
- If it finds a live port, it looks it up in the SQLite registry to report whether it is registered to a Project, or if it is an "Untracked process".
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORTFILE_DIR = path.join(os.homedir(), '.portfile');
const DB_PATH = path.join(PORTFILE_DIR, 'registry.db');

// Ensure directory exists
if (!fs.existsSync(PORTFILE_DIR)) {
  fs.mkdirSync(PORTFILE_DIR, { recursive: true });
}

// Init database
const db = new Database(DB_PATH);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS ports (
    port INTEGER PRIMARY KEY,
    project TEXT NOT NULL,
    projectPath TEXT NOT NULL,
    description TEXT
  );
`);

/**
 * Get a registered port
 */
function getPort(port) {
  const stmt = db.prepare('SELECT * FROM ports WHERE port = ?');
  return stmt.get(port);
}

/**
 * Register a port
 */
function registerPort(port, project, projectPath, description) {
  const stmt = db.prepare(`
    INSERT INTO ports (port, project, projectPath, description)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(port) DO UPDATE SET
      project = excluded.project,
      projectPath = excluded.projectPath,
      description = excluded.description
  `);
  stmt.run(port, project, projectPath, description);
}

/**
 * Release a single port
 */
function releasePort(port) {
  const stmt = db.prepare('DELETE FROM ports WHERE port = ?');
  stmt.run(port);
}

/**
 * Release all ports for a given project path
 */
function releaseAllPorts(projectPath) {
  const stmt = db.prepare('DELETE FROM ports WHERE projectPath = ?');
  stmt.run(projectPath);
}

/**
 * List all registered ports
 */
function listPorts() {
  const stmt = db.prepare('SELECT * FROM ports ORDER BY port ASC');
  return stmt.all();
}

module.exports = {
  db,
  getPort,
  registerPort,
  releasePort,
  releaseAllPorts,
  listPorts,
};

const fs = require('fs');
const path = require('path');

function getConfigPath(dir = process.cwd()) {
  return path.join(dir, '.portfile');
}

/**
 * Reads and parses the .portfile in the given directory.
 * Returns null if it doesn't exist or is invalid.
 */
function readConfig(dir = process.cwd()) {
  const file = getConfigPath(dir);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Error parsing .portfile', e);
    return null;
  }
}

/**
 * Writes the configuration object to .portfile in the chosen directory.
 */
function writeConfig(config, dir = process.cwd()) {
  const file = getConfigPath(dir);
  fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

module.exports = {
  readConfig,
  writeConfig,
  getConfigPath
};

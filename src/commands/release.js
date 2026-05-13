const chalk = require('chalk');
const path = require('path');
const db = require('../lib/db');

module.exports = (program) => {
  program
    .command('release [port]')
    .description('Removes a port from the registry')
    .option('--all', 'Releases all ports registered to the current project')
    .action((portStr, options) => {
      const projectPath = process.cwd();
      const project = path.basename(projectPath);

      if (options.all) {
        db.releaseAllPorts(projectPath);
        console.log(chalk.green(`Released all ports for project ${project}.`));
        return;
      }

      if (!portStr) {
        console.error(chalk.red('Error: Please specify a port or use --all.'));
        process.exit(1);
      }

      const port = parseInt(portStr, 10);
      if (isNaN(port)) {
        console.error(chalk.red('Error: Invalid port number.'));
        process.exit(1);
      }

      const existing = db.getPort(port);
      if (!existing) {
        console.log(chalk.yellow(`Port ${port} is not registered.`));
        return;
      }

      if (existing.projectPath !== projectPath) {
        console.log(chalk.yellow(`Warning: Port ${port} is registered to ${existing.project}, not the current project.`));
      }

      db.releasePort(port);
      console.log(chalk.green(`Released port ${port}.`));
    });
};

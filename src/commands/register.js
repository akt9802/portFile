const path = require('path');
const chalk = require('chalk');
const readline = require('readline');
const db = require('../lib/db');

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

module.exports = (program) => {
  program
    .command('register <port> [description]')
    .description('Manually registers a single port to the current project')
    .action(async (portStr, description) => {
      const port = parseInt(portStr, 10);
      if (isNaN(port) || port <= 0 || port > 65535) {
        console.error(chalk.red('Error: Invalid port number.'));
        process.exit(1);
      }

      const projectPath = process.cwd();
      const project = path.basename(projectPath);
      const desc = description || '';

      const existing = db.getPort(port);

      if (existing && existing.projectPath !== projectPath) {
        console.log(chalk.yellow(`\nPort ${port} is already registered to: ${existing.project}`));
        console.log(chalk.gray(`  ${existing.projectPath}\n`));
        
        console.log('What would you like to do?');
        console.log('  1. Overwrite — take this port for the current project');
        console.log('  2. Cancel');
        
        const answer = await prompt('\n> ');
        if (answer !== '1') {
          console.log(chalk.gray('Canceled.'));
          process.exit(0);
        }
      }

      db.registerPort(port, project, projectPath, desc);
      console.log(chalk.green(`Successfully registered port ${port} to ${project}.`));
    });
};

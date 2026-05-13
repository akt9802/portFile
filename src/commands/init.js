const readline = require('readline');
const path = require('path');
const chalk = require('chalk');
const db = require('../lib/db');
const { writeConfig, readConfig } = require('../lib/config');

module.exports = (program) => {
  program
    .command('init')
    .description('Initializes a .portfile config in the current directory')
    .action(async () => {
      if (readConfig()) {
        console.log(chalk.yellow('.portfile already exists in this directory.'));
        return;
      }

      console.log(chalk.cyan('Initializing Portfile...'));
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const question = (query) => new Promise(resolve => rl.question(query, resolve));

      const defaultProjectName = path.basename(process.cwd());
      const projectNameInput = await question(`Project name (${defaultProjectName}): `);
      const projectName = projectNameInput.trim() || defaultProjectName;
      
      const ports = [];
      let adding = true;
      
      console.log(chalk.gray('\nEnter the ports this project needs (Press Enter with no input to finish):'));
      
      while (adding) {
        const portStr = await question('Port: ');
        if (!portStr.trim()) {
          adding = false;
          break;
        }
        
        const port = parseInt(portStr.trim(), 10);
        if (isNaN(port)) {
          console.log(chalk.red('Invalid port number.'));
          continue;
        }
        
        const description = await question('Description (e.g., API server): ');
        ports.push({ port, description: description.trim() });
      }

      rl.close();

      if (ports.length === 0) {
        console.log(chalk.yellow('No ports provided. Aborting initialization.'));
        return;
      }

      const config = {
        project: projectName,
        ports
      };

      writeConfig(config);
      console.log(chalk.green(`\nCreated .portfile with ${ports.length} port(s).`));

      const projectPath = process.cwd();
      ports.forEach(p => {
        db.registerPort(p.port, projectName, projectPath, p.description);
      });
      console.log(chalk.green('Successfully registered ports in your local registry.'));
    });
};

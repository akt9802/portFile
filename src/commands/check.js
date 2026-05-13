const chalk = require('chalk');
const Table = require('cli-table3');
const db = require('../lib/db');
const { isPortLive } = require('../lib/detect');
const { readConfig } = require('../lib/config');

module.exports = (program) => {
  program
    .command('check')
    .description('Checks the status of registered ports from the .portfile config')
    .action(async () => {
      const projectPath = process.cwd();
      const config = readConfig(projectPath);

      if (!config) {
        console.log(chalk.yellow('No .portfile found. Run "portfile init" to create one.'));
        return;
      }

      const { project, ports } = config;

      if (!ports || ports.length === 0) {
        console.log(chalk.yellow('No ports declared in .portfile.'));
        return;
      }

      console.log(`Checking ports for ${chalk.cyan(project)} ${chalk.gray(`(${projectPath})`)}...\n`);

      const table = new Table({
        head: [
          chalk.cyan('PORT'),
          chalk.cyan('DESCRIPTION'),
          chalk.cyan('STATUS'),
          chalk.cyan('CONFLICTS'),
        ],
        style: { head: [], border: [] }
      });

      for (const p of ports) {
        const live = await isPortLive(p.port);
        let conflictText = chalk.green('None');

        const registered = db.getPort(p.port);
        if (registered && registered.projectPath !== projectPath) {
          conflictText = chalk.red(`Owned by: ${registered.project}`);
        } else if (!registered) {
          conflictText = chalk.yellow('Not in registry');
        }

        table.push([
          live ? chalk.yellow(p.port.toString()) : chalk.green(p.port.toString()),
          p.description || chalk.gray('-'),
          live ? chalk.bgGreen.black(' LIVE ') : chalk.gray('idle'),
          conflictText
        ]);
      }

      console.log(table.toString());
    });
};

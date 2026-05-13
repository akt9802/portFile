const Table = require('cli-table3');
const chalk = require('chalk');
const db = require('../lib/db');
const { isPortLive } = require('../lib/detect');

module.exports = (program) => {
  program
    .command('list')
    .description('Shows all registered ports across all your projects')
    .action(async () => {
      const ports = db.listPorts();

      if (ports.length === 0) {
        console.log(chalk.gray('No ports registered yet.'));
        return;
      }

      const table = new Table({
        head: [
          chalk.cyan('PORT'),
          chalk.cyan('PROJECT'),
          chalk.cyan('DESCRIPTION'),
          chalk.cyan('STATUS')
        ],
        style: { head: [], border: [] }
      });

      for (const p of ports) {
        const live = await isPortLive(p.port);
        table.push([
          live ? chalk.green(p.port.toString()) : chalk.yellow(p.port.toString()),
          p.project,
          p.description || chalk.gray('-'),
          live ? chalk.bgGreen.black(' LIVE ') : chalk.gray('idle')
        ]);
      }

      console.log(table.toString());
    });
};

const Table = require('cli-table3');
const chalk = require('chalk');
const db = require('../lib/db');

module.exports = (program) => {
  program
    .command('list')
    .description('Shows all registered ports across all your projects')
    .action(() => {
      const ports = db.listPorts();

      if (ports.length === 0) {
        console.log(chalk.gray('No ports registered yet.'));
        return;
      }

      // In Phase 1 we only have registered status, no live detection yet.
      const table = new Table({
        head: [
          chalk.cyan('PORT'),
          chalk.cyan('PROJECT'),
          chalk.cyan('DESCRIPTION'),
        ],
        style: { head: [], border: [] }
      });

      ports.forEach((p) => {
        table.push([
          chalk.green(p.port.toString()),
          p.project,
          p.description || chalk.gray('-')
        ]);
      });

      console.log(table.toString());
    });
};

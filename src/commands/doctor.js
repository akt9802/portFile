const fs = require('fs');
const chalk = require('chalk');
const Table = require('cli-table3');
const db = require('../lib/db');

module.exports = (program) => {
  program
    .command('doctor')
    .description('Scans registry for stale entries and reports issues')
    .action(() => {
      console.log(chalk.cyan('Running Portfile Doctor...\n'));

      const allPorts = db.listPorts();
      
      if (allPorts.length === 0) {
        console.log(chalk.green('Registry is empty. Nothing to check!'));
        return;
      }

      const table = new Table({
        head: [
          chalk.cyan('PORT'),
          chalk.cyan('PROJECT'),
          chalk.cyan('ISSUE')
        ],
        style: { head: [], border: [] }
      });

      let issuesFound = 0;

      for (const p of allPorts) {
        let issue = null;

        // Check 1: Directory no longer exists (Stale entry)
        if (!fs.existsSync(p.projectPath)) {
          issue = chalk.red(`Stale entry: Directory not found (${p.projectPath})`);
        }

        if (issue) {
          issuesFound++;
          table.push([
            chalk.yellow(p.port.toString()),
            p.project,
            issue
          ]);
        }
      }

      if (issuesFound === 0) {
        console.log(chalk.green('✅ Everything looks good! No stale entries or conflicts found in the registry.'));
      } else {
        console.log(chalk.yellow(`Found ${issuesFound} issue(s):`));
        console.log(table.toString());
        console.log(chalk.gray('\nTip: You can use `portfile release <port>` to clean up stale entries.'));
      }
    });
};

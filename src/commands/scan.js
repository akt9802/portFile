const chalk = require('chalk');
const Table = require('cli-table3');
const db = require('../lib/db');
const { isPortLive } = require('../lib/detect');

module.exports = (program) => {
  program
    .command('scan')
    .description('Scans a range of ports to see what is currently live')
    .option('-r, --range <range>', 'Port range to scan (e.g., 3000-4000)', '1024-9999')
    .action(async (options) => {
      const [startStr, endStr] = options.range.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > 65535) {
        console.log(chalk.red('Invalid range provided. Ensure it is in the format START-END.'));
        return;
      }

      console.log(chalk.cyan(`Scanning ports ${start} through ${end}. This may take a moment...\n`));

      const livePorts = [];
      
      // Batch promises to avoid Too Many Open Files errors (EMFILE)
      const CONCURRENCY = 100;
      const portsToScan = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      
      for (let i = 0; i < portsToScan.length; i += CONCURRENCY) {
        const batch = portsToScan.slice(i, i + CONCURRENCY);
        const results = await Promise.all(
          batch.map(async (port) => {
            const live = await isPortLive(port);
            return { port, live };
          })
        );
        
        livePorts.push(...results.filter(r => r.live).map(r => r.port));
      }

      if (livePorts.length === 0) {
        console.log(chalk.green(`No live ports found in range ${start}-${end}.`));
        return;
      }

      const table = new Table({
        head: [
          chalk.cyan('PORT'),
          chalk.cyan('STATUS'),
          chalk.cyan('REGISTRY INFO')
        ],
        style: { head: [], border: [] }
      });

      livePorts.forEach(port => {
        const registered = db.getPort(port);
        const registryInfo = registered 
          ? chalk.blue(`Registered to: ${registered.project}`) 
          : chalk.gray('Untracked process');

        table.push([
          chalk.green(port.toString()),
          chalk.bgGreen.black(' LIVE '),
          registryInfo
        ]);
      });

      console.log(table.toString());
      console.log(chalk.gray(`\nFound ${livePorts.length} live port(s).`));
    });
};

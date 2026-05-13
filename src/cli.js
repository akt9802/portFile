const { program } = require('commander');
const packageJson = require('../package.json');

program
  .name('portfile')
  .description('A local port registry for developers')
  .version(packageJson.version);

require('./commands/register')(program);
require('./commands/release')(program);
require('./commands/list')(program);

program.parse(process.argv);

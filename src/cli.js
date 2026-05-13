const { program } = require('commander');
const packageJson = require('../package.json');

program
  .name('portfile')
  .description('A local port registry for developers')
  .version(packageJson.version);

require('./commands/init')(program);
require('./commands/register')(program);
require('./commands/release')(program);
require('./commands/list')(program);
require('./commands/check')(program);
require('./commands/doctor')(program);
require('./commands/scan')(program);

program.parse(process.argv);

import { copyAssets } from './utilities/copy-assets';
import { updateVersion } from './utilities/update-version';

const program = require('commander');

program
  .command('copy-assets')
  .alias('ca')
  .description('Copy assets')
  .action(function () {
    copyAssets();
  });

program
  .command('update-versions')
  .alias('uv')
  .description('Update versions')
  .action(function () {
    updateVersion();
  });

program.parse(process.argv);

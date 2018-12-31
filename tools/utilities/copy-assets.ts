import Chalk from 'chalk';
import { copy } from 'fs-extra';

export const copyAssets = async () => {
  try {
    await copy('README.md', 'dist/ng-timer/README.md');
    console.log(Chalk.green('README copied to package')); /* tslint:disable-line */
  } catch (e) {
    console.error(e);
  }
};

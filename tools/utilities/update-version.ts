import Chalk from 'chalk';
import { writeFile } from 'fs-extra';
import { gitDescribe } from 'git-describe';
import { resolve, relative } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';


export const updateVersion = async () => {
  const gitInfo = await gitDescribe({
    longSemver: true
  });

  gitInfo.commitHash = (await promisify(exec)('git rev-parse HEAD')).stdout.replace('\r', '').replace('\n', '');
  gitInfo.branch = (await promisify(exec)('git rev-parse --abbrev-ref HEAD')).stdout.replace('\r', '').replace('\n', '');

  const file = resolve(__dirname, '..', '..', 'apps', 'ng-timer-docs', 'src', 'environments', 'version.ts');
  writeFile(file,
`// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECK IN!
export const VERSION = ${JSON.stringify(gitInfo, null, 2).replace(/"/g, '\'')};
`, { encoding: 'utf-8' });

  console.log(Chalk.green(`Wrote version info ${gitInfo.raw} to ${relative(resolve(__dirname, '..'), file)}`)); /* tslint:disable-line */
};

import semver from 'semver';
import chalk from 'chalk';
import { version } from 'process';

const checkNodeVersion = (wanted: string, id: string) => new Promise<void>((resolve, reject) => {
  if (!semver.satisfies(version, wanted, { includePrerelease: true })) {
    reject(new Error(`${chalk.red(`当前Node版本：${version}`)}\n${chalk.green(`${id}要求Node版本：${wanted}`)}\n${chalk.bgBlue('请升级你的 Node 版本！！！')}`));
  } else {
    resolve();
  }
});

export default checkNodeVersion;

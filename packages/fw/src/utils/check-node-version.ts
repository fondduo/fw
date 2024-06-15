import semver from 'semver';
import chalk from 'chalk';
import { exit, version } from 'process';

function checkNodeVersion(wanted: string, id: string) {
  if (!semver.satisfies(version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      `You are using Node ${version} , but this version of ${id} requires Node ${wanted}.\nPlease upgrade your Node version.`,
    ));
    exit(1);
  } else {
    console.log(chalk.green(
      `node version: ${version}`,
    ));
  }
}

export default checkNodeVersion;

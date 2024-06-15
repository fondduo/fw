import checkNodeVersion from 'utils/check-node-version';
import { program } from 'commander';
import { argv } from 'process';
import {
  genAction, genAllXmlOption, genWatchDateXmlOption, genWatchEditorXmlOption,
} from './generate';
import pkg from '../../package.json';

checkNodeVersion(pkg?.engines?.node ?? 'unknown', '@fondduo/watcher');

program
  .name('fw-gen')
  .description('生成 jetbrains fw xml 配置文件')
  .version(`@fondduo/watcher version: ${pkg.version}`, '-v, --version', '版本信息');
program
  .option('-l, --list', '显示所有支持的配置')
  .option('-d, --debug', '调试模式')
  .action((options) => {
    console.log(options, program.opts());
  });
program.command('generate')
  .alias('gen')
  .description('gen develop configs')
  .addOption(genAllXmlOption)
  .addOption(genWatchDateXmlOption)
  .addOption(genWatchEditorXmlOption)
  .action(genAction);

program.parse(argv);

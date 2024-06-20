import checkNodeVersion from 'utils/check-node-version';
import { CommanderError, program } from 'commander';
import { argv, stdout } from 'process';
import logger from 'loglevel';
import { ProgramOptions } from '@fondduo/types';
import {
  genAction, genAllXmlOption, genWatchDateXmlOption, genWatchEditorXmlOption,
} from '@/generator';
import pkg from '../package.json';

const main = async () => {
  await checkNodeVersion(pkg?.engines?.node ?? 'unknown', '@fondduo/fw');
  logger.noConflict();
  logger.setLevel(logger.levels.INFO);

  program.exitOverride();
  program.configureOutput({
    writeErr: (str: string) => stdout.write(str.replace(/error: /, '')),
  });
  program.showSuggestionAfterError();

  program
    .name('fw')
    .description('@fondduo/fw 是一个包含jetbrains file-watcher 脚本和生成xml配置文件的工具库')
    .version(`@fondduo/watcher version: ${pkg.version}`, '-v, --version', '版本信息')
    .helpOption('-h, --help', '显示帮助')
    .option('-d, --debug', '调试模式')
    .action((options: ProgramOptions) => {
      if (options.debug) {
        logger.setLevel('debug');
      }
      logger.log('debug', options, program.opts(), logger.getLevel());
    });

  program.command('generate')
    .alias('gen')
    .description('生成jetbrains file-watcher 的xml导入配置文件')
    .addOption(genAllXmlOption)
    .addOption(genWatchDateXmlOption)
    .addOption(genWatchEditorXmlOption)
    .action(genAction);
  await program.parseAsync(argv);
};

main()
  .catch((err) => {
    if (err instanceof CommanderError && err.exitCode === 0) {
      logger.info('程序退出');
    } else {
      logger.error(err);
    }
  });

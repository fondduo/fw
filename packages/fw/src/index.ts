import checkNodeVersion from 'utils/check-node-version';
import { CommanderError, program } from 'commander';
import { argv, stdout } from 'process';
import container from 'utils/logger';
import { watchDateAction, watchDateOptions } from 'watchers/date';
import pkg from '../package.json';
import {
  genAction,
  genAllXmlOption,
  genWatchDateXmlOption,
  genWatchEditorXmlOption,
} from '@/generator';

const logger = container.get('fw');

const main = async () => {
  program.exitOverride();
  program.configureOutput({
    writeErr: () => stdout.write(''),
  });
  program
    .name('fw')
    .description('@fondduo/fw 是一个包含jetbrains file-watcher 脚本和生成xml配置文件的工具库')
    .version(`@fondduo/watcher version: ${pkg.version}`, '-v, --version', '版本信息')
    .helpOption('-h, --help', '显示帮助')
    .option('-d, --debug', '调试模式')
    .hook('preSubcommand', async (thisCommand) => {
      await checkNodeVersion(pkg?.engines?.node ?? 'unknown', '@fondduo/fw');
      if (thisCommand.opts().debug) {
        logger.level = 'debug';
      }
    });

  program.command('generate')
    .alias('gen')
    .description('生成jetbrains file-watcher 的xml导入配置文件')
    .helpOption('-h, --help', '显示帮助')
    .addOption(genAllXmlOption)
    .addOption(genWatchDateXmlOption)
    .addOption(genWatchEditorXmlOption)
    .action(genAction);

  program.command('watch')
    .alias('w')
    .description('jetbrains file-watchers core')
    .helpOption('-h, --help', '显示帮助')
    .argument('<path>', '文件路径')
    .argument('<encode>', '文件编码')
    .addOption(watchDateOptions)
    .action((path, encode, options) => {
      logger.debug(path, encode, options);
      if (options.date) {
        watchDateAction(path, encode, options.date);
      }
      if (options.editor) {
        logger.debug('watch editor');
      }
    });

  program.showSuggestionAfterError();
  await program.parseAsync(argv);
};

main()
  .catch((err) => {
    if (err instanceof CommanderError && err.exitCode === 0) {
      logger.info('fw exit');
    } else {
      logger.error(err);
    }
  });

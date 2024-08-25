import container from 'utils/logger';
import { Option } from 'commander';
import fileUpdate from 'utils/file-update';

const logger = container.get('fw');

export const watchEditorOption = new Option('--editor <options...>', 'editor参数 <pattern, username>');

export const watchEditorAction = (filePath:string, encoding: string, options: any) => {
  if (options.length < 2) {
    throw new Error('watch editor options error');
  } else {
    logger.debug('options', options);
    fileUpdate(filePath, encoding, options[0], `$1${options[1]}`);
  }
};

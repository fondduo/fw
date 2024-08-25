import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import container from 'utils/logger';
import { Option } from 'commander';
import fileUpdate from 'utils/file-update';

dayjs.extend(customParseFormat);
const logger = container.get('fw');

export const watchDateOptions = new Option('--date <options...>', 'watch date <pattern, format>');

export const watchDateAction = (filePath:string, encoding: string, options: any) => {
  if (options.length < 2) {
    throw new Error('watch date options error');
  } else {
    logger.debug('options', options);
    const date = dayjs().format(options[1]);
    fileUpdate(filePath, encoding, options[0], `$1${date}`);
  }
};

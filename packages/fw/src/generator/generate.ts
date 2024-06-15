import { Option, program } from 'commander';
import type { GenOptions } from '@fondduo/types';
import { handleQuestions } from './questions';

export const genWatchDateXmlOption = new Option('--date <date-formatter>', '配置watch-date')
  .conflicts([
    'all',
  ]);
export const genWatchEditorXmlOption = new Option('--editor <editor>', '配置watch-editor')
  .conflicts([
    'all',
  ]);

export const genAllXmlOption = new Option('-a, --all', '生成全部xml配置');
export const genAction = (options: GenOptions) => {
  console.log(options);
  handleQuestions(options, program.opts());
};

export default {
  genAllXmlOption,
  genWatchDateXmlOption,
  genWatchEditorXmlOption,
  genAction,
};

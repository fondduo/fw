import { Option } from 'commander';
import type {
  GenDateParams, GenEditorParams, GenOptions, GenQuestions,
} from '@fondduo/types';
import container from 'utils/logger';
import inquirer from 'inquirer';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import template from 'gen/template';
import * as os from 'os';
import dayjsLocales from './locale.json';

dayjs.extend(localeData);
dayjs.extend(localizedFormat);
const logger = container.get('fw');

const importDayjsLocale = (locale: string) => import(`dayjs/locale/${locale}.js`);
export const genWatchDateXmlOption = new Option('--date [options...]', '配置watch-date')
  .conflicts([
    'all',
  ]);
export const genWatchEditorXmlOption = new Option('--editor [options...]', '配置watch-editor')
  .conflicts([
    'all',
  ]);

export const genAllXmlOption = new Option('-a, --all', '生成全部xml配置');

const getDateParams = (params: GenDateParams) => `--date &quot;${params.pattern}&quot; &quot;${params.format}&quot;`;

const getEditorParams = (params: GenEditorParams) => `--editor &quot;${params.pattern}&quot; &quot;${params.editor}&quot;`;

const watchDateQuestions = async () => {
  const params: GenDateParams = {
    pattern: '',
    format: '',
  };
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'pattern',
      message: 'input date pattern',
      default: '(@update-at: )(.*)',
    },
    {
      type: 'confirm',
      name: 'custom',
      message: 'use locale formatter',
      default: false,
    },
  ]);
  params.pattern = answers.pattern;
  if (answers.custom) {
    const formatAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'format',
        message: 'input date formatter',
        default: 'YYYY-MM-DD HH:mm:ss',
      },
    ]);
    params.format = formatAnswers.format;
  } else {
    const localeAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'locale',
        message: 'choose dayjs locale',
        choices: dayjsLocales.map((l) => ({
          name: l.name.trim(),
          value: l.key,
        })),
      },
    ]);
    await importDayjsLocale(localeAnswers.locale);
    dayjs.locale(localeAnswers.locale);
    const testTime = dayjs('1949-10-01 14:00:00');
    const longFormats = [
      'LT', 'LTS', 'L', 'LL', 'LLL', 'LLLL', 'l', 'll', 'lll', 'llll',
    ];
    const formatChoices = longFormats.map((l) => ({
      name: testTime.format(l),
      value: dayjs.localeData().longDateFormat(l),
    }));
    const formatAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'format',
        message: 'choose time formatter',
        choices: formatChoices,
      },
    ]);
    params.format = formatAnswers.format;
  }
  return getDateParams(params);
};

const watchEditorQuestions = async () => {
  const params: GenEditorParams = {
    pattern: '',
    editor: '',
  };
  const { username } = os.userInfo();
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'pattern',
      message: 'input editor pattern',
      default: '(@last-editor: )(.*)',
    },
    {
      type: 'input',
      name: 'editor',
      message: 'input editor',
      default: username,
    },
  ]);
  params.pattern = answers.pattern;
  params.editor = answers.editor;
  return getEditorParams(params);
};

const genQuestions = async () => {
  const params: string[] = [];
  const answers:GenQuestions = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'watchers',
      message: '选择需要的watcher:',
      choices: [
        { name: 'watch date', value: 1 },
        { name: 'watch editor', value: 2 },
      ],
    },
  ]);
  if (answers.watchers.length <= 0) {
    logger.error('select at least 1 watcher');
  }
  if (answers.watchers.includes(1)) {
    params.push(await watchDateQuestions());
  }
  if (answers.watchers.includes(2)) {
    params.push(await watchEditorQuestions());
  }
  return params;
};

export const genAction = async (options: GenOptions) => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'ext',
      message: 'watch file ext',
      default: '*',
    },
  ]);

  const params :string[] = [];
  if (options.all) {
    params.push(await watchDateQuestions());
    params.push(await watchEditorQuestions());
  }
  if (options.date) {
    if (options.date instanceof Array) {
      params.push(getDateParams({
        pattern: options.date[0],
        format: options.date[1],
      }));
    } else {
      params.push(await watchDateQuestions());
    }
  }
  if (options.editor) {
    if (options.editor instanceof Array) {
      params.push(getEditorParams({
        pattern: options.editor[0],
        editor: options.editor[1],
      }));
    } else {
      params.push(await watchEditorQuestions());
    }
  }
  if (Object.keys(options).length === 0) {
    params.push(...await genQuestions());
  }

  const xml = template('fw-watcher', params.join(' '), answers.ext);
  logger.debug(xml);
};

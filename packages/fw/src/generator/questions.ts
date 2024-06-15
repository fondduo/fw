import inquirer from 'inquirer';
import type { Question } from '@fondduo/types';

export function handleQuestions(params: object, options: object) {
  console.log('handleQuestion', params, options);
  inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'configList',
        prefix: '',
        message: '选择需要的配置:',
        choices: [
          { name: '日期替换', value: 1 },
          { name: '作者替换', value: 2 },
        ],
      },
    ])
    .then((answers: Question) => {
      console.log(answers);
    })
    .catch((error: unknown) => {
      console.error(error);
    });
}

export default {
  handleQuestions,
};

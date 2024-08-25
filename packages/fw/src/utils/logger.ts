import winston from 'winston';
import { SPLAT } from 'triple-beam';
import chalk from 'chalk';

const { format } = winston;

const container = new winston.Container();

const levelTagColor = (level: string) => {
  switch (level) {
    case 'debug':
      return chalk.bold;
    case 'info':
      return chalk.bgHex('#1778BD').bold;
    case 'warn':
      return chalk.bgHex('#A87B00').bold;
    case 'error':
      return chalk.bgHex('#B82421').bold;
    default:
      return chalk.bgHex('#006E6E').bold;
  }
};

const levelMessageColor = (level: string) => {
  switch (level) {
    case 'debug':
      return chalk.hex('#4FC414');
    case 'info':
      return chalk.hex('#1FB0FF');
    case 'warn':
      return chalk.hex('#E5BF00');
    case 'error':
      return chalk.hex('#F97583');
    default:
      return chalk.hex('#00E5E5');
  }
};

const logPrefix = (info: winston.Logform.TransformableInfo) => `${info.timestamp} ${levelTagColor(info.level)(`[${info.level}]`)}:\t`;

const jsonPretty = (json: any, isFirst: boolean) => {
  const jsonString = JSON.stringify(json, null, 2);
  return jsonString.split('\n').map((line, index) => `${
    (isFirst && index === 0) ? '' : '\t\t\t\t'
  }${line}`).join('\n');
};

const isObject = (data: any) => typeof data === 'object';

const splatDisplay = (info: winston.Logform.TransformableInfo) => `,${
  info[SPLAT].map(
    (s: any) => `\n${
      levelMessageColor(info.level)(
        isObject(s) ? `${jsonPretty(s, false)}` : `\t\t\t\t${s}`,
      )}`,
  ).join(',')
}`;

const betterDisplay = winston.format.printf((info) => {
  let display = `${logPrefix(info)}${levelMessageColor(info.level)(isObject(info.message) ? `${jsonPretty(info.message, true)}` : info.message)}`;
  if (info[SPLAT]) {
    display += splatDisplay(info);
  }
  if (info.stack) {
    display += `\n${info.stack}`;
  }
  return display;
});

container.add('fw', {
  level: 'warn',
  format: format.combine(
    format.json(),
    format.errors({ stack: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    betterDisplay,
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

export default container;

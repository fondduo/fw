import fs from 'fs';

export default (filePath:string, encoding: string, pattern: string, replaceValue: string) => {
  const source = fs.readFileSync(filePath, {
    encoding,
  });
  let sourceStr = source.toString();
  const reg = new RegExp(pattern);
  if (reg.test(sourceStr)) {
    sourceStr = sourceStr.replace(reg, replaceValue);
  }
  fs.writeFileSync(filePath, sourceStr, { encoding });
};

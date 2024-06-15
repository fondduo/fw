import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

try {
  const fileDir = process.argv[2];
  const fileName = process.argv[3];
  const fileEncode = process.argv[4];
  const fileExt = process.argv[5];
  const filePath = path.join(fileDir, fileName);

  if (!fileDir.includes('scripts')) {
    console.log(`path: ${filePath}, encode: ${fileEncode}, ext: ${fileExt}`);

    const source = fs.readFileSync(filePath, {
      encoding: fileEncode,
    });
    let sourceStr = source.toString();
    const dateMatch = sourceStr.match(/(@update-at: )(.*)/);
    const time = dateMatch ? dateMatch[0] : false;

    const date = dayjs().format('YYYY-MM-DD HH:mm:ss');

    if (time) {
      sourceStr = sourceStr.replace(time, `@update-at: ${date}`);
    }

    fs.writeFileSync(filePath, sourceStr, { encoding: fileEncode });
  }
} catch (error) {
  console.error(error);
}

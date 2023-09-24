import { readdirSync, lstatSync } from 'fs';
import { join, sep } from 'path';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';

function collectInputFiles(
  basePath = `src${sep}rendering${sep}public${sep}js${sep}pages`
) {
  const files = readdirSync(basePath);
  return files.reduce((acc, file) => {
    const filePath = join(basePath, file);
    if (lstatSync(filePath).isDirectory()) {
      return {
        ...acc,
        ...collectInputFiles(filePath)
      };
    } else {
      return {
        ...acc,
        [filePath
          .replace(`src${sep}rendering${sep}public${sep}js${sep}`, '')
          .replace('.js', '')]: filePath
      };
    }
  }, {});
}

const input = collectInputFiles();
console.log(input);

export default {
  input,
  output: {
    dir: 'dist/rendering/public/js',
    format: 'es'
  },
  plugins: [
    terser(),
    copy({
      targets: [
        { src: 'src/rendering/views', dest: 'dist/rendering' },
        { src: 'src/rendering/partials', dest: 'dist/rendering' },
        { src: 'src/rendering/public/icons', dest: 'dist/rendering/public' }
      ]
    })
  ]
};

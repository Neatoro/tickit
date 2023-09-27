import { readdirSync, lstatSync } from 'fs';
import { join, sep } from 'path';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';

const jsBasePath = join('src', 'rendering', 'public', 'js');

function collectInputFiles(filePath) {
  if (lstatSync(filePath).isDirectory()) {
    const files = readdirSync(filePath);
    return files.reduce((acc, file) => {
      const inputFiles = collectInputFiles(join(filePath, file));
      return {
        ...acc,
        ...inputFiles
      };
    }, {});
  } else {
    return {
      [filePath.replace(jsBasePath, '').replace('.js', '').substring(1)]:
        filePath
    };
  }
}

const input = {
  ...collectInputFiles(join(jsBasePath, 'pages')),
  ...collectInputFiles(join(jsBasePath, 'dialogs'))
};

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

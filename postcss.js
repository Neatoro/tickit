const fs = require('fs');
const postcss = require('postcss');
const atImport = require('postcss-import');
const path = require('path');
const cssnano = require('cssnano');

const entry = 'src/rendering/public/css/main.css';
const out = 'dist/rendering/public/css/main.css';

const code = fs.readFileSync(entry, 'utf-8');

postcss([cssnano()])
  .use(atImport())
  .process(code, {
    from: entry
  })
  .then((result) => {
    const outDir = path.dirname(out);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(out, result.css);
  });

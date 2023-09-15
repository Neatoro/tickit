const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');

fs.cpSync(
    path.resolve(
        process.cwd(),
        'src',
        'rendering',
        'public'
    ),
    path.resolve(
        process.cwd(),
        'dist',
        'rendering',
        'public'
    ),
    { recursive: true }
);

fs.cpSync(
    path.resolve(
        process.cwd(),
        'src',
        'rendering',
        'views'
    ),
    path.resolve(
        process.cwd(),
        'dist',
        'rendering',
        'views'
    ),
    { recursive: true }
);

const { devDependencies, scripts, ...rest } = packageJson;

fs.writeFileSync(
    path.resolve(process.cwd(), 'dist', 'package.json'),
    JSON.stringify({ ...rest, main: 'index.js' }, null, 2)
);

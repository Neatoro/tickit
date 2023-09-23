const fs = require('fs');
const path = require('path');
const waitPort = require('wait-port');
const { spawn } = require('child_process');

async function ensureFileExists(filePath) {
  try {
    await fs.stat(filePath);
  } catch {
    await fs.promises.writeFile(filePath, '');
  }
}

const colorRegex =
  /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

module.exports = async function startServer(context, config, port) {
  const logPath = path.resolve(__dirname, '..', 'logs', context);
  const outPath = path.resolve(logPath, 'out.txt');
  const errPath = path.resolve(logPath, 'err.txt');

  await fs.promises.mkdir(logPath, { recursive: true });

  await ensureFileExists(outPath);
  await ensureFileExists(errPath);

  const stdoutStream = fs.createWriteStream(outPath);
  const stderrStream = fs.createWriteStream(errPath);

  const server = spawn('node', ['dist/index.js', '--config=' + config], {
    cwd: process.cwd()
  });

  server.stdout.on('data', (data) => {
    stdoutStream.write(data.toString().replace(colorRegex, ''));
  });

  server.stderr.on('data', (data) => {
    stderrStream.write(data.toString().replace(colorRegex, ''));
  });

  server.on('close', () => {
    stdoutStream.close();
    stderrStream.close();
  });

  await waitPort({
    host: 'localhost',
    port
  });

  return server;
};

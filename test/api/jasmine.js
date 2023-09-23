const Jasmine = require('jasmine');
const JasmineConsoleReporter = require('jasmine-console-reporter');
const jasmine = new Jasmine();

const startServer = require('../common/startServer');

jasmine.loadConfig({
  spec_dir: 'test/api/spec',
  spec_files: ['**/*[sS]pec.?(m)js'],
  helpers: ['helpers/**/*.?(m)js'],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true
  }
});

const reporter = new JasmineConsoleReporter({
  colors: 1,
  cleanStack: 1,
  verbosity: 4,
  listStyle: 'indent',
  timeUnit: 'ms',
  timeThreshold: { ok: 500, warn: 1000, ouch: 3000 },
  activity: true,
  emoji: true,
  beep: true
});
jasmine.env.clearReporters();
jasmine.addReporter(reporter);

(async () => {
  const server = await startServer(
    'api',
    'test/api/configuration/config.yaml',
    5000
  );
  await jasmine.execute();
  server.kill();
})();

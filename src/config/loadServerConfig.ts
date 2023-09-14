import { Logger } from '@nestjs/common';
import { readFile, stat } from 'fs/promises';
import { dirname, resolve } from 'path';
import * as YAML from 'yaml';
import yargs from 'yargs';

const logger = new Logger('loadServerConfig');

async function loadYAML(path) {
  try {
    await stat(path);
    const configContent = await readFile(path, 'utf-8');
    const yaml = YAML.parse(configContent);

    return yaml;
  } catch {
    throw new Error(
      `${path} not found`
    );
  }
}

async function loadProjects({ basePath, config }) {
  const projects = [];
  for (const project of config.projects) {
    if (project.name) {
      projects.push(project);
    } else {
      const path = resolve(basePath, project + '.yaml');
      logger.log(`Loading project configuration ${path}`);

      const projectConfig = await loadYAML(path);
      projects.push(projectConfig);
    }
  }

  return projects;
}

export default async () => {
  const argv = yargs(process.argv).argv;

  if (!argv.config) {
    throw new Error('No config parameter passed');
  }

  logger.log(`Loading config ${argv.config}`);
  const path = resolve(process.cwd(), argv.config);

  try {
    const config = await loadYAML(path);

    return {
      ...config,
      projects: await loadProjects({ basePath: dirname(path), config })
    };
  } catch (e) {
    throw e;
  }
};

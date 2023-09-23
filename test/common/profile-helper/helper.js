const sqlite = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs/promises');

class ProfileHelper {
  constructor(context) {
    const dbPath =
      process.env.DATABASE_PATH ||
      path.resolve(process.cwd(), 'test', context, 'test.db');
    this.db = new sqlite.Database(dbPath);
  }

  _exec(query) {
    return new Promise((resolve, reject) => {
      this.db.exec(query, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async cleanSetup() {
    await this._exec('DELETE FROM field_values;');
    await this._exec('DELETE FROM ticket;');
  }

  async apply(profileName) {
    const profile = require(`./profiles/${profileName}.json`);
    const database = profile.database;
    const tables = Object.keys(database);

    for (const table of tables) {
      const entries = database[table];
      for (const entry of entries) {
        const fields = Object.keys(entry).join(', ');
        const values = Object.values(entry).map(JSON.stringify).join(', ');

        const query = `INSERT INTO ${table} (${fields}) VALUES (${values});`;
        await this._exec(query);
      }
    }
  }

  close() {
    this.db.close();
  }
}

module.exports = ProfileHelper;

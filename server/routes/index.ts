import fs from 'fs';
import { Application } from 'express';

const filesystem = (app: Application) => {
  // API routes
  fs.readdirSync(__dirname + '/api/').forEach((file) => {
    require(`./api/${file.substr(0, file.indexOf('.'))}`)(app);
  });

}

export default filesystem;
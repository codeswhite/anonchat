// Copy this file as config.js in the same folder, with the proper database connection URI.

const remote = "127.0.0.1";

export default {
  db: `mongodb://${remote}/anonchat-production?retryWrites=true&w=majority`,
  db_dev: `mongodb://${remote}/anonchat-dev?retryWrites=true&w=majority`,
};

// Copy this file as config.js in the same folder, with the proper database connection URI.

const remote =
  process.env.LOCAL_MONGODB || false ? "localhost" : "git.ortomorrow.com";

export default {
  db: `mongodb://${remote}/ortomorrow-production?retryWrites=true&w=majority`,
  db_dev: `mongodb://${remote}/ortomorrow-dev?retryWrites=true&w=majority`,
};

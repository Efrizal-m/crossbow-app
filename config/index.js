let config = {};
config.mongoConnection = "mongodb+srv://hssStagingUser:birdwatchlalala@staging-quickey.qapmg.mongodb.net/cbStaging?retryWrites=true&w=majority"
config.whitelist = [
  undefined,
  "http://localhost:4001"
];
module.exports = config;
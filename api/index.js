const { getApp } = require('../dist/serverless');

module.exports = async (req, res) => {
  const app = await getApp();
  return app(req, res);
};

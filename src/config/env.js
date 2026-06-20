const path = require('path');
const dotenv = require('dotenv');

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  dotenv.config({ path: envPath });
}

function getEnv(name, defaultValue) {
  return process.env[name] || defaultValue;
}

loadEnv();

module.exports = {
  loadEnv,
  PORT: parseInt(getEnv('PORT', '5000'), 10),
  MONGO_URI: getEnv('MONGO_URI', 'mongodb://localhost:27017/publisher_dashboard'),
  JWT_SECRET: getEnv('JWT_SECRET', 'change_this_secret'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:5173'),
  ADMIN_EMAIL: getEnv('ADMIN_EMAIL', 'admin@example.com'),
  ADMIN_PASSWORD: getEnv('ADMIN_PASSWORD', 'Admin@1234')
};

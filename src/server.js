const app = require('./app');
const { connectDatabase } = require('./config/db');
const { loadEnv } = require('./config/env');
const { PORT } = require('./config/env');

loadEnv();
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });

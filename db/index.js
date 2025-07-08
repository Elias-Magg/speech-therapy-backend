// db/index.js
const { Pool } = require('pg'); //group of reusable database connections.
require('dotenv').config();
/*It automatically looks for a file named .env in the root of your project directory 
that is, wherever you’re running your node or npm start command from. */

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'speech_therapy',
  password: process.env.DB_PASS || 'postgres',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
/* In Node.js, every file is treated as a module.
If you want to share something (like a function, variable, or object) with other files, you use module.exports.*/

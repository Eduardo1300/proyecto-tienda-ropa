const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('DB_HOST:', process.env.DB_HOST);

require('./dist/main.js');

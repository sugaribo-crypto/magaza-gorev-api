const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'requests.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

function logger(req, res, next) {
  const time = new Date().toISOString();                    
  const line = `[${time}] ${req.method} ${req.originalUrl}`; 

  console.log(line);                         
  fs.appendFileSync(LOG_FILE, line + '\n');  

  next(); 
}

module.exports = logger;
const fs = require('fs');    
const path = require('path'); 

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function readDB() {
  const text = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(text);                        
}

function writeDB(data) {
  const text = JSON.stringify(data, null, 2);
  fs.writeFileSync(DB_PATH, text);
}

function getNextId(list) {
  if (list.length === 0) return 1;
  const ids = list.map((item) => item.id);
  return Math.max(...ids) + 1;
}

module.exports = { readDB, writeDB, getNextId };
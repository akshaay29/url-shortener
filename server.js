const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'urls.json');

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}), 'utf8');
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function generateCode(n = 6) {
  return crypto.randomBytes(Math.ceil(n / 2)).toString('hex').slice(0, n);
}

app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') return res.status(400).json({ error: 'url required' });
  // basic validation
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'invalid url' });
  }

  const db = readDb();
  // check if exists
  for (const code in db) {
    if (db[code].original === url) {
      return res.json({ short: `${req.protocol}://${req.get('host')}/${code}`, code });
    }
  }

  let code;
  do {
    code = generateCode(6);
  } while (db[code]);

  db[code] = { original: url, createdAt: new Date().toISOString() };
  writeDb(db);

  res.json({ short: `${req.protocol}://${req.get('host')}/${code}`, code });
});

app.get('/api/list', (req, res) => {
  const db = readDb();
  res.json(db);
});

app.get('/:code', (req, res) => {
  const db = readDb();
  const entry = db[req.params.code];
  if (!entry) return res.status(404).send('Not found');
  res.redirect(entry.original);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

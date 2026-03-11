# Minimal URL Shortener

This is a minimal URL shortener built with Node.js and Express. It stores mappings in a JSON file under `data/urls.json`.

Prerequisites
- Node.js 14+ installed

Install and run

```powershell
cd "c:\Users\gupta\OneDrive\Desktop\Practice\url-               shortener"
npm install
npm start
```

Open http://localhost:3000 in your browser.

API
- POST /api/shorten { url } -> { short, code }
- GET /:code -> redirect to original URL
- GET /api/list -> returns JSON map of codes to entries

Push to GitHub
1. git init
2. git add .
3. git commit -m "Initial url shortener"
4. gh repo create <name> --public --source=. --push (or create repo on GitHub and add remote)

Notes
- This is a simple demo. For production use a database and add rate-limiting, authentication, and collision-resistant codes.
 

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

function connectToDbWithRetry() {
  db.connect(err => {
    if (err) {
      console.error('DB connection error, retrying in 5 seconds:', 
err.message);
      setTimeout(connectToDbWithRetry, 5000);
      return;
    }
    console.log('Connected to MySQL');
  });
}

connectToDbWithRetry();

app.get('/', (req, res) => {
  res.send('Hello from my-project-be backend!');
});

app.get('/api/items', (req, res) => {
  const query = 'SELECT * FROM items'; 
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching items from database');
      return;
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});      




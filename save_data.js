// save_data.js 
// npm install express mysql2 body-parser bcrypt cors

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5500;

const corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'host.docker.internal', // For Docker Desktop on Windows or Mac
  user: 'root',
  password: 'root',
  database: 'firsttest',
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define route handlers for each HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/teacher-login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teacher-login.html'));
});

app.get('/teacher-register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teacher-register.html'));
});

app.get('/student-login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student-login.html'));
});

app.get('/student-register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student-register.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.post('/register-teacher', (req, res) => {
  console.log('Teacher registration request received:', req.body);

  const { name, email, password, city, pincode, subject, uid } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO teachers (name, email, password, city, pincode, subject, uid) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [name, email, hashedPassword, city, pincode, subject, uid];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
      return;
    }
    console.log('Teacher data inserted successfully');
    res.status(200).json({ success: true });
  });
});

app.post('/login-teacher', (req, res) => {
  console.log('Teacher login request received:', req.body);

  const { email, password } = req.body;

  const sql = 'SELECT * FROM teachers WHERE email = ?';
  const values = [email];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const storedPassword = results[0].password;
    if (bcrypt.compareSync(password, storedPassword)) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  });
});

app.post('/getTeacherDetails', (req, res) => {
  const { uid } = req.body;

  const sql = 'SELECT * FROM teachers WHERE uid = ?';
  const values = [uid];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ success: false, error: 'No matching teacher found' });
      return;
    }

    const teacherDetails = {
      name: results[0].name,
      email: results[0].email,
      city: results[0].city,
      subject: results[0].subject,
      uid: results[0].uid,
    };

    res.status(200).json({ success: true, teacherDetails: [teacherDetails] });
  });
});

app.post('/save_student', (req, res) => {
  console.log('Student registration request received:', req.body);

  const { name, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO students (name, email, password) VALUES (?, ?, ?)';
  const values = [name, email, hashedPassword];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
      return;
    }
    console.log('Student data inserted successfully');
    res.status(200).json({ success: true });
  });
});

app.post('/login-student', (req, res) => {
  console.log('Student login request received:', req.body);

  const { email, password } = req.body;

  const sql = 'SELECT * FROM students WHERE email = ?';
  const values = [email];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const storedPassword = results[0].password;
    if (bcrypt.compareSync(password, storedPassword)) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  });
});

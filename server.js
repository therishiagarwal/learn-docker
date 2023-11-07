// Server.js

const express = require('express');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: 'your-rds-endpoint',
  user: 'your-rds-username',
  password: 'your-rds-password',
  database: 'your-database-name'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.use(express.json());

app.post('/getTeacherDetails', (req, res) => {
    const { uid } = req.body;
  
    const sql = `SELECT * FROM teachers WHERE uid = ?`;
    const values = [uid];
  
    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error fetching teacher details:', error);
        res.json({ success: false });
      } else {
        if (results.length > 0) {
          const teacherDetails = {
            name: results[0].name,
            email: results[0].email,
            city: results[0].city,
            subject: results[0].subject,
            uid: results[0].uid
          };
          res.json({ success: true, teacherDetails });
        } else {
          res.json({ success: false });
        }
      }
    });
  });
  
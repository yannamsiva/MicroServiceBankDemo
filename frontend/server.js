const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/dashboard.html'));
});

app.get('/transactions', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/transactions.html'));
});

app.get('/transfer', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/transfer.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/profile.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
}); 
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Define views directory
const viewsDir = path.join(__dirname, 'views');

// Routes
app.get('/', (req, res) => res.sendFile(path.join(viewsDir, 'index.html')));
app.get('/nosotros', (req, res) => res.sendFile(path.join(viewsDir, 'nosotros.html')));
app.get('/servicios', (req, res) => res.sendFile(path.join(viewsDir, 'servicios.html')));
app.get('/proyectos', (req, res) => res.sendFile(path.join(viewsDir, 'proyectos.html')));
app.get('/resenas', (req, res) => res.sendFile(path.join(viewsDir, 'resenas.html')));
app.get('/contacto', (req, res) => res.sendFile(path.join(viewsDir, 'contacto.html')));

// API for reviews
const REVIEWS_FILE = path.join(__dirname, 'data', 'reviews.csv');
if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(REVIEWS_FILE)) fs.writeFileSync(REVIEWS_FILE, 'date,name,rating,comment\n');

// Robust CSV Parsing for 4 columns: date, name, rating, comment
function parseReviewLine(line) {
    const parts = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            parts.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    parts.push(current.trim());
    
    if (parts.length < 4) return null;
    
    const [date, name, rating, comment] = parts;
    return { 
        date, 
        name: name.replace(/^"|"$/g, ''), 
        rating: parseInt(rating), 
        comment: comment.replace(/^"|"$/g, '') 
    };
}

app.get('/api/reviews', (req, res) => {
    try {
        const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
        const lines = data.split('\n').filter(l => l.trim());
        const reviews = lines.slice(1)
            .map(parseReviewLine)
            .filter(r => r !== null);
        res.json(reviews);
    } catch (error) {
        console.error('Error reading reviews:', error);
        res.status(500).json({ error: 'Failed to read reviews' });
    }
});

app.post('/api/reviews', (req, res) => {
    try {
        const { name, rating, comment } = req.body;
        console.log('Received review submission:', { name, rating, comment });
        
        const date = new Date().toISOString().split('T')[0];
        
        // Escape quotes by doubling them
        const safeName = name ? name.replace(/"/g, '""') : 'Anónimo';
        const safeComment = comment ? comment.replace(/"/g, '""') : '';
        
        const line = `${date},"${safeName}",${rating},"${safeComment}"\n`;
        console.log('Writing to CSV:', line);
        
        fs.appendFileSync(REVIEWS_FILE, line);
        console.log('Successfully saved to CSV');
        
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('CRITICAL ERROR saving review:', error);
        res.status(500).json({ error: 'Failed to save review', details: error.message });
    }
});

// API for contacts
const CONTACTS_FILE = path.join(__dirname, 'data', 'contacts.csv');
if (!fs.existsSync(CONTACTS_FILE)) fs.writeFileSync(CONTACTS_FILE, 'date,name,email,message\n');

app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;
        const date = new Date().toISOString().split('T')[0];
        
        const safeName = name ? name.replace(/"/g, '""') : 'Anónimo';
        const safeEmail = email ? email.replace(/"/g, '""') : '';
        const safeMessage = message ? message.replace(/"/g, '""') : '';
        
        const line = `${date},"${safeName}","${safeEmail}","${safeMessage}"\n`;
        fs.appendFileSync(CONTACTS_FILE, line);
        
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Failed to save contact' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`SERVER ACTIVE AT http://localhost:${PORT}`);
    console.log(`Views path: ${viewsDir}`);
    fs.readdirSync(viewsDir).forEach(f => console.log(` - Found view: ${f}`));
});

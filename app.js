const express = require('express');
const app = express();
const path = require('path'); // Import the path module
const mongoose = require('mongoose');
app.use(express.json());

const bookSchema = mongoose.Schema;

const book = new bookSchema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    published_year: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', book);

mongoose
    .connect('mongodb://localhost:27017/book')
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error('Connection Failed!', err);
    })

// Define the path to the public directory
const publicDirectoryPath = path.join(__dirname, 'public');

// Set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/',(req,res)=>{
    res.sendFile(path.join(publicDirectoryPath,'index.html'))
})
app.get('/books/addBook', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'addBook.html'));
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.log('Error fetching books');
        res.status(500).send(err);
    }
});

app.post('/books/addBook', async (req, res) => {
    try {
        const { title, author, published_year } = req.body;
        const newBook = new Book({
            title,
            author,
            published_year
        });

        const savedBook = await newBook.save();
        res.status(201).json({
            message: `${savedBook.title} added successfully`,
            book: savedBook
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening to localhost:${PORT}`)
});

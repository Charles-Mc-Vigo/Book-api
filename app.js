const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

const bookSchema = mongoose.Schema;

const book = new bookSchema({
    title:{type:String,required:true},
    author:{type:String,required:true},
    publish_year:{type:Number,required:true},
    createdAt:{type:Date,default:Date.now}
})

const Book = mongoose.model('Book',book);

mongoose
    .connect('mongodb://localhost:27017/book')
    .then(()=>{
        console.log('Connected to MongoDB')
    })
    .catch((err)=>{
        console.error('Connection Failed!',err);
    })

app.get('/',(req,res)=>{
    console.log('Welcome to Book API');
    res.send('Welcome to Book API')
})

app.get('/books', async (req,res)=>{
    try{
        const books = await Book.find();
        res.json(books);
    }catch(err){
        console.log('Error fetching books');
        res.status(500).send(err);
    }
})

app.post('/books/addBook', async (req, res) => {
    try {
        const { title, author, publish_year } = req.body;
        const newBook = new Book({
            title,
            author,
            publish_year
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
app.listen(PORT,()=>{
    console.log(`Listening to localhost:${PORT}`)
});
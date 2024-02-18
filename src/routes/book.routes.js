// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo libro
router.post('/', async (req, res) => {
  const { title, author, genre } = req.body;
  if (!title || !author || !genre) {
    return res.status(400).json({ message: "Se requieren campos 'title', 'author' y 'genre'." });
  }

  const book = new Book({
    title,
    author,
    genre
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener un libro por su ID
router.get('/:id', getBook, (req, res) => {
  res.json(res.book);
});

// Actualizar un libro por su ID
router.put('/:id', getBook, async (req, res) => {
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar parcialmente un libro por su ID
router.patch('/:id', getBook, async (req, res) => {
  if (!req.body.title && !req.body.author && !req.body.genre) {
    return res.status(400).json({ message: "Se requiere al menos un campo 'title', 'author' o 'genre' para actualizar." });
  }

  if (req.body.title != null) {
    res.book.title = req.body.title;
  }
  if (req.body.author != null) {
    res.book.author = req.body.author;
  }
  if (req.body.genre != null) {
    res.book.genre = req.body.genre;
  }
  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un libro por su ID
router.delete('/:id', getBook, async (req, res) => {
  try {
    await res.book.remove();
    res.json({ message: 'Libro eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener un libro por su ID
async function getBook(req, res, next) {
  let book;
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ message: 'ID de libro no válido' });
  }

  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'No se encontró el libro' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.book = book;
  next();
}

module.exports = router;

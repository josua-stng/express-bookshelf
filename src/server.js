import express from 'express';
import { nanoid } from 'nanoid';
import books from './books.js';

const app = express();
const PORT = 3000;
const host = 'localhost';
app.use(express.json());

// Post book or add book
app.post('/book/add', (req, res) => {
  const {
    names,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
  } = req.body;
  if (names === undefined) {
    return res.status(404).send({
      status: 404,
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(404).send({
      status: 404,
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }
  const id = nanoid(16);
  const newBook = {
    id,
    names,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    res.json({
      status: 200,
      error: null,
      data: {
        bookId: id,
      },
    });
  } else {
    res.json({
      status: 404,
      message: 'Gagal menambahkan buku',
    });
  }
});

// Get All book
app.get('/books', (req, res) => {
  let filteredBooks = books;
  if (filteredBooks) {
    res.json({
      status: 200,
      message: 'Buku berhasil ditampilkan',
      books: filteredBooks.map((book) => ({
        id: book.id,
        author: book.author,
        publisher: book.publisher,
      })),
    });
  }
});

// Get book with Id
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    res.json({
      status: 200,
      message: 'Buku berhasil ditampilkan',
      data: {
        book,
      },
    });
  } else {
    res.json({
      status: 404,
      message: 'Id tidak ditemukan',
    });
  }
});

// Put book with Id
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const {
    names,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
  } = req.body;
  if (!names) {
    return res.status(400).send({
      status: 400,
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }
  if (readPage > pageCount) {
    return res.status(400).send({
      status: 400,
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }
  const updateBookIndex = books.findIndex((b) => b.id === id);

  if (updateBookIndex === -1) {
    res.json({
      status: 404,
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }
  books[updateBookIndex] = {
    ...books[updateBookIndex],
    names,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
  };
  if (updateBookIndex) {
    return res.status(200).send({
      status: 200,
      message: 'Buku berhasil diperbarui',
    });
  }
});

app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    res.json({
      status: 200,
      message: 'Buku berhasil dihapus',
    });
  } else {
    res.json({
      status: 400,
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Your server running at http://${host}:${PORT}`);
});

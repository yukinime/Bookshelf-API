import { nanoid } from 'nanoid';
import books from './books.js';

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      // Validasi jika nama buku tidak diisi
      if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
      }

      // Validasi jika readPage lebih besar dari pageCount
      if (readPage > pageCount) {
        return h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
      }

      const id = nanoid(); // Menghasilkan ID unik untuk buku
      const finished = pageCount === readPage; // Menentukan apakah buku sudah selesai dibaca
      const insertedAt = new Date().toISOString(); // Menentukan waktu saat buku ditambahkan
      const updatedAt = insertedAt; // Waktu update awal sama dengan waktu insert

      const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      };

      books.push(newBook); // Menambahkan buku ke dalam array books

      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      }).code(201);
    },
  },
  {
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
      return h.response({
        status: 'success',
        data: {
          books: books.map(({ id, name, publisher }) => ({ id, name, publisher })), // Mengembalikan hanya ID, nama, dan penerbit
        },
      }).code(200);
    },
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: (request, h) => {
      const { id } = request.params; // Mengambil ID dari parameter URL
      const book = books.find((b) => b.id === id); // Mencari buku berdasarkan ID

      if (!book) {
        return h.response({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        }).code(404);
      }

      return h.response({
        status: 'success',
        data: {
          book, // Mengembalikan data buku yang ditemukan
        },
      }).code(200);
    },
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: (request, h) => {
      const { id } = request.params; // Mengambil ID dari parameter URL
      const index = books.findIndex((b) => b.id === id); // Mencari indeks buku yang akan diupdate

      if (index === -1) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Buku tidak ditemukan',
        }).code(404);
      }

      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
      }

      if (readPage > pageCount) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
      }

      const updatedAt = new Date().toISOString();

      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: pageCount === readPage,
        reading,
        updatedAt,
      };

      return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      }).code(200);
    },
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: (request, h) => {
      const { id } = request.params; // Mengambil ID dari parameter URL
      const index = books.findIndex((b) => b.id === id); // Mencari indeks buku yang akan dihapus

      if (index === -1) {
        return h.response({
          status: 'fail',
          message: 'Buku gagal dihapus. Buku tidak ditemukan',
        }).code(404);
      }

      books.splice(index, 1); // Menghapus buku dari array

      return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      }).code(200);
    },
  },
];

export default routes; // Ekspor default rute

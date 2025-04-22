import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all books.
router.get("/", async (req, res) => {
  try {
    const collection = db.collection("books");
    const { avail } = req.query;

    // Filter by availability if the query parameter is provided
    const query = avail ? { avail: avail === "true" } : {};
    const books = await collection.find(query).project({ id: 1, title: 1 }).toArray();

    res.status(200).send(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Error fetching books");
  }
});

// This section will help you get a single book by id.
router.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("books");
    const query = { id: req.params.id };
    const book = await collection.findOne(query);

    if (!book) res.status(404).send("Book not found");
    else res.status(200).send(book);
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).send("Error fetching book");
  }
});

// This section will help you create a new book.
router.post("/", async (req, res) => {
  try {
    const newBook = {
      id: req.body.id,
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      isbn: req.body.isbn,
      avail: req.body.avail,
      who: req.body.who,
      due: req.body.due,
    };

    const collection = db.collection("books");
    const existingBook = await collection.findOne({ id: newBook.id });

    if (existingBook) {
      res.status(403).send("Book ID already exists");
    } else {
      const result = await collection.insertOne(newBook);
      res.status(201).send(result);
    }
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).send("Error adding book");
  }
});

// This section will help you update a book by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { id: req.params.id };
    const updates = { $set: req.body };

    const collection = db.collection("books");
    const result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      res.status(404).send("Book not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).send("Error updating book");
  }
});

// This section will help you delete a book by id.
router.delete("/:id", async (req, res) => {
  try {
    const query = { id: req.params.id };

    const collection = db.collection("books");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      res.status(404).send("Book not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).send("Error deleting book");
  }
});

export default router;

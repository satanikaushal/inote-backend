const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//get all the notes of the user available on the database /api/notes/fetchallnotes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).send("interanal server error occured"); // if any error occurs in the try block then it will be catched here and will get it in console as well as the resolution
  }
});

//Add a new note using post method api/notes/addnote. login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req); //it will check if there are errors in the passed data from the above parameters
      // if there are errors then return bad request with 400 code and the error as well
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savednote = await note.save();
      res.json(savednote);
    } catch (error) {
      console.log(error);
      res.status(500).send("interanal server error occured"); // if any error occurs in the try block then it will be catched here and will get it in console as well as the resolution
    }
  }
);

//update an existing note PUT: /api/notes/updatenote
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  //create a newNote object
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
  //find the note to be updated and update it
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not Found");
  }
  if (note.user.toString() != req.user.id) {
    return res.status(401).send("Not allowed");
  }
  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json({ note });
});

//endpoint to delete a particular note
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.send("Note deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("interanal server error occured"); // if any error occurs in the try block then it will be catched here and will get it in console as well as the resolution
  }
});

module.exports = router;

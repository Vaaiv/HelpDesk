const express = require("express");
const router = express.Router();
const { createTicket, getMyTickets, getAllTickets, updateTicket, deleteTicket } = require("../Controllers/ticketController");
const { protect, adminOnly } = require("../Controllers/authMiddleware");

router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);
router.get("/all", protect, adminOnly, getAllTickets);
router.put("/:id", protect, adminOnly, updateTicket);
router.delete("/:id", protect, adminOnly, deleteTicket);

module.exports = router;
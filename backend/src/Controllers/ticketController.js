const Ticket = require("../Models/Ticket");

async function createTicket(req, res) {
  const { category, issue, description, priority } = req.body;

  try {
    const ticket = await Ticket.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      category,
      issue,
      description,
      priority: priority || "Medium",
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Ticket creation error:", error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getMyTickets(req, res) {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllTickets(req, res) {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateTicket(req, res) {
  const { status, technicianNotes, priority } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status || ticket.status;
    ticket.technicianNotes = technicianNotes || ticket.technicianNotes;
    ticket.priority = priority || ticket.priority;

    const updatedTicket = await ticket.save();

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteTicket(req, res) {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createTicket, getMyTickets, getAllTickets, updateTicket, deleteTicket };
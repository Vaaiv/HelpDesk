# 🖥️ IT Help Desk - Self Service System

A full-stack MERN web application built for university IT departments. Customers can self-resolve basic IT issues directly on a laptop screen, and escalate complex issues to a technician via ticket submission.

## 🎯 Project Purpose

Built to reduce the workload on IT Help Desk technicians by allowing students/customers to:
- Walk up to a laptop
- Login and select their issue
- Get instant step-by-step solutions for basic problems
- Submit a support ticket for complex issues that need technician help

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router, Axios, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas + MongoDB Compass
- **Authentication:** JWT (JSON Web Tokens) + bcryptjs

## 🗂️ Project Structure
HelpDesk/
├── backend/
│   ├── src/
│   │   ├── Controllers/
│   │   │   ├── authController.js
│   │   │   ├── authMiddleware.js
│   │   │   └── ticketController.js
│   │   ├── db/
│   │   │   └── connectDB.js
│   │   ├── Models/
│   │   │   ├── User.js
│   │   │   └── Ticket.js
│   │   ├── Routes/
│   │   │   ├── authRoutes.js
│   │   │   └── ticketRoutes.js
│   │   └── app.js
│   ├── server.js
│   └── .env
└── frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── HelpFlow.jsx
│   │   ├── MyTickets.jsx
│   │   └── AdminDashboard.jsx
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── vite.config.js
⚙️ Setup Instructions
1. Clone the repository
git clone <your-repo-url>
cd HelpDesk
2. Backend Setup
cd backend
npm install
Create a .env file:
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/helpdesk
JWT_SECRET=your_jwt_secret_key
Run the backend:
npm run dev
3. Frontend Setup
cd frontend
npm install
npm run dev
🔄 How It Works

Customer walks up to the laptop and logs in
Selects their issue category (WiFi, Password, Printer, etc.)
Selects the specific problem they are facing
✅ Basic issue → Step-by-step solution displayed on screen instantly
🔧 Complex issue → Directed to visit IT Help Desk + option to submit a ticket
IT Technician (Admin) logs in to the dashboard to manage all tickets

👥 User Roles
RoleAccessCustomerSelf-service help flow, submit tickets, view own ticketsAdminFull dashboard, update ticket status, add technician notes, delete tickets
🌐 API Endpoints
Auth
MethodEndpointDescriptionPOST/api/auth/registerRegister new userPOST/api/auth/loginLogin user
Tickets
MethodEndpointDescriptionPOST/api/ticketsCreate new ticketGET/api/tickets/myGet my tickets (customer)GET/api/tickets/allGet all tickets (admin only)PUT/api/tickets/:idUpdate ticket (admin only)DELETE/api/tickets/:idDelete ticket (admin only)
📋 IT Issue Categories Covered

🌐 Network / WiFi
🔑 Password & Account
🖨️ Printer Issues
💻 Software / Apps
🔧 Hardware Problems
📧 Email Issues

🚀 Features

JWT Authentication with role-based access control
Self-service knowledge base with step-by-step solutions
Ticket submission for complex issues
Admin dashboard with ticket stats and filters
Update ticket status, priority and add technician notes
Persistent data with MongoDB Atlas
Responsive and clean UI


Just copy everything from the first ` ``` ` to the last ` ``` ` and paste it into your `README.md` file! 👍
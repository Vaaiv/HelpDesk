import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API from "../api";

const categories = [
  { id: "network", label: "Network / WiFi", icon: "🌐" },
  { id: "password", label: "Password & Account", icon: "🔑" },
  { id: "printer", label: "Printer Issues", icon: "🖨️" },
  { id: "software", label: "Software / Apps", icon: "💻" },
  { id: "hardware", label: "Hardware Problem", icon: "🔧" },
  { id: "email", label: "Email Issues", icon: "📧" },
];

const knowledgeBase = {
  network: [
    {
      id: "no-wifi",
      question: "Can't connect to WiFi?",
      selfService: true,
      solution: `1. Make sure WiFi is turned ON on your device.
2. Forget the network and reconnect.
3. Restart your device and try again.
4. Try connecting to USF_WiFi using your USF email and password.
5. Make sure your USF account is active at my.usf.edu.`,
    },
    {
      id: "slow-internet",
      question: "Internet is very slow?",
      selfService: true,
      solution: `1. Move closer to the WiFi access point.
2. Disconnect and reconnect to the WiFi network.
3. Close any unused background apps or downloads.
4. Clear your browser cache.`,
    },
    {
      id: "vpn-issue",
      question: "VPN not connecting?",
      selfService: false,
      escalateMessage: "VPN issues require account-level access. Please visit the IT Help Desk.",
      category: "Network/WiFi",
      priority: "Medium",
    },
  ],
  password: [
    {
      id: "forgot-password",
      question: "Forgot my USF password?",
      selfService: true,
      solution: `1. Go to netid.usf.edu and click Reset Password.
2. Enter your USF email or NetID.
3. Follow the link sent to your recovery email or phone.
4. Create a new password.
5. Log in with your new password at my.usf.edu.`,
    },
    {
      id: "account-locked",
      question: "Account is locked out?",
      selfService: true,
      solution: `1. Wait 15 minutes, accounts auto unlock after multiple failed attempts.
2. Try resetting your password at netid.usf.edu.
3. Make sure CAPS LOCK is off.`,
    },
    {
      id: "mfa-issue",
      question: "MFA / Two-factor not working?",
      selfService: false,
      escalateMessage: "MFA issues require identity verification. Please come to the IT Help Desk with your USF ID.",
      category: "Password & Account",
      priority: "High",
    },
  ],
  printer: [
    {
      id: "printer-offline",
      question: "Printer shows as offline?",
      selfService: true,
      solution: `1. Turn the printer OFF and back ON.
2. Go to Settings → Printers & Scanners → Set as Default.
3. Right click the printer → Cancel all jobs → Try again.
4. Make sure you are connected to the same network as the printer.`,
    },
    {
      id: "printer-not-printing",
      question: "Printer is on but not printing?",
      selfService: true,
      solution: `1. Check if there is a paper jam.
2. Make sure there is paper in the tray.
3. Check ink or toner levels.
4. Restart the Print Spooler from Services.`,
    },
    {
      id: "printer-install",
      question: "Need to install a new printer?",
      selfService: false,
      escalateMessage: "Network printer installation requires IT admin access. Please visit the Help Desk.",
      category: "Printer",
      priority: "Low",
    },
  ],
  software: [
    {
      id: "app-crashing",
      question: "App keeps crashing?",
      selfService: true,
      solution: `1. Close the app completely and reopen it.
2. Restart your computer.
3. Check for updates in the app.
4. Uninstall and reinstall the application.`,
    },
    {
      id: "software-install",
      question: "Need to install new software?",
      selfService: false,
      escalateMessage: "Software installation on university devices requires IT authorization. Please visit the Help Desk.",
      category: "Software/Apps",
      priority: "Medium",
    },
    {
      id: "microsoft-office",
      question: "Microsoft Office not working?",
      selfService: true,
      solution: `1. Sign out of Office and sign back in with your USF email.
2. Run Office repair from Control Panel.
3. Make sure your USF license is active at portal.office.com.`,
    },
  ],
  hardware: [
    {
      id: "wont-turn-on",
      question: "Computer won't turn on?",
      selfService: false,
      escalateMessage: "Hardware power issues require physical inspection. Please bring your device to the IT Help Desk.",
      category: "Hardware",
      priority: "High",
    },
    {
      id: "slow-computer",
      question: "Computer is very slow?",
      selfService: true,
      solution: `1. Restart your computer.
2. Close unused programs from Task Manager.
3. Check for Windows Updates.
4. Run Disk Cleanup on C: drive.
5. Disable unnecessary startup programs.`,
    },
    {
      id: "screen-issues",
      question: "Screen flickering or display issues?",
      selfService: false,
      escalateMessage: "Display hardware issues need technician inspection. Please visit the IT Help Desk.",
      category: "Hardware",
      priority: "Medium",
    },
  ],
  email: [
    {
      id: "cant-send-email",
      question: "Can't send or receive emails?",
      selfService: true,
      solution: `1. Check your internet connection first.
2. Sign out and sign back into your email.
3. Check your Spam or Junk folder.
4. Clear your browser cache and try again.`,
    },
    {
      id: "email-access",
      question: "Can't access USF email at all?",
      selfService: false,
      escalateMessage: "USF email access issues may be account related. Please visit the IT Help Desk with your USF ID.",
      category: "Email",
      priority: "High",
    },
  ],
};

function HelpFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(null);

  function handleCategorySelect(cat) {
    setSelectedCategory(cat);
    setStep("issue");
  }

  function handleIssueSelect(issue) {
    setSelectedIssue(issue);
    if (issue.selfService) {
      setStep("solution");
    } else {
      setStep("escalate");
    }
  }

  async function handleCreateTicket() {
    setLoading(true);
    try {
      const { data } = await API.post("/tickets", {
        category: selectedIssue.category || "Other",
        issue: selectedIssue.question,
        description: description || selectedIssue.escalateMessage,
        priority: selectedIssue.priority || "Medium",
      });
      setTicketCreated(data);
      setStep("ticket-sent");
    } catch (err) {
      alert("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("category");
    setSelectedCategory(null);
    setSelectedIssue(null);
    setDescription("");
    setTicketCreated(null);
  }

  const issues = selectedCategory ? knowledgeBase[selectedCategory.id] : [];

  return (
    <>
      <Navbar />
      <div className="page">

        {step === "category" && (
          <>
            <div className="page-header">
              <h2>👋 Hello, {user?.name}!</h2>
              <p>What kind of IT help do you need today?</p>
            </div>
            <div className="category-grid">
              {categories.map(function(cat) {
                return (
                  <div key={cat.id} className="category-card" onClick={function() { handleCategorySelect(cat); }}>
                    <div className="cat-icon">{cat.icon}</div>
                    <h3>{cat.label}</h3>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === "issue" && (
          <>
            <button className="back-btn" onClick={function() { setStep("category"); }}>
              ← Back
            </button>
            <div className="page-header">
              <h2>{selectedCategory?.icon} {selectedCategory?.label}</h2>
              <p>Select the issue that best describes your problem.</p>
            </div>
            <div className="issue-list">
              {issues.map(function(issue) {
                return (
                  <button key={issue.id} className="issue-btn" onClick={function() { handleIssueSelect(issue); }}>
                    {issue.selfService ? "✅" : "🔧"} {issue.question}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === "solution" && (
          <>
            <button className="back-btn" onClick={function() { setStep("issue"); }}>
              ← Back
            </button>
            <div className="page-header">
              <h2>💡 Try These Steps</h2>
            </div>
            <div className="solution-box">
              <h3>✅ {selectedIssue?.question}</h3>
              <p className="solution-steps">{selectedIssue?.solution}</p>
            </div>
            <div className="card" style={{ marginTop: "1rem", textAlign: "center" }}>
              <p style={{ marginBottom: "1rem" }}>Did this solve your problem?</p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button className="btn btn-primary" onClick={reset}>
                  ✅ Yes, resolved!
                </button>
                <button className="btn btn-danger" onClick={function() {
                  setSelectedIssue({
                    ...selectedIssue,
                    selfService: false,
                    escalateMessage: "Self-service steps did not resolve the issue.",
                    category: selectedIssue.category,
                    priority: "Medium",
                  });
                  setStep("escalate");
                }}>
                  ❌ No, still need help
                </button>
              </div>
            </div>
          </>
        )}

        {step === "escalate" && (
          <>
            <button className="back-btn" onClick={function() { setStep("issue"); }}>
              ← Back
            </button>
            <div className="escalate-box">
              <h3>🔧 Technician Assistance Required</h3>
              <p>{selectedIssue?.escalateMessage}</p>
              <p style={{ fontWeight: 600 }}>Please visit the IT Help Desk or submit a ticket below.</p>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>📝 Submit a Support Ticket</h3>
              <div className="form-group">
                <label>Describe your issue</label>
                <textarea
                  placeholder="Add any extra details..."
                  value={description}
                  onChange={function(e) { setDescription(e.target.value); }}
                />
              </div>
              <button className="btn btn-primary" onClick={handleCreateTicket} disabled={loading}>
                {loading ? "Submitting..." : "🎫 Submit Ticket"}
              </button>
            </div>
          </>
        )}

        {step === "ticket-sent" && (
          <>
            <div className="card" style={{ textAlign: "center", marginTop: "2rem" }}>
              <p style={{ fontSize: "3rem" }}>✅</p>
              <h3>Ticket Submitted Successfully!</h3>
              <p style={{ color: "#555", margin: "1rem 0" }}>
                Ticket ID: <strong>#{ticketCreated?._id.slice(-6).toUpperCase()}</strong>
              </p>
              <p style={{ color: "#555", marginBottom: "1.5rem" }}>
                A technician will review your ticket shortly.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button className="btn btn-primary" onClick={reset}>
                  🏠 Back to Home
                </button>
                <button className="btn btn-gold" onClick={function() { navigate("/my-tickets"); }}>
                  📋 View My Tickets
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </>
  );
}

export default HelpFlow;
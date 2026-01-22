const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Handle form submission
app.post("/send-message", (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const filePath = path.join(__dirname, "messages.json");
    let messages = [];

    if (fs.existsSync(filePath)) {
        messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    messages.push({
        name,
        email,
        subject,
        message,
        date: new Date().toISOString()
    });

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

    res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

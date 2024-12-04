const express = require('express');
const https = require('https');

// Create an Express app
const app = express();

// Use the port provided by Render or default to 8080 for local development
const PORT = process.env.PORT || 8080;

// Define the `/api` endpoint
app.get('/api', (req, res) => {
    const uid = req.query.uid;

    if (!uid) {
        return res.status(400).json({ error: "UID is required" });
    }

    const options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: `/${uid}/picture?type=normal`,
        method: 'GET',
        rejectUnauthorized: true, // Validate SSL certificates
    };

    https.get(options, fbRes => {
        let data = '';

        fbRes.on('data', chunk => {
            data += chunk;
        });

        fbRes.on('end', () => {
            if (data.includes("Photoshop")) {
                res.status(200).json({ status: "Alive" });
            } else {
                res.status(200).json({ status: "Dead" });
            }
        });
    }).on('error', error => {
        res.status(500).json({ error: "Request failed", details: error.message });
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

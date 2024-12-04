const https = require('https');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 80; // Default to port 80 for web hosting

// Endpoint to process user ID
app.get('/dsr/:uid', (req, res) => {
    const uid = req.params.uid;

    const options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: `/${uid}/picture?type=normal`,
        method: 'GET',
        rejectUnauthorized: true, // Ensure SSL certificate validation
    };

    const apiRequest = https.request(options, (apiResponse) => {
        let data = '';

        // Collect data chunks
        apiResponse.on('data', (chunk) => {
            data += chunk;
        });

        // Process response when complete
        apiResponse.on('end', () => {
            try {
                const result = {
                    statusCode: apiResponse.statusCode,
                    body: data,
                    status: data.includes("Photoshop") ? "Alive" : "Dead",
                };
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: "Error processing response" });
            }
        });
    });

    // Handle errors
    apiRequest.on('error', (error) => {
        res.status(500).json({ error: error.message });
    });

    apiRequest.end();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://yourdomain.com:${PORT}/`);
});

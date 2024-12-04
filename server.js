const http = require('http'); // Using HTTP since SSL termination will be handled externally
const url = require('url');

const server = http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const uid = queryObject.uid;

    if (!uid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "UID is required" }));
        return;
    }

    const options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: `/${uid}/picture?type=normal`,
        method: 'GET',
        rejectUnauthorized: true, // Validate SSL certificates
    };

    const fbReq = https.request(options, fbRes => {
        let data = '';

        fbRes.on('data', chunk => {
            data += chunk;
        });

        fbRes.on('end', () => {
            if (data.includes("Photoshop")) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "Alive" }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "Dead" }));
            }
        });
    });

    fbReq.on('error', error => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Request failed", details: error.message }));
    });

    fbReq.end();
});

// Start the server
server.listen(8080, () => {
    console.log("Server is running on http://localhost:8080/");
});

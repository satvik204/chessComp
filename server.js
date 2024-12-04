const express = require('express');
const path = require('path');
const app = express();

const PORT = 5500;

// Middleware to set necessary headers for SharedArrayBuffer
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

// Serve static files (HTML, JS, WASM, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
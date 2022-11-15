const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname, "frontend", "dist")));


app.get('/', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})

app.listen(3001, () => {
    console.log("Server listening on port 3001")
})
import express from "express";
import authMiddleware from "../src/index";

const app = express();

app.get("/", authMiddleware(), function handleRequest(req, res) {
    res.json(req.user);
});

const port = process.PORT || 3000;
app.listen(port, function() {
    console.log(`Server listening at port ${port}`);
});

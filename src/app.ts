import express from 'express';

const app = express();
const port = 3000;

app.get('/stacked.png', (req, res) => {
    const agency = (!Array.isArray(req.query.agency)) ? [req.query.agency] : req.query.agency;
    // TODO: limit height so we don't crash the server
    const height = Number(req.query.height ?? "800");
    const square = Boolean(req.query.square);
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
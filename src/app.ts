import express from 'express';
import responseHandler from './handler';

const app = express();
const port = 3000;

app.get("/stacked.png", responseHandler(false));
app.get("/inline.png", responseHandler(true));

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
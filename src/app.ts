import express from 'express';
import { inline, stacked } from './brand';

const app = express();
const port = 3000;

const dollarEscape = (l: string[]) => l.map(arg => decodeURIComponent(arg.replaceAll("$", "%")));

const responseHandler = (isInline: boolean) => async (req: express.Request, res: express.Response) => {
    const agency = (!Array.isArray(req.query.agency)) ? [req.query.agency] : req.query.agency;
    // TODO: limit height so we don't crash the server
    const height = Number(req.query.height ?? "800");
    const square = Boolean(req.query.square);

    const image = await (isInline ? inline : stacked)(dollarEscape(agency.map(item => typeof item === "string" ? item : "")), height, square);

    res.type("png");
    res.send(image);
};

app.get("/stacked.png", responseHandler(false));
app.get("/inline.png", responseHandler(true));

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
import express from "express";
import { inline, stacked } from './brand';

const dollarEscape = (l: string[]) => l.map(arg => decodeURIComponent(arg.replaceAll("$", "%")));

export default (isInline: boolean) => async (req: express.Request, res: express.Response) => {
    const agency = (!Array.isArray(req.query.agency)) ? [req.query.agency] : req.query.agency;
    // TODO: limit height so we don't crash the server
    const height = Number(req.query.height ?? "800");
    const square = Boolean(req.query.square);

    const image = await (isInline ? inline : stacked)(dollarEscape(agency.map(item => typeof item === "string" ? item : "")), height, square);

    res.type("png");
    res.send(image);
};
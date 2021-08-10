import express from "express";
import { inline, stacked } from './brand';
import { VercelRequest, VercelResponse } from "@vercel/node";

const dollarEscape = (l: string[]) => l.map(arg => decodeURIComponent(arg.replaceAll("$", "%")));

export default (isInline: boolean) => async (req: express.Request | VercelRequest, res: express.Response | VercelResponse) => {
    const agency = (!Array.isArray(req.query.agency)) ? [req.query.agency] : req.query.agency;
    // TODO: limit height so we don't crash the server
    const height = Number(req.query.height ?? "800");
    const square = Boolean(req.query.square);
    const govt = (typeof req.query.custom_govt === "string") ? req.query.custom_govt : undefined;

    const image = await (isInline ? inline : stacked)(dollarEscape(agency.map(item => typeof item === "string" ? item : "")), height, square, govt);

    res.setHeader("Content-Type", "image/png");
    res.send(image);
};
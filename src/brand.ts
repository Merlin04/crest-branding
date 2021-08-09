import { Canvas, createCanvas, Image, loadImage, NodeCanvasRenderingContext2D, registerFont } from "canvas";
import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

const BRANDING_X = 60;
const QUARTER_BRANDING_X = BRANDING_X / 4;
const AU_GOVT = "Australian Government";

registerFont("static/LiberationSerif-Bold.ttf", {
    family: "Liberation Serif",
    weight: "bold"
});

registerFont("static/LiberationSerif-Regular.ttf", {
    family: "Liberation Serif",
    weight: "regular"
});

let crest: Image | undefined = undefined;

export async function inline(lines: string[], setHeight: number, square: boolean) {
    if (crest === undefined) {
        crest = await loadImage(await readFile("static/crest.png", "binary"));
    }
    const linesStart = (BRANDING_X * 1.95);
    const longestLine = getLongestWidth(lines);
    const height = Math.max(crest.height, 80 * (lines.length + howManyNewLines(lines) + 1) + linesStart);
    const width = longestLine + 2 * BRANDING_X + crest.width;

    const g = createGraphics(width, height);
    g.ctx.drawImage(crest, QUARTER_BRANDING_X, QUARTER_BRANDING_X);
    drawLines(g.ctx, lines, width, linesStart, longestLine, false);

    return sizeImage(g, setHeight, square).canvas.toBuffer();
}

export async function stacked(lines: string[], setHeight: number, square: boolean) {
    if (crest === undefined) {
        crest = await loadImage(await readFile("static/crest.png", "binary"));
    }
    const longestLine = getLongestWidth(lines);
    const height = crest.height + 80 * (lines.length + howManyNewLines(lines) + 1);
    const width = longestLine + 2 * BRANDING_X;

    const g = createGraphics(width, height);
    g.ctx.drawImage(crest, (width - crest.width) / 2, 0);
    drawLines(g.ctx, lines, width, crest.height, longestLine, true);

    return sizeImage(g, setHeight, square).canvas.toBuffer();
}

function sizeImage(source: Graphics, setHeight: number, square: boolean): Graphics {
    const { width, height } = source.canvas;

    if(!square) {
        const heightScale = height / setHeight;
        const widthScale = width / heightScale;
        const destination = createGraphics(widthScale, setHeight);
        destination.ctx.drawImage(source.canvas, 0, 0, destination.canvas.width, destination.canvas.height);
        return destination;
    }

    const destination = createGraphics(width, width);
    destination.ctx.drawImage(source.canvas, 0, (width - height) / 2);
    // A bit inefficient but should work well and results in cleaner code
    return sizeImage(destination, setHeight, false);
}

function getLongestWidth(initialLines: string[]) {
    const g = createGraphics(1, 1).ctx;
    const lines = [AU_GOVT, ...initialLines];
    let longest = 0;
    for (const line of lines) {
        for (const part of line.split("\n")) {
            const width = g.measureText(part).width;
            longest = Math.max(longest, width);
        }
    }

    return longest;
}

interface Graphics {
    canvas: Canvas,
    ctx: NodeCanvasRenderingContext2D
}

function createGraphics(width: number, height: number): Graphics {
    const c = createCanvas(width, height);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000";
    ctx.font = "bold 54px 'Liberation Serif'";
    return {
        canvas: c,
        ctx
    };
}

function howManyNewLines(lines: string[]) {
    let newLineCount = 0;
    for (const line of lines) {
        if (line.includes("\n")) {
            newLineCount++;
        }
    }
    return newLineCount;
}

function drawLines(
    g: NodeCanvasRenderingContext2D,
    initialLines: string[],
    width: number,
    yOffset: number,
    longestLine: number,
    center: boolean
) {
    const lines = [AU_GOVT, ...initialLines];
    let offset = 40 + yOffset;
    for (const line of lines) {
        const actualLineWidth = line === lines[lines.length - 1] ? 0 : longestLine;
        const lineOffset = drawAndUnderline(g, line, offset, width, actualLineWidth, center, longestLine);
        offset += lineOffset;
    }
}

function drawAndUnderline(
    g: NodeCanvasRenderingContext2D,
    text: string,
    y: number,
    canvasWidth: number,
    lineWidth: number,
    center: boolean,
    longestLine: number
) {
    if(!crest) {
        throw new Error("Crest has not been loaded");
    }

    if(text.includes("\n")) {
        const parts = text.split("\n");
        let offset = 0;

        for (const part of parts) {
            const actualLineWidth = part !== parts[parts.length - 1] ? 0 : lineWidth;
            drawAndUnderline(g, part, y + offset, canvasWidth, actualLineWidth, center, longestLine);
            const addedOffset = part !== parts[parts.length - 1] ? 60 : 80;
            offset += addedOffset;
        }
        return offset;
    }

    const stringWidth = g.measureText(text).width;
    const leftTextOffset = center ? ((canvasWidth - stringWidth) / 2) : crest.width + QUARTER_BRANDING_X;
    const leftLineOffset = center ? ((canvasWidth - lineWidth) / 2) : crest.width + QUARTER_BRANDING_X;

    if(text.startsWith("|")) {
        g.font = "regular 54px 'Liberation Serif'";
        // TODO: replaceAll polyfill
        g.fillText(text.replace("|", ""), leftTextOffset, y - 20);
        g.fillRect(leftLineOffset, y, lineWidth, 2);
        const leftLineOffsetErase = center ? (canvasWidth - longestLine) / 2 : crest.width + QUARTER_BRANDING_X;
        g.fillStyle = "#fff";
        g.fillRect(leftLineOffsetErase, y - 60, longestLine, 2);
        g.fillStyle = "#000";
        g.font = "bold 54px 'Liberation Serif'";

        return 60;
    }

    g.fillText(text.replace("|", ""), leftTextOffset, y);
    g.fillRect(leftLineOffset, y + 20, lineWidth, 2);
    return 80;
}
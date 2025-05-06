import os
import random
from math import pi
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, A3, A2, A1, A0
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg


availableLetters = ["D", "H", "K", "N", "O", "R", "S", "V", "Z"]

lettersDir = os.path.join(os.path.dirname(__file__), "letters_svg")


dialogFormats = {
    "A4": (A4, (210, 297)),
    "A3": (A3, (297, 420)),
    "A2": (A2, (420, 594)),
    "A1": (A1, (594, 841)),
    "A0": (A0, (841, 1189)),
}


def logmarToSize(distanceMm: float, logmar: float) -> float:
    angleRad = 5 * pi / (180 * 60)  
    return distanceMm * angleRad * (10 ** logmar)

def getChartHeight(distanceMm: float, rowCount: int):
    heights = []
    for i in range(rowCount):
        logmar = -0.2 + (rowCount - i - 1) * 0.1
        heights.append(logmarToSize(distanceMm, logmar))
    totalHeightMm = sum(heights) + 50 
    return totalHeightMm, heights


def selectPageFormat(totalHeightMm: float, maxWidthMm: float):
    for name, (pageSize, (widthMm, heightMm)) in dialogFormats.items():
        if totalHeightMm <= heightMm and maxWidthMm <= widthMm:
            return name, pageSize
    return None, None

def generateEtdrsPdf(distanceM: float, rows: int, filename: str) -> str:

    distanceMm = distanceM * 1000
    totalHeightMm, letterHeights = getChartHeight(distanceMm, rows)

   
    maxWidthMm = max(letterHeights) * 9

    formatName, pageSize = selectPageFormat(totalHeightMm, maxWidthMm)
    if not formatName:
        raise ValueError("chart does not fit in A4-A0 formats")


    c = canvas.Canvas(filename, pagesize=pageSize)
    pageWidthPt, pageHeightPt = pageSize
    topMarginPt = 50 * 2.83465  
    yTop = pageHeightPt - topMarginPt


    for i, heightMm in enumerate(letterHeights):
        logmar = round(-0.2 + (rows - i - 1) * 0.1, 2)
        sizePt = heightMm * 2.83465  

        spacingPt = sizePt 
        rowWidthPt = 5 * sizePt + 4 * spacingPt
        xStart = (pageWidthPt - rowWidthPt) / 2
        yPos = yTop - sizePt

        if xStart < 0 or xStart + rowWidthPt > pageWidthPt:
            raise ValueError("chart is too big")


        letters = random.sample(availableLetters, 5)
        for j, letter in enumerate(letters):
            path = os.path.join(lettersDir, f"{letter}.svg")
            if not os.path.exists(path):
                raise FileNotFoundError(f"svg not found")

            drawing = svg2rlg(path)
            scale = sizePt / drawing.height
            drawing.scale(scale, scale)
            drawing.width *= scale
            drawing.height *= scale

            x = xStart + j * (sizePt + spacingPt)
            renderPDF.draw(drawing, c, x, yPos)

        c.setFont("Helvetica", 10)
        c.drawRightString(pageWidthPt - 40, yPos + sizePt / 3, f"LogMAR: {logmar:.1f}")

        nextHeightMm = letterHeights[i + 1] if i + 1 < len(letterHeights) else heightMm
        yTop = yPos - (nextHeightMm * 2.83465)


    c.setFont("Helvetica", 10)
    c.drawString(40, 20, f"Format: {formatName}, Distance: {distanceM}m, Rows: {rows}")


    c.save()
    return filename

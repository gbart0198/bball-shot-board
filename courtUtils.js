export function verifyClick(clickCoords) {
    const court = document.getElementById("court");
    const rect = court.getBoundingClientRect();

    const aspectRatio = court.naturalWidth / court.naturalHeight;
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    let visibleWidth, visibleHeight, offsetX, offsetY;

    if (displayWidth / displayHeight > aspectRatio) {
        visibleHeight = displayHeight;
        visibleWidth = visibleHeight * aspectRatio;
    } else {
        visibleWidth = displayWidth;
        visibleHeight = visibleWidth / aspectRatio;
    }

    offsetX = rect.left + (displayWidth - visibleWidth) / 2;
    offsetY = rect.top + (displayHeight - visibleHeight) / 2;

    const isInsideCourt =
        clickCoords.x >= offsetX &&
        clickCoords.x <= offsetX + visibleWidth &&
        clickCoords.y >= offsetY &&
        clickCoords.y <= offsetY + visibleHeight;

    return isInsideCourt;
}

export function setCanvasHeight() {
    const canvas = document.getElementById("canvas");
    const panelHeight = document.getElementById("controls-panel").offsetHeight;
    const viewportHeight = window.innerHeight;

    canvas.style.height = `${viewportHeight - panelHeight}px`;
}


export function refreshDisplay() {
    const canvas = document.getElementById("canvas");
}

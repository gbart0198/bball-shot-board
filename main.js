function savePoints() {
    const data = JSON.stringify(points);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "points.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importPoints(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            points = importedData;
            points.forEach((point) => {
                addCircle(point);
            });
        } catch (err) {
            console.error("Failed to import points: ", err);
            alert("Failed to import points.");
        }
    };

    reader.readAsText(file);
}

function refreshDisplay() {
    const canvas = document.getElementById("canvas");
}

function addCircle(pointData) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("shot-wrapper");
    wrapper.style.position = "absolute";
    wrapper.style.left = `${pointData.x - 10}px`;
    wrapper.style.top = `${pointData.y - 10}px`;

    const point = document.createElement("div");
    point.classList.add("click");

    const statDialog = document.createElement("div");
    statDialog.classList.add("stat-dialog");

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    let statText = `Time: ${timeString}`;

    statDialog.textContent = statText;

    statDialog.style.position = "absolute";
    statDialog.style.left = `${pointData.x + 25}px`;
    statDialog.style.top = `${pointData.y - 20}px`;
    statDialog.style.display = "none";

    point.addEventListener("mouseover", () => {
        statDialog.style.display = "block";
    });

    point.addEventListener("mouseout", () => {
        statDialog.style.display = "none";
    });

    const shotDialog = document.createElement("div");
    shotDialog.classList.add("shot-dialog");
    if (pointData.totalShots > 0) {
        // if there are shots recorded (this is an import)
        if (pointData.selectionType === selectionTypes.SINGLE) {
            // check for make or miss to determine point color
            if (pointData.makes > 0) {
                point.style.backgroundColor = "green";
                statDialog.textContent = "MAKE - " + statDialog.textContent;
            } else {
                point.style.backgroundColor = "red";
                statDialog.textContent = "MISS - " + statDialog.textContent;
            }
        } else if (pointData.selectionType === selectionTypes.MULTIPLE) {
            // determine color of point based on percentage made
            // TODO: YOU STOPPED HERE ----------------------------------------------
            statText = `\nMakes: ${pointData.makes}, Misses: ${pointData.totalShots - pointData.makes}`;
            statDialog.textContent = statText;

            const percent = pointData.makes / pointData.totalShots;
            if (percent >= 0.7) {
                point.style.backgroundColor = "green";
            } else if (percent >= 0.4) {
                point.style.backgroundColor = "orange";
            } else {
                point.style.backgroundColor = "red";
            }
        }
    } else if (pointData.totalShots === 0) {
        // if there have been no shots recorded (aka this is a new point, not an import)
        console.log("New point created");
        if (pointData.selectionType === selectionTypes.SINGLE) {
            pointData.totalShots = 1;
            const makeButton = document.createElement("button");
            const missButton = document.createElement("button");

            makeButton.textContent = "✓";
            missButton.textContent = "✗";

            makeButton.classList.add("shot-button", "make");
            missButton.classList.add("shot-button", "miss");

            makeButton.addEventListener("click", (e) => {
                e.stopPropagation();
                point.style.backgroundColor = "green";
                shotDialog.style.display = "none";
                statDialog.textContent = "MAKE - " + statDialog.textContent;
                pointData.makes = 1;
                points.push(pointData);
            });

            missButton.addEventListener("click", (e) => {
                e.stopPropagation();
                point.style.backgroundColor = "red";
                shotDialog.style.display = "none";
                statDialog.textContent = "MISS - " + statDialog.textContent;
                points.push(pointData);
            });

            shotDialog.appendChild(makeButton);
            shotDialog.appendChild(missButton);
        } else if (pointData.selectionType === selectionTypes.MULTIPLE) {
            const formWrapper = document.createElement("div");
            formWrapper.classList.add("multi-shot-form");

            const totalInput = document.createElement("input");
            totalInput.type = "number";
            totalInput.placeholder = "Total shots";
            totalInput.classList.add("multi-input");

            const makesInput = document.createElement("input");
            makesInput.type = "number";
            makesInput.placeholder = "Makes";
            makesInput.classList.add("multi-input");

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.classList.add("shot-button", "save");

            saveButton.addEventListener("click", (e) => {
                e.stopPropagation();
                const totalShots = parseInt(totalInput.value);
                const madeShots = parseInt(makesInput.value);

                if (isNaN(totalShots) || isNaN(madeShots) || totalShots < madeShots) {
                    alert("Invalid values.");
                    return;
                }
                statText = `\nMakes: ${madeShots}, Misses: ${totalShots - madeShots}`;
                statDialog.textContent = statText;
                pointData["totalShots"] = totalShots;
                pointData["makes"] = madeShots;
                points.push(pointData);

                const percent = madeShots / totalShots;
                if (percent >= 0.7) {
                    point.style.backgroundColor = "green";
                } else if (percent >= 0.4) {
                    point.style.backgroundColor = "orange";
                } else {
                    point.style.backgroundColor = "red";
                }

                shotDialog.style.display = "none";
            });

            formWrapper.appendChild(totalInput);
            formWrapper.appendChild(makesInput);
            formWrapper.appendChild(saveButton);

            shotDialog.appendChild(formWrapper);
        }
    }

    wrapper.appendChild(point);
    wrapper.appendChild(shotDialog);
    document.body.appendChild(statDialog);
    document.body.appendChild(wrapper);
}
function verifyClick(clickCoords) {
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
function setCanvasHeight() {
    const canvas = document.getElementById("canvas");
    const panelHeight = document.getElementById("controls-panel").offsetHeight;
    const viewportHeight = window.innerHeight;

    canvas.style.height = `${viewportHeight - panelHeight}px`;
}

function setEventListeners() {
    const canvas = document.getElementById("canvas");
    canvas.addEventListener("click", function(event) {
        const clickCoords = {
            x: event.clientX,
            y: event.clientY,
        };
        const isInsideCourt = verifyClick(clickCoords);
        if (isInsideCourt) {
            var pointData = {
                x: clickCoords.x,
                y: clickCoords.y,
                selectionType: selectionType,
                totalShots: 0,
                makes: 0,
            };
            addCircle(pointData);
        } else {
            console.log("Click outside the court");
        }
    });

    document.querySelectorAll(".shot-selection").forEach((button) => {
        button.addEventListener("click", () => {
            document
                .querySelectorAll(".shot-selection")
                .forEach((btn) => btn.classList.remove("selected"));
            button.classList.add("selected");
            const selection = button.textContent.trim().toLowerCase();
            if (selection === "single") {
                selectionType = selectionTypes.SINGLE;
            } else if (selection === "multiple") {
                selectionType = selectionTypes.MULTIPLE;
            }
        });
    });

    document.getElementById("save-button").addEventListener("click", () => {
        savePoints();
    });

    document
        .getElementById("import-button")
        .addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;
            importPoints(file);
        });
}

function init() {
    setEventListeners();
    setCanvasHeight();
}

window.onload = () => {
    init();
};

window.onresize = () => {
    setCanvasHeight();
};

const selectionTypes = {
    SINGLE: "single",
    MULTIPLE: "multiple",
};

var selectionType = selectionTypes.SINGLE;
var pointX = 0.0;
var pointY = 0.0;
var points = [];

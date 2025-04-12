function addCircle(clickCoords) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("shot-wrapper");
    wrapper.style.position = "absolute";
    wrapper.style.left = `${clickCoords.x - 10}px`;
    wrapper.style.top = `${clickCoords.y - 10}px`;

    const point = document.createElement("div");
    point.classList.add("click");

    const statDialog = document.createElement("div");
    statDialog.classList.add("stat-dialog");

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let statText = `Time: ${timeString}`;


    statDialog.textContent = statText;

    statDialog.style.position = "absolute";
    statDialog.style.left = `${clickCoords.x + 25}px`;
    statDialog.style.top = `${clickCoords.y - 20}px`;
    statDialog.style.display = "none";

    point.addEventListener("mouseover", () => {
        statDialog.style.display = "block";
    });

    point.addEventListener("mouseout", () => {
        statDialog.style.display = "none";
    });

    const shotDialog = document.createElement("div");
    shotDialog.classList.add("shot-dialog");

    if (selectionType === selectionTypes.SINGLE) {
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
            if (selectionType === selectionTypes.SINGLE) {
                statDialog.textContent = 'MAKE - ' + statDialog.textContent;
            }
        });

        missButton.addEventListener("click", (e) => {
            e.stopPropagation();
            point.style.backgroundColor = "red";
            shotDialog.style.display = "none";
            if (selectionType === selectionTypes.SINGLE) {
                statDialog.textContent = 'MISS - ' + statDialog.textContent;
            }
        });

        shotDialog.appendChild(makeButton);
        shotDialog.appendChild(missButton);
    }

    if (selectionType === selectionTypes.MULTIPLE) {
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
            y: event.clientY
        };
        const isInsideCourt = verifyClick(clickCoords);
        if (isInsideCourt) {
            addCircle(clickCoords);
        } else {
            console.log("Click outside the court");
        }
    });

    document.getElementById("toggle-controls").addEventListener("click", function() {
        const panel = document.getElementById("controls-panel");
        if (panel.style.maxHeight === "50px" || panel.style.maxHeight === "") {
            panel.style.maxHeight = "200px";
        } else {
            panel.style.maxHeight = "50px";
        }
    });

    document.querySelectorAll(".shot-selection").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll('.shot-selection').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            const selection = button.textContent.trim().toLowerCase();
            if (selection === "single") {
                selectionType = selectionTypes.SINGLE;
            } else if (selection === "multiple") {
                selectionType = selectionTypes.MULTIPLE;
            }
        });
    })
}

function setupGhostCursor() {
    const ghostCircle = document.createElement("div");
    ghostCircle.id = "ghost-circle";
    document.body.appendChild(ghostCircle);

    const courtImage = document.getElementById("court");
    const canvas = document.getElementById("canvas");

    canvas.addEventListener("mouseenter", () => {
        ghostCircle.style.display = "block";
    });

    canvas.addEventListener("mouseleave", () => {
        ghostCircle.style.display = "none";
    });

    canvas.addEventListener("mousemove", (e) => {
        const isInCourt = verifyClick({
            x: e.clientX,
            y: e.clientY
        })


        if (isInCourt) {
            ghostCircle.style.left = `${e.clientX}px`;
            ghostCircle.style.top = `${e.clientY}px`;
            ghostCircle.style.display = "block";
        } else {
            ghostCircle.style.display = "none";
        }
    });
}

function init() {
    setEventListeners();
    setCanvasHeight();
    setupGhostCursor();
}

window.onload = () => {
    init();
}

window.onresize = () => {
    setCanvasHeight();
}

const selectionTypes = {
    SINGLE: "single",
    MULTIPLE: "multiple",
}

var selectionType = selectionTypes.SINGLE;


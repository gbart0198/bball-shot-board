function courtAlert(clickCoords) {
    addCircle(clickCoords);
}

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
    statDialog.textContent = `${Math.round(clickCoords.x)}, ${Math.round(clickCoords.y)}`;
    statDialog.style.position = "absolute";
    statDialog.style.left = `${clickCoords.x + 10}px`;
    statDialog.style.top = `${clickCoords.y}px`;

    statDialog.style.display = "none";

    point.addEventListener("mouseover", () => {
        statDialog.style.display = "block";
    });

    point.addEventListener("mouseout", () => {
        statDialog.style.display = "none";
    });

    const shotDialog = document.createElement("div");
    shotDialog.classList.add("shot-dialog");

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
    });

    missButton.addEventListener("click", (e) => {
        e.stopPropagation();
        point.style.backgroundColor = "red";
        shotDialog.style.display = "none";
    });

    shotDialog.appendChild(makeButton);
    shotDialog.appendChild(missButton);

    wrapper.appendChild(point);
    wrapper.appendChild(shotDialog);
    document.body.appendChild(statDialog);
    document.body.appendChild(wrapper);
}
function verifyClick(clickCoords) {
    const court = document.getElementById("court");
    const rect = court.getBoundingClientRect();
    const isInsideCourt =
        clickCoords.x >= rect.left &&
        clickCoords.x <= rect.right &&
        clickCoords.y >= rect.top &&
        clickCoords.y <= rect.bottom;

    return isInsideCourt;
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
            courtAlert(clickCoords)
        } else {
            addCircle(clickCoords)
        }
    });
}

function init() {
    setEventListeners();
}

window.onload = () => {
    init();
}


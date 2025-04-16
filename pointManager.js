import { selectionTypes } from "./selectionTypes";

export function addCircle(pointData) {
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

export function editPoint() {
    alert('u are editing a point');
}

export let points = [];

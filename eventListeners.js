import { verifyClick } from "./courtUtils";
import { addCircle, points } from "./pointManager";
import { selectionTypes } from "./selectionTypes";
import { savePoints, importPoints } from "./storage";

export function setEventListeners() {
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
                selectionType: window.selectionType,
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
                window.selectionType = selectionTypes.SINGLE;
            } else if (selection === "multiple") {
                window.selectionType = selectionTypes.MULTIPLE;
            }
        });
    });

    document.getElementById("save-button").addEventListener("click", () => {
        savePoints(points);
    });

    document
        .getElementById("import-button")
        .addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;
            importPoints(file);
        });
}

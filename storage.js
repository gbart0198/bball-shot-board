import { addCircle } from "./pointManager";
import { points } from "./pointManager";

export function savePoints(points) {
    const data = JSON.stringify(points);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "points.json";
    a.click();
    URL.revokeObjectURL(url);
}

export function importPoints(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            // extend points to add new data
            importedData.forEach((point) => {
                addCircle(point);
            })
            points.push(...importedData);
        } catch (err) {
            console.error("Failed to import points: ", err);
            alert("Failed to import points.");
        }
    };

    reader.readAsText(file);
}


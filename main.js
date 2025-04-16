import { setCanvasHeight } from "./courtUtils";
import { setEventListeners } from "./eventListeners";
import { selectionTypes } from "./selectionTypes";

function init() {
    setEventListeners();
    setCanvasHeight();
}

window.onload = () => {
    window.selectionType = selectionTypes.SINGLE;
    init();
};

window.onresize = () => {
    setCanvasHeight();
};



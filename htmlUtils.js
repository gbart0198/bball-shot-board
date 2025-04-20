import { editPoint } from "./pointManager";

export function createStatDialog(pointData, content) {
  const statDialog = document.createElement("div");
  const closeButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");
  const dialogContent = document.createElement("div");

  statDialog.classList.add("stat-dialog");
  closeButton.classList.add("dialog-close-button");
  editButton.classList.add("dialog-edit-button");
  deleteButton.classList.add("dialog-delete-button");
  dialogContent.classList.add("dialog-content");

  statDialog.style.position = "absolute";
  statDialog.style.left = `${pointData.x + 65}px`;
  statDialog.style.top = `${pointData.y - 50}px`;
  statDialog.style.display = "none";

  dialogContent.innerText = content;
  closeButton.innerText = "X";
  editButton.innerText = "Edit";
  deleteButton.innerText = "Delete";

  closeButton.addEventListener("click", () => {
    statDialog.style.display = "none";
  });

  editButton.addEventListener("click", () => {
    editPoint(pointData);
  });

  deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this point?")) {
      alert("deleting...");
    }
  });

  statDialog.appendChild(closeButton);
  statDialog.appendChild(editButton);
  statDialog.appendChild(deleteButton);
  statDialog.appendChild(dialogContent);

  return statDialog;
}

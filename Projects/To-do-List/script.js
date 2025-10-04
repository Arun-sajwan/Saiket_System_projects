const modal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-input");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

let currentEditSpan = null;

function addTask() {
  const input = document.getElementById("task-input");
  const taskText = input.value.trim();

  if (taskText === "") return alert("Task cannot be empty!");

  const taskList = document.getElementById("task-list");

  const li = document.createElement("li");
  li.className = "task";

  const span = document.createElement("span");
  span.textContent = taskText;

  const actions = document.createElement("div");
  actions.className = "actions";

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete";
  completeBtn.innerHTML = "✓";
  completeBtn.onclick = () => li.classList.toggle("completed");

  const editBtn = document.createElement("button");
  editBtn.className = "edit";
  editBtn.innerHTML = "✎";
  editBtn.onclick = () => openEditModal(span);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.onclick = () => taskList.removeChild(li);

  actions.appendChild(completeBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actions);

  taskList.appendChild(li);

  input.value = "";
}

function openEditModal(span) {
  currentEditSpan = span;
  editInput.value = span.textContent;
  modal.style.display = "flex";
  editInput.focus();
}

saveBtn.onclick = () => {
  const newValue = editInput.value.trim();
  if (newValue === "") {
    alert("Task cannot be empty!");
    return;
  }
  if (currentEditSpan) {
    currentEditSpan.textContent = newValue;
  }
  closeModal();
};

cancelBtn.onclick = closeModal;

function closeModal() {
  modal.style.display = "none";
  currentEditSpan = null;
}

// Close modal on clicking outside content
window.onclick = function(event) {
  if (event.target === modal) {
    closeModal();
  }
};

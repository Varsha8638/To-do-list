const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const progressBar = document.getElementById('progress');
const progressText = document.getElementById('progressText');
const numbersCircle = document.getElementById('numbers');
let hasShownCongrats = false;

// Initialize existing tasks if any
document.querySelectorAll("#list-container li").forEach((li) => {
    if (!li.querySelector(".delete-icon")) {
        let span = document.createElement("span");
        span.className = "material-symbols-outlined delete-icon";
        span.textContent = "delete";
        li.appendChild(span);
    }
});

function addTask() {
    if (inputBox.value.trim() === '') {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;

        // Create delete icon
        let span = document.createElement("span");
        span.className = "material-symbols-outlined delete-icon";
        span.textContent = "delete";

        li.appendChild(span);
        listContainer.appendChild(li);
    }
    inputBox.value = "";
    saveData();
    updateProgress(); // 👈 Update progress after adding
}

inputBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Check or delete tasks with delegation
listContainer.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-icon")) {
        e.target.parentElement.remove();
    } else if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");

        // Move checked items to bottom
        if (e.target.classList.contains("checked")) {
            listContainer.appendChild(e.target);
        } else {
            listContainer.insertBefore(e.target, listContainer.firstChild);
        }
    }
    saveData();
    updateProgress(); // 👈 Update progress after check/delete
});

// Save data to localStorage
function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

// Show tasks from localStorage
function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
    updateProgress(); // 👈 Also update progress after restoring
}
showTask();

// ✅ Update progress bar and circle
function updateProgress() {
    const tasks = listContainer.querySelectorAll("li");
    const completed = listContainer.querySelectorAll("li.checked");

    const total = tasks.length;
    const done = completed.length;

    let percent = total === 0 ? 0 : Math.round((done / total) * 100);

    // Update progress bar and count
    progressBar.style.width = percent + "%";
    progressText.textContent = percent + "%";
    numbersCircle.textContent = `${done}/${total}`;

    const modal = document.getElementById('congratsModal');

    if (percent === 100 && total > 0 && !hasShownCongrats) {
        hasShownCongrats = true; // Show only once
        modal.style.display = 'flex';
    }

    // Reset flag if user deletes or unchecks any task (back below 100%)
    if (percent < 100) {
        hasShownCongrats = false;
    }
}

function closeModal() {
    document.getElementById('congratsModal').style.display = 'none';
}


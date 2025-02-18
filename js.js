const toDoListQsl = document.querySelector(".to_do_list");
const completedListQsl = document.querySelector(".completed_task_list");

let taskArr = [
  {
    id: self.crypto.randomUUID(),
    text: "Example on task",
    antal: "0",
    date: "",
    done: false,
  },
  {
    id: self.crypto.randomUUID(),
    text: "Example on completed task",
    antal: "0",
    date: "",
    done: true,
  },
];

console.log("localStorage første gang", localStorage.getItem("storedTasks"));

if (localStorage.getItem("storedTasks") !== null) {
  taskArr = JSON.parse(localStorage.getItem("storedTasks"));
}

showToDo();
function showToDo() {
  localStorage.setItem("storedTasks", JSON.stringify(taskArr));

  toDoListQsl.innerHTML = "";
  completedListQsl.innerHTML = "";

  taskArr.forEach((task) => {
    const li = document.createElement("li");
    console.log("dato", task.date);
    li.innerHTML = `
  <div class="li_container">
    <div class="li_content">
      <div class="li_elm_1">
        <input type="checkbox" class="mark_toggle_done" ${
          task.done ? "checked" : ""
        }>
        <input type="text" class="text_input ${
          task.done ? "completed" : ""
        }" value="${task.text}">
      </div>
      <input class="date_input" type="date" value="${task.date}">
    </div>

    <div class="amount-container">
      <button class="minus-btn">-</button>
      <input class="amount_input" type="number" value="${task.antal}">
      <button class="plus-btn">+</button>
    </div>

    <div class="button_container">
      <button class="delete_button">&times;</button>
    </div>
  </div>
`;

    // Event listeners for minus and plus buttons
    const minusBtn = li.querySelector(".minus-btn");
    const plusBtn = li.querySelector(".plus-btn");
    const amountInput = li.querySelector(".amount_input");

    minusBtn.addEventListener("click", () => {
      let currentValue = parseInt(amountInput.value, 10);
      if (!isNaN(currentValue) && currentValue > 0) {
        currentValue--; // Decrease value
        amountInput.value = currentValue;
        task.antal = currentValue; // Update task array
        localStorage.setItem("storedTasks", JSON.stringify(taskArr)); // Save changes to localStorage
      }
    });

    plusBtn.addEventListener("click", () => {
      let currentValue = parseInt(amountInput.value, 10);
      currentValue++; // Increase value
      amountInput.value = currentValue;
      task.antal = currentValue; // Update task array
      localStorage.setItem("storedTasks", JSON.stringify(taskArr)); // Save changes to localStorage
    });

    if (task.done) {
      li.classList.add("completed");
      completedListQsl.appendChild(li);
    } else {
      toDoListQsl.appendChild(li);
    }

    li.querySelector(".mark_toggle_done").addEventListener("click", () => {
      task.done = !task.done;
      showToDo();
      console.log("taskArray", taskArr);
    });

    li.querySelector(".text_input").addEventListener("input", (evt) => {
      task.text = evt.target.value;
      localStorage.setItem("storedTasks", JSON.stringify(taskArr));
    });

    li.querySelector(".amount_input").addEventListener("input", (evt) => {
      task.antal = evt.target.value;
      console.log("taskArray", taskArr);
    });

    li.querySelector(".date_input").addEventListener("input", (evt) => {
      console.log("date input", evt.target.value);
      task.date = evt.target.value;
      localStorage.setItem("storedTasks", JSON.stringify(taskArr));
    });

    li.querySelector(".delete_button").addEventListener("click", () => {
      taskArr = taskArr.filter((t) => t.id !== task.id);
      showToDo();
    });
  });

  addTaskInput();
}

function addTaskInput() {
  if (!document.querySelector(".new_task_input")) {
    const newTaskDiv = document.createElement("div");
    newTaskDiv.classList.add("new_task_container");
    newTaskDiv.innerHTML = `
    <div class="li_container">
      <div class="li_content">
        <div class="li_elm_1">
          <button class="plus_sign">+</button>
          <input type="text" class="new_task_input" placeholder="Add new task...">
        </div>
        <input class="date_input" type="date">
      </div>
  
      <div class="amount-container">
        <button class="minus-btn">-</button>
        <input class="amount_input" type="number" value="0">
        <button class="plus-btn">+</button>
      </div>
  
      <div class="button_container">
        <button class="add_task_button">Add</button>
      </div>
    </div>
  `;

    toDoListQsl.appendChild(newTaskDiv);

    const taskInput = newTaskDiv.querySelector(".new_task_input");
    const amountInput = newTaskDiv.querySelector(".amount_input");
    const dateInput = newTaskDiv.querySelector(".date_input");

    // Add event listeners to the plus/minus buttons for the new task
    const minusBtn = newTaskDiv.querySelector(".minus-btn");
    const plusBtn = newTaskDiv.querySelector(".plus-btn");

    minusBtn.addEventListener("click", () => {
      let currentValue = parseInt(amountInput.value, 10);
      if (!isNaN(currentValue) && currentValue > 0) {
        currentValue--; // Decrease value
        amountInput.value = currentValue;
      }
    });

    plusBtn.addEventListener("click", () => {
      let currentValue = parseInt(amountInput.value, 10);
      currentValue++; // Increase value
      amountInput.value = currentValue;
    });

    const addTask = () => {
      console.log("ADD TASK");
      if (taskInput.value.trim() !== "") {
        taskArr.push({
          id: self.crypto.randomUUID(),
          text: taskInput.value,
          antal: amountInput.value,
          date: dateInput.value,
          done: false,
        });
        showToDo();
        console.log("dateInput", dateInput);
        console.log("dato value", dateInput.value);
      }
    };

    // Event listeners for både knapper og Enter
    newTaskDiv
      .querySelectorAll(".plus_sign, .add_task_button")
      .forEach((button) => {
        button.addEventListener("click", addTask); // Klik-event
      });

    taskInput.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter") {
        addTask(); // Kald addTask ved Enter-tastetryk
      }
    });
  }
}

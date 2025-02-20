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

    // Event listeners til plus og minus knapper
    const minusBtn = li.querySelector(".minus-btn"); //Minus knap
    const plusBtn = li.querySelector(".plus-btn"); //Plus knap
    const amountInput = li.querySelector(".amount_input"); //Inputfelt hvor tal vises

    minusBtn.addEventListener("click", () => {
      let currentValue = parseInt(amountInput.value, 10); //Sikrer at værdi er hele tal
      if (!isNaN(currentValue) && currentValue > 0) {
        //Tjekker om værdien er et tal og større end 0
        currentValue--; //Reducerer tallet med 1
        amountInput.value = currentValue; //Opdaterer input feltet til den nye værdi
        task.antal = currentValue; // Opdaterer array til nuværende tal
        localStorage.setItem("storedTasks", JSON.stringify(taskArr));
      }
    });

    plusBtn.addEventListener("click", () => {
      let currentValue = parseInt(amountInput.value, 10);
      currentValue++; // Øger tallet med 1
      amountInput.value = currentValue;
      task.antal = currentValue; // Opdaterer array til nuværende tal
      localStorage.setItem("storedTasks", JSON.stringify(taskArr));
    });

    if (task.done) {
      li.classList.add("completed");
      completedListQsl.appendChild(li);
    } else {
      toDoListQsl.appendChild(li);
    }

    li.querySelector(".mark_toggle_done").addEventListener("click", (evt) => {
      //Toggler task.done mellem true (færdig) og false (ikke færdig)
      //Bruges til at flytte task mellem to do og completed
      task.done = !task.done;

      // Finder <li>-elementet der er parent til den checkbox
      // man har trykket på, så den tilføjer animation til hele den <li>
      const liElement = evt.target.closest("li");

      //Hvis task markeres som færdig, tilføjes animation
      if (task.done) {
        liElement.classList.add("slideOut-animation");
      }

      // Vent på, at animationen er færdig, og flyt derefter elementet
      const animationDuration = 500; // Samme tid som i CSS

      setTimeout(() => {
        //Opdaterer to do liste
        showToDo();
      }, animationDuration); // Vent på at animationen slutter, før elementet flyttes
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
      li.classList.add("delete-animation");

      const animationDuration = 500;

      setTimeout(() => {
        taskArr = taskArr.filter((t) => t.id !== task.id);
        showToDo();
      }, animationDuration);
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

    const taskInput = newTaskDiv.querySelector(".new_task_input");
    const amountInput = newTaskDiv.querySelector(".amount_input");
    const dateInput = newTaskDiv.querySelector(".date_input");

    const addTask = () => {
      if (taskInput.value.trim() !== "") {
        taskArr.push({
          id: self.crypto.randomUUID(), //Generer et unikt ID til task
          text: taskInput.value, //Henter den indtastede tekst
          antal: amountInput.value, //Henter det indtastede antal
          date: dateInput.value, //Henter den indtastede dato
          done: false, //Sørger for at task starter som ikke færdig
        });
        showToDo();
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

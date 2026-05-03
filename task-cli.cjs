#!/usr/bin/node

const fs = require("fs/promises");
const path = require("path");

const DB_FILE = path.join(__dirname, "tasks.json");

async function readTasks() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // ENOENT means 'Error NO ENTry' (file not found)
    if (error.code === "ENOENT") {
      return { nextId: 1, tasks: [] };
    }

    throw error; // If it's a different error (like permissions), let it crash
  }
}

async function writeTasks(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function main() {
  const [, , command, ...argv] = process.argv;

  switch (command) {
    case "add":
      const description = argv[0];
      await addTask(description);
      break;
    case "list":
      const status = argv[0];
      await listTasks(status);
      break;
    case "update":
      const id = argv[0];
      const newDescription = argv[1];
      await updateTask(id, newDescription);
      break;
    case "delete":
      const idxToDel = argv[0];
      await deleteTask(idxToDel);
      break;
    case "mark":
      await updateStatus(argv[0], argv[1]);
      break;
    default:
      console.log(
        "Usage: task-cli [add|list|update|delete|mark]",
      );
  }
}

async function addTask(description) {
  if (!description) {
    console.log("Error: Description not provided");
    return;
  }

  const data = await readTasks();

  const newTask = {
    id: data.nextId,
    description,
    status: "to-do",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.tasks.push(newTask);
  data.nextId++;

  await writeTasks(data);

  console.log(`Task added successfully (ID: ${newTask.id})`);
}

async function listTasks(status) {
  const data = await readTasks();
  const allTasks = data.tasks;

  const validFilters = ["to-do", "in-progress", "done", "all"];

  const filter = status ? status.toLowerCase() : "all";

  if (!validFilters.includes(filter)) {
    console.error(`\x1b[31mError:\x1b[0m "${filter}" is not a valid filter.`);
    console.log(`Valid options are: to-do, in-progress, done, all`);
    return;
  }

  const tasksToShow =
    filter === "all" ? allTasks : allTasks.filter((t) => t.status === filter);

  if (tasksToShow.length === 0) {
    console.log(`No tasks found${status ? ` with status: ${filter}` : ""}.`);
    return;
  }

  const displayTable = tasksToShow.map((task) => {
    return {
      ID: task.id,
      Description: task.description,
      Status: task.status,
      Created: new Date(task.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      Updated: new Date(task.updatedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  });

  console.table(displayTable);
}

async function updateTask(id, description) {
  if (!description) {
    console.error("Error: Please provide a new description.");
    return;
  }

  if (!id || isNaN(id)) {
    console.error("Error: Please provide a valid numeric Task ID.");
    return;
  }
  const data = await readTasks();

  const idx = data.tasks.findIndex((task) => task.id === parseInt(id));

  if (idx < 0) {
    console.log(`Error: Task with ID ${id} not found!`);
    return;
  }

  data.tasks[idx].description = description;
  data.tasks[idx].updatedAt = new Date().toISOString();

  await writeTasks(data);

  console.log(`Task with id ${id} updated successfully!`);
}

async function deleteTask(id) {
  if (!id || isNaN(id)) {
    console.error("Error: Please provide a valid numeric Task ID.");
    return;
  }

  const data = await readTasks();

  const originalLength = data.tasks.length;

  data.tasks = data.tasks.filter((task) => task.id !== parseInt(id));

  if (data.tasks.length === originalLength) {
    console.log(`Error: Task with ID ${id} not found.`);
    return;
  }

  await writeTasks(data);

  console.log(`Task with id ${id} deleted successfully!`);
}

async function updateStatus(id, status) {
  if (!id || isNaN(id)) {
    console.error("Error: Please provide a valid numeric Task ID.");
    return;
  }

  const allowedStatuses = ["to-do", "in-progress", "done"];

  const normalizedStatus = status.toLowerCase();

  if (!allowedStatuses.includes(normalizedStatus)) {
    console.error(`\x1b[31mError:\x1b[0m "${status}" is not a valid status.`);
    console.log(`Valid options are: ${allowedStatuses.join(", ")}`);
    return;
  }

  const data = await readTasks();
  const task = data.tasks.find((t) => t.id === parseInt(id));

  if (!task) {
    console.log(`Error: Task with ID ${id} not found.`);
    return;
  }

  task.status = normalizedStatus;
  task.updatedAt = new Date().toISOString();

  await writeTasks(data);
  console.log(`Task ${id} marked as ${status}.`);
}

main();

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
      return [];
    }

    throw error; // If it's a different error (like permissions), let it crash
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(DB_FILE, JSON.stringify(tasks, null, 2), "utf-8");
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
        "Usage: node task-cli.cjs [add|list|update|delete|mark-done|mark-in-progress|mark-pending]",
      );
  }
}

async function addTask(description) {
  if (!description) {
    console.log("Error: Description not provided");
    return;
  }

  const tasks = await readTasks();

  const taskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

  tasks.push({
    id: taskId,
    description,
    status: "to-do",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await writeTasks(tasks);

  console.log(`New task added successfully! ${taskId}`);
}

async function listTasks(status) {
  const tasks = await readTasks();

  const filteredTasks = status 
    ? tasks.filter(task => task.status === status) 
    : tasks;

  if (filteredTasks.length === 0) {
      console.log(`No tasks found${status ? ` with status: ${status}` : ""}.`);
      return;
  }

  const displayTable = filteredTasks.map(task => {
    return {
      ID: task.id,
      Description: task.description,
      Status: task.status,
      Created: new Date(task.createdAt).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      Updated: new Date(task.updatedAt).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    };
  });

  console.table(displayTable);
}

async function updateTask(id, description) {
  if (!id || isNaN(id)) {
    console.error("Error: Please provide a valid numeric Task ID.");
    return;
  }
  const tasks = await readTasks();

  const idx = tasks.findIndex((task) => task.id === parseInt(id));

  if (idx < 0) {
    console.log(`Error: Task with ID ${idx} not found!`);
    return;
  }

  tasks[idx].description = description;
  tasks[idx].updatedAt = new Date().toISOString();

  await writeTasks(tasks);

  console.log(`Task with id ${id} updated successfully!`);
}

async function deleteTask(id) {
  if (!id || isNaN(id)) {
    console.error("Error: Please provide a valid numeric Task ID.");
    return;
  }

  const tasks = await readTasks();

  const filteredListOfTasks = tasks.filter(filterTaskToDelete);

  function filterTaskToDelete(task) {
    return task.id !== id;
  }

  await writeTasks(filteredListOfTasks);

  console.log(`Task with id ${id} deleted succesfully!`);
}

async function updateStatus(id, status) {
  if (!id || isNaN(id)) {
    console.error("Error: Please provide a valid numeric Task ID.");
    return;
  }

  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === parseInt(id));

  if (!task) {
    console.log(`Error: Task with ID ${id} not found.`);
    return;
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();

  await writeTasks(tasks);
  console.log(`Task ${id} marked as ${status}.`);
}

main();

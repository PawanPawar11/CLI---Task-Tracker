const fs = require("fs/promises");
const path = require("path");

const DB_FILE = path.join(__dirname, "tasks.json");

async function readTasks() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
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

    default:
      console.log(
        "Usage: node task-cli.cjs [add|list|update|delete|mark-done|mark-in-progress|mark-pending]",
      );
  }
}

async function addTask(description) {
  if (!description) {
    console.log("Error: Description not provided");
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

  const filteredListOfTasks = tasks.filter(filterByStatus);

  function filterByStatus(task) {
    return task.status === status;
  }

  // const filteredListOfTasks = tasks.filter(function (task) {
  //     return task.status === status;
  // });

  console.table(filteredListOfTasks);
}

main();

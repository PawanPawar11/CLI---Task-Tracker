# Task Tracker CLI

A simple and efficient command-line application to manage your daily tasks.

This project is a solution to the [task-tracker challenge](https://roadmap.sh/projects/task-tracker) from [roadmap.sh](https://roadmap.sh/).

---

## Features

* Add new tasks with a unique ID
* List tasks by status (`to-do`, `in-progress`, `done`) or view all
* Update an existing task description
* Delete tasks by ID
* Mark tasks as `in-progress` or `done`
* Persistent storage using a local JSON file

---

## Prerequisites

* Node.js (v14 or higher recommended)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/PawanPawar11/CLI---Task-Tracker.git

# Navigate into the project directory
cd CLI---Task-Tracker

# Link the CLI globally
npm link
```

> ⚠️ If you face permission issues, try running it with `sudo`.

---

## Usage

### Add a Task

```bash
task-cli add "Go to gym"
```

---

### List Tasks

#### List all tasks

```bash
task-cli list
# or
task-cli list all
```

#### List by status

```bash
task-cli list to-do
task-cli list in-progress
task-cli list done
```

---

### Update a Task

```bash
task-cli update 1 "Go to gym and do 50 pushups"
```

---

### Update Task Status

```bash
task-cli mark 1 in-progress
task-cli mark 1 done
```

---

### Delete a Task

```bash
task-cli delete 1
```

---

## Example Output

```
Task added successfully (ID: 1)

┌─────────┬────┬─────────────────────┬─────────┬───────────────────┬───────────────────┐
│ (index) │ ID │ Description         │ Status  │ Created           │ Updated           │
├─────────┼────┼─────────────────────┼─────────┼───────────────────┼───────────────────┤
│ 0       │ 1  │ 'Go to gym'         │ 'to-do' │ 'May 3, 12:23 AM' │ 'May 3, 12:23 AM' │
└─────────┴────┴─────────────────────┴─────────┴───────────────────┴───────────────────┘

```

---

## Data Storage

Tasks are stored locally in a `tasks.json` file with the following structure:

```json
{
  "nextId": 2,
  "tasks": [
    {
      "id": 1,
      "description": "Go to gym",
      "status": "to-do",
      "createdAt": "2026-05-02T18:53:20.383Z",
      "updatedAt": "2026-05-02T18:53:20.383Z"
    }
  ]
}
```

---

## Uninstall

```bash
npm unlink -g cli-task-tracker
```


const fs = require('fs/promises');
const path = require('path');

function main() {
    const [, , command, argument] = process.argv;
    
    switch(command) {
        case "add":
            const description = argument;
            await addTask(description);
            break;
        case "list":
            const status = argument;
            await listTasks(status);
            break;
        default:
            console.log("Usage: node task-cli.cjs [add|list|update|delete|mark-done|mark-in-progress|mark-pending]");
    }
}

main();
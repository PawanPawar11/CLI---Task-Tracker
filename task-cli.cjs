const fs = require('fs/promises');
const path = require('path');

function main() {
    const [, , command, args] = process.argv;
    console.log(command);
    console.log(args);
}

main();
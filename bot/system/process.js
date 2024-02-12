const { loadedCommands, loadFriends, loadConfig } = require("./load");

async function system_handler({ api, event }) {
    switch (event.type) {
        case "event":
            onEvent({ api, event });
            break;

        case "message":
            const args = event.body.split(' ');
            if (!args[0].includes(loadConfig[0].prefix)) return;
            if (loadConfig[0].friend_only && !Array.from(loadFriends).some(friend => event.senderID === friend.userID)) return;
            if (!loadConfig[0].group_thread && event.senderID !== event.threadID) return;
            if (!loadConfig[0].personal_thread && event.senderID === event.threadID) return;
            args[0] = args[0].replace(loadConfig[0].prefix, '');
            console.log(args);
            onMessage({ api, event, args });
            const commandToRun = loadedCommands.find(command => {
                return (
                    args[0].toLowerCase() === command.config.name ||
                    (command.config.alias && command.config.alias.includes(args[0].toLowerCase()))
                );
            });
            if (commandToRun) {
                if (commandToRun.config.role === 1 && loadConfig[0].admin.includes(event.senderID)) return commandToRun.onRun({ api, event, args });
                if (commandToRun.config.role === 0) return commandToRun.onRun({ api, event, args });
            }
            break;
    }
}


async function onLoadCommands({ api }) {
    loadedCommands.forEach(runner => {
        if (runner.onLoad) return runner.onLoad({ api });
    });
}

async function onEvent({ api, event }) {
    loadedCommands.forEach(runner => {
        if (runner.onEvent) return runner.onEvent({ api, event });
    });
}

async function onMessage({ api, event }) {
    loadedCommands.forEach(runner => {
        if (runner.onMessage) return runner.onMessage({ api, event });
    });
}

module.exports = { system_handler, onLoadCommands };
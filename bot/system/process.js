const { loadedCommands, loadFriends, loadConfig } = require("./load");

async function system_handler({ api, event }) {
    switch (event.type) {
        case "event":
            onEvent({ api, event });
            break;

        case "message":
            onMessage({ api, event });
            if (loadConfig[0].friend_only && !Array.from(loadFriends).some(friend => event.senderID === friend.userID)) return;
            if (!loadConfig[0].group_thread && event.senderID !== event.threadID) return;
            if (!loadConfig[0].personal_thread && event.senderID === event.threadID) return;

            const commandToRun = loadedCommands.find(command => {
                return (
                    event.body.toLowerCase() === command.config.name ||
                    (command.config.alias && command.config.alias.includes(event.body.toLowerCase()))
                );
            });

            if (commandToRun) {
                commandToRun.onRun({ api, event });
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
require("./load");

async function system_handler({ api, event }) {
    switch (event.type) {
        case "event":
            onEvent({ api, event });
            break;

        case "message":
            const args = event.body.split(' ');
            onMessage({ api, event });

            if (!args[0].startsWith(global.utils.loadConfig[0].prefix)) return;

            if (global.utils.loadConfig[0].friend_only &&
                !Array.from(global.utils.loadFriends).some(friend => event.senderID === friend.userID)) return;

            if (!global.utils.loadConfig[0].group_thread && event.senderID !== event.threadID) return;

            if (!global.utils.loadConfig[0].personal_thread && event.senderID === event.threadID) return;

            args[0] = args[0].slice(global.utils.loadConfig[0].prefix.length);
            
            const commandToRun = global.utils.loadedCommands.find(command => {
                return (
                    args[0].toLowerCase() === command.config.name ||
                    (command.config.alias && command.config.alias.includes(args[0].toLowerCase()))
                );
            });

            if (commandToRun) {
                if (commandToRun.config.role === 1 && global.utils.loadConfig[0].admin.includes(event.senderID)) {
                    return commandToRun.onRun({ api, event, args });
                }
                if (commandToRun.config.role === 0) {
                    return commandToRun.onRun({ api, event, args });
                }
            }
            break;
    }
}

async function onLoadCommands({ api }) {
    for (const runner of global.utils.onLoad) {
        await runner.onLoad({ api });
    }
}

async function onEvent({ api, event }) {
    for (const runner of global.utils.onEvent) {
        await runner.onEvent({ api, event });
    }
}

async function onMessage({ api, event }) {
    for (const runner of global.utils.onMessage) {
        await runner.onMessage({ api, event });
    }
}

module.exports = { system_handler, onLoadCommands };

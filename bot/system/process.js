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
                args.shift();
                if (commandToRun.config.role === 1 && global.utils.loadConfig[0].admin.includes(event.senderID)) {
                    try {
                        return commandToRun.onRun({ api, event, args, commandName: commandToRun.config.name });
                    } catch (error) {
                        console.error(error);
                    }
                }
                if (commandToRun.config.role === 0) {
                    try {
                        return commandToRun.onRun({ api, event, args, commandName: commandToRun.config.name });
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
            break;

        case "message_reply":
            const onReply = global.utils.onReplyValue.find(command => {
                return (
                    event.messageReply.messageID === command.messageID
                );
            });

            if (onReply) {
                const commandToRun = global.utils.ONReply.find(command => {
                    return (
                        onReply.commandName === command.config.name
                    );
                });
    
                if (commandToRun) {
                    const args = event.body.split(' ');
                    args.shift();
                    if (commandToRun.config.role === 1 && global.utils.loadConfig[0].admin.includes(event.senderID)) {
                        try {
                            return commandToRun.onReply({ api, event, args, commandName: commandToRun.config.name, onReply });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    if (commandToRun.config.role === 0) {
                        try {
                            return commandToRun.onReply({ api, event, args, commandName: commandToRun.config.name, onReply });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            }
            break;
    }
}

async function onLoadCommands({ api }) {
    for (const runner of global.utils.onLoad) {
        try {
            return runner.onLoad({ api });
        } catch (error) {
            console.error(error);
        }
    }
}

async function onEvent({ api, event }) {
    for (const runner of global.utils.onEvent) {
        try {
            return runner.onEvent({ api, event });
        } catch (error) {
            console.error(error);
        }
    }
}

async function onMessage({ api, event }) {
    for (const runner of global.utils.onMessage) {
        try {
            return runner.onMessage({ api, event });
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = { system_handler, onLoadCommands };

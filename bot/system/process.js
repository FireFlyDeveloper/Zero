require("./load");

const cooldowns = {};

function isUserInCooldown(userId, cooldownTime) {
    const currentTime = Date.now();
    const lastExecutionTime = cooldowns[userId] || 0;
    const elapsedTime = currentTime - lastExecutionTime;

    return elapsedTime < cooldownTime;
}

function updateUserCooldown(userId) {
    cooldowns[userId] = Date.now();
}

async function system_handler({ api, event }) {
    switch (event.type) {
        case "event":
            await onEvent({ api, event });
            break;

        case "message":
            const args = event.body.split(' ');
            await onMessage({ api, event });

            if (!args[0].startsWith(global.utils.loadConfig[0].prefix)) return;

            if (global.utils.loadConfig[0].friend_only &&
                !Array.from(global.utils.loadFriends).some(friend => event.senderID === friend.userID)) return;

            if (!global.utils.loadConfig[0].group_thread && event.senderID !== event.threadID) return;

            if (!global.utils.loadConfig[0].personal_thread && event.senderID === event.threadID) return;

            args[0] = args[0].slice(global.utils.loadConfig[0].prefix.length);

            const targetName = args[0].toLowerCase();

            const commandToRun = binarySearch(global.utils.loadedCommands, targetName);

            if (commandToRun) {
                args.shift();

                const cooldownTime = commandToRun.config.countdown * 1000;

                if (isUserInCooldown(event.senderID, cooldownTime)) {
                    await api.sendMessage(`Command is on cooldown for ${commandToRun.config.countdown} seconds. Please wait.`, event.threadID);
                } else {

                    if (commandToRun.config.role === 1 && global.utils.loadConfig[0].admin.includes(event.senderID)) {
                        try {
                            await commandToRun.onRun({ api, event, args, commandName: commandToRun.config.name });

                            updateUserCooldown(event.senderID);
                        } catch (error) {
                            console.error(error.message);
                        }
                    }
                    if (commandToRun.config.role === 0) {
                        try {
                            await commandToRun.onRun({ api, event, args, commandName: commandToRun.config.name });

                            updateUserCooldown(event.senderID);
                        } catch (error) {
                            console.error(error.message);
                        }
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
                            return await commandToRun.onReply({ api, event, args, commandName: commandToRun.config.name, onReply });
                        } catch (error) {
                            console.error(error.message);
                        }
                    }
                    if (commandToRun.config.role === 0) {
                        try {
                            return await commandToRun.onReply({ api, event, args, commandName: commandToRun.config.name, onReply });
                        } catch (error) {
                            console.error(error.message);
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
            return await runner.onLoad({ api });
        } catch (error) {
            console.error(error.message);
        }
    }
}

async function onEvent({ api, event }) {
    for (const runner of global.utils.onEvent) {
        try {
            return await runner.onEvent({ api, event });
        } catch (error) {
            console.error(error.message);
        }
    }
}

async function onMessage({ api, event }) {
    for (const runner of global.utils.onMessage) {
        try {
            return await runner.onMessage({ api, event });
        } catch (error) {
            console.error(error.message);
        }
    }
}

function binarySearch(loadedCommands, targetName) {
    let left = 0;
    let right = loadedCommands.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const currentCommand = loadedCommands[mid];
        const currentName = currentCommand.config.name;
        const currentAlias = currentCommand.config.alias || [];

        if (currentName === targetName || currentAlias.includes(targetName)) {
            return currentCommand;
        }

        if (currentName < targetName) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return null;
}

module.exports = { system_handler, onLoadCommands };

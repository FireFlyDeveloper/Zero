require("./load");

const cooldowns = {};

async function isUserInCooldown(userId, cooldownTime) {
    const currentTime = Date.now();
    const lastExecutionTime = cooldowns[userId] || 0;
    const elapsedTime = currentTime - lastExecutionTime.time;
    if (elapsedTime < cooldownTime) return lastExecutionTime.commandName;
    return elapsedTime < cooldownTime;
}

async function updateUserCooldown(userId, commandName) {
    cooldowns[userId + commandName] = { time: Date.now(), commandName };
}

async function system_handler({ api, event }) {
    if (event.type) {

        if (global.utils.loadConfig.friend_only &&
            !Array.from(global.utils.loadFriends).some(friend => event.senderID === friend.userID)) return;

        if (!global.utils.loadConfig.group_thread && event.senderID !== event.threadID) return;

        if (!global.utils.loadConfig.personal_thread && event.senderID === event.threadID) return;

        switch (event.type) {
            case "event":
                onEvent({ api, event });
                break;

            case "message":
                onMessage({ api, event });
                onRun({ api, event });
                break;

            case "message_reply":
                onReply({ api, event });
                break;
        }
    }
}

async function onLoadCommands({ api }) {
    for (const runner of global.utils.onLoad) {
        try {
            await runner.onLoad({ api });
        } catch (error) {
            console.error(error.message);
        }
    }
}

async function onEvent({ api, event }) {
    for (const runner of global.utils.onEvent) {
        try {
            await runner.onEvent({ api, event });
        } catch (error) {
            console.error(error.message);
        }
    }
}

async function onMessage({ api, event }) {
    for (const runner of global.utils.onMessage) {
        try {
            await runner.onMessage({ api, event });
        } catch (error) {
            console.error(error.message);
        }
    }
}

async function onRun({ api, event }) {
    const args = event.body.split(' ');
    if (!args[0].startsWith(global.utils.prefix)) return;

    args[0] = args[0].slice(global.utils.prefix.length);

    const targetName = args[0].toLowerCase();

    const commandToRun = await binarySearch(global.utils.onRun, targetName);

    if (commandToRun) {
        if (commandToRun.suggestion) return await api.sendMessage(commandToRun.suggestion, event.threadID, event.messageID);
        args.shift();

        const cooldownTime = commandToRun.config.countdown * 1000;
        const inCoolDown = await isUserInCooldown((event.senderID + commandToRun.config.name), cooldownTime);
        if (inCoolDown) {
            await api.sendMessage(`The command '${inCoolDown}' is on cooldown for ${Math.ceil((cooldownTime - (Date.now() - cooldowns[event.senderID + commandToRun.config.name].time)) / 1000)} seconds. Please wait.⏳`, event.threadID);
        } else {

            if (commandToRun.config.role === 1) {
                if (global.utils.admin.includes(event.senderID)) {
                    try {
                        await commandToRun.onRun({ api, event, args, commandName: commandToRun.config.name });
                        await updateUserCooldown(event.senderID, commandToRun.config.name);
                        return;
                    } catch (error) {
                        console.error(error.message);
                    }
                } else {
                    await api.sendMessage(`⚠️ Oops! It seems like the command '${commandToRun.config.name}' is reserved for administrators only. Please make sure you have the necessary permissions before attempting to use this command.`, event.threadID, event.messageID);
                    await updateUserCooldown(event.senderID, commandToRun.config.name);
                }
            } else {
                try {
                    await commandToRun.onRun({ api, event, args, commandName: commandToRun.config.name });
                    await updateUserCooldown(event.senderID, commandToRun.config.name);
                } catch (error) {
                    console.error(error.message);
                }
            }
        }
    }
}

async function onReply({ api, event }) {
    const onReply = global.utils.onReplyValue.find(command => {
        return (
            event.messageReply.messageID === command.messageID
        );
    });

    if (onReply) {
        const commandToRun = await binarySearch(global.utils.ONReply, onReply.commandName);
        if (commandToRun.suggestion) return await api.sendMessage(commandToRun.suggestion, event.threadID, event.messageID);

        const cooldownTime = commandToRun.config.countdown * 1000;
        const inCoolDown = await isUserInCooldown((event.senderID + commandToRun.config.name), cooldownTime);
        if (inCoolDown) {
            await api.sendMessage(`The command '${inCoolDown}' is on cooldown for ${Math.ceil((cooldownTime - (Date.now() - cooldowns[event.senderID + commandToRun.config.name].time)) / 1000)} seconds. Please wait.⏳`, event.threadID);
        } else {

            if (commandToRun) {
                const args = event.body.split(' ');
                args.shift();
                if (commandToRun.config.role === 1) {
                    if (global.utils.admin.includes(event.senderID)) {
                        try {
                            await commandToRun.onReply({ api, event, args, commandName: commandToRun.config.name, onReply });
                            await updateUserCooldown(event.senderID, commandToRun.config.name);
                        } catch (error) {
                            console.error(error.message);
                        }
                    } else {
                        await api.sendMessage(`⚠️ Oops! It seems like the command '${commandToRun.config.name}' is reserved for administrators only. Please make sure you have the necessary permissions before attempting to use this command.`, event.threadID, event.messageID);
                        await updateUserCooldown(event.senderID, commandToRun.config.name);
                    }
                } else {
                    try {
                        await commandToRun.onReply({ api, event, args, commandName: commandToRun.config.name, onReply });
                        await updateUserCooldown(event.senderID, commandToRun.config.name);
                    } catch (error) {
                        console.error(error.message);
                    }
                }
            }
        }
    } else {

        const args = event.body.split(' ');

        if (!args[0].startsWith(global.utils.prefix)) return;

        args[0] = args[0].slice(global.utils.prefix.length);

        const targetName = args[0].toLowerCase();

        const commandToRun = await binarySearch(global.utils.onRun, targetName);

        if (commandToRun) {
            if (commandToRun.suggestion) return await api.sendMessage(commandToRun.suggestion, event.threadID, event.messageID);
            args.shift();

            const cooldownTime = commandToRun.config.countdown * 1000;
            const inCoolDown = await isUserInCooldown((event.senderID + commandToRun.config.name), cooldownTime);
            if (inCoolDown) {
                await api.sendMessage(`The command '${inCoolDown}' is on cooldown for ${Math.ceil((cooldownTime - (Date.now() - cooldowns[event.senderID + commandToRun.config.name].time)) / 1000)} seconds. Please wait.⏳`, event.threadID);
            } else {

                if (commandToRun.config.role === 1) {
                    if (global.utils.admin.includes(event.senderID)) {
                        try {
                            await commandToRun.onRun({ api, event, args, commandName: commandToRun.config.name });
                            await updateUserCooldown(event.senderID, commandToRun.config.name);
                            return;
                        } catch (error) {
                            console.error(error.message);
                        }
                    } else {
                        await api.sendMessage(`⚠️ Oops! It seems like the command '${commandToRun.config.name}' is reserved for administrators only. Please make sure you have the necessary permissions before attempting to use this command.`, event.threadID, event.messageID);
                        await updateUserCooldown(event.senderID, commandToRun.config.name);
                    }
                } else {
                    try {
                        await commandToRun.onRun({ api, event, args, commandName: commandToRun.config.name });
                        await updateUserCooldown(event.senderID, commandToRun.config.name);
                    } catch (error) {
                        console.error(error.message);
                    }
                }
            }
        }
    }
}

async function binarySearch(loadedCommands, targetName) {
    let left = 0;
    let right = loadedCommands.length - 1;
    let closestMatch = null;
    let closestMatchIndex = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const currentCommand = loadedCommands[mid];
        const currentName = currentCommand.config.name;
        const currentAlias = currentCommand.config.alias || [];

        if (currentName === targetName || currentAlias.includes(targetName)) {
            return currentCommand;
        }

        const currentDistance = await getLevenshteinDistance(currentName, targetName);
        const closestDistance = closestMatch ? await getLevenshteinDistance(closestMatch, targetName) : Infinity;

        if (currentDistance < closestDistance) {
            closestMatch = currentName;
            closestMatchIndex = mid;
        }

        if (currentName < targetName) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    if (closestMatch !== null) {
        const suggestion = `Command not found. Did you mean "${closestMatch}"?`;
        return { suggestion, index: closestMatchIndex };
    }

    return null;
}

async function getLevenshteinDistance(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0),
                    dp[i][j - 1] + 1,
                    dp[i - 1][j] + 1
                );
            }
        }
    }

    return dp[m][n];
}

module.exports = { system_handler, onLoadCommands };

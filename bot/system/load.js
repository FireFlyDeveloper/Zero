const fs = require('fs');
const path = require('path');

const loadedCommandNames = new Set();
const loadedCommandAliases = new Set();

global.utils = {
    loadedCommands: [],
    loadFriends: new Set(),
    loadConfig: [],
    onLoad: [],
    onEvent: [],
    onMessage: [],
    onReplyValue: [],
    onReply: function (data) {
        if (!data.commandName) return console.error('commandName are missing.');
        if (!data.messageID) return console.error('messageID are missing.');
        global.utils.onReplyValue.push(data);
        setTimeout(() => {
            const index = global.utils.onReplyValue.indexOf(data);
            if (index !== -1) {
                global.utils.onReplyValue.splice(index, 1);
            }
        }, 15 * 60 * 1000);
    },
    ONReply: []
};

async function loadConfig() {
    try {
        const config = await fs.promises.readFile('config.json', 'utf8');
        global.utils.loadConfig.push(JSON.parse(config));
    } catch (error) {
        console.error('Error loading config:', error.message);
    }
}

async function loadCommands() {
    const commandsFolder = path.join(__dirname, '../../script/commands');
    const sortedCommands = [];

    try {
        const files = await fs.promises.readdir(commandsFolder);

        await Promise.all(files.map(async (file) => {
            if (file.endsWith('.js')) {
                try {
                    const commandModule = require(path.join(commandsFolder, file));

                    if (commandModule && commandModule.config) {
                        const { config, onRun, onLoad, onEvent, onMessage, onReply } = commandModule;

                        if (loadedCommandNames.has(config.name) || loadedCommandAliases.has(config.alias)) {
                            console.error(`Name or alias already exists, unloading: ${file}`);
                        } else {
                            // Push the command to the sorted array
                            if (onRun) sortedCommands.push({ config, onRun });
                            if (onLoad) global.utils.onLoad.push({ config, onLoad });
                            if (onEvent) global.utils.onEvent.push({ config, onEvent });
                            if (onMessage) global.utils.onMessage.push({ config, onMessage });
                            if (onReply) global.utils.ONReply.push({ config, onReply });

                            loadedCommandNames.add(config.name);
                            if (config.alias) loadedCommandAliases.add(config.alias);

                            console.log(`Loaded command: ${config.name}`);
                        }
                    } else {
                        console.error(`Invalid module structure in file: ${file}`);
                    }
                } catch (error) {
                    console.error(`Error loading module from file ${file}: ${error.message}`);
                }
            }
        }));
    } catch (error) {
        console.error(`Error reading directory: ${error.message}`);
    }

    sortedCommands.sort((a, b) => a.config.name.localeCompare(b.config.name));
    global.utils.loadedCommands.push(...sortedCommands);
}

async function loadFriends({ api }) {
    try {
        const friends = await api.getFriendsList();
        friends.forEach(friend => global.utils.loadFriends.add(friend));
    } catch (error) {
        console.error('Error loading friends:', error.message);
    }
}

module.exports = { loadCommands, loadFriends, loadConfig };

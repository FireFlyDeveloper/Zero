const fs = require('fs');
const path = require('path');

const loadedCommands = new Array();
const loadedCommandNames = new Set();
const loadedCommandAliases = new Set();

const loadFriends = new Set();
const loadConfig = new Array();

function load_config() {
    const config = fs.readFileSync('config.json', "utf8");
    loadConfig.push(JSON.parse(config));
}

function load_commands() {
    const commandsFolder = path.join(__dirname, '../../script/commands');

    fs.readdirSync(commandsFolder).forEach(file => {
        if (file.endsWith('.js')) {
            try {
                const commandModule = require(path.join(commandsFolder, file));

                if (commandModule && commandModule.config && commandModule.onRun) {
                    const { config, onRun, onLoad, onEvent, onMessage } = commandModule;

                    if (loadedCommandNames.has(config.name) || loadedCommandAliases.has(config.alias)) {
                        console.error(`Name already exist, unloading: ${file}`);
                    } else {
                        loadedCommands.push({ config, onRun, onLoad, onEvent, onMessage });
                        loadedCommandNames.add(config.name);
                        if (config.alias) {
                            loadedCommandAliases.add(config.alias);
                        }
                        console.log(`Loaded command: ${config.name}`);
                    }
                } else {
                    console.error(`Invalid module structure in file: ${file}`);
                }
            } catch (error) {
                console.error(`Error loading module from file ${file}: ${error.message}`);
            }
        }
    });
}

async function load_friends({ api }) {
    const friends = await api.getFriendsList();
    friends.forEach(friend => {
        loadFriends.add(friend);
    });
}

module.exports = { load_commands, loadedCommands, loadFriends, load_friends, load_config, loadConfig };

const fs = require('fs');
const path = require('path');

const loadedCommands = new Array();
const loadedCommandNames = new Set();
const loadedCommandAliases = new Set();

function load_commands() {
    const commandsFolder = path.join(__dirname, '../../script/commands');

    fs.readdirSync(commandsFolder).forEach(file => {
        if (file.endsWith('.js')) {
            try {
                const commandModule = require(path.join(commandsFolder, file));

                if (commandModule && commandModule.config && commandModule.onRun) {
                    const { config, onRun, onLoad } = commandModule;

                    if (loadedCommandNames.has(config.name) || loadedCommandAliases.has(config.alias)) {
                        console.error(`Name already exist, unloading: ${file}`);
                    } else {
                        loadedCommands.push({ config, onRun, onLoad });
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

module.exports = { load_commands, loadedCommands };

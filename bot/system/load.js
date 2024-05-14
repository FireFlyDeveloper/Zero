const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

global.utils = {
    loadedCommandNames: new Set(),
    loadedCommandAliases: new Set(),
    loadFriends: new Set(),
    loadConfig: {},
    botID: "",
    admin: [],
    prefix: "",
    config: [],
    onRun: [],
    onLoad: [],
    onEvent: [],
    onMessage: [],
    onReplyValue: [],
    onReply: function (data) {
        if (!data.commandName) return console.error('commandName are missing.');
        if (!data.messageID) return console.error('messageID are missing.');
        global.utils.onReplyValue.push(data);
        setTimeout(() => {
            const index = this.onReplyValue.indexOf(data);
            if (index !== -1) {
                this.onReplyValue.splice(index, 1);
            }
        }, 15 * 60 * 1000);
    },
    ONReply: []
};

async function loadConfig() {
    try {
        const config = await fs.promises.readFile('config.json', 'utf8');
        const parse_json = JSON.parse(config);
        global.utils["loadConfig"] = parse_json;
        global.utils["prefix"] = parse_json.prefix;
        parse_json.admin.map(element => global.utils.admin.push(element));
    } catch (error) {
        console.error('Error loading config:', error.message);
    }
}

async function loadCommands() {
    const commandsFolder = path.join(__dirname, '../../script/commands');
    const sortedCommands = [];

    try {
        const files = await fs.promises.readdir(commandsFolder);
        console.log(chalk.bold.blue(`\n[ ${chalk.bold.white(`==== ${chalk.bold.yellow('Loaded Commands')} ====`)} ]`));

        files.forEach(file => {
            if (file.endsWith('.js')) {
                const filePath = path.join(commandsFolder, file);
                delete require.cache[require.resolve(filePath)];
            }
        });

        await Promise.all(files.map(async (file) => {
            if (file.endsWith('.js')) {
                try {
                    const commandModule = require(path.join(commandsFolder, file));

                    if (commandModule && commandModule.config) {
                        const { config, onRun, onLoad, onEvent, onMessage, onReply } = commandModule;

                        if (global.utils.loadedCommandNames.has(config.name) || global.utils.loadedCommandAliases.has(config.alias)) {
                            console.error(chalk.bold.blue(`[ ${chalk.bold.red('Error')} ] : ${chalk.bold.white(file)} | ${chalk.bold.red(`Name or Alias already exist.`)}`));
                        } else {
                            sortedCommands.push({ config, onRun, onLoad, onEvent, onMessage, onReply });

                            global.utils.loadedCommandNames.add(config.name);
                            if (config.alias) global.utils.loadedCommandAliases.add(config.alias);

                            console.log(chalk.bold.blue(`[ ${chalk.bold.yellow('Command')} ] : ${chalk.bold.white(config.name)}`));
                        }
                    } else {
                        console.error(chalk.bold.blue(`[ ${chalk.bold.red('Error')} ] : ${chalk.bold.white(file)} | ${chalk.bold.red(`Invalid module structure.`)}`));
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

    sortedCommands.forEach(command => {
        const { config, onRun, onLoad, onEvent, onMessage, onReply } = command;

        global.utils.config.push({ config });
        if (onRun) global.utils.onRun.push({ config, onRun });
        if (onLoad) global.utils.onLoad.push({ config, onLoad });
        if (onEvent) global.utils.onEvent.push({ config, onEvent });
        if (onMessage) global.utils.onMessage.push({ config, onMessage });
        if (onReply) global.utils.ONReply.push({ config, onReply });
    });
}

async function loadFriends({ api }) {
    try {
        const botID = await api.getCurrentUserID();
        global.utils["botID"] = botID;
        const friends = await api.getFriendsList();
        friends.forEach(friend => global.utils.loadFriends.add(friend));
    } catch (error) {
        console.error('Error loading friends:', error.message);
    }
}

module.exports = { loadCommands, loadFriends, loadConfig };

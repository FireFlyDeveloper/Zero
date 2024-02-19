const login = require('./bot/system/login');
const { loadCommands, loadConfig } = require('./bot/system/load');

async function start() {
    loadConfig();
    loadCommands();
    await login();
}

start();
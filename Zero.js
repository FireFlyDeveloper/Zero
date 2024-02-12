const login = require('./bot/system/login');
const { load_commands, load_config } = require('./bot/system/load');

async function start() {
    load_config();
    load_commands();
    await login();
}

start();
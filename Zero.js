const login = require('./bot/system/login');
const { load_commands } = require('./bot/system/load');

async function start() {
    load_commands();
    await login();
}

start();
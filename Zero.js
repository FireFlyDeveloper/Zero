const login = require('./bot/system/login');
const { loadCommands, loadConfig } = require('./bot/system/load');

async function start() {
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    
    loadConfig();
    loadCommands();
    await login();
}

start();
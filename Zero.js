const login = require('./bot/system/login');
const { loadConfig } = require('./bot/system/load');
require('./design/terminal');

async function start() {
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    
    await global.design.logo();
    await loadConfig();
    await login();
}

start();
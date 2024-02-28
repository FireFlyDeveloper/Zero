const { loadCommands } = require('../../bot/system/load');

module.exports = {
    config: {
        name: "reload",
        alias: "",
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 1,
        countdown: 10,
        description: "Reload commands.",
        category: "utility",
        guide: ""
    },
    onRun: async function ({ api, event }) {
        try {
            await loadCommands();
            await api.sendMessage("Commands loaded ✅", event.threadID);
        } catch (error) {
            await api.sendMessage(error, event.threadID);
        }
    }
};
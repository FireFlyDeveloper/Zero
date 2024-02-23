module.exports = {
    config: {
        name: "uptime",
        alias: ["up", "uptime"],
        version: 2.0,
        author: "Razi",
        role: 0,
        countdown: 5,
        description: "monitor bot running time",
        category: "utility",
        guide: "{prefix} uptime"
    },
    onRun: async function ({ api, event }) {
        const uptime = process.uptime();
        const seconds = Math.floor(uptime % 60);
        const minutes = Math.floor((uptime / 60) % 60);
        const hours = Math.floor((uptime / (60 * 60)) % 24);
        const days = Math.floor(uptime / (60 * 60 * 24));
        const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} second`;
        api.sendMessage(`hello user, the bot has been running for ${uptimeString}.`, event.threadID);
    }
};
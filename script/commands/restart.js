const fs = require("fs");

module.exports = {
    config: {
        name: "restart",
        alias: ["restart"],
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 1,
        countdown: 5,
        description: "Restart system",
        category: "utility",
        guide: ""
    },
    onLoad: async function ({ api }) {
        const pathFile = `${__dirname}/tmp/restart.txt`;
		if (fs.existsSync(pathFile)) {
			const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
			api.sendMessage(`System online ✅\nTime: ${(Date.now() - time) / 1000}s ⌚`, tid);
			fs.unlinkSync(pathFile);
		}
    },
    onRun: async function ({ api, event }) {
        const pathFile = `${__dirname}/tmp/restart.txt`;
		fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
		await api.sendMessage("Restarting system... 🔃", event.threadID);
		process.exit(2);
    }
};
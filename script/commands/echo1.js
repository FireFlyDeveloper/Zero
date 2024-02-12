module.exports = {
    config: {
        name: "echo",
        alias: ["echo"],
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 1,
        countdown: 5,
        description: "Echo back",
        category: "utility",
        guide: ""
    },
    onRun: async function ({ api, event }) {
		await api.sendMessage("echo", event.threadID);
    }
};
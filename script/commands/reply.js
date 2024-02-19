module.exports = {
    config: {
        name: "reply",
        alias: ["reply"],
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 0,
        countdown: 5,
        description: "Reply back",
        category: "utility",
        guide: ""
    },
    onRun: async function ({ api, event, commandName }) {
		const data = await api.sendMessage("echo", event.threadID);
        global.utils.onReply({
            commandName,
            messageID: data.messageID,
            data: "Reply"
        });
    },
    onReply: async function ({ api, event, onReply }) {
        await api.sendMessage(onReply.data, event.threadID);
    }
};
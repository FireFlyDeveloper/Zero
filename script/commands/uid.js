module.exports = {
    config: {
        name: "uid",
        alias: ["uid"],
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 0,
        countdown: 5,
        description: "Echo back",
        category: "utility",
        guide: ""
    },
    onRun: async function ({ api, event, args }) {
		if (!args[1])
			return api.sendMessage(event.senderID, event.threadID, event.messageID);

		let msg = "";
		const { mentions } = event;
		for (const id in mentions)
			msg += `${mentions[id].replace("@", "")}: ${id}\n`;
		api.sendMessage(msg, event.threadID, event.messageID);
    }
};
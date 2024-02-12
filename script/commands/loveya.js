const fs = require("fs");

module.exports = {
    config: {
        name: "love",
        alias: ["love", "heart"],
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 0,
        countdown: 5,
        description: "Love you",
        category: "fun",
        guide: ""
    },
    onRun: async function ({ api, event }) {
		const message = ["I", "love", "you"];
        const message_ID = await api.sendMessage(message[0], event.threadID);
        for (let i = 0; i < message.length; i++) {
            if (i == 0) {
                continue;
            }
            await delay(1000);
            await api.editMessage(message[i], message_ID.messageID);
        }
        await delay(1000);
        await api.unsendMessage(message_ID.messageID);
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
    config: {
        name: "unsend",
        alias: "",
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 0,
        countdown: 5,
        description: "Echo back",
        category: "utility",
        guide: ""
    },
    onRun: async function ({ api, event }) {
        if (event.type === "message_reply") {
            if (event.messageReply.senderID === global.utils.botID) {
                return await api.unsendMessage(event.messageReply.messageID);
            } else {
                return await api.sendMessage(`🔄 Only reply to the Bot's message! 🤖`, event.threadID);
            }
        } else {
            return await api.sendMessage(`🌟 If you want to unsend a message, just reply to the message you want to take back. 🔄 Only reply to the Bot's message, though! 🤖`, event.threadID);
        }
    }
};
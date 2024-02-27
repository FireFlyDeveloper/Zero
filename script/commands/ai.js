const axios = require('axios');
const Prefixes = [
    'Ai',
    'ai',
    'ask',
    'Ask',
    '+ai',
    'AI',
    '+Ai'
];

module.exports = {
    config: {
        name: "ai",
        alias: ["ai"],
        version: 2.0,
        author: "RazihelX",
        role: 0,
        countdown: 5,
        description: "Ai ZERO",
        category: "Artificial I",
        guide: "Ai or multiprefix"
    },
    onMessage: async function ({ api, event }) {
        try {
            const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
            if (!prefix) {
                return;
            }
            const question = event.body.substring(prefix.length).trim();
            if (question === "") {
                await api.sendMessage(`please input a keyword or what to ask! `, event.threadID);
                return;
            }

            const message = await api.sendMessage("Thinking...💭", event.threadID, event.messageID);
            const response = await axios.get(``);
            const messageText = response.data.output.trim();
            await api.editMessage(messageText, message.messageID);
            global.utils.onReply({
                commandName: "ai",
                messageID: message.messageID
            });
        } catch (error) {
            console.error("Error in AI command:", error.message);
            await api.sendMessage("An error occurred while processing your request.", event.threadID);
        }
    },
    onReply: async function ({ api, event, commandName }) {
        try {
            const message = await api.sendMessage("Thinking...💭", event.threadID, event.messageID);
            const response = await axios.get(`https://artificial-intelligence-saludeskimdev.replit.app/brook?prompt_user=${event.body}&user_id=${event.threadID + event.sender}`);
            const messageText = response.data.output.trim();
            await api.editMessage(messageText, message.messageID);
            global.utils.onReply({
                commandName,
                messageID: message.messageID
            });
        } catch (error) {
            console.error("Error in AI command:", error.message);
            await api.sendMessage("An error occurred while processing your request.", event.threadID);
        }
    }
};
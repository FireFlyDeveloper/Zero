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
    onRun: async function () {},
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
            
            const info = await api.getUserInfo(event.senderID);
            const name = info[event.senderID].firstName;
            const message = await api.sendMessage("Thinking...💭", event.threadID, event.messageID);
            const response = await axios.get(`https://nekohime.xyz/api/ai/openai?text=${encodeURIComponent(`User name: ${name}. User prompt:${question}`)}`);
            const messageText = response.data.result.trim();
            await api.editMessage(messageText, message.messageID);
        } catch (error) {
            console.error("Error in AI command:", error.message);
            await api.sendMessage("An error occurred while processing your request.", event.threadID);
        }
    }
};
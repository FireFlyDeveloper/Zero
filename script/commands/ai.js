const axios = require('axios');

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
  onRun: async function ({ api, event, args}) {
    const question = args.join(' ');
    if (!question)
      return await api.sendMessage(`please input a keyword or what to ask! `, event.threadID);
    else {
      
      const response = await axios.get(`https://openaikey.onrender.com/api?prompt=${encodeURIComponent(question)}`);
      const messageText = response.data.response.trim();
      await api.sendMessage(messageText, event.threadID, event.messageID);
    }
  }
};
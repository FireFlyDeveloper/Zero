module.exports = {
    config: {
        name: "thread",
        alias: ["tid"],
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 0,
        countdown: 5,
        description: "Get Thread ID",
        category: "utility",
        guide: ""
    },
    onRun: async function ({ api, event }) {
      return api.sendMessage(event.threadID.toString(), event.threadID, event.messageID);
    }
};
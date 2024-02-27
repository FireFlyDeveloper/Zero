module.exports = {
    config: {
        name: "prefix",
        alias: "",
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 0,
        countdown: 5,
        description: "Prefix",
        category: "utility",
        guide: ""
    },
    onMessage: async function ({ api, event }) {
        const msg = `Prefix: '${global.utils.prefix}'`;
        return await api.sendMessage(msg, event.threadID, event.messageID);
    }
};
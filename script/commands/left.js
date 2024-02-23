module.exports = {
    config: {
        name: "left",
        alias: "",
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 1,
        countdown: 0,
        description: "Left Event",
        category: "group",
        guide: ""
    },
    onRun: async function () {},
    onEvent: async function ({ api, event }) {
		if (event.logMessageType === "log:unsubscribe") {
            if (event.logMessageData.leftParticipantFbId === await api.getCurrentUserID()) return;
            if (event.logMessageData.leftParticipantFbId !== event.author) return;
            return await api.sendMessage("User left detected ⚠", event.threadID);
        }
    }
};
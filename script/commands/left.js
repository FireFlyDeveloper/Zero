module.exports = {
    config: {
        name: "left",
        alias: "",
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 0,
        countdown: 0,
        description: "Left Event",
        category: "group",
        guide: ""
    },
    onRun: async function () {},
    onEvent: async function ({ api, event }) {
		if (event.logMessageType === "log:unsubscribe") {
            if (event.logMessageData.leftParticipantFbId === api.getCurrentUserID()) return;
            return api.sendMessage("User left detected ⚠", event.threadID);
        }
    }
};
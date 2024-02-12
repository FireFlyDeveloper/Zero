module.exports = {
    config: {
        name: "join",
        alias: "",
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 0,
        countdown: 0,
        description: "Join Event",
        category: "group",
        guide: ""
    },
    onRun: async function () {},
    onEvent: async function ({ api, event }) {
		if (event.logMessageType === "log:subscribe") {
            if (event.logMessageData.addedParticipants[0].userFbId === api.getCurrentUserID()) {
                return api.sendMessage("Thank you for inviting me 😊\nNote: This is an automated message ⚠", event.threadID);
            }
        
            return api.sendMessage("New user detected ⚠", event.threadID);
        }
    }
};
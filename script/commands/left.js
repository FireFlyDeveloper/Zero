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
    onEvent: async function ({ api, event }) {
        if (event.logMessageType === "log:unsubscribe") {
            const leftParticipantFbId = event.logMessageData.leftParticipantFbId;

            if (leftParticipantFbId === await api.getCurrentUserID()) return;

            if (leftParticipantFbId !== event.author) return;

            const userInfo = await api.getUserInfo(leftParticipantFbId);
            const userName = userInfo[leftParticipantFbId]?.firstName || "Unknown User";

            const goodbyeMessage = `Goodbye ${userName}! We'll miss you. If you ever decide to come back, you're always welcome! 😢`;

            return await api.sendMessage(goodbyeMessage, event.threadID);
        }
    }
};

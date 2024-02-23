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
            const leftParticipantFbId = event.logMessageData.leftParticipantFbId;

            // Ignore if the bot itself left
            if (leftParticipantFbId === await api.getCurrentUserID()) return;

            // Ignore if the event author is not the one who left
            if (leftParticipantFbId !== event.author) return;

            const userInfo = await api.getUserInfo(leftParticipantFbId);
            const userName = userInfo[leftParticipantFbId]?.firstName || "Unknown User";

            const goodbyeMessage = `Goodbye ${userName}! We'll miss you. If you ever decide to come back, you're always welcome! 😢`;

            return await api.sendMessage(goodbyeMessage, event.threadID);
        }
    }
};

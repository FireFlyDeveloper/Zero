module.exports = {
    config: {
        name: "join",
        alias: "",
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 1,
        countdown: 0,
        description: "Join Event",
        category: "group",
        guide: ""
    },
    onRun: async function () { },
    onEvent: async function ({ api, event }) {
        if (event.logMessageType === "log:subscribe") {
            const botUserID = await api.getCurrentUserID();

            if (event.logMessageData.addedParticipants.some(participant => participant.userFbId === botUserID)) {
                await api.sendMessage("Grateful for the invite! 😊\nJust a heads up, this message is automated ⚠️", event.threadID);
            } else {
                const addedParticipants = event.logMessageData.addedParticipants;
                const mentions = addedParticipants.map(participant => ({
                    tag: `@${participant.fullName}`,
                    id: participant.userFbId,
                    fromIndex: 6, // Highlight the occurrence of @Username in the message body
                }));

                let welcomeMessage = "";

                if (mentions.length === 1) {
                    welcomeMessage = `Hello ${mentions[0].tag}! 🎉 Welcome to the group! Feel free to introduce yourself and join in the conversation. If you have any questions, just ask! 😊`;
                } else {
                    const allMentionsExceptLast = mentions.slice(0, -1).map(mention => mention.tag).join(", ");
                    const lastMention = mentions.slice(-1)[0].tag;
                    welcomeMessage = `Hello ${allMentionsExceptLast} and ${lastMention}! 🎉 Welcome to the group! Feel free to introduce yourselves and join in the conversation. If you have any questions, just ask! 😊`;
                }

                await api.sendMessage({
                    body: welcomeMessage,
                    mentions,
                }, event.threadID);
            }
        }
    }
};

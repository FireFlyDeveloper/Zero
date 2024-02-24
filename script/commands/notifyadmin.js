module.exports = {
    config: {
        name: "notify_admin",
        alias: "",
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 1,
        countdown: 0,
        description: "Notify admin",
        category: "group",
        guide: ""
    },
    onEvent: async function ({ api, event }) {
		if (event.logMessageType === "log:subscribe") {
            const botUserID = await api.getCurrentUserID();
            if (event.logMessageData.addedParticipants.some(participant => participant.userFbId === botUserID)) {
                const threadInfo = await api.getThreadInfo(event.threadID);
                const threadName = threadInfo.threadName;
                const userInfo = await api.getUserInfo(event.author);
                const msg = `==⚠ New Event ⚠==\nEvent: Added to a new group.\nGroup: ${threadName}\nAdded by: ${userInfo[event.author].name}`;
                const admin = global.utils.loadConfig[0];
                admin.admin.forEach(async (admin) => {
                    await api.sendMessage(msg, admin);
                });
            }
        }
    }
};
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
    onRun: async function () {},
    onEvent: async function ({ api, event }) {
		if (event.logMessageType === "log:subscribe") {
            if (event.logMessageData.addedParticipants[0].userFbId === await api.getCurrentUserID()) {
                const threadInfo = await api.getThreadInfo(event.threadID);
                const threadName = threadInfo.threadName;
                const userInfo = await api.getUserInfo(event.author);
                const msg = `==⚠ New Event ⚠==\nEvent: Added to a new group.\nGroup: ${threadName}\nAdded by: ${userInfo[event.author].name}`;
                const fs = require("fs").promises;
                const admin = await fs.readFile('config.json', "utf8");
                JSON.parse(admin).admin.forEach(async (admin) => {
                    await api.sendMessage(msg, admin);
                });
            }
        }
    }
};
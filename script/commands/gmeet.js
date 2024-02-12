module.exports = {
    config: {
        name: "gmeet",
        alias: ["gmeet"],
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 1,
        countdown: 0,
        description: "Forward Gmeet link to the group",
        category: "school",
        guide: ""
    },
    onRun: async function () {},
    onMessage: async function ({ api, event }) {
        const thread_to_listen = [
            "7379943615401950" // Change this to target Group chat to listen for google meet link.
        ];
        if (event.body.includes('meet.google.com/') && thread_to_listen.includes(event.threadID)) {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const threadName = threadInfo.threadName;
            const match = event.body.match(/meet\.google\.com\/([\w-]+)/);

            if (match && match[1]) {
                const meetCode = match[1];
                const meetLink = `https://meet.google.com/${meetCode}`;
                const message = await api.sendMessage('A Google Meet link has been identified; the link is currently being forwarded to the students of BSIT-1B.', event.threadID);
                await api.sendMessage(`From: ${threadName}\n===================\nGoogle Meet Code: ${meetCode}\nGoogle Meet Link: ${meetLink}`, event.senderID);
                await delay(5000);
                return api.editMessage('Students have been notified ✅', message.messageID);
            }
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
};
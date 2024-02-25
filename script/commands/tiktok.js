const axios = require('axios');

module.exports = {
    config: {
        name: "tiktok",
        alias: "",
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 0,
        countdown: 5,
        description: "Download Tiktok",
        category: "utility",
        guide: ""
    },
    onMessage: async function ({ api, event }) {
        const tiktokUrlRegex = /https:\/\/vt\.tiktok\.com\/[a-zA-Z0-9]{8,}\//;
        const match = event.body.match(tiktokUrlRegex);

        if (match) {
            const tiktokLink = match[0];
            try {
                const message = await api.sendMessage('Tiktok♪ url detected ⚠', event.threadID, event.messageID);
                const link = await axios.get(`https://tiktokapi-2z4a.onrender.com/downloadTiktok?url=${tiktokLink}`);
                if (link.data.images.length !== 0) return await api.editMessage('Unsupported tiktok url 😢', message.messageID);
                await api.editMessage('Downloading...⬇', message.messageID);
                const buffer = await downloadFile(link);
                await api.sendMessage({
                    body: ``,
                    attachment: buffer,
                }, event.threadID, event.messageID);
                await api.editMessage('Downloaded ✅', message.messageID);
            } catch (error) {
                console.error(error);
            }            
        }
    }

};

async function downloadFile(link) {
    if (link.data.images.length !== 0) {
        return null;
    } else {
        const downloadFile = await axios({
            method: 'get',
            url: link.data.url,
            responseType: 'stream',
        });
        return downloadFile.data;
    }
}

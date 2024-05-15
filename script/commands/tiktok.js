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
        const tiktokUrlRegex = /(?:http(?:s)?:\/\/)?(?:www\.tiktok\.com\/@[^\/\?\s]+\/video\/[^\/\?\s]+|vt\.tiktok\.com\/[^\/\?\s]+)/gi;
        const match = event.body.match(tiktokUrlRegex);

        if (match) {
            const tiktokLink = match[0];
            try {
                const message = await api.sendMessage('Tiktok♪ url detected ⚠', event.threadID, event.messageID);
                const link = await axios.request({
                    method: 'GET',
                    url: 'https://tiktok-scraper7.p.rapidapi.com/',
                    params: {
                        url: `${tiktokLink}`,
                        hd: '1'
                    },
                    headers: {
                        'X-RapidAPI-Key': 'Your Rapid API Key',
                        'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com'
                    }
                });
                await api.editMessage('Downloading...⬇', message.messageID);
                const buffer = await downloadFile(link);
                if (buffer.images) {
                    await api.sendMessage({
                        body: `Author: ${link.data.data.author.nickname}\nTitle: ${link.data.data.title}`,
                        attachment: buffer.images,
                    }, event.threadID, event.messageID);
                    if (buffer.music) {
                        await api.sendMessage({
                            body: `Author: ${link.data.data.author.nickname}\nTitle: ${link.data.data.title}`,
                            attachment: buffer.music,
                        }, event.threadID, event.messageID);
                    }
                } else {
                    await api.sendMessage({
                        body: `Author: ${link.data.data.author.nickname}\nTitle: ${link.data.data.title}`,
                        attachment: buffer.video,
                    }, event.threadID, event.messageID);
                }
                await api.editMessage('Downloaded ✅', message.messageID);
            } catch (error) {
                console.error(error);
            }
        }
    }

};

async function downloadFile(link) {
    if (link.data.data.images) {
        const images = await Promise.all(link.data.data.images.map(async (item) => {
            const image = await axios.get(item, {
                responseType: 'stream'
            });
            image.data.path = `${Date.now()}.png`;
            return image.data;
        }));
        if (link.data.data.music) {
            const music = await axios({
                method: 'get',
                url: link.data.data.music,
                responseType: 'stream',
            });
            return { images, music: music.data };
        }
        return { images };
    }
    const downloadFile = await axios({
        method: 'get',
        url: link.data.data.hdplay,
        responseType: 'stream',
    });
    return { video: downloadFile.data };
}

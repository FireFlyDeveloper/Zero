const figlet = require('figlet');

global.design = {
    logo: async function () {
        const logo = new Promise((resolve, reject) => {
            figlet.text('ZERO BOT', { font: 'ANSI Shadow' }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        console.log(await logo);
    },
    login: async function () {
        const frames = ['\x1b[1;34m◜\x1b[0m', '\x1b[1;34m◠\x1b[0m', '\x1b[1;34m◝\x1b[0m', '\x1b[1;34m◞\x1b[0m', '\x1b[1;34m◡\x1b[0m', '\x1b[1;34m◟\x1b[0m']; // Blue and bold circle frames
        let currentFrame = 0;
    
        return setInterval(() => {
            process.stdout.write('\r' + 'LOGGING IN ' + frames[currentFrame] + '\r');
    
            currentFrame = (currentFrame + 1) % frames.length;
        }, 100);
    }
}
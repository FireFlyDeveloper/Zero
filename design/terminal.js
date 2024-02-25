const figlet = require('figlet');
const chalk = require('chalk');

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
            process.stdout.write(`\r${chalk.bold.blue('[')} ${chalk.bold.yellow('LOGGING IN')} ${frames[currentFrame]} ${chalk.bold.blue(']')}\r`);
    
            currentFrame = (currentFrame + 1) % frames.length;
        }, 100);
    }
}
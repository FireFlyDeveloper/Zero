const fs = require("fs").promises;
const login = require("@xaviabot/fca-unofficial");
const { system_handler, onLoadCommands } = require("./process");
const auto = require("../auto/auto");
const { loadCommands, loadFriends } = require("./load");
require('../../design/terminal');

async function start_facebook_login() {
    try {
        const appStateData = await fs.readFile("appstate.json", "utf8");
        const appState = JSON.parse(appStateData);
        const loading = await global.design.login();

        login({ appState }, async (err, api) => {
            clearInterval(loading);
            if (err) {
                console.error(err);
                return;
            }

            await loadCommands();
            await onLoadCommands({ api });
            await auto({ api });
            await loadFriends({ api });

            await api.setOptions({
                listenEvents: true,
                online: false,
                autoMarkDelivery: false
            });

            await api.listenMqtt(async (err, event) => {
                if (err) {
                    console.error(err);
                    return;
                }

                try {
                    await system_handler({ api, event });
                } catch (error) {
                    console.error(error);
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = start_facebook_login;
const fs = require("fs").promises;
const login = require("@xaviabot/fca-unofficial");
const { system_handler, onLoadCommands } = require("./process");
const auto = require("../auto/auto");
const { loadFriends } = require("./load");

async function start_facebook_login() {
    try {
        const appStateData = await fs.readFile("appstate.json", "utf8");
        const appState = JSON.parse(appStateData);

        login({ appState }, async (err, api) => {
            if (err) {
                console.error(err);
                return;
            }

            onLoadCommands({ api });
            auto({ api });
            loadFriends({ api });

            await api.setOptions({
                listenEvents: true,
                online: false,
                autoMarkDelivery: false,
                logLevel: "silent",
            });

            await api.listenMqtt(async (err, event) => {
                if (err) {
                    console.error(err);
                    return;
                }

                try {
                    system_handler({ api, event });
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
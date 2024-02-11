const { join_event } = require("../event/join");
const { left_event } = require("../event/left");
const { loadedCommands } = require("./load");

function system_handler({ api, event }) {
    switch (event.type) {
        case "event":
            if (event.logMessageType === "log:subscribe") {
                join_event(api, event);
            } else if (event.logMessageType === "log:unsubscribe") {
                left_event(api, event);
            }
            console.log(JSON.stringify(event, null, 2));
            break;

        case "message":
            const commandToRun = loadedCommands.find(command => {
                return (
                    event.body.toLowerCase() === command.config.name ||
                    (command.config.alias && command.config.alias.includes(event.body.toLowerCase()))
                );
            });

            if (commandToRun) {
                commandToRun.onRun({ api, event });
            }
            break;
    }
}


function onLoadCommands ({ api }) {
    loadedCommands.forEach(runner => {
        if (runner.onLoad) {
            runner.onLoad({ api });
        }
    });
}

module.exports = { system_handler, onLoadCommands };
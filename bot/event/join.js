async function join_event(api, event) {
    if (event.logMessageData.addedParticipants[0].userFbId === api.getCurrentUserID()) {
        return api.sendMessage("Thank you for inviting me 😊\nNote: This is a automated message ⚠", event.threadID);
    }

    return api.sendMessage("New user detected ⚠", event.threadID);
}

module.exports = { join_event };
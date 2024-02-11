async function left_event(api, event) {
    if (event.logMessageData.leftParticipantFbId === api.getCurrentUserID()) return;
    return api.sendMessage("User left detected ⚠", event.threadID);
}

module.exports = { left_event };
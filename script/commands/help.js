const _ = require('lodash');

const myArray = global.utils.config;
const itemsPerPage = 10;
const capitalizeFirstLetter = (inputString) => `${inputString.charAt(0).toUpperCase()}${inputString.slice(1)}`;

module.exports = {
    config: {
        name: "help",
        alias: "",
        version: 1.0,
        author: "Saludes, Kim Eduard",
        role: 0,
        countdown: 0,
        description: "List of existing commands.",
        category: "group",
        guide: ""
    },
    onRun: async function ({ api, event, args }) {
        let currentPage = 1;
        if (args[0] < 1 || args[0] > Math.ceil(myArray.length / itemsPerPage)) {
            return await api.sendMessage(`⚠ Page does not exist ⚠\nTotal Page/s: '${myArray.length}'.`, event.threadID, event.messageID);
        } else if (args && args > 0) {
            currentPage = args[0];
        }
        const result = paginateArray(myArray, currentPage, itemsPerPage);
        let msg = `== Command list ==\n`;
        result.data.forEach((element, index) => {
            msg += `${index + 1}. ${capitalizeFirstLetter(element.config.name)}\n`;
        });
        msg += `Current page "${result.currentPage}" of "${result.totalPages}"`;
        await api.sendMessage(msg, event.threadID);
    }
};

function paginateArray(array, currentPage, itemsPerPage) {

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, array.length);

    const paginatedItems = _.slice(array, startIndex, endIndex);

    return {
        totalItems: array.length,
        totalPages: Math.ceil(array.length / itemsPerPage),
        currentPage,
        itemsPerPage,
        data: paginatedItems,
    };
}
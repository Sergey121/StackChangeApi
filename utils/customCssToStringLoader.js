const loaderUtils = require("loader-utils");

module.exports = function() {};

module.exports.pitch = function(remainingRequest) {
    if (this.cacheable) {
        this.cacheable();
    }

    return `
        var result = require(${loaderUtils.stringifyRequest(this, "!!" + remainingRequest)});

        if (typeof result === "string") {
            module.exports = {
                style: result 
            };
        } else {
            module.exports = {
                style: result.toString() 
            };
        }
    `;
};

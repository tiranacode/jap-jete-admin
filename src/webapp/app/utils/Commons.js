'use strict';

export default class CommonUtils {
    /**
     * Get query String from object
     * @param obj
     * @returns {string}
     */
    static getQueryStringFromObject(obj) {
        if (!obj) {
            return "";
        } else {
            var result = "?";
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result += (key + "=" + obj[key] + "&");
                }
            }
            return result;
        }
    }
}
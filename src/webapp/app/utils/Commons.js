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
    
    /**
     * Get dd/mm/yyyy format of date
     * @param date
     * @returns {string}
     */
    static getFormattedDate(timestamp) {
        var date = new Date(timestamp * 1000);
        return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    }

    /**
     * Get hh:mm format of date
     * @param date
     * @returns {string}
     */
    static getFormattedTime(timestamp) {
        var date = new Date(timestamp * 1000);
        return date.getHours() + ":" + date.getMinutes();
    }
}
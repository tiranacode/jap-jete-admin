/**
 * This configuration provides URLS and Endpoints
 */

var API_URL = "/api/v1/";

export const Endpoints = {
    BloodTypes: API_URL + "blood-types",
    Users: API_URL + "users",
    FacebookPicture: "http://graph.facebook.com/{0}/picture?width=150"
};

export const HttpHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
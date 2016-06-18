/**
 * This configuration provides URLS and Endpoints
 */

var API_URL = "/api/v1/";

export const Endpoints = {
    BloodTypes: API_URL + "blood-types",
    Users: API_URL + "users",
    FacebookPicture: "http://graph.facebook.com/{0}/picture?width=150",
    CampaignsList: API_URL + "hospitals/campaigns/",
    CreateCampaign: API_URL + "hospitals/campaigns/",
    UpdateCampaign: API_URL + "hospitals/campaign/{0}",
    DeactivateCampaign: API_URL + "hospitals/campaign/{0}", //DELETE
    ActivateCampaign: API_URL + "hospitals/campaign/{0}/activate/",
    Login: API_URL + "hospitals/login/",
    UpdateHospital: API_URL + "hospitals/users/edit/"
};

export const HttpHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
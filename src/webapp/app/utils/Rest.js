import {HttpHeaders} from './../configs/Url'
import CommonUtils from './Commons'

export default class Rest {

    /**
     * READ (GET Request)
     * @param url
     * @param params
     * @param success
     * @param error
     * @constructor
     */
    static read(url, params, success, error) {
        return fetch(url + CommonUtils.getQueryStringFromObject(params), {
            method: 'GET'
        }).then((res) => success(res)).catch((res) => error(res))
    }

    /**
     * READJSON (GET Request as JSON)
     * @param url
     * @param params
     * @param success
     * @param error
     * @constructor
     */
    static readJSON(url, params, success, error) {
        return fetch(url + CommonUtils.getQueryStringFromObject(params), {
            method: 'GET',
            headers: HttpHeaders
        }).then((res) =>  {
           res.json().then( (res) => success(res) );
        } ).catch((res) => error(res))
    }


    /**
     * CREATE (Post Request, Get response as JSON)
     * @param url
     * @param body
     * @param success
     * @param error
     * @constructor
     */
    static createJSON(url, body, success, error) {
        fetch(url, {
            method: 'POST',
            headers: HttpHeaders,
            body: JSON.stringify(body)
        }).then((res) => {
            res.json().then( (res) => success(res) );
        }).catch((res) => error(res))
    }
    
    /**
     * CREATE (Post Request)
     * @param url
     * @param body
     * @param success
     * @param error
     * @constructor
     */
    static create(url, body, success, error) {
        fetch(url, {
            method: 'POST',
            headers: HttpHeaders,
            body: JSON.stringify(body)
        }).then((res) => success(res)).catch((res) => error(res))
    }

    /**
     * UPDATE (POST Request)
     * @param url
     * @param body
     * @param success
     * @param error
     * @constructor
     */
    static update(url, body, success, error) {
        fetch(url, {
            method: 'PUT',
            headers: HttpHeaders,
            body: JSON.stringify(body)
        }).then((res) => {
            res.json().then( (res) => success(res) );    
        }).catch((res) => error(res))
    }

    /**
     * Delete (DELETE Request)
     * @param url
     * @param param
     * @param success
     * @param error
     * @constructor
     */
    static delete(url, param, success, error) {
        //TODO - Create Query Params
        fetch(url + CommonUtils.getQueryStringFromObject(param), {
            method: 'DELETE',
            headers: HttpHeaders,
            body: JSON.stringify(body)
        }).then((res) => {
            res.json().then( (res) => success(res) );    
        }).catch((res) => error(res))
    }


}
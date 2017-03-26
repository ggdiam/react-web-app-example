/**
 * Created by Alexander Sveshnikov on 29.11.16.
 */
import request from 'superagent';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

const apiPath = 'https://tapnews.ru/api/v2';
const apiPathServer = 'https://tapnews.ru/api/v2';

const getUrl = (path) => {
    if (path.startsWith('http') || path.startsWith('https')) {
        return path;
    }
    else {//на сервере - делаем запросы напрямую в api.inna.ru, на клиенте - через m.inna.ru
        return canUseDOM ? `${apiPath}${path}` : `${apiPathServer}${path}`;
    }
};

const ApiClient = {

    get: (path, params) => new Promise((resolve, reject) => {
        request
            .get(getUrl(path))
            .query(params)
            .accept('application/json')
            .use(noCache)
            .end((err, res) => {
                if (err) {
                    if (err.status === 404) {
                        resolve(null);
                    } else {
                        //reject(err);
                        handleError(err, reject);
                    }
                } else {
                    resolve(res.body);
                }
            });
    }),

    post: (path, params) => new Promise((resolve, reject) => {
        request
            .post(getUrl(path))
            .set('Content-Type', 'application/json')
            .send(params)
            .accept('application/json')
            .end((err, res) => {
                if (err) {
                    if (err.status === 404) {
                        resolve(null);
                    } else {
                        //reject(err);
                        handleError(err, reject);
                    }
                } else {
                    resolve(res.body);
                }
            });
    }),

    //just for debug
    test: (isSuccess) => new Promise((resolve, reject)=>{
        if (isSuccess) {
            resolve(isSuccess);
        }
        else {
            reject(isSuccess);
        }
    })
};

function handleError(err, reject) {
    var resErr = {
        message: err.response && err.response.body ? err.response.body.Message : err.message,
        status: err.status
    };
    console.log('error', err.message, err.status);
    reject(resErr);
}

function noCache(request) {
    request.set('X-Requested-With', 'XMLHttpRequest');
    request.set('Expires', '-1');
    request.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1,private');

    with_query_strings(request);

    return request;
}

function with_query_strings (request) {
    var timestamp = Date.now().toString();
    if (request._query !== undefined && request._query[0]) {
        request._query[0] += '&' + timestamp
    } else {
        request._query = [timestamp]
    }

    return request;
}

export default ApiClient;

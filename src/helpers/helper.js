/**
 * Created by Alexander on 25.03.2017.
 */

export function trackEvent(eventName, sourceName, link) {
    window.ga('send', 'event', `${eventName} ${sourceName}`, link);
}

export function proxyUrlsInContent(html) {
    //меняем в src http:// на /proxy/
    html = html.replace(/(<img.*?src=['"])(http:\/\/)(.*?["']>)/g, "$1/proxy/$3");
    //youtube.com
    html = html.replace(/(<iframe.*?src=['"])(http:\/\/)(.*youtube.com.*?["'].*>)/g, "$1https://$3");
    // html = html.replace(/(<iframe.*?src=['"])(http:\/\/)(.*?["']>)/g, "$1/proxy/$3");
    html = html.replace(/(<a.*?href=['"])(http:\/\/)(.*?["']>)/g, "$1/redirect/$3");
    // html = html.replace(/http:\/\//g, '/proxy/');
    return html;
}

export function proxyHttpUrl(url) {
    if (url.indexOf('https') == -1) {
        //не https - значит проксируем
        url = url.replace('http://', '/proxy/');
    }
    return url;
}

export function getLinkKey(link, guid) {
    return `${link}:${guid}`;
}
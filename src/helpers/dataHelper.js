/**
 * Created by Alexander Sveshnikov on 26.01.17.
 */

export function needToReloadData(data, timestamp) {
    var now = +(new Date());

    var stamp = timestamp + 600000;//10 min
    // var stamp = timestamp + 4000;//4 sec

    var res = (now > stamp) || (!data || data.length == 0);

    // console.log('needToReloadData len', data.length, 'res', res);
    // console.log('now', pd(now));
    // console.log('stamp', pd(stamp));
    return res;
}

function pd(timestamp) {
    return new Date(timestamp);
}
/**
 * Created by Alexander Sveshnikov on 29.11.16.
 */

export function addClass(element, className) {
    // console.log('addClass');
    var classes = element.className;
    if (classes.indexOf(className) == -1) {
        classes += ` ${className}`;
    }
    element.className = classes;
}

export function removeClass(element, className) {
    // console.log('removeClass');
    var classes = element.className;

    if (classes.indexOf(className) != -1) {
        classes = classes.replace(` ${className}`, '');
        element.className = classes;
    }
}

export function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export function getScrollTop() {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    return top;
}

export function getScrollLeft() {
    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    return left;
}

function getNodeStyle(node, prop) {
    return getComputedStyle(node, null).getPropertyValue(prop);
}

export function getOverflowParent(node) {
    if (node == document.body) {
        return node;
    }
    var overflowY = getNodeStyle(node, "overflow-y");
    var overflowX = getNodeStyle(node, "overflow-x");
    var everyOverflow = getNodeStyle(node, "overflow") + overflowX + overflowY;
    if (/(auto|scroll)/.test(everyOverflow)) {
        return node;
    }

    if (overflowY != "" && overflowX != "" && overflowY != overflowX && (overflowY == "visible" || overflowX == "visible")) {
        // http://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
        // Это очень неявное поведение, которое тем не менее зашито в спеке.
        // Если по одной оси visible, а по другой что-то кроме visible, то по первой оси будет auto
        // всё было бы норм, если бы IE при этом не врал в функции getNodeStyle
        // Я не нашёл способа как в IE задетектировать факт этой подмены - он продолжает убеждать,
        // что значение переполнения всё ещё visible хотя сам отлично скроллит
        return node;
    }
    return getOverflowParent(node.parentElement);
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function getFormattedDate(date) {
    var now = new Date();
    var nowDay = now.getDate();

    var yest = new Date();
    yest.setDate(yest.getDate() - 1);
    var yesterDay = yest.getDate();

    var day = date.getDate();

    var hoursString = addZero(date.getHours());
    var minutesString = addZero(date.getMinutes());
    var dayString = addZero(day);
    var monthString = addZero(date.getMonth() + 1);
    var yearString = date.getFullYear();

    var wordString = '';
    if (day == nowDay) {
        wordString = 'Сегодня ';
    }
    else if (day == yesterDay) {
        wordString = 'Вчера ';
    }

    if (wordString) {
        return `${wordString}${hoursString}:${minutesString}`;
    }
    else {
        return `${dayString}.${monthString}.${yearString}`;
    }
}

export function getScreenSize() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return {
        x, y
    }
}

function addZero(num) {
    num = parseInt(num);
    if (num < 10) {
        return '0' + num;
    }
    return '' + num;
}

export function getFormattedDate2(date) {
    var nowMillis = new Date().getTime();
    var dateMillis = date.getTime();

    var diffMillis = nowMillis - dateMillis;

    var diffDays = Math.floor(diffMillis / (1000 * 3600 * 24));
    var diffHours = Math.floor(diffMillis / (1000 * 3600));
    var diffMinutes = Math.floor(diffMillis / (1000 * 60));
    var diffSeconds = Math.floor(diffMillis / (1000));

    if (diffDays > 0) {
        return diffDays + 'д назад';
    }
    else if (diffHours > 0) {
        return diffHours + 'ч назад';
    }
    else if (diffMinutes > 0) {
        return diffMinutes + 'м назад';
    }
    else if (diffSeconds > 0) {
        return diffSeconds + 'с назад';
    }

    // console.log('diffDays', diffDays);
    // console.log('diffHours', diffHours);
    // console.log('diffMinutes', diffMinutes);
    // console.log('diffSeconds', diffSeconds);
    //
    // console.log('---------');

    return `${date.getDate()}.${date.getMonth() + 1}`;
}

export function getTitle(text) {
    if (text) {
        return `Tap News - ${text}`;
    }

    return 'Tap News';
}
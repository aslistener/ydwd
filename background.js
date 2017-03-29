const API = 'http://fanyi.youdao.com/openapi.do?keyfrom=f2ec-org&key=1787962561&type=data&doctype=json&version=1.1&q=';

browser.contextMenus.create({
    id: 'translate-selection',
    title: '翻译"%s"',
    contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
    let word = info.selectionText;
    let http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let content = parseResponse(http.responseText);
            showExplains(word,content);
        }
    }
    http.open('GET', API + word, true);
    http.send();
});

String.format = function () {
    if (arguments.length == 0)
        return null;

    let str = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
        let re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

function parseResponse(result) {
    result = JSON.parse(result);
    let content = '';
    if (result.errorCode == 0) {
        let query = result.query;
        if (result.basic) {
            if (result.basic['us-phonetic']) {
                content += String.format('美[{0}]', result.basic['us-phonetic']);
            }
            if (content.length > 0) {
                content += '  ';
            }
            if (result.basic['uk-phonetic']) {
                content += String.format('英[{0}]', result.basic['uk-phonetic']);
            }
            if (content.length > 0) {
                content += '\n';
            }
            if (result.basic.explains) {
                for (let index in result.basic.explains) {
                    content += String.format('{0}\n', result.basic.explains[index]);
                }
            }
        } else if (result.translation && result.translation.length > 0) {
            content += result.translation[0];
        }

    }
    if (content.length == 0) {
        content = '没有找到释义';
    }
    return content;

}

function showExplains(word, explains) {
    browser.notifications.clear('ydwd-notification')
    browser.notifications.create('ydwd-notification', {
        "type": "basic",
        "title": word,
        "message": explains
    });
}

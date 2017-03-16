function onCreated(n) {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Item created successfully");
    }
}

const API = 'http://fanyi.youdao.com/openapi.do?keyfrom=f2ec-org&key=1787962561&type=data&doctype=json&version=1.1&q=';

function query(word) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            showExplain(http.responseText);
        }
    }
    http.open('GET', API + word, true);
    http.send();
}
String.format = function () {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}
function showExplain(result) {

    result = JSON.parse(result);
    console.log(result);
    var content = '';
    if (result.errorCode == 0) {
        var query = result.query;
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
                for (var index in result.basic.explains) {
                    content += String.format('{0}\n', result.basic.explains[index]);
                }
            }
        }

    }
    if (content.length == 0) {
        content = '没有找到释义';
    }

    browser.notifications.create({
        "type": "basic",
        "title": query,
        "message": content
    });
}

browser.contextMenus.create({
    id: 'translate-selection',
    title: '翻译"%s"',
    contexts: ["selection"]
}, onCreated);

browser.contextMenus.onClicked.addListener(function (info, tab) {
    var word = info.selectionText;
    query(word);
});
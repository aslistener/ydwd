const API = 'http://fanyi.youdao.com/openapi.do?keyfrom=Firefox-addon-ydwd&key=1451433447&type=data&doctype=json&version=1.1&q={0}';

browser.contextMenus.create({
    id: 'translate-selection',
    title: '翻译"%s"',
    contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
    let word = info.selectionText;
    translate(word);
});

browser.commands.onCommand.addListener(function (command) {
    if (command == "ydwd-translate") {
        browser.tabs.query({ active: true, currentWindow: true })
            .then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, { action: 'fetch' })
                    .then(response => {
                        if (response && response.word) {
                            translate(response.word);
                        }
                    });
            });
    }
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

function translate(word) {
    let http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let content = parseResponse(http.responseText);
            showExplains(word, content);
        }
    }
    http.open('GET', String.format(API, word), true);
    http.send();
}

function parseResponse(result) {
    result = JSON.parse(result);
    let content = {
        phonetics: [],
        explains: [],
        web: []
    };
    if (result.errorCode == 0) {
        let query = result.query;
        if (result.basic) {
            if (result.basic['us-phonetic']) {
                content.phonetics.push(String.format('美[{0}]', result.basic['us-phonetic']));
            }
            if (result.basic['uk-phonetic']) {
                content.phonetics.push(String.format('英[{0}]', result.basic['uk-phonetic']));
            }
            if (result.basic.explains) {
                for (let index in result.basic.explains) {
                    content.explains.push(result.basic.explains[index]);
                }
            }
        }
        if (result.web) {
            for (let i in result.web) {
                obj = result.web[i];
                content.web.push({ key: obj.key, value: obj.value.join(';') });
            }
        }
        if (content.explains.length == 0 && result.translation && result.translation.length > 0) {
            content.explains.push(result.translation[0]);
        }

    }
    if (content.explains.length == 0) {
        content.explains.push('没有找到释义');
    }
    return content;

}

function showExplains(word, explains) {
    let tabs = browser.tabs.query({ active: true, currentWindow: true });
    tabs.then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { action: 'show', word: word, explains: explains });
    })
}

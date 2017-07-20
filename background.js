
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

function postAjax(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
        function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url + "?" + params, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status == 200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('Content-Encoding', 'gzip');
    xhr.send();
    return xhr;
}

function translate(word) {
    let request = {
        "jsonversion": "2",
        "client": "mobile",
        "q": undefined,
        "dicts": "{\"count\":99,\"dicts\":[[\"ec\",\"ce\",\"hh\"],[\"web_trans\"],[\"fanyi\"]]}",
        "keyfrom": "mdict.7.4.2.android",
        "model": "OD105",
        "mid": "7.1.1",
        "imei": "99000869048590",
        "vendor": "union53",
        "screen": "1080x1920",
        "ssid": "Lawrence-lyra",
        "network": "wifi",
        "abtest": "8",
        "xmlVersion": "5.1"
    }
    request.q = word;
    postAjax('http://dict.youdao.com/jsonapi', request, result => {
        let json = JSON.parse(result);
        showExplains(word, parseResponse(json));
    })
}

function parseResponse(result) {
    let content = {
        phonetics: [],
        explains: [],
        web: []
    };
    let word = undefined;
    if (result.ec) {
        word = result.ec.word[0];
        if (word.usphone) {
            phonetic = {};
            phonetic.value = String.format('美[{0}]', word.usphone);
            if (word.usspeech) {
                phonetic.speech = word.usspeech;
            }
            content.phonetics.push(phonetic);
        }
        if (word.ukphone) {
            phonetic = {};
            phonetic.value = String.format('英[{0}]', word.ukphone);
            if (word.ukspeech) {
                phonetic.speech = word.ukspeech;
            }
            content.phonetics.push(phonetic);
        }
        if (content.phonetics.length == 0 && word.phone) {
            phonetic = {};
            phonetic.value = String.format('[{0}]', word.phone);
            if (word.speech) {
                phonetic.speech = word.speech;
            }
            content.phonetics.push(phonetic);
        }
        if (word.trs) {
            word.trs.forEach((item) => {
                let explain = item.tr[0].l.i[0];
                if (item.tr[0].l.i[1]) {
                    explain += item.tr[0].l.i[1]['#text'];
                }
                content.explains.push(explain);
            })
        }
    }

    if (result.ce) {
        word = result.ce.word[0];
        if (word.phone) {
            phonetic = {};
            phonetic.value = word.phone;
            content.phonetics.push(phonetic);
        }
        if (word.trs) {
            let explains = [];
            word.trs.forEach((item) => {
                let explain = item.tr[0].l.i[0];
                if (item.tr[0].l.i[1]) {
                    explain += item.tr[0].l.i[1]['#text'];
                }
                explains.push(explain);
            })
            content.explains.push(explains.join("; "));
        }
    }

    if (result.hh) {
        word = result.hh.word[0];
        if (content.phonetics.length == 0 && word.phone) {
            phonetic = {};
            phonetic.value = word.phone;
            content.phonetics.push(phonetic);
        }
        if (word.trs) {
            word.trs.tr.forEach((item, i) => {
                content.explains.push((i + 1) + ". " + item.l.i);
            })
        }
    }

    if (result.web_trans) {
        result.web_trans['web-translation'].forEach(item => {
            if (content.web.length < 5) {
                let key = item.key;
                if (key != result.input) {
                    let values = [];
                    item.trans.forEach(v => {
                        values.push(v.value)
                    })
                    content.web.push({ key: key, value: values[0] });
                }

            }
        })
    }

    if (result.fanyi && result.fanyi.tran) {
        content.explains.push(result.fanyi.tran);
    }
    return content;
}

function showExplains(word, explains) {
    let tabs = browser.tabs.query({ active: true, currentWindow: true });
    tabs.then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { action: 'show', word: word, explains: explains });
    })
}

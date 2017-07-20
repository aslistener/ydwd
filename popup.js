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

var popup = {
    word: undefined,
    content: undefined,
    dom: undefined,
    timeoutId: undefined,

    render: function () {
        let wrapper = this.createElement('div', "id", "ydwd-wrapper");

        let closeButton = this.createElement('button', "class", "ydwd-close");
        closeButton.textContent = '+';
        closeButton.addEventListener("click", () => {
            this.close();
        });
        wrapper.appendChild(closeButton);

        let content = this.createElement('div', "id", "ydwd-content");

        let word = this.createElement('h1', "id", "ydwd-word");
        word.textContent = this.word;
        content.appendChild(word);

        let phonetics = this.createElement("div", "id", "ydwd-phonetics");
        this.content.phonetics.forEach(phonetic => {
            let node = this.createElement("span", "class", "ydwd-phonetics-inline");
            node.textContent = phonetic.value;
            if (phonetic.speech) {
                node.className += ' ydwd-speech'
                node.addEventListener("click", () => {
                    this.ydwd_play_voice(phonetic.speech)
                })
            }
            phonetics.appendChild(node);
        })
        content.appendChild(phonetics);

        let explains = this.createElement("div", "id", "ydwd-explains");
        for (let i in this.content.explains) {
            let node = this.createElement("p", "class", "ydwd-explain")
            node.textContent = this.content.explains[i];
            explains.appendChild(node);
        }
        content.appendChild(explains);

        let web = this.createElement("div", "id", "ydwd-extends");
        for (let i in this.content.web) {
            let node = this.createElement("p", "class", "ydwd-extend");
            let key = this.createElement("span", "class", "ydwd-extend-key");
            key.textContent = this.content.web[i].key + ":";
            let value = document.createElement("span");
            value.textContent = this.content.web[i].value;
            node.appendChild(key);
            node.appendChild(value);
            web.appendChild(node);
        }
        content.appendChild(web);

        wrapper.appendChild(content);
        this.dom = wrapper;
        document.body.appendChild(this.dom);
    },
    show: function (word, content) {
        if (this.dom) {
            this.close();
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.word = word;
        this.content = content;
        this.render();
        ref = this;
        this.timeoutId = setTimeout(function () {
            if (ref.dom) {
                ref.close();
            }
        }, 25000);
    },
    close: function () {
        this.dom.parentNode.removeChild(this.dom);
        this.dom = undefined;
        this.word = undefined;
    },
    createElement: function (name, attr, value) {
        let node = document.createElement(name);
        if (attr) {
            node.setAttribute(attr, value);
        }
        return node;
    },
    getCurrentWord: function () {
        return this.word;
    },
    ydwd_play_voice: function (speech) {
        let url = String.format('https://dict.youdao.com/dictvoice?audio={0}&keyfrom=mdict.7.4.2.android&model=OD105&mid=7.1.1&imei=99000869048590&vendor=union53&screen=1080x1920&ssid=Lawrence-lyra&network=wifi&abtest=8', speech);
        let audio = new Audio(url)
        audio.play()
    }
}
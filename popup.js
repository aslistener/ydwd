
var popup = {
    word: undefined,
    content: undefined,
    dom: undefined,
    timeoutId: undefined,

    render: function () {
        if (this.dom) {
            this.close();
        }

        let wrapper = document.createElement('div');
        wrapper.style.cssText = "background:rgba(255, 255, 255, 1.0);\
                                position: fixed;\
                                width: 250px;\
                                right: 5px;\
                                bottom: 5px;\
                                box-sizing: border-box;\
                                border: 1px solid lightgray;\
                                z-index: 999;\
                                overflow: hidden;"

        let closeButton = document.createElement('button');
        closeButton.textContent = '+';
        closeButton.style.cssText = "all: initial;\
                                    position: absolute;\
                                    transform: rotate(45deg);\
                                    height:16px;\
                                    width: 16px;\
                                    line-height: 16px !important;\
                                    right: 2px;\
                                    top: 2px;\
                                    border-radius: 50%;\
                                    background-color: white;\
                                    font-size: 14px;\
                                    font-weight: 100 !important;\
                                    text-align: center !important;\
                                    font-family: arial,'Hiragino Sans GB','Microsoft Yahei','微软雅黑','宋体',Tahoma,Arial,Helvetica,STHeiti !important;";
        closeButton.addEventListener("click", () => {
            this.close();
        });
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = 'lightgray';
            closeButton.style.color = 'white';
        })
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = 'white';
            closeButton.style.color = 'black';
        })
        wrapper.appendChild(closeButton);

        let box = document.createElement('div');
        box.style.cssText = "max-height: 500px;\
                             box-sizing: border-box;\
                             padding: 10px;\
                             overflow: auto;";

        let word = document.createElement('h1');
        word.textContent = this.word;
        word.style.cssText = "all: initial;\
                              display: block;\
                              font-size: 14px !important;\
                              color: #1a1a1a !important;\
                              font-family: 'Microsoft Yahei','微软雅黑',arial,'Hiragino Sans GB','宋体',Tahoma,Arial,Helvetica,STHeiti !important;\
                              font-weight: bold;";
        box.appendChild(word);

        let blockCss = "all: initial !important;\
                    display: block !important;\
                    margin-top: 10px !important;";
        let lineCss = "all: initial !important;\
                    display: block !important;\
                    font-size: 12px !important;\
                    color: #1a1a1a !important;\
                    font-family: 'Microsoft Yahei','微软雅黑',arial,'Hiragino Sans GB','宋体',Tahoma,Arial,Helvetica,STHeiti !important";
        let inlineCss = "margin-right: 5px !important;\
                    font-size: 12px !important;";

        let phonetics = this.createNode("div", blockCss, undefined);
        for (let i in this.content.phonetics) {
            let node = this.createNode("span", inlineCss, this.content.phonetics[i]);
            phonetics.appendChild(node);
        }
        box.appendChild(phonetics);

        let explains = this.createNode("div", blockCss, undefined);
        for (let i in this.content.explains) {
            let node = this.createNode("p", lineCss, this.content.explains[i])
            explains.appendChild(node);
        }
        box.appendChild(explains);

        let web = this.createNode("div", blockCss, undefined);
        for (let i in this.content.web) {
            let node = this.createNode("p", lineCss, undefined);
            let key = this.createNode("span", "font-weight: bold !important;", this.content.web[i].key + ":");
            let value = this.createNode("span", undefined, this.content.web[i].value);
            node.appendChild(key);
            node.appendChild(value);
            web.appendChild(node);
        }
        box.appendChild(web);

        wrapper.appendChild(box);
        this.dom = wrapper;
        document.body.appendChild(this.dom);
    },
    show: function (word, content) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.word = word;
        this.content = content;
        this.render();
        ref = this;
        this.timeoutId = setTimeout(function () {
            ref.close();
        }, 20000);
    },
    close: function () {
        this.dom.parentNode.removeChild(this.dom);
        this.dom = undefined;
        this.word = undefined;
    },
    createNode: function (name, cssText, textContent) {
        let node = document.createElement(name);
        if (cssText) {
            node.style.cssText = cssText;
        }
        if (textContent) {
            node.textContent = textContent;
        }
        return node;
    },
    getCurrentWord: function(){
        return this.word;
    }
}
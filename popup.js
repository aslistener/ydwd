
var popup = {
    word: undefined,
    explains: undefined,
    dom: undefined,
    timeoutId: undefined,

    render: function () {
        if (this.dom) {
            this.close();
        }
        let wrapper = document.createElement('div');
        wrapper.style.cssText = "background:rgba(255, 255, 255, 0.95);\
                                width: 350px;\
                                font-family: arial,'Hiragino Sans GB','Microsoft Yahei','微软雅黑','宋体',Tahoma,Arial,Helvetica,STHeiti;\
                                font-size: 14px;\
                                position: fixed;\
                                right: 5px;\
                                bottom: 5px;\
                                -moz-box-sizing: border-box;\
                                padding-bottom: 10px;\
                                box-shadow: -2px -2px 5px #E0E0E0;\
                                border: 1px solid lightgray;\
                                z-index: 999;\
                                overflow: hidden;"
        let box = document.createElement('div');
        box.style.cssText = "max-height: 500px;\
                             overflow: auto;";

        let closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = "all: initial;\
                                    height:20px;\
                                    float: right;\
                                    font-size: 12px;\
                                    font-family: arial,'Hiragino Sans GB','Microsoft Yahei','微软雅黑','宋体',Tahoma,Arial,Helvetica,STHeiti;\
                                    border: 1px solid white\
                                    z-index: 999;";
        closeButton.addEventListener("click", () => {
            this.close();
        });
        box.appendChild(closeButton);

        let word = document.createElement('h1');
        word.textContent = this.word;
        word.style.cssText = "all: initial;\
                              display: block;\
                              font-size: 16px;\
                              padding-left: 15px;\
                              padding-right: 15px;\
                              padding-top:10px;\
                              padding-bottom: 5px;\
                              font-family: arial,'Hiragino Sans GB','Microsoft Yahei','微软雅黑','宋体',Tahoma,Arial,Helvetica,STHeiti;\
                              font-weight: bold;";
        box.appendChild(word);

        let body = document.createElement("p");
        body.innerHTML = this.explains;
        body.style.cssText = "all: initial;\
                              display: block;\
                              font-size: 14px;\
                              padding-left: 15px;\
                              padding-right: 15px;\
                              font-family: arial,'Hiragino Sans GB','Microsoft Yahei','微软雅黑','宋体',Tahoma,Arial,Helvetica,STHeiti";
        box.appendChild(body);
        wrapper.appendChild(box);
        this.dom = wrapper;
        document.body.appendChild(this.dom);
    },
    show: function (word, explains) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.word = word;
        this.explains = explains;
        this.render();
        ref = this;
        let timeout = explains.length / 12.0 * 1000;
        if (timeout < 5000) {
            timeout = 5000;
        }
        this.timeoutId = setTimeout(function () {
            ref.close();
        }, timeout);
    },
    close: function () {
        this.dom.parentNode.removeChild(this.dom);
        this.dom = undefined;
    }
}
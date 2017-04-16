browser.runtime.onMessage.addListener((msg) => {
    if (msg.action == 'show') {
        explains = msg.explains.replace(/\n/g, '<br/>');
        popup.show(msg.word, explains);
    } else if (msg.action == 'fetch') {
        let word = window.getSelection().toString();
        return Promise.resolve({ word: word });
    }
});
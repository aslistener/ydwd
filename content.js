browser.runtime.onMessage.addListener((msg) => {
    if (msg.action == 'show') {
        popup.show(msg.word, msg.explains);
    } else if (msg.action == 'fetch') {
        let word = window.getSelection().toString();
        return Promise.resolve({ word: word });
    }
});
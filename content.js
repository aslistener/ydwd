browser.runtime.onMessage.addListener((msg) => {
    if (msg.action == 'show') {
        popup.show(msg.word, msg.explains);
    } else if (msg.action == 'fetch') {
        let word = window.getSelection().toString();
        if(popup && (word==undefined || word=='' || word==popup.getCurrentWord())){
            popup.close();
        }else{
            return Promise.resolve({ word: word });
        }
    }
});
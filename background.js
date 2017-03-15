function onCreated(n) {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Item created successfully");
    }
}

browser.contextMenus.create({
    id: 'translate-selection',
    title: '翻译"%s"',
    contexts: ["selection"]
}, onCreated);

browser.contextMenus.onClicked.addListener(function (info, tab) {
    var word = info.selectionText;
    //TODO
    //1. Query the meaning by Youdao API(http://fanyi.youdao.com/openapi.do?keyfrom=f2ec-org&key=1787962561&type=data&doctype=json&version=1.1&q=good)
    //2. Dispay the result in the DOM
});
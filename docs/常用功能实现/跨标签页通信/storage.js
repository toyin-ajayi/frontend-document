// pageA
window.addEventListener('storage', function (evt) {
    if(evt.key==='msg')
       console.log(evt.newValue);
});

// pageB
function sendMsg(text) {
    window.localStorage.setItem('msg',text);
}
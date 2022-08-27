```tsx
/* 获取CSS样式 */
function getCss(element, attr) {
    let value = window.getComputedStyle(element)[attr],
        reg = /^\d+(px|rem|em)?$/i;
    if (reg.test(value)) {
        value = parseFloat(value);
    }
    return value;
}
/* 设置CSS样式：单个设置 */
function setCss(element, attr, value) {
    if (attr === "opacity") {
        element['style']['opacity'] = value;
        element['style']['filter'] = `alpha(opacity=${value*100})`;
        return;
    }
    let reg = /^(width|height|margin|padding)?(top|left|bottom|right)?$/i;
    if (reg.test(attr)) {

        if (!isNaN(value)) {
            value += 'px';
        }
    }
    element['style'][attr] = value;
}
/* 设置CSS样式：对象形式设置 */
function setGroupCss(element, options) {
    for (let key in options) {
        if (!options.hasOwnProperty(key)) break;
        setCss(element, key, options[key]);
    }
}

function css(element) {
    let len = arguments.length,
        attr = arguments[1],
        value = arguments[2];
    if (len >= 3) {
        // 单一设置样式
        setCss(element, attr, value);
        return;
    }
    if (attr !== null && typeof attr === "object") {
        // 批量设置
        setGroupCss(element, attr);
        return;
    }
    // 获取样式
    return getCss(element, attr);
}

```
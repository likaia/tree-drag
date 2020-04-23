/**
 * 安慕希: JSON转DOM解析器
 * @param data
 * @param tabSize
 * @returns {*|string}
 */
function JsonToDomParser(data, tabSize = 0) {
    if (!Array.isArray(data)) {
        data = [data]
    }
    return data.reduce((result, item) => {
        if (item.children) {
            return `${result}${genTab(tabSize)}<li>${item.value}\n${genTab(tabSize)}<ul>\n${JsonToDomParser(item.children, tabSize + 1)}${genTab(tabSize)}</ul>\n${genTab(tabSize)}</li>\n`
        }
        return `${result}\t${genTab(tabSize)}<li>${item.value}</li>\n`
    }, '')
}

/**
 * 安慕希：生成标签之间的空格
 * @param n
 * @returns {any}
 */
function genTab(n) {
    return new Array(n).fill(1).reduce(result => result + '\t', '')
}

/**
 * Dom字符串转Dom对象
 * @param arg
 * @returns {NodeListOf<ChildNode>}
 * @constructor
 */
function DomStrToDomObj(arg) {
    let DomObj = document.createElement("div");
    DomObj.innerHTML = arg;
    return DomObj.childNodes;
}
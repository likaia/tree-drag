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
            return `${result}${genTab(tabSize)}<li data-id="${item.id}"><p>${item.value}</p>\n${genTab(tabSize)}<ul>\n${JsonToDomParser(item.children, tabSize + 1)}${genTab(tabSize)}</ul>\n${genTab(tabSize)}</li>\n`
        }
        return `${result}\t${genTab(tabSize)}<li data-id="${item.id}"><p>${item.value}</p></li>\n`
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
 * DOM转JSON解析器
 * @param DomTree
 * @constructor
 */
function DomToJsonParser(DomTree) {
    let jsonTree = {};
    for (let i = 0; i < DomTree.length; i++) {
        jsonTree.id = DomTree.eq(i).attr("data-id");
        jsonTree.value = DomTree.eq(i).find(">p").html();
        jsonTree.children = getChildren(DomTree);
    }
    return jsonTree;
}

/**
 * 获取子结点dom
 * @param obj
 * @returns {[]}
 */
function getChildren(obj) {
    let list = [];
    // 遍历当前li的所有结点
    obj.find('>ul>li').each(function () {
        let area = {};
        area.value = $(this).find('>p').html();
        area.id = $(this).attr('data-id');
        if ($(this).find('>ul>li').length > 0) {
            // 递归子节点
            area.children = getChildren($(this));
        }
        list.push(area);
    });
    return list;
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

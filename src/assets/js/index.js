/**
 * 渲染页面
 * @param dataTree 需要渲染的树形JSON
 * @param DomNode 接收渲染结果的dom结点
 * @param isDrag
 */
const renderPage = function (dataTree = {}, DomNode = "#chart", isDrag = true) {
    // Dom字符串转Dom对象
    const org = $(JsonToDomParser(dataTree));
    // 清空页面
    $(DomNode).empty()
    // 渲染页面
    return org.treeDrag({
        chartElement: DomNode,
        dragAndDrop: isDrag,
        clickCallback: nodeClickFn,
        rightClickCallback: nodeRightClickFn
    });
};

const nodeClickFn = (nodeId) =>{
    console.log("节点点击了",nodeId)
}

const nodeRightClickFn = (mouseEvent, nodeObj) => {
    console.log("元素右击", mouseEvent, nodeObj)
}

let treeData = {};
let treeDom = {};
// 生成json数据
const generateJSON = function () {
    const jsonTree = new DomToJsonParser(treeDom);
    console.log(jsonTree);
    alert("json已生成，请在控制台查看");
};
jQuery(document).ready(function () {
    $.ajax({
        url: "src/config/treeDragData.json",
        type: "get",
        dataType: "JSON",
        success: (res) => {
            treeData = res;
            // 渲染页面
            treeDom = renderPage(treeData);

            /**
             * 下述代码为树节点操作的demo
             * @type {{name: string, id: string, value: string}}
             */
            const treeNode = {
                "name": "行政区",
                "value": "新开发区",
                "id": "90199"
            };
            // 重命名目标节点值
            const renameResult = renameTreeNode(treeData, "1003", "新的修改值")
            console.log("修改节点完成，页面重新渲染", renameResult)
            treeDom = renderPage(treeData);

            // 向目标节点位置插入子节点
            const insertResult = insertNode(
                treeData,
                treeNode,
                "1007",
                false
            )
            treeDom = renderPage(treeData);
            console.log("节点插入完成，重新渲染页面", insertResult)

            // 删除节点
            const delResult = delNode(treeData, "1021")
            treeDom = renderPage(treeData);
            console.log("节点删除完成，重新渲染页面", delResult)

            console.log("搜索成功",searchNode(treeData,"1002"))
            traverseTreeNodes(treeData,(val)=>{
                console.log(val)
            })
        }
    })
});

/**
 * 渲染页面
 * @param dataTree 需要渲染的树形JSON
 * @param DomNode 接收渲染结果的dom结点
 * @param isDrag
 */
const renderPage = function(dataTree={},DomNode="#chart",isDrag=true){
    // Dom字符串转Dom对象
    const org = $(JsonToDomParser(dataTree));
    // 渲染页面
    org.treeDrag({
        chartElement: DomNode,
        dragAndDrop: isDrag
    });
};

let treeData = {};
jQuery(document).ready(function () {
    $.ajax({
        url:"src/config/treeDragData.json",
        type:"get",
        dataType:"JSON",
        success:(res)=>{
            treeData = res;
            // 渲染页面
            renderPage(treeData);
        }
    })
});
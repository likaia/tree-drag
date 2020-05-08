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
    return org.treeDrag({
        chartElement: DomNode,
        dragAndDrop: isDrag
    });
};

let treeData = {};
let treeDom = {};
// 生成json数据
const generateJSON = function(){
    const jsonTree = new DomToJsonParser(treeDom);
    console.log(jsonTree);
    alert("json已生成，请在控制台查看");
};
jQuery(document).ready(function () {
    $.ajax({
        url:"src/config/treeDragData.json",
        type:"get",
        dataType:"JSON",
        success:(res)=>{
            treeData = res;
            // 渲染页面
            treeDom = renderPage(treeData);
        }
    })
});
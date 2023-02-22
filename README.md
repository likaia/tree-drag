## 前言
基于JQuery+JQueryUI实现的一款树形拖拽插件，效果图如下

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/821168dfec1a441db261024112bfd399~tplv-k3u1fbpfcp-watermark.image?)

## 项目目录
* plugins 插件目录
    * jquery 存放jquery相关文件
    * jqueryui 存放jqueryui相关文件
    * treeDrag 树形拖拽插件实现相关文件
* src
    * assets 静态资源存放目录
        * css 插件内用到的css文件
        * js 插件内用到的js文件
    * config 树形结构渲染需要的文件
        * treeDragData.json 渲染树形结构的json数据
    * index.html 树形拖拽插件演示DEMO文件
    
 ## 如何使用
 
 * 在要使用插件的html文件里引入下述依赖
 ```html
    <!--树形拖拽插件样式文件-->
    <link rel="stylesheet" href="plugins/treeDrag/css/jquery.treeDrag.css">
    <link rel="stylesheet" href="src/assets/css/custom.css">
    <!--JQuery依赖-->
    <script src="plugins/jquery/1.7.1/jquery.min.js"></script>
    <script src="plugins/jqueryui/1.8.16/jquery-ui.min.js"></script>
    <!--树形拖拽插件-->
    <script src="plugins/treeDrag/js/jquery.treeDrag.js"></script>
    <!--JSON转DOM解析器-->
    <script type="text/javascript" src="plugins/treeDrag/js/JsonToDomParser.js"></script>
    <!--业务逻辑-->
    <script type="text/javascript" src="src/assets/js/index.js"></script>
    <link rel="stylesheet" href="src/assets/css/index.css">
```
* 在html的body里添加容器，用于接受树形图的渲染结果

```html
<!--渲染树形拖拽的容器-->
<div id="chart" class="orgChart"></div>
<!--生成JSON按钮-->
<div class="btn-panel">
    <button type="button" class="btn" onclick="generateJSON()">
        <span>生成JSON</span>
    </button>
</div>
```
* 编写js代码，渲染don结构为树形拖拽控件
```javascript
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
```

### 操作树节点
在[TreeOperations.js](plugins%2FtreeDrag%2Fjs%2FTreeOperations.js)文件中实现了对树节点的一些操作函数，进一步提升了可玩性。

在要使用插件的html文件里引入下述依赖，调用文件暴露出来的函数即可。
```html
    <!--树的相关操作-->
    <script type="text/javascript" src="plugins/treeDrag/js/TreeOperations.js"></script>
```
* `renameTreeNode`，重命名节点名称，接受3个参数
  * treeData 树结构数据
  * nodeId 目标节点ID
  * nodeTitle 修改后的节点名称
* `insertNode`，插入节点（同级插入或子级插入），接受4个参数
  * treeData 树结构数据 
  * treeNode 要插入的节点
  * nodeId 目标节点ID
  * isChildNode 是否为子级插入模式，默认为false
* `delNode`，删除树节点，接受2个参数
  * treeData 树结构数据
  * nodeId 目标节点ID
* `searchNode` 搜索树节点，接受2个参数。会返回搜索到的树节点对象
  * treeData 树结构数据
  * nodeId 目标节点ID
* `traverseTreeNodes` 遍历树节点，接受2个参数
  * treeData 树结构数据
  * callback 事件回调函数，访问树节点时，此回调函数会执行
* `searchAllParentNode` 搜索树的所有父节点，接受2个参数
  * treeData 树结构数据
  * nodeId 目标节点ID
* `getAllParentsOfANode` 获取目标节点的所有直接父节点，接受2个参数 
  * treeData 树结构数据
  * nodeId 目标节点ID

使用示例：
```html
    <!--树的相关操作-->
    <script type="text/javascript" src="plugins/treeDrag/js/TreeOperations.js"></script>

    <!--渲染树形拖拽的容器-->
    <div id="chart" class="orgChart"></div>
    <!--生成JSON按钮-->
    <div class="btn-panel">
        <button type="button" class="btn" onclick="generateJSON()">
            <span>生成JSON</span>
        </button>
    </div>
    <script type="text/javascript">
        // 你的树结构数据源，此处省略
        const treeData = {}
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
                "1012",
                false
        )
        treeDom = renderPage(treeData);
        console.log("节点插入完成，重新渲染页面", insertResult)

        // 删除节点
        const delResult = delNode(treeData, "1021")
        treeDom = renderPage(treeData);
        console.log("节点删除完成，重新渲染页面", delResult)
    </script>
```
### 事件处理函数
除了上面谈到的方法外，调用者可能还想在视图上对树节点进行操作，因此本插件提供了相关的回调函数：
* `clickCallback` 单击回调函数，有1个回调参数：节点ID
* `rightClickCallback` 右击回调函数，有2个回调参数：
  * `mouseEvent` 当前鼠标点击对象
  * `nodeObj` 节点对象数据（包含节点id、节点值）

使用示例：
```javascript
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
        dragAndDrop: isDrag,
        clickCallback: nodeClickFn,
        rightClickCallback: nodeRightClickFn
    });
};

const nodeClickFn = (nodeId) =>{
    console.log("节点点击了",nodeId)
}

const nodeRightClickFn = (mouseEvent, nodeObj) => {
    console.log("元素右击",mouseEvent, nodeObj)
}

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
```

> 至此，插件的使用介绍就完成了。

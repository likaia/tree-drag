## 前言
基于JQuery+JQueryUI实现的一款树形拖拽插件，效果图如下

![](https://user-gold-cdn.xitu.io/2020/5/8/171f4b58065134b2?w=1782&h=739&f=gif&s=2214918)

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

> 至此，插件的使用介绍就完成了。

## 前言
基于JQuery+JQueryUI实现的一款树形拖拽插件，效果图如下

![](https://user-gold-cdn.xitu.io/2020/4/14/171781bad5f3d857?w=1237&h=602&f=png&s=26027)

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
        * treeDragData.json 渲染树形结构的json数据(该功能尚未实现)
    * index.html 树形拖拽插件演示DEMO文件
    
 ## 如何使用
 
 * 在要使用插件的html文件里引入下述依赖
 ```html
    <!--树形拖拽插件样式文件-->
    <link rel="stylesheet" href="plugins/treeDrag/css/jquery.treeDrag.css">
    <link rel="stylesheet" href="src/assets/css/custom.css">
    <link rel="stylesheet" href="src/assets/css/prettify.css">
    <!--JQuery依赖-->
    <script src="plugins/jquery/1.7.1/jquery.min.js"></script>
    <script src="plugins/jqueryui/1.8.16/jquery-ui.min.js"></script>
    <!--树形拖拽插件-->
    <script src="plugins/treeDrag/js/jquery.treeDrag.js"></script>
    <script src="src/assets/js/prettify.js"></script>
```
* 在html的body里添加要渲染的dom结构，渲染的格式如下。
> 注意：整体结构必须为ul和li，最外层的ul需要设置display:none，最外层ul的id为js渲染时所需要的id

```html
<!--渲染树形拖拽的dom结构-->
<ul id="org" style="display:none">
    <li>
        0
        <ul>
            <li id="beer">1</li>
            <li>1
                <ul>
                    <li>1-1</li>
                    <li>
                        1-2
                    </li>
                </ul>
            </li>
            <li class="fruit">1
                <ul>
                    <li>1-1
                        <ul>
                            <li>1-1-1</li>
                        </ul>
                    </li>
                    <li>1-2
                        <ul>
                            <li>1-2-1</li>
                            <li>1-2-2</li>
                            <li>1-2-3</li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li>1</li>
            <!--收缩状态: collapsed-->
            <li class="collapsed">1
                <ul>
                    <li>1-1</li>
                    <li>1-2</li>
                </ul>
            </li>
        </ul>
    </li>
</ul>
```
* 编写js代码，渲染don结构为树形拖拽空间
```javascript
// 渲染页面
const org = $("#org");
// 调用treeDrag方法来渲染页面
org.treeDrag({
    // 渲染后的dom结构id，这里可以为任意名字，注意一定要带#
    chartElement: '#chart',
    // 开启拖拽功能
    dragAndDrop: true
});
```

> 至此，插件的使用介绍就完成了。

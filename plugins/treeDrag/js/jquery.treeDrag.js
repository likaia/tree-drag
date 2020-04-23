/**
 * 基于JQuery的树形渲染插件
 */
(function ($) {

    $.fn.jOrgChart = function (options) {
        var opts = $.extend({}, $.fn.jOrgChart.defaults, options);
        var $appendTo = $(opts.chartElement);

        // 当前传进来的li对象
        $this = $(this);
        // 声明树形图容器
        var $container = $("<div class='" + opts.chartClass + "'/>");
        if ($this.is("ul")) {
            buildNode($this.find("li:first"), $container, 0, opts);
        } else if ($this.is("li")) {
            buildNode($this, $container, 0, opts);
        }
        // 将生成的树形图容器放进目标Dom里
        $appendTo.append($container);

        // 拖放处理事件 JQuery UI 提供的拖拽事件
        if (opts.dragAndDrop) {
            // 托
            $('div.node').draggable({
                cursor: 'move',
                distance: 40,
                helper: 'clone',
                opacity: 0.8,
                revert: 'invalid',
                revertDuration: 100,
                snap: 'div.node.expanded',
                snapMode: 'inner',
                stack: 'div.node'
            });
            // 放
            $('div.node').droppable({
                accept: '.node',
                activeClass: 'drag-active',
                hoverClass: 'drop-hover'
            });

            // 节点的拖动启动事件处理
            $('div.node').bind("dragstart", function handleDragStart(event, ui) {

                var sourceNode = $(this);
                sourceNode.parentsUntil('.node-container')
                    .find('*')
                    .filter('.node')
                    .droppable('disable');
            });

            // 节点的拖动停止事件处理
            $('div.node').bind("dragstop", function handleDragStop(event, ui) {

                // 删除节点
                $(opts.chartElement).children().remove();
                /* 插件重载 */
                $this.jOrgChart(opts);
            });

            // 删除节点的事件处理
            $('div.node').bind("drop", function handleDropEvent(event, ui) {

                var targetID = $(this).data("tree-node");
                var targetLi = $this.find("li").filter(function () {
                    return $(this).data("tree-node") === targetID;
                });
                var targetUl = targetLi.children('ul');

                var sourceID = ui.draggable.data("tree-node");
                var sourceLi = $this.find("li").filter(function () {
                    return $(this).data("tree-node") === sourceID;
                });
                var sourceUl = sourceLi.parent('ul');

                if (targetUl.length > 0) {
                    targetUl.append(sourceLi);
                } else {
                    targetLi.append("<ul></ul>");
                    targetLi.children('ul').append(sourceLi);
                }

                //删除所有空UL
                if (sourceUl.children().length === 0) {
                    sourceUl.remove();
                }

            });  // 处理删除结点事件

        } // 拖和放
    };

    // 默认选项
    $.fn.jOrgChart.defaults = {
        chartElement: 'body',
        depth: -1,
        chartClass: "jOrgChart",
        dragAndDrop: false
    };

    // 节点数量
    var nodeCount = 0;

    // 递归构建树
    function buildNode($node, $appendTo, level, opts) {
        var $table = $("<table cellpadding='0' cellspacing='0' border='0'/>");
        var $tbody = $("<tbody/>");

        // 构造节点容器
        var $nodeRow = $("<tr/>").addClass("node-cells");
        var $nodeCell = $("<td/>").addClass("node-cell").attr("colspan", 2);
        var $childNodes = $node.children("ul:first").children("li");
        var $nodeDiv;
        if ($childNodes.length > 1) {
            $nodeCell.attr("colspan", $childNodes.length * 2);
        }
        // 绘制节点
        // 获取内容-允许使用li和ul以外的任何标记
        var $nodeContent = $node.clone()
            .children("ul,li")
            .remove()
            .end()
            .html();

        // 增加用于链接源列表和组织结构图节点Count ++的节点数；
        nodeCount++;
        $node.data("tree-node", nodeCount);
        $nodeDiv = $("<div>").addClass("node")
            .data("tree-node", nodeCount)
            .append($nodeContent);

        // 展开和收缩节点
        if ($childNodes.length > 0) {
            $nodeDiv.click(function () {
                var $this = $(this);
                var $tr = $this.closest("tr");

                if ($tr.hasClass('contracted')) {
                    $this.css('cursor', 'n-resize');
                    $tr.removeClass('contracted').addClass('expanded');
                    $tr.nextAll("tr").css('visibility', '');

                    // 适当更新<li>，以便如果树重绘折叠/未折叠的节点
                    // 保持外观
                    $node.removeClass('collapsed');
                } else {
                    $this.css('cursor', 's-resize');
                    $tr.removeClass('expanded').addClass('contracted');
                    $tr.nextAll("tr").css('visibility', 'hidden');

                    $node.addClass('collapsed');
                }
            });
        }

        $nodeCell.append($nodeDiv);
        $nodeRow.append($nodeCell);
        $tbody.append($nodeRow);

        if ($childNodes.length > 0) {
            // 如果可以扩展，则更改光标
            $nodeDiv.css('cursor', 'n-resize');

            // 递归直到找到叶子（-1）或达到指定级别
            if (opts.depth == -1 || (level + 1 < opts.depth)) {
                var $downLineRow = $("<tr/>");
                var $downLineCell = $("<td/>").attr("colspan", $childNodes.length * 2);
                $downLineRow.append($downLineCell);

                //从父节点到水平线绘制连接线
                $downLine = $("<div></div>").addClass("line down");
                $downLineCell.append($downLine);
                $tbody.append($downLineRow);

                // 画水平线
                var $linesRow = $("<tr/>");
                $childNodes.each(function () {
                    var $left = $("<td>&nbsp;</td>").addClass("line left top");
                    var $right = $("<td>&nbsp;</td>").addClass("line right top");
                    $linesRow.append($left).append($right);
                });

                // 水平线不应超出第一个和最后一个子分支
                $linesRow.find("td:first")
                    .removeClass("top")
                    .end()
                    .find("td:last")
                    .removeClass("top");

                $tbody.append($linesRow);
                var $childNodesRow = $("<tr/>");
                $childNodes.each(function () {
                    var $td = $("<td class='node-container'/>");
                    $td.attr("colspan", 2);
                    // 通过子列表和项递归
                    buildNode($(this), $td, level + 1, opts);
                    $childNodesRow.append($td);
                });

            }
            $tbody.append($childNodesRow);
        }

        // LI元素上的所有类都将复制到树中的相关节点
        // 除了特殊的“折叠”类之外，该类此时会折叠子树
        if ($node.attr('class') != undefined) {
            var classList = $node.attr('class').split(/\s+/);
            $.each(classList, function (index, item) {
                if (item == 'collapsed') {
                    $nodeRow.nextAll('tr').css('visibility', 'hidden');
                    $nodeRow.removeClass('expanded');
                    $nodeRow.addClass('contracted');
                    $nodeDiv.css('cursor', 's-resize');
                } else {
                    $nodeDiv.addClass(item);
                }
            });
        }

        $table.append($tbody);
        $appendTo.append($table);

        /* 如果单击节点内的链接，防止树崩溃*/
        $nodeDiv.children('a').click(function (e) {
            e.stopPropagation();
        });
    };

})(jQuery);
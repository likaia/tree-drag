/**
 * 实现一个基础队列
 * @constructor
 */
const Queue = function () {
    // 使用数组初始化队列
    let items = [];
    // 向队列插入元素
    this.enqueue = function (elem) {
        items.push(elem);
    }
    // 从队头删除元素
    this.dequeue = function () {
        return items.shift();
    }
    // 查看队头元素
    this.front = function () {
        return items[0];
    }
    // 判断队列是否为空
    this.isEmpty = function () {
        return items.length ===0;
    }
    // 查看队列长度
    this.size = function () {
        return items.length;
    }
    // 查看队列中的元素
    this.print = function () {
        return items.toString();
    }
}

/**
 * 广度优先搜索
 * @param tree 树形图
 * @returns {string} 返回目标结点在树中的深度
 */
const breadthFirstSearch = function (tree) {
    // 实例化一个队列
    let queue = new Queue();
    // 入队
    queue.enqueue(tree);
    // 根结点到目标结点的深度
    let step = 0;
    // 转化后的dom树
    let domTree = ``;
    // 遍历队列，直至队列为空，或者找到目标结点
    while (!queue.isEmpty()){
        step += 1;
        let len = queue.size();
        // 判断是否为根结点
        if(step === 1){
            // 渲染根结点容器
            domTree += `<li>`;
        }else{
            // 渲染叶结点容器
            domTree += `<ul>`
        }
        for (let i = 0; i < len; i++){
            // 获取队首元素
            let teamLeader = queue.front();
            if(step ===1){
                // 渲染根结点内容
                domTree += `${teamLeader.value}<ul>`;
            }else{
                // 渲染叶结点内容
                domTree += `<li>${teamLeader.value}</li>`
            }
            // 将下一层结点添加进队列
            if(teamLeader.children && teamLeader.children.length){
                teamLeader.children.map(item=>{
                    queue.enqueue(item);
                });
            }
            // 删除遍历过的结点
            queue.dequeue();
        }
        if(step !== 1){
            // 渲染叶结点容器结束
            domTree += `</ul>`;
        }
    }
    // 闭合根结点容器
    domTree += `</ul></li>`
    return domTree;
}

const dataTree = {
    name:"国家",
    value:"中国",
    children:[
        {
            name:"省份",
            value:"广东",
            children: [
                {
                    name:"城市",
                    value:"广州",
                    children:[
                        {
                            name:"行政区",
                            value:"天河区",
                        },
                        {
                            name:"行政区",
                            value:"越秀区"
                        },
                        {
                            name:"行政区",
                            value:"海珠区"
                        },
                        {
                            name:"行政区",
                            value: "白云区"
                        }
                    ]
                },
                {
                    name:"城市",
                    value: "深圳",
                    children: [
                        {
                            name:"行政区",
                            value: "福田区"
                        },
                        {
                            name:"行政区",
                            value: "罗湖区"
                        },
                        {
                            name:"行政区",
                            value:"南山区"
                        }
                    ]
                }
            ]
        },
        {
            name:"省份",
            value:"陕西",
            children: [
                {
                    name:"城市",
                    value: "西安",
                    children: [
                        {
                            name:"行政区",
                            value: "莲湖区"
                        },
                        {
                            name:"行政区",
                            value: "雁塔区"
                        },
                        {
                            name:"行政区",
                            value: "未央区"
                        },
                        {
                            name: "行政区",
                            value:"新城区"
                        }
                    ]
                },
                {
                    name:"城市",
                    value: "商洛",
                    children: [
                        {
                            name: "行政区",
                            value: "洛南"
                        },
                        {
                            name:"行政区",
                            value: "丹凤"
                        },
                        {
                            name: "行政区",
                            value: "柞水"
                        },
                        {
                            name: "行政区",
                            value:"镇安"
                        }
                    ]
                }
            ]
        }
    ]
}

console.log(breadthFirstSearch(dataTree));
/**
 * 重命名节点
 * @param treeData 树结构数据
 * @param nodeId 目标节点ID
 * @param nodeTitle 修改后的节点名称
 * @returns {{msg: string, code: number}}
 */
function renameTreeNode(treeData, nodeId, nodeTitle) {
    const result = searchNodeOfTree(treeData, nodeId)
    result.value = nodeTitle
    return {code: 0, msg: "修改成功"}
}

/**
 * 插入节点（同级插入或子级插入）
 * @param treeData 树结构数据
 * @param treeNode 要插入的节点
 * @param nodeId 目标节点ID
 * @param isChildNode 是否为子级插入模式
 * @returns {{msg: string, code: number}}
 */
function insertNode(treeData, treeNode, nodeId, isChildNode = false) {
    if (Object.keys(treeNode).length === 0 || nodeId == null) {
        throw new Error("要插入的节点不能为空且目标节点id不能为空")
    }
    // 使用深度优先搜索寻找父节点
    const nodeObj = findParentNode(treeData, nodeId)
    const pathTraveled = nodeObj.pathTraveled
    const TraveledIndex = nodeObj.TraveledIndex

    if (!isChildNode) {
        const targetParentNode = nodeObj.parentNode
        console.log("父节点找到", targetParentNode)
        // 插入同级节点
        if (insertFn(treeData, treeNode, targetParentNode.id)) {
            return {
                code: 0,
                msg: "同级节点插入成功"
            }
        }
        return {
            code: -1,
            msg: "插入失败, 目标节点不存在"
        }
    }
    const targetParentNode = pathTraveled[TraveledIndex]
    // 插入子节点
    if (insertFn(treeData, treeNode, targetParentNode.id)) {
        return {
            code: 0,
            msg: "子节点插入成功"
        }
    }
    return {
        code: -1,
        msg: "插入失败, 目标节点不存在"
    }
}

/**
 * 删除树节点
 * @param treeData 树结构数据
 * @param nodeId 目标节点id
 * @returns {{msg: string, code: number}}
 */
function delNode(treeData, nodeId) {
    if (nodeId == null) throw new Error("节点ID不能为空");
    const parentNode = findParentNode(treeData, nodeId).parentNode;
    // 使用广度优先搜索找到父节点下一层的数据，筛选出要删除的数据将其删除
    const queue = new Queue()
    queue.enqueue(treeData)
    while (!queue.isEmpty()) {
        const len = queue.size()
        for (let i = 0; i < len; i++) {
            const teamLeader = queue.peek();
            if (teamLeader) {
                // 父节点相同，找到它下一层的所有节点
                if (teamLeader.id === parentNode.id) {
                    if ((teamLeader.children && teamLeader.children.length)) {
                        const childData = teamLeader.children;
                        for (let j = 0; j < childData.length; j++) {
                            const node = childData[j]
                            // 找到节点相同的元素，将其删除
                            if (node.id === nodeId) {
                                childData.splice(j, 1)
                                return {
                                    code: 0,
                                    msg: "节点删除成功"
                                };
                            }
                        }
                    }
                }

                // 将下一层入队
                if (teamLeader.children && teamLeader.children.length) {
                    teamLeader.children.map(item => {
                        queue.enqueue(item)
                    })
                }
                // 将遍历过的节点出队
                queue.dequeue()
            }
        }
    }
    return {
        code: -1,
        msg: "节点未找到"
    }
}

/**
 * 搜索树节点
 * @param treeData 树结构数据
 * @param nodeId 节点id
 * @returns {*|null}
 */
function searchNode(treeData, nodeId) {
    return searchNodeOfTree(treeData, nodeId)
}


/**
 * 获取节点的所有直接父节点
 * @param treeData 树结构数据
 * @param nodeId 目标节点id
 * @returns {*|null} 返回含有所有直接父节点的树结构数据
 */
function getAllParentsOfANode(treeData, nodeId) {
    // 搜索目标节点
    const targetResult = searchNode(treeData, nodeId)
    // 搜索所有父节点
    const parents = searchAllParentNode(treeData, nodeId)
    // 如果选择的是根节点则直接返回树的所有节点数据
    if (parents.length === 0) {
        return treeData
    }
    // 把目标节点放入它的直接父节点内，它的0号元素一定是它的直接父节点，将搜索结果放入
    parents[0].children = [targetResult]
    // 重新构建树
    return convertToTree(parents)
}

/**
 *  搜索树的所有父节点
 * @param treeData 树结构数据
 * @param nodeId 目标节点id
 * @returns {*[]}
 */
function searchAllParentNode(treeData, nodeId) {
    const result = []
    const recursionFn = (treeData, nodeId) => {
        // 基线条件：目标节点为根节点
        if (nodeId === treeData.id) {
            return result;
        }
        const parenNode = findParentNode(treeData, nodeId).parentNode
        result.push({name: parenNode.name, value: parenNode.value, id: parenNode.id})
        recursionFn(treeData, parenNode.id)
    }
    recursionFn(treeData, nodeId)
    return result
}


/**
 * 遍历树节点
 * @param treeData 树结构数据
 * @param callback 回调函数
 */
function traverseTreeNodes(treeData, callback = (nodeObj)=>{}) {
    searchNodeOfTree(treeData, "", callback)
}

/**
 * 将含有一定规律的数组转为树结构数据
 * @param arr 数组的规律为：数组的后一项是其前一项的父节点
 * @returns {*|null}
 */
function convertToTree(arr) {
    if (!arr || arr.length === 0) {
        return null;
    }
    let tree = arr[0]
    for (let i = 1; i < arr.length; i++) {
        let node = arr[i]
        if (!node.children) {
            node.children = []
        }
        node.children.push(tree);
        tree = node;
    }
    return tree;
}


/**
 * 深度优先搜索指定树节点
 * @param treeData 树结构数据
 * @param nodeId 目标节点ID
 * @param callback 遍历到每个节点时的回调函数
 * @returns {*|null}
 */
const searchNodeOfTree = (treeData, nodeId, callback = (nodeObj) => {
}) => {
    if (nodeId == null) throw new Error("节点ID不能为空")
    const stack = [treeData];
    while (stack.length !== 0) {
        // 取出栈顶元素
        const stackTop = stack.pop();
        if (stackTop) {
            // 执行回调函数
            callback(stackTop)
            // 继续搜索子节点
            if (stackTop.children && stackTop.children.length) {
                /**
                 * 将子结点入栈：
                 * 1. 使用扩展运算符取出参数对象,使用reverse方法将数组中的元素进行颠倒
                 * 2. 使用扩展运算符取出颠倒后数组中的对象
                 * 3. 将取出的对象放进栈中
                 */
                stack.push(...[...stackTop.children].reverse());
            }
            if (stackTop.id === nodeId) {
                return stackTop;
            }
        }
    }
    return null;
};


/**
 * 寻找某个节点的父节点
 * @param treeData 树结构数据
 * @param nodeId 目标节点ID
 * @returns {{TraveledIndex: number, parentNode: *, pathTraveled: *[]}}
 */
const findParentNode = (treeData, nodeId) => {
    const pathTraveled = []
    let TraveledIndex = -1
    const stack = [treeData];
    const parentIds = []
    while (stack.length !== 0) {
        // 取出栈顶元素
        const stackTop = stack.pop();
        TraveledIndex++
        pathTraveled.push(stackTop)
        if (stackTop) {
            // 继续搜索子节点
            if (stackTop.children && stackTop.children.length) {
                parentIds.push(stackTop.id)
                stack.push(...[...stackTop.children].reverse());
            }
            if (stackTop.id === nodeId) {
                break
            }
        }
    }
    if (TraveledIndex - 1 < 0) {
        throw new Error("根节点不存在父节点")
    }
    // 计算父节点索引
    let parentIndex = 0;
    let findParentResult = false
    for (let i = 0; i < pathTraveled.length; i++) {
        const path = pathTraveled[i]
        for (let j = 0; j < parentIds.length; j++) {
            // 寻找与父节点相同的节点
            if (path.id === parentIds[j]) {
                // 遍历节点，找到与目标节点相同的节点用于定位其父节点
                for (let k = 0; k < path.children.length; k++) {
                    const childData = path.children[k]
                    // 定位到父节点
                    if (childData.id === nodeId) {
                        parentIndex = i
                        findParentResult = true
                        break
                    }
                }
            }
            if (findParentResult) {
                break
            }
        }
        if (findParentResult) {
            break
        }
    }

    return {
        parentNode: pathTraveled[parentIndex],
        pathTraveled,
        TraveledIndex
    }
}

/**
 * 向指定树节点位置插入节点
 * @param treeData 树结构数据
 * @param treeNode 要插入的节点
 * @param targetNodeId 目标节点id
 * @returns {boolean}
 */
const insertFn = (treeData, treeNode, targetNodeId) => {
    // 使用广度优先搜索树的每一层，直至找到目标节点的下一层数据
    const queue = new Queue();
    queue.enqueue(treeData);
    let targetChildData = {}
    while (!queue.isEmpty()) {
        const len = queue.size();
        let findResult = false;
        for (let i = 0; i < len; i++) {
            // 获取当前层节点
            const teamLeader = queue.peek();
            if (teamLeader) {
                if (teamLeader.id === targetNodeId) {
                    findResult = true
                    if ((teamLeader.children && teamLeader.children.length)) {
                        // 存储下一层的树节点
                        targetChildData = teamLeader.children
                        break
                    }
                    // 当前为树的叶节点，不存在children则直接保存其本身
                    targetChildData = teamLeader
                    break
                }
                // 将下一层入队
                if (teamLeader.children && teamLeader.children.length) {
                    teamLeader.children.map(item => {
                        queue.enqueue(item);
                    });
                }
                // 删除遍历过的节点
                queue.dequeue();
            }
        }
        if (findResult) break;
    }
    if (Object.keys(targetChildData).length === 0) {
        // 节点未找到
        return false;
    }
    // 插入新节点
    if (targetChildData instanceof Array) {
        targetChildData.push(treeNode)
        return true;
    }
    // 目标为叶节点时，则先构造children再插入新节点
    targetChildData.children = [treeNode]
    return true;
}


/**
 * 实现队列
 *    队列的基础方法: 入队、出队、返回队首元素、获取队列大小、判断队列是否为空、清空队列、获取队列内所有数据
 */
const Queue = (function () {
    // 构造器
    function Queue() {
        // 队列中的三个必要变量: 队列大小、队首元素、队列对象
        this.count = 0;
        this.lowestCount = 0;
        this.items = {};
    }

    // 入队
    Queue.prototype.enqueue = function (item) {
        // 队列的末尾添加元素: 将队列的大小作为key
        this.items[this.count] = item;
        this.count++;
    };
    // 出队
    Queue.prototype.dequeue = function () {
        if (this.isEmpty()) {
            return undefined;
        }
        const result = this.items[this.lowestCount];
        // 删除队首元素
        delete this.items[this.lowestCount];
        // 队首元素自增
        this.lowestCount++;
        return result;
    };
    // 返回队首元素
    Queue.prototype.peek = function () {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.lowestCount];
    };
    // 队列大小: 队列的大小 - 队首元素
    Queue.prototype.size = function () {
        return this.count - this.lowestCount;
    };
    // 判断队列是否为空
    Queue.prototype.isEmpty = function () {
        return this.count - this.lowestCount === 0;
    };
    // 清空队列
    Queue.prototype.clear = function () {
        this.count = 0;
        this.lowestCount = 0;
        this.items = {};
    };
    // 获取队列内所有数据
    Queue.prototype.toString = function () {
        if (this.isEmpty()) {
            return "";
        }
        let objString = "".concat(this.items[this.lowestCount]);
        for (let i = this.lowestCount + 1; i < this.count; i++) {
            objString = "".concat(objString, ",").concat(this.items[i]);
        }
        return objString;
    };
    return Queue;
}());

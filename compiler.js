// 编译器
//递归遍历dom树
//判读节点类型， 如果是文本，则判断是否是插值类型
//如果是元素， 则遍历其属性判断是否是指令或事件，然后递归子元素

class Compiler {
  // el: 宿主元素
  // vm： KVue实例
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm
    // console.log('vm====', vm)
    if(this.$el) {
      // 执行编译
      this.compiler(this.$el)
    }
  }
  compiler(el) {
    // 遍历 el树
    const childNodes = el.childNodes
    // console.log('typeof childNodes===', typeof childNodes);
    // console.log(Array.from(childNodes))
    // debugger
    Array.from(childNodes).forEach(node => {
      // 判断是否是元素
      if(this.isElement(node)){
        console.log('编译元素： ', node.nodeName);
        this.compilerElement(node)
        
      } else if(this.isInter(node)){
        console.log('编译插值绑定： ', node.textContent);
        this.compilerText(node)
      }
      // 递归子节点
      if(node.childNodes && node.childNodes.length > 0) {
        this.compiler(node)
      }
    })
  }
  isElement(node) {
    return node.nodeType === 1
  }

  isInter(node) {
    // 首先是文本标签， 其实内容是{{xxx}}
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  compilerElement(node) {
    // 节点上元素，遍历其属性列表
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      // 规定： 指令以k-xx="oo" 定义
      const attrName = attr.name
      const exp = attr.value
      if(this.isDirective(attrName)) { // 有k- 开头  代表指令
        const dir = attrName.substring(2) // 想要xx
        // 执行指令
        this[dir] && this[dir](node, exp)
       }
    })
  }
  compilerText(node) {
    // console.log('RegExp====', RegExp)
    //RegExp.$1   回匹配到 /\{\{(.*)\}\}/  里的(.*)   分组
    // node.textContent = this.$vm[RegExp.$1]
    this.update(node, RegExp.$1, 'text')
  }
  isDirective(attrName) {
    return attrName.indexOf('k-') === 0
  }

  update(node, exp, dir) {
    // 初始化
    // 指令对应的更新函数 xxUpdate
    const fn = this[dir + 'Update']
    fn && fn(node, this.$vm[exp])

    //更新处理
    new Watcher(this.$vm, exp, function(val){
      fn && fn(node, val)
    })
  }

  // k-text
  text(node, exp) {
    // node.textContent = this.$vm[exp]
    this.update(node, exp, 'text')
  }

  textUpdate(node, value) {
    node.textContent = value
  }

  //k-html
  html(node, exp){
    // node.innerHTML = this.$vm[exp]
    // debugger
    this.update(node, exp, 'html')
  }

  htmlUpdate(node, value) {
    node.innerHTML = value
  }
}
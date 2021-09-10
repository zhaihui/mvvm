function defineReactive(obj, key, val) {
  // 如果传入的val是obj, 需要做响应化
  observe(val)

  // 创建一个dep和当前key一一对应
  const dep = new Dep()

  //对传入的obj进行访问拦截
  Object.defineProperty(obj, key , {
    get() {
      console.log('get: ', key)
      // 依赖收集在这里
      Dep.target && dep.addDep(Dep.target)
      debugger
      return val
    },
    set(newVal) {
      if(newVal !== val) {
        console.log('set: ', key, ' : ', newVal)
        // 如果传入的newVal依然是obj, 需要做响应化
        observe(newVal)
        val = newVal

        // 走更新函数
        // watches.forEach(w => w.update())
        dep.notify()
      }
    } 
  })
}

function observe(obj) {
  // console.log('----', obj)
  if(typeof obj !== 'object' || obj == null){
    // 希望传入的是obj
    return 
  }
  new Observer(obj)
}

//代理函数， 方便用户直接访问$data中的数据
function proxy(vm, sourceKey){
  Object.keys(vm[sourceKey]).forEach(key => {
    // 将 $data中的key代理到vm属性中
    Object.defineProperty(vm, key, {
      get() {
        return vm[sourceKey][key]
      },
      set(newVal) {
        vm[sourceKey][key] = newVal
      }
    })
  })
}

class KVue {
  constructor(options) {
    // 保存选项
    this.$options = options
    this.$data = options.data
    //响应化处理
    observe(this.$data)

    // 代理
    proxy(this, '$data')

    //编译器
    new Compiler(options.el, this)
  }
}

// 根据对象类型如何做响应化
class Observer {
  constructor(value) {
    this.value = value

    if(typeof value === 'object') {
      this.walk(value)
    }
  }

  // 对象数据响应化
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }

  // 数组响应化
}

//创建观察者:  保存更新函数，值发生变化调用更新函数
// const watches = []
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm
    
    this.key = key

    this.updateFn = updateFn

    // watches.push(this) 
    Dep.target = this
    debugger
    this.vm[this.key] //读取触发了getter
    Dep.target = null //收集完就制空
  }
  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

//dep ： 依赖，管理某个key相关所有watcher实例
class Dep {
  constructor() {
    this.deps = []
  }
  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    debugger
    console.log('this.deps====', this.deps)
    this.deps.forEach(dep => dep.update())
  }
}
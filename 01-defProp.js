// 响应式
// const obj = {}

function defineReactive(obj, key, val) {
  // 如果传入的val是obj, 需要做响应化
  observe(val)
  //对传入的obj进行访问拦截
  Object.defineProperty(obj, key , {
    get() {
      console.log('get: ', key)
      return val
    },
    set(newVal) {
      if(newVal !== val) {
        console.log('set: ', key, ' : ', newVal)
        // 如果传入的newVal依然是obj, 需要做响应化
        observe(newVal)
        val = newVal
      }
    }
  })
}

function observe(obj) {
  if(typeof obj !== 'object' || obj == null){
    // 希望传入的是obj
    return 
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function set(obj, key, val){
  defineReactive(obj, key, val)
}

// defineReactive(obj, 'foo', 'foo')
// obj.foo
// obj.foo = 'fooooooooooooooooooooooooooooooooooo'

const obj = { foo: 'foo', bar: 'bar', baz: { a: 1}, arr: [1,2,3,4]}
observe(obj)
obj.foo
obj.foo = 'fooooooooooo'

obj.bar
obj.bar = 'baooooooooooooooo'

// obj.baz.a = 10

obj.baz = {a: 10}
obj.baz.a = 100


set(obj, 'dog', 'dog')
obj.dog


// 分析： 改变数组的方法只有7个
// 解决方案： 替换数组实例的原型方法，让他们在修改数组的同时还可以通知更新
obj.arr.push(4)
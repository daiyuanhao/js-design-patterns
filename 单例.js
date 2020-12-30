function getTime() {
  return new Date().getTime()
}

var getSingle = function (fn) {
  var result
  return function () {
    // 有result返回result，否则执行创建单例的函数
    return result || (result = fn.apply(this, arguments))
  }
}

var getSingleTime = getSingle(getTime)
console.log(getSingleTime())
console.log(getSingleTime())

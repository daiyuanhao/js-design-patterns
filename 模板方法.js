// 模板
var Template = function () { }
Template.prototype.fn1 = function () {
  console.log('通用第一步')
}
Template.prototype.fn2 = function () {
  throw new Error('子类必须重写fn2方法')
}
Template.prototype.fn3 = function () {
  throw new Error('子类必须重写fn3方法')
}
Template.prototype.fn4 = function () {
  throw new Error('子类必须重写fn4方法')
}
Template.prototype.hasFn4 = function () {
  return true
}
Template.prototype.init = function () {
  this.fn1()
  this.fn2()
  this.fn3()
  if (this.hasFn4()) {
    this.fn4()
  }
}

// 实例
var Example = function () { }
Example.prototype = new Template()
Example.prototype.fn2 = function () {
  console.log('第二步')
}
Example.prototype.fn3 = function () {
  console.log('第三步')
}
Example.prototype.fn4 = function () {
  console.log('第四步')
}

var example1 = new Example()
example1.init()
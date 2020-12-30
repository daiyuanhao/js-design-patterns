// 灵活可拆分的职责链节点
var order500 = function (orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500元定金预购，得到100优惠券')
  } else {
    return 'nextSuccessor'
  }
}
var order200 = function (orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200元定金预购，得到100优惠券')
  } else {
    return 'nextSuccessor'
  }
}

var orderNormal = function (orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券')
  } else {
    console.log("库存不足")
  }
}

var Chain = function (fn) {
  this.fn = fn
  this.successor = null
}

Chain.prototype.setNextSuccessor = function (successor) {
  return this.successor = successor
}

Chain.prototype.passRequest = function () {
  var ret = this.fn.apply(this, arguments)
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments)
  }
  return ret
}

var chainOrder500 = new Chain(order500)
var chainOrder200 = new Chain(order200)
var chainOrderNormal = new Chain(orderNormal)

chainOrder500.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(chainOrderNormal)

chainOrder500.passRequest(3, true, 500)

// 异步的职责链
Chain.prototype.next = function () {
  return this.successor && this.successor.passRequest.apply(this.successor, arguments)
}

var fn1 = new Chain(function () {
  console.log(1)
  return 'nextSuccessor'
})

var fn2 = new Chain(function () {
  console.log(2)
  var self = this
  setTimeout(function () {
    self.next()
  }, 1000)
})

var fn3 = new Chain(function () {
  console.log(3)
})

fn1.setNextSuccessor(fn2).setNextSuccessor(fn3)
fn1.passRequest()
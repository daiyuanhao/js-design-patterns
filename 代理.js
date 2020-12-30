// 图片预加载
// var myImage = (function () {
//   var imgNode = document.createElement('img');
//   document.body.appendChild(imgNode);
//   return {
//     setSrc: function (src) {
//       imgNode.src = src;
//     }
//   }
// })();
// var proxyImage = (function () {
//   var img = new Image;
//   img.onload = function () {
//     myImage.setSrc(this.src);
//   }
//   return {
//     setSrc: function (src) {
//       myImage.setSrc('loading.png');
//       img.src = src;
//     }
//   }
// })();
// proxyImage.setSrc('avatar.png');

var mult = function () {
  var a = 1
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i]
  }
  return a
}

var plus = function () {
  var a = 0
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a + arguments[i]
  }
  return a
}

var proxyFactory = function (fn) {
  var cache = {};
  return function () {
    var args = Array.prototype.join.call(arguments, ',');
    if (args in cache) {
      return cache[args];
    }
    return cache[args] = fn.apply(this, arguments);
  }
};

var proxyMult = proxyFactory(mult)
var proxyPlus = proxyFactory(plus)

console.log(proxyMult(1, 2, 3, 4))
console.log(proxyMult(1, 2, 3, 4))
console.log(proxyPlus(1, 2, 3, 4))
console.log(proxyPlus(1, 2, 3, 4))
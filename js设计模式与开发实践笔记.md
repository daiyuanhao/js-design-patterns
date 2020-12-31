# JavaScript

## 基础知识

### 动态语言类型

- 静态类型语言： 编译时确定变量类型；编译器帮忙检查错误
- 动态类型语言：运行时，赋值后，确定变量类型；

### 鸭子类型

  会嘎嘎嘎叫就是鸭子，会什么样的行为就是什么对象

### 面向对象

- 多态 封装 继承
多态：对同一对象进行操作，产生不同的结果

### this、call、apply

- this
  当函数作为对象的方法被调用时，this指向该对象；
  作为普通函数调用，this总是指向全局对象。在浏览器里指window对象。
- call
  改变this指向，第二个参数为参数的列表
- apply
  改变this指向，第二个参数为带下标的集合，可以是数组或者类数组

### 闭包

  封装变量，延续局部变量寿命

### 高阶函数

  概念：函数可以被当做参数，函数可以被返回
  
## 设计模式

### 单例模式

保证一个类仅有一个实例，并提供一个访问它的全局访问点

```JavaScript
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
```

### 策略模式

定义一系列算法，并一一封装起来，使他们可以互相替换

```JavaScript
var strategies = {
  "x2": a => a *= 2,
  "x3": a => a *= 3,
  "x4": a => a *= 4
}

var calculate = (strategie, number) => {
  return strategies[strategie](number)
}

console.log(calculate('x3', 4))
```

### 代理模式

为一个对象提供一个代用品或占位符，以便控制对它的访问。
关键：不方便访问一个对象或不满足需要时，提供一个替身对象来控制对这个对象的访问，实际访问的是替身对象。

#### 保护代理和虚拟代理

- 保护代理：过滤掉一些请求
- 虚拟代理：把一些开销很大的对象，延迟到需要时才创建

#### 图片预加载

```JavaScript
var myImage = (function () {
  var imgNode = document.createElement('img');
  document.body.appendChild(imgNode);
  return {
    setSrc: function (src) {
      imgNode.src = src;
    }
  }
})();
var proxyImage = (function () {
  var img = new Image;
  img.onload = function () {
    myImage.setSrc(this.src);
  }
  return {
    setSrc: function (src) {
      myImage.setSrc('loading.png');
      img.src = src;
    }
  }
})();
proxyImage.setSrc('avatar.png');
```

#### 代理的意义

符合单一职责原则和开放封闭原则
代理和本体接口一致性，可以替换使用

#### 缓存代理

缓存代理可以为一些开销大的函数执行结果提供暂时的存储，在下次运算时，如果参数跟之前一致，则返回存储结果。

```JavaScript
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
```

#### 小结

在编写业务代码的时候，往往不需要去预先猜测是否需要使用代理模式。当真正发现不方便直接访问某个对象的时候，再编写代理也不迟。

### 迭代器模式

提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。JavaScript的Array.prototype.forEach

### 发布订阅模式

当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。在JavaScript开发中，我们一般用事件模型来替代传统的发布订阅模式。

发布—订阅模式可以用一个全局的Event对象来实现，订阅者不需要了解消息来自哪个发布者，发布者也不知道消息会推送给哪些订阅者，Event作为一个类似中介者的角色，把订阅者和发布者联系起来

```JavaScript
var Event = (function () {
  var clientList = {},
    listen,
    trigger,
    remove

  listen = function (key, fn) {
    if (!clientList[key]) {
      clientList[key] = []
    }
    clientList[key].push(fn)
  }

  trigger = function () {
    var key = [].shift.call(arguments),
      fns = clientList[key]
    if (!fns || fns.length === 0) {
      return false
    }
    for (var i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments)
    }
  }

  remove = function (key, fn) {
    var fns = clientList[key]
    if (!fns) {
      return false
    }
    if (!fn) {
      fns.length = 0
    } else {
      for (var l = fns.length - 1; l >= 0; l--) {
        var _fn = fns[l]
        if (_fn === fn) {
          fns.splice(l, 1)
        }
      }
    }
  }

  return {
    listen,
    trigger,
    remove
  }
})()

Event.listen('event1', function (a) {
  console.log('event1: ' + a)
})

Event.trigger('event1', 123)
```

#### 命令模式

命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系

```JavaScript
var closeDoorCommand = {
  excute: function () {
    console.log('关门')
  }
}

var openPcCommand = {
  excute: function () {
    console.log('打开电脑')
  }
}

var openQQCommand = {
  excute: function () {
    console.log('登录QQ')
  }
}

var MacroCommand = function () {
  return {
    commandList: [],
    add: function (command) {
      this.commandList.push(command)
    },
    excute: function () {
      this.commandList.forEach(command => command.excute())
    }
  }
}

var macroCommand = MacroCommand()
macroCommand.add(closeDoorCommand)
macroCommand.add(openPcCommand)
macroCommand.add(openQQCommand)

macroCommand.excute()
```

#### 组合模式

表示对象的部分-整体层次结构，统一对待树中的所有对象

```JavaScript
var Folder = function (name) {
  this.name = name
  this.files = []
}

Folder.prototype.add = function (file) {
  this.files.push(file)
}

Folder.prototype.scan = function () {
  console.log('开始扫描文件夹：' + this.name)
  this.files.forEach(file => file.scan())
}

var File = function (name) {
  this.name = name
}

File.prototype.add = function () {
  throw new Error('文件下不能添加文件')
}

File.prototype.scan = function () {
  console.log('开始扫描文件：' + this.name)
}

var folder = new Folder('学习资料')
var folder1 = new Folder('JavaScript')
var folder2 = new Folder('jquery')

var file1 = new File('JavaScript设计模式与开发实践')
var file2 = new File('精通jquery')
var file3 = new File('重构与模式')

folder1.add(file1)
folder2.add(file2)

folder.add(folder1)
folder.add(folder2)
folder.add(file3)

folder.scan()
```

#### 模板方法模式

在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。

```JavaScript
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
```

#### 职责链模式

使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

#### 中介者模式

中介者模式使各个对象之间得以解耦，以中介者和对象之间的一对多关系取代了对象之间的网状多对多关系。各个对象只需关注自身功能的实现，对象之间的交互关系交给了中介者对象来实现和维护。

```JavaScript
var Player = function (name, teamColor) {
  this.name = name
  this.teamColor = teamColor
  this.state = 'alive'
}

Player.prototype.win = function () {
  console.log(this.name + ' won')
}

Player.prototype.lose = function () {
  console.log(this.name + ' lost')
}

Player.prototype.die = function () {
  this.state = 'dead'
  playerDirector.receiveMessage('playerDead', this)
}

Player.prototype.remove = function () {
  playerDirector.receiveMessage('removePlayer', this)
}

Player.prototype.changeTeam = function (color) {
  playerDirector.receiveMessage('changeTeam', this, color)
}

var playerFactory = function (name, teamColor) {
  var newPlayer = new Player(name, teamColor);
  playerDirector.receiveMessage('addPlayer', newPlayer);
  return newPlayer;
};

//中介者
var playerDirector = (function () {
  var players = {},
    options = {}

  options.addPlayer = function (player) {
    var teamColor = player.teamColor
    players[teamColor] = players[teamColor] || []
    players[teamColor].push(player)
  }

  options.removePlayer = function (player) {
    var teamColor = player.teamColor,
      teamPlayers = players[teamColor] || []
    for (var i = teamPlayers.length - 1; i >= 0; i--) {
      if (teamPlayers[i] === player) {
        teamPlayers.splice(i, 1)
      }
    }
  }

  options.changeTeam = function (player, newTeamColor) {
    options.removePlayer(player)
    var teamColor = player.teamColor
    player.teamColor = newTeamColor
    options.addPlayer(player)
  }

  options.playerDead = function (player) {
    var teamColor = player.teamColor,
      teamPlayers = players[teamColor]
    var all_dead = !teamPlayers.some(player => player.state === 'alive')
    if (all_dead) {
      teamPlayers.forEach(player => player.lose())
      for (var color in players) {
        if (color !== teamColor) {
          var teamPlayers = players[color]
          teamPlayers.forEach(player => player.win())
        }
      }
    }
  }

  var receiveMessage = function () {
    var message = [].shift.call(arguments)
    options[message].apply(this, arguments)
  }

  return {
    receiveMessage
  }

})()

// 红队：
var player1 = playerFactory('皮蛋', 'red'),
  player2 = playerFactory('小乖', 'red'),
  player3 = playerFactory('宝宝', 'red'),
  player4 = playerFactory('小强', 'red');
// 蓝队：
var player5 = playerFactory('黑妞', 'blue'),
  player6 = playerFactory('葱头', 'blue'),
  player7 = playerFactory('胖墩', 'blue'),
  player8 = playerFactory('海盗', 'blue');
player1.die();
player2.die();
player3.die();
player4.die();
```

#### 装饰者模式

动态地给某个对象添加一些额外的职责，而不会影响从这个类中派生的其他对象

```JavaScript
Function.prototype.before = function (beforeFn) {
  var _self = this
  return function () {
    beforeFn.apply(this, arguments)
    return _self.apply(this, arguments)
  }
}

Function.prototype.after = function (afterFn) {
  var _self = this
  return function () {
    var ret = _self.apply(this, arguments)
    afterFn.apply(this, arguments)
    return ret
  }
}

function fn(a) {
  console.log(a)
}

var fn2 = fn.before(function (a) {
  console.log(a - 1)
}).after(function (a) {
  console.log(a + 1)
})

fn2(1)
```

#### 状态模式

状态模式的关键是区分事物内部的状态，事物内部状态的改变往往会带来事物的行为改变。

```JavaScript
var Light = function () {
  this.currState = FSM.off; // 设置当前状态
}

Light.prototype.init = function () {
  console.log('初始化操作')
}

Light.prototype.btn = function () {
  this.currState.btn.call(this, arguments)
}

var FSM = {
  off: {
    btn: function () {
      console.log('开灯为弱光')
      this.currState = FSM.weakLight
    }
  },
  weakLight: {
    btn: function () {
      console.log('变为强光')
      this.currState = FSM.strongLight
    }
  },
  strongLight: {
    btn: function () {
      console.log('关灯')
      this.currState = FSM.off
    }
  }
}

var light = new Light()
light.init()
light.btn()
light.btn()
light.btn()
light.btn()
light.btn()
light.btn()
```

## 设计原则

### 单一职责原则

一个对象（方法）只做一件事

### 最少知识原则

一个软件实体应当尽可能少地与其他实体发生相互作用

### 开放-封闭原则

软件实体（类、模块、函数）等应该是可以扩展的，但是不可修改

## 代码重构

### 1.提炼函数

将函数中的部分代码独立出来，封装为另一个函数

### 2.合并重复的条件片段

条件分支语句里的重复代码可以合并去重

### 3.把条件分支语句提炼成函数

复杂的条件分支语句代码可以提炼为一个函数

### 4.合理使用循环

重复性工作的代码整理到数组里去循环

### 5.提前让函数退出代替嵌套条件分支

用多个return替代else if

### 6.传递对象参数代替过长的参数列表

将过长的参数封装成对象传参

### 7.尽量减少参数数量

不要传入能通过计算得到的参数

### 8.少用三目运算符

复杂的条件分支语句使用三目运算符没有可读性和可维护性

### 9.合理使用链式调用

如果链条很容易发生变化，会导致调试和维护困难

### 10. 分解大型类

### 11.用return退出多重循环

如果循环之后又执行的代码可以封装成一个函数放到return后面

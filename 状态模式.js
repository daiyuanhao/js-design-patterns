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
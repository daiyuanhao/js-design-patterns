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

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
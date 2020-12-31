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

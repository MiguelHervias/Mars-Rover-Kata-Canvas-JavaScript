window.onload = function() {
  'use strict';

  //CLASS OBSTACLES
  function Obstacles(sizeX, sizeY) {
    this.createObstacles(sizeX, sizeY);
  }

  Obstacles.prototype.createObstacles = function(sizeX, sizeY){
    var listObstacles = [];
    var numberObstacles = Math.floor((Math.random() * (15-10+1)) + 10);
    for(var i = 0; i < numberObstacles; i++) {
      var posX = Math.floor((Math.random() * sizeX-1) + 1);
      var posY = Math.floor((Math.random() * sizeY-1) + 1);
      if (!((posX == 0 && posY == 0) || (posX == sizeX-1 && posY == sizeY-1))){
        listObstacles.push([posX, posY]);
      }
    }
    this.listObstacles = listObstacles;
  }

  Obstacles.prototype.checkingObstacles = function(posX, posY) {
    for(var i = 0; i < this.listObstacles.length; i++) {
      if (this.listObstacles[i][0] == posX && this.listObstacles[i][1] == posY) {
        return true;
      }
    }
    return false;
  }


  //CLASS GRID
  function Grid(sizeX, sizeY, obstacles_obj) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.obstacles = obstacles_obj
    this.drawGrid();
  }

  Grid.prototype.drawObstacles = function() {
    var marginX = 50;
    var marginY = 25;
    for (var i = 0; i < this.obstacles.listObstacles.length; i++) {
      var posX = (this.obstacles.listObstacles[i][0] * marginX) + 15;
      var posY = (this.obstacles.listObstacles[i][1] * marginY) + 3;
      this.board.drawImage(stone, posX, 131-posY, 20, 20);
    }
  }

  Grid.prototype.drawGrid = function() {
    //BOARD DIMENSIONS
    var marginxLines = 50;
    var marginyLines = 25;
    var xLine = 0;
    var yLine = 0;
    //GETTING CANVAS
    var canvas = document.getElementById("myCanvas");
    this.board = canvas.getContext("2d");
    
    this.board.fillStyle="#eee";    
    this.board.fillRect(0, 0, 600, 150);

    //DRAWING LINES BOARD
    this.board.fillStyle="#555";
    for (var i = 1; i < this.sizeY; i++) {
      yLine += marginyLines;
      this.board.fillRect(0, yLine, 600, 1);  
    }
    for (var i = 1; i < this.sizeX; i++) {
      xLine += marginxLines;
      this.board.fillRect(xLine, 0, 1, 400);
    }
    this.drawObstacles();
  }

  Grid.prototype.drawRocket = function(posX, posY, orientation) {
    this.drawGrid();
    var marginxLines = 50;
    var marginyLines = 25;

    posX = marginxLines * posX;
    posY = marginyLines * posY * (-1);

    if(orientation == "n") {
      this.board.drawImage(rocket_n, posX+16, posY+130);
    }else if (orientation == "s") {
      this.board.drawImage(rocket_s, posX+16, posY+130);
    }else if (orientation == "w") {
      this.board.drawImage(rocket_w, posX+16, posY+130);
    }else if (orientation == "e") {
      this.board.drawImage(rocket_e, posX+16, posY+130);
    }
  }


  //ROVER CLASS
  function Rover(startX, startY, looking, grid_obj) {
    this.position = [startX, startY];
    this.looking = looking;
    this.grid = grid_obj;
    this.grid.drawRocket(this.position[0], this.position[1], this.looking);
  }

  Rover.prototype.move = function(moves) {
    for (var i = 0; i < moves.length; i++) {
      var direction = moves[i];
      if (direction == 'f') {
        this.goingforward();
      }else if (direction == 'b') {
        this.goingbackward();
      }else if (direction == 'l') {
        this.goingleft();
      }else if (direction == 'r') {
        this.goingright();
      }else {
        console.log('Wrong direction');
      }
      console.log('x'+this.position[0]+' y'+this.position[1]+' looking'+this.looking);
      this.grid.drawRocket(this.position[0], this.position[1], this.looking);
    }
  }

  Rover.prototype.goingforward = function() {    
    var preMovex = this.position[0];
    var preMovey = this.position[1];

    if (this.looking == 'n') {
      this.position[1] = (this.position[1] + 1) % this.grid.sizeY;
    }else if (this.looking == 's') {
      this.position[1] = (this.position[1] - 1);
      if (this.position[1] < 0) this.position[1] = (this.grid.sizeY - 1);
    }else if (this.looking == 'w') {
      this.position[0] = (this.position[0] - 1);
      if (this.position[0] < 0) this.position[0] = (this.grid.sizeX - 1);
    }else if (this.looking == 'e') {
      this.position[0] = (this.position[0] + 1) % this.grid.sizeX;
    }else {
      console.log('Wrong cardinal point');
    }

    if (obstacles.checkingObstacles(this.position[0], this.position[1])) {
      this.position = [preMovex, preMovey];
    }
  }

  Rover.prototype.goingbackward = function() {

    var preMovex = this.position[0];
    var preMovey = this.position[1];

    if (this.looking == 'n') {
      this.position[1] = (this.position[1] - 1);
      if (this.position[1] < 0) this.position[1] = (this.grid.sizeY - 1);
    }else if (this.looking == 's') {
      this.position[1] = (this.position[1] + 1) % this.grid.sizeY;
    }else if (this.looking == 'w') {
      this.position[0] = (this.position[0] + 1) % this.grid.sizeX;
    }else if (this.looking == 'e') {
      this.position[0] = (this.position[0] - 1);
      if (this.position[0] < 0) this.position[0] = (this.grid.sizeX - 1);
    }else {
      console.log('Wrong cardinal point');
    }

    if (obstacles.checkingObstacles(this.position[0], this.position[1])) {
      this.position = [preMovex, preMovey];
    }
  }

  Rover.prototype.goingleft = function () {
    if (this.looking == 'n') {
      this.looking = 'w';
    }else if (this.looking == 's') {
      this.looking = "e";
    }else if (this.looking == 'w') {
      this.looking = "s";
    }else if (this.looking == 'e') {
      this.looking = "n";
    }else {
      console.log('Wrong cardinal point');
    }
  }

  Rover.prototype.goingright = function () {
    if (this.looking == 'n') {
      this.looking = 'e';
    }else if (this.looking == 's') {
      this.looking = "w";
    }else if (this.looking == 'w') {
      this.looking = "n";
    }else if (this.looking == 'e') {
      this.looking = "s";
    }else {
      console.log('Wrong cardinal point');
    }
  }


  //CLASS GAME
  function Game() {
    var movesRocket = document.getElementById('instructions').value;
    this.checkingInstructions()
    rover.move(movesRocket);
  }

  Game.prototype.checkingInstructions = function (){
    var instructions = document.getElementById('instructions').value;
    for (var i = 0; i < instructions.length; i++) {
      if (instructions[i] != 'f' && instructions[i] != 'b' && instructions[i] != 'r' && instructions[i] != 'l') {
        alert("Check your instructions");
        break;
      }
    }
  }

  var grid, rover, game, obstacles, sizeX = 6, sizeY = 6;
  
  obstacles = new Obstacles(sizeX, sizeY);
  grid = new Grid(sizeX, sizeY, obstacles);
  rover = new Rover(0, 0, 'n', grid);

  var startGame = function() {
    game = new Game();
  }

  document.getElementById('go').onclick = startGame;

}
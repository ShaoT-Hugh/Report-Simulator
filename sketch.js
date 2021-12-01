var _stageManager;
var _spriteManager;
var _entityManager;

var _isMousePressed = false;
var _mouseBuffer = false;
var _mouseBufferTimer = 0;

var _mainColors = ['0, 0, 0', '255,0,170', '0,170,240', '170,0,255', '255,170,0'];

function setup() {
  createCanvas(800, 600);

  // Initialize the stage_manager
  _stageManager = stageManager.get();

  // Initialize the sprite manager
  _spriteManager = spriteManager.get();

  _stageManager.reset(); // initialzie the stages
}

function draw() {
  background(220);

  _stageManager.update();
}

// check if the mouse is pressed
function mousePressed(){
  _isMousePressed = true;
}
function mouseReleased(){
  _isMousePressed = false;
}

class stageManager{
  static get(){
    if(!this.instance) this.instance = new stageManager();
    return this.instance;
  }
  constructor(){
    this.state_num = 0;

    // start match button
    this.start_match = new cusButton(width/2, 450, 280, 100, function(){
      _stageManager.start_match.enabled = false;
      _stageManager.state_num ++;
      _spriteManager.createEntity();
    }, {text : "Start Match", text_col : '0, 0, 0', text_size : 40})

    // engage button
    this.engage = new cusButton(width/2 + 230, height/2, 100, 70, function(){
      _spriteManager.heros[0].engage();
    }, {color : '180, 20, 20', text : 'PRESS', text_col : '255, 255, 255', text_size : 32});

    this.ifEngage = false;
    this.engageTimer = 0;
    this.ifWin = false;

    // report buttons
    this.report_buttons = [];
  }

  // reset all the stages
  reset(){
    this.state_num = 0;
    this.ifEngage = false;
    clearTimeout(this.engageTimer);
    this.ifWin = false;
    this.start_match.enabled = true; // enable the match button
  }
  startEngage(){
    this.ifEngage = true;
    this.engage.enabled = true; // enable the angage button
    this.engageTimer = setTimeout(function(){
      _stageManager.ifEngage = false;
      _stageManager.engage.enabled = true; // disable the angage button
      _stageManager.state_num --;
      _spriteManager.entity.leave(); // remove the current entity
      // checkout the result
      if(_spriteManager.checkoutResult()) _spriteManager.winning_bar.value += 10;
      else _spriteManager.winning_bar.value -= 10;
      _spriteManager.resetEngage();
      clearTimeout(this.engageTimer);
    }, 5000);
  }

  update(){
    switch(this.state_num){
      case 0: // home page
        this.start_match.render();
        break;
      case 1: // waiting stage
        let entity = _spriteManager.entity;
        if(entity.isReady){
          if(entity.isLeave){ // if the last entity leave the screen, create a new one
            // if the winning progress equals to 0 or 100, end the game
            if(_spriteManager.winning_bar.value <= 0 || _spriteManager.winning_bar.value >= 100){
              this.state_num += 2;
              if(_spriteManager.winning_bar.value <= 0) this.ifWin = false;
              else this.ifWin = true;
            }else{
              _spriteManager.createEntity();
            }
          }else{ // if the entity just arrive, enter the engage stage
            this.state_num ++;
            this.startEngage();
          }
        }
        break;
      case 2: // engage stage
        this.engage.render();
        _spriteManager.heros[0].renderEngageBar();
        break;
      case 3: // result stage
        _spriteManager.renderResult();
        break;
    }

    if(this.state_num > 0){
      _spriteManager.renderHeros();
      _spriteManager.renderFloatingTexts();
      _spriteManager.entity.update();
      _spriteManager.entity.render();
      _spriteManager.winning_bar.render();
    }
  }
}

// <---------- Sprite ---------->
class spriteManager{
  static get(){
    if(!this.instance) this.instance = new spriteManager();
    return this.instance;
  }
  constructor(){
    // Initialize all the sprites
    this.heros = [];
    for(let i = 1; i <= 4; i++){
      this.heros.push(new hero(i * 200 - 100, 500, 40, _mainColors[i]));
    }

    // the winning progress bar
    this.winning_bar = new powerGauge(80, 50, 640, 30, {color : "180, 40, 0", mode : "horizontal", max : 100, init : 40})

    this.entity = null; // current object

    // game result board
    this.result_board = createGraphics(600, 280);
    this.result = new gameResult(width/2, -150, width/2, height/2, 600, 280);

    this.floating_texts = []; // floating texts
  }
  // reset all the sprites
  reset(){

  }
  // render the sprite to the canvas
  renderHeros(){ // render the heros
    for(let i = 0; i < this.heros.length; i++){
      this.heros[i].update();
      this.heros[i].render();
    }
  }
  checkoutResult(){ // render the engage result
    let result = 0;
    for(let i = 0; i < this.heros.length; i++){
      if(this.heros[i].showResult() === 'SUCCESS') result += 1;
    }
    if(result < this.heros.length) return false;
    else return true;
  }
  resetEngage(){ // reset the engagement of each hero
    for(let i = 0; i < this.heros.length; i++){
      this.heros[i].resetEngage();
    }
  }
  renderResult(){ // render the game result
    this.result.update();
    this.result.render(this.result_board);
    imageMode(CENTER);
    image(this.result_board, this.result.pos_x, this.result.pos_y);
  }
  renderFloatingTexts(){ // render all the floating texts
    if(this.floating_texts.length > 0){
      for(let i in this.floating_texts){
        if(this.floating_texts[i].render()) this.floating_texts.splice(i, 1);
      }
    }
  }
  // create a new entity
  createEntity(){
    let random_color = round(random(50, 220)) + ',' + round(random(50, 220)) + ',' + round(random(50, 220));
    this.entity = new dynamicImg(-100, height/2, width/2, height/2, random(120, 200), random(120, 200), random_color);
  }
  // create a new floating text
  createFloatingText(x, y, txt, mode = "vertical_float", size = 26, color = '0, 0, 0'){
    this.floating_texts.push(new floatingText(x, y, txt, mode, size, color));
  }
}

// sprites refer to all the individual changable elements on the screen
class sprite{
  constructor(x, y, tx, ty, w, h, rate = 20){
    this.opos_x = x; // initial x position
    this.opos_y = y; // initial y position
    this.targt_x = this.otargt_x; // original target x position
    this.targt_y = this.otargt_y; // original target y position
    this.pos_x = x; // current x position
    this.pos_y = y; // current x position
    this.targt_x = tx; // target x position
    this.targt_y = ty; // target y position
    this.width = w; // width of the sprite
    this.height = h; // height of the sprite
    this.rate = rate; // bigger to slower the moving spd
    this.isReady = false; // inform if the sprite has reach the right position
    this.isLeave = false; // inform if the sprite has left
  }
  // reset all the parameter of the sprite
  reset(){
    this.pos_x = this.opos_x;
    this.pos_y = this.opos_y;
    this.targt_x = this.otargt_x;
    this.targt_y = this.otargt_y;
    this.isLeave = false;
    // reset all the buttons
    for(let i = 0; i < this.buttons.length; i++){
      this.buttons[i].enabled = true;
    }
  }
  // remove the sprite from the canvas
  leave(){
    this.targt_x = width - this.opos_x;
    this.targt_y = this.opos_y;
    this.isReady = false;
    this.isLeave = true;
  }

  move(){
    let x = this.pos_x, y = this.pos_y, v = this.rate;
    let tx = this.targt_x, ty = this.targt_y;
    // if the current postion does not match the target position, move the sprite
    if(x !== tx || y !== ty){
      this.pos_x += (tx - x) / v;
      this.pos_y += (ty - y) / v;
      // if the current position get close enough to the target, stop moving
      if(abs(this.pos_x - tx) < 1) this.pos_x = tx;
      if(abs(this.pos_y - ty) < 1) this.pos_y = ty;
    }
  }
  
  update(){
    let x = this.pos_x, y = this.pos_y, tx = this.targt_x, ty = this.targt_y;
    if(x !== tx || y !== ty){ // always check if the sprite is ready
      this.move();
      this.isReady = false;
    }else this.isReady = true;
  }
}

// game result page
class gameResult extends sprite{
  constructor(x, y, tx, ty, w, h){
    super(x, y, tx, ty, w, h);
  }

  render(canvas = window){
    let w = this.width, h = this.height
    let game_result = '';
    canvas.push();
    // render the board
    canvas.rectMode(CORNER);
    canvas.stroke(80);
    canvas.strokeWeight(3);
    canvas.fill(180);
    canvas.rect(0, 0, w, h);
    // render the result
    canvas.textSize(48);
    if(_stageManager.ifWin){
      game_result = 'YOU WIN';
      canvas.fill(180, 0, 0);
    }else{
      game_result = 'YOU LOSE';
      canvas.fill(180, 0, 0);
    }
    canvas.text(game_result, w/2, 100);
    canvas.pop();
  }
}

// dynamic images
class dynamicImg extends sprite{
  constructor(x, y, tx, ty, w, h, color){
    super(x, y, tx, ty, w, h);
    this.color = color;
  }

  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, w = this.width, h = this.height
    canvas.push();
    canvas.rectMode(CENTER);
    canvas.noStroke();
    canvas.fill('rgb(' + this.color + ')');
    canvas.rect(x, y, w, h);
    canvas.pop();
  }
}

// floating text
class floatingText extends sprite{
  constructor(x, y, txt, mode, size = 26, color = '0, 0, 0'){
    switch(mode){
      case "vertical_float":
        super(x, y, x, y - 20);
        break;
      case "horizontal_flash":
        super(x, y, width/2, y);
        this.rate = 15; // accelerate
        break;
    }
    this.txt = txt;
    this.mode = mode;
    this.size = size ; // size of the text
    this.color = color; // color of the text(string)
  }

  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, tx = this.targt_x, ty = this.targt_y, ox = this.opos_x;
    this.move();
    let apl = 0;
    switch(this.mode){
      case "vertical_float":
        apl = map(abs(ty - y), 0, 20, 0, 1);
        break;
      case "horizontal_flash":
        let dis = abs(width/2 - ox);
        apl = map(abs(width/2 - x), 0, dis, 1, 0);
        if(x === tx && x === width/2) this.changeTarget(width - ox, y);
        break;
    }

    canvas.push();
    canvas.fill('rgba(' + this.color + ',' + apl + ')');
    canvas.textSize(this.size);
    canvas.textAlign(CENTER);
    canvas.text(this.txt, x, y);
    canvas.pop();
    return x === tx && y === ty && apl <= 0;
  }
}
// menu
class homepage{
  constructor(){

  }
}

// <---------- Entity ---------->

class entity{
  constructor(x, y, size, color){
    this.pos_x = x;
    this.pos_y = y;
    this.size = size;
    this.color = color;
    this.controller = undefined;
  }

  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, d = this.size
    canvas.push();
    canvas.noStroke();
    canvas.fill('rgb(' + this.color + ')');
    canvas.ellipse(x, y, d);
    canvas.pop();
  }
}

class hero extends entity{
  constructor(x, y, size, color){
    super(x, y, size, color);
    this.engage_bar = new powerGauge(width/2 + 120, height/2 - 50, 30, 100);
    this.power = 0;
    this.power_bar = new powerGauge(x - 60, y + size, 120, 15, {color : color, mode : "horizontal", max : 100, init : 40});
  }
  // engage behavior
  engage(){
    if(this.engage_bar.value < this.engage_bar.max_value){
      this.engage_bar.value += (5 + this.power);
    }else{
      this.engage_bar.value = this.engage_bar.max_value;
    }
  }
  // report the result of engagement
  showResult(){
    let result = "", result_color = "";
    if(this.engage_bar.value < this.engage_bar.max_value){
      result = 'FAIL';
      result_color = '250, 80, 80';
    }else{
      result = 'SUCCESS';
      result_color = '80, 250, 80';
    }
    _spriteManager.createFloatingText(this.pos_x, this.pos_y - 20, result, "vertical_float", 28, result_color);
    return result;
  }
  // reset the engage bar
  resetEngage(){
    this.engage_bar.value = 50;
  }
  update(){
    // when the engage bar is full, stop decrease the engage power
    if(this.engage_bar.value < this.engage_bar.max_value) this.engage_bar.update();
  }

  renderEngageBar(canvas = window){
    // render the engage bar
    this.engage_bar.render(canvas);
  }

  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, d = this.size
    canvas.push();
    canvas.noStroke();
    canvas.fill('rgb(' + this.color + ')');
    canvas.ellipse(x, y, d);
    canvas.pop();
    // render the hero's power bar
    this.power_bar.render(canvas);
  }
}

class powerGauge{
  constructor(x, y, w, h, param = {mode : "verticle", color : "120, 255, 120", max : 100, init : 50}){
    this.mode = param.mode;
    this.pos_x = x;
    this.pos_y = y;
    this.width = w;
    this.height = h;
    this.color = param.color;
    this.max_value = param.max;
    this.value = param.init;
  }
  update(){
    this.value = max(this.value - 0.2, 0);
  }
  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, w = this.width, h = this.height;
    let offset = this.value / this.max_value;
    canvas.push();
    canvas.rectMode(CORNER);
    // draw the power bar
    canvas.noStroke();
    canvas.fill('rgb(' + this.color + ')');
    switch(this.mode){
      case "verticle":
        canvas.rect(x, y + h * (1 - offset), w, h * offset);
        break;
      case "horizontal":
        canvas.rect(x, y, w * offset, h);
        break;
    }
    // draw the frame
    canvas.strokeWeight(2);
    canvas.stroke(80);
    canvas.noFill();
    canvas.rect(x, y, w, h);
    canvas.pop();
  }
}

// customized button element
class cusButton{
  // additional parameters: button color(string), text(string), text_col(string), text_size(int), offsetX(int), offsetY(int)
  constructor(x, y, width, height, func, param = {
    color : "255, 255, 255", text : '', text_col : '0, 0, 0', text_size : 24
  }){
    this.pos_x = x;
    this.pos_y = y;
    this.width = width;
    this.height = height;
    this.offset_x = param.offsetX ? param.offsetX : 0;
    this.offset_y = param.offsetY ? param.offsetX : 0;
    
    this.func = func;
    this.color = param.color;
    this.text = param.text;
    this.text_color = param.text_col;
    this.text_size = param.text_size;
    this.enabled = false; // if the button is enabled
    this.Clicked = false;
  }
  
  // check if the mouse is on the button
  ifMouseOn(){
    let x = this.pos_x + this.offset_x, y = this.pos_y + this.offset_y, w = this.width, h = this.height;
    let mx = mouseX, my = mouseY;
    if(mx > x + w/2 || mx < x - w/2 || my > y + h/2 || my < y - h/2)
      return false;
    else return true;
  }
  // check if the button is clicked
  ifClicked(){
    if(this.ifMouseOn()){
      this.Clicked = true;
      // assets.get("button_sound").play(); // play the button clicked sound
      this.func(); // trigger the button
      // start buffer
      _mouseBuffer = true;
      _mouseBufferTimer = setTimeout(function(){
        _mouseBuffer = false;
        clearTimeout(_mouseBufferTimer);
      }, 100);
    }else this.Clicked = false;
  }
  
  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, w = this.width, h = this.height;
    // check if the button is clicked
    if(this.enabled && _isMousePressed && !this.Clicked) this.ifClicked();
    if(!_isMousePressed && this.Clicked) this.Clicked = false;
    
    canvas.push();
    canvas.rectMode(CENTER);
    canvas.textAlign(CENTER);
    canvas.textSize(this.text_size);
    if(!this.Clicked){
      canvas.stroke(75);
      canvas.strokeWeight(3);
      canvas.fill('rgb(' + this.color + ')');
      canvas.rect(x, y, w, h);
      canvas.noStroke();
      canvas.fill('rgb(' + this.text_color + ')');
      canvas.text(this.text, x, y + this.text_size/2 - 5);
    }else{
      canvas.stroke(75);
      canvas.strokeWeight(3);
      canvas.fill('rgb(' + this.color + ')');
      canvas.rect(x, y, w, h);
      canvas.noStroke();
      canvas.fill('rgb(' + this.text_color + ')');
      canvas.text(this.text, x, y + this.text_size/2 - 5);
    }
    canvas.pop();
  }
}

class switchButton extends cusButton{
  constructor(x, y, width, height, func){
    super(x, y, width, height, func);
    this.ifSwitched = false;
  }
}

// calculate the average of an array
function averageNum(array){
  let sum = 0;
  for(let i in array){
    sum += array[i];
  }
  return sum / array.length;
}
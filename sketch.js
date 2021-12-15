var _assets;
// managers
var _stageManager;
var _spriteManager;
var _dynamicObjManager;
var _beatManager;
var _AIManager;

// mouse buffer used to avoid repeat mouse click
var _isMousePressed = false; // if the mouse is pressed
var _mouseBuffer = false;
var _mouseBufferTimer = 0;

var _playerPool = []; // all the AI players
var _playerTypes = ['normal', 'newbie', 'irritable', 'exhausted', 'nasty', 'disruptive'];
var _playerColors = ['255,0,170', '0, 170, 240', '221,237,170', '240,207,101', '277,138,0', '227,201,228'];
var _identityCards = [];
var _identity = [
  [` Brad
  A normal player who never becomes 
  toxic.`],
  [` Lima
  A new player who is not toxic, but 
  often makes mistakes due to the lack 
  of play experience and skills.`],
  [`Kevin
  A player who is out of form(or 
  exhasuted) today and unable to 
  concentrate too long.`],
  [` Simon
  An experienced player who is not 
  toxic inherently, but is so irritable 
  that he always easily gets annoyed 
  and starts to sabotage others`],
  [` Alex
  A player who likes to do something 
  toxic occasionally to make fun from 
  others.`],
  [` Olive
  A player who intentionally sabotages 
  others because he wants to lower his 
  rank level so that he can plays more 
  easily.`]
];

var _homePage; // home page canvas
var _gameResult; // game result canvas

var _scaleLevel = 1; // scale level of the window
var _maxLv = 10; // max level of the hero
var _mainFont; // main font
var _backColor = '220, 220, 220';

function preload(){
  _mainFont = loadFont('assets/Minecraft.ttf');
  // Initialize assets manager
  _assets = new Map();
  _assets.set('board', new asset('static_image', 'assets/graphics/board.png'));
  _assets.set('hero_frame', new asset('static_image', 'assets/graphics/hero_frame.png'));
  _assets.set('winning_bar', new asset('static_image', 'assets/graphics/winning_bar.png'));
  _assets.set('player_icons', new asset('dynamic_image', 'assets/graphics/player_icon_', 6, '.png'));

  // load sound files
  _assets.set('button_click', new asset('sound', 'assets/sounds/sfx_sounds_button8.wav'));
}

function setup() {
  // resize the size of the canvas
  createCanvas(960, 540); // canvas size: 960 x 540
  angleMode(DEGREES);
  textFont(_mainFont);
  _homePage = createGraphics(640, 360);
  _homePage.textFont(_mainFont);
  _gameResult = createGraphics(640, 360);
  _gameResult.textFont(_mainFont);
  
  // load assets
  // load graphics
  _assets.set('Portrait_A', new asset('static_image', 'assets/graphics/heroPortrait_A.png'));
  _assets.set('Portrait_B', new asset('static_image', 'assets/graphics/heroPortrait_B.png'));
  _assets.set('Portrait_C', new asset('static_image', 'assets/graphics/heroPortrait_C.png'));
  _assets.set('Portrait_D', new asset('static_image', 'assets/graphics/heroPortrait_D.png'));
  _assets.set('Hero_A', new asset('dynamic_image', 'assets/graphics/hero_A', 2, '.png'));
  _assets.set('Hero_B', new asset('dynamic_image', 'assets/graphics/hero_B', 2, '.png'));
  _assets.set('Hero_C', new asset('dynamic_image', 'assets/graphics/hero_C', 2, '.png'));
  _assets.set('Hero_D', new asset('dynamic_image', 'assets/graphics/hero_D', 2, '.png'));
  _assets.set('Enemy_A', new asset('dynamic_image', 'assets/graphics/Enemy_A', 4, '.png'));
  _assets.set('Enemy_B', new asset('dynamic_image', 'assets/graphics/Enemy_B', 4, '.png'));
  _assets.set('Enemy_C', new asset('dynamic_image', 'assets/graphics/Enemy_C', 4, '.png'));
  _assets.set('Enemy_D', new asset('dynamic_image', 'assets/graphics/Enemy_D', 4, '.png'));

  _assets.set('portraits', [_assets.get('Portrait_A'), _assets.get('Portrait_B'), _assets.get('Portrait_C'), _assets.get('Portrait_D')]);
  _assets.set('hero_pool', [_assets.get('Hero_A'), _assets.get('Hero_B'), _assets.get('Hero_C'), _assets.get('Hero_D')]);
  _assets.set('hero_size', [[96, 92], [88, 92], [76, 92], [128, 92]]);
  _assets.set('enemy_pool', [_assets.get('Enemy_A'), _assets.get('Enemy_B'), _assets.get('Enemy_C'), _assets.get('Enemy_D')]);
  _assets.set('enemy_size', [[194, 168], [216, 170], [168, 188], [196, 190]]);
  // buttons
  _assets.set('main_button', new asset('dynamic_image', 'assets/graphics/main_button_', 2, '.png'));
  _assets.set('report_button', new asset('dynamic_image', 'assets/graphics/report_button_', 2, '.png'));

  // background images
  _assets.set('backgrounds', new asset('dynamic_image', 'assets/graphics/background_', 5, '.jpg'));

  // load sound files
  _assets.set('ball_shoot', new asset('sound', 'assets/sounds/sfx_exp_shortest_hard7.wav'));
  _assets.set('ball_hit', new asset('sound', 'assets/sounds/sfx_exp_short_hard2.wav'));
  _assets.set('get_hit', new asset('sound', 'assets/sounds/sfx_exp_medium6.wav'));
  _assets.set('monster_death', new asset('sound', 'assets/sounds/sfx_deathscream_android7.wav'));

  // Initialize the managers
  // identity cards
  for(let i = 0; i < 6; i++){
    _identityCards.push(new card(284, 100, _identity[i], _playerColors[i]));
  }
  // Initialize the stage_manager
  _stageManager = stageManager.get();
  // Initialize the sprite manager
  _spriteManager = spriteManager.get();
  // Initialize the dynamic object manager
  _dynamicObjManager = dynamicObjManager.get();
  // Initialize the beat manager
  _beatManager = beatManager.get();
  // Initialize the AI manager
  _AIManager = AIManager.get();

  // Initialize player pool
  // player types: normal, newbie, irritable, indifferent, nasty
  _playerPool.push(new Player('Brad', 0, 95, 30));
  _playerPool.push(new Player('Lima', 1, 95, 80));
  _playerPool.push(new Player('Simon', 2, 95, 20));
  _playerPool.push(new Player('Kevin', 3, 85, 30));
  _playerPool.push(new Player('Alex', 4, 90, 50));
  _playerPool.push(new Player('Olive', 5, 50, 50));

  _stageManager.reset(); // initialzie the stages
  console.log(width + ',' + height);
}

function draw() {
  _stageManager.update();
}

// check if the mouse is pressed
function mousePressed(){
  _isMousePressed = true;
}
function mouseReleased(){
  _isMousePressed = false;
}

// <---------- Assets ---------->
class asset{
  constructor(type, path, num = 1, suffix = ''){
    switch(type){
      case 'dynamic_image':
        this.content = [];
        for(let i = 1; i <= num; i++) this.content.push(loadImage(path + i + suffix));
        break;
      case 'static_image':
        this.content = loadImage(path);
        break;
      case 'sound':
        this.content = loadSound(path);
        break;
      default:
        console.log('Warning: File type is invalid:', path);
    }
  }
}

// <---------- Stage ---------->
class stageManager{
  static get(){
    if(!this.instance) this.instance = new stageManager();
    return this.instance;
  }
  constructor(){
    this.state_num = 0;

    // home page
    // start match button
    this.start_match = new cusButton(690, 495, 200, 54, function(){
      _stageManager.start_match.enabled = false;
      _stageManager.ifTrans = 2; // leave the homepage
    }, _assets.get('main_button').content, {text : "START",  text_col : '0, 0, 0', text_size : 28})

    // engage button
    this.engage = new cusButton(width/2 + 230, height/2, 100, 70, function(){
      _spriteManager.heros[0].engage();
    }, [], {color : '180, 20, 20', text : 'PRESS', text_col : '255, 255, 255', text_size : 32});

    this.ifEngage = false; // inform if it's the angage stage
    this.engageTimer = 0;
    this.rounds = 0; // game rounds
    this.ifWin = false;
    this.isOver = false; // inform if the game is over

    // black transition mask
    this.ifTrans = 0; // 0: no trans; 1: enter; 2: leave
    this.mask_alp = 0;
    // countdown
    this.countdown_text = '';
  }
  // transition mask
  startTrans(trans){ // true: enter; false: leave
    if(trans) this.mask_alp -= 1;
    else this.mask_alp += 1;
    fill(0, map(this.mask_alp, 0, 100, 0, 255));
    rectMode(CORNER);
    rect(0, 0, width, height);
  }

  // reset all the stages
  reset(){
    this.state_num = 0;
    this.ifEngage = false;
    this.rounds = 0;
    clearTimeout(this.engageTimer);
    this.ifWin = false;
    // check if the game is over
    if(_playerPool.length < 4){
      this.isOver = true;
      _spriteManager.home_page.enableButtons(true); // unlock all the identities
    }else this.start_match.enabled = true; // enable the match button
  }    

  startEngage(){ // players start to engage
    this.ifEngage = true;
    // start AI check every 0.25 seconds
    _AIManager.engage_interval = setInterval(function(){
      _AIManager.engagePlayer();
    }, 500);
    // start the engage stage
    let engage_time = min(4000 + this.rounds * 200, 6000);
    this.engageTimer = setTimeout(function(){
      _stageManager.ifEngage = false;
      _stageManager.state_num --;
      _spriteManager.entity.leave(); // remove the current entity
      // checkout the result
      _spriteManager.checkoutResult();
      _spriteManager.resetEngage();

      clearInterval(_AIManager.engage_interval);
      clearTimeout(_stageManager.engageTimer);
    }, engage_time);
  }

  update(){
    let status = this.state_num;
    // stage 1 : home page
    // start match -> randomly assign players to the heros
    if(status > 0){
      background(64, 43, 45);
      _spriteManager.renderBackground(); // randomly select a scene
    }else{
      background(220);
    }
    /* order of each round
      wait for the enemy to be present
      when the enemy is ready, start engage stage(5 sec)
      -> for every 0.2 second, run 1 check for AI players
      when the engage stage ends, show the result & players level up(2 sec)
      wait for the enemy to leave
      check the winning progress
    */
    switch(status){
      case 0: // home page
        _spriteManager.renderTitle();
        this.start_match.render();
        if(this.mask_alp >= 100){
          this.mask_alp = 100;
          this.ifTrans = 1; // change trans state to enter
          _AIManager.assignPlayer(); // assign players to the game
          // randomly select a scene
          let random_scene = floor(random(0, 5));
          _spriteManager.background = _assets.get('backgrounds').content[random_scene];
          this.state_num ++;
        }
        break;
      case 1: // loading stage
        if(this.mask_alp <= 0){
          this.mask_alp = 0;
          this.ifTrans = 0; // stop trans
          // present countdown text
          if(this.countdown_text === '' && _spriteManager.floating_texts.length <= 0){
            _spriteManager.createFloatingText(-100, height/2, 'Ready', {mode: 'horizontal_flash', size: 40});
            this.countdown_text = 'Ready';
          }else if(this.countdown_text === 'Ready' && _spriteManager.floating_texts.length <= 0){
            _spriteManager.createFloatingText(-100, height/2, 'GO', {mode: 'horizontal_flash', size: 40});
            this.countdown_text = 'GO';
          }else if(this.countdown_text === 'GO' && _spriteManager.floating_texts.length <= 0){
            _stageManager.countdown_text = '';
            _spriteManager.createEntity();
            // _spriteManager.enableButtons(); // enable report buttons
            _stageManager.state_num ++;
          }
        }
        break;
      case 2: // waiting stage
        let entity = _spriteManager.entity;
        if(entity.isReady){
          if(entity.isLeave){ // if the last entity leave the screen, create a new one
            // if the enemy is not defeated, create a beat
            if(_spriteManager.entity.health > 0){
              _beatManager.createBeat(width, height/2 - 50, '220, 0, 0', 260);
              _assets.get('get_hit').content.play();
            }
            // if the winning progress equals to 0 or 100, end the game
            if(_spriteManager.winning_bar.value <= 0 || _spriteManager.winning_bar.value >= 100){
              _spriteManager.game_result.enableButtons(true);
              this.state_num += 2;
              if(_spriteManager.winning_bar.value <= 0) this.ifWin = false;
              else this.ifWin = true;
            }else{
              this.rounds ++;
              _spriteManager.createEntity(); // create a new enemy
            }           
          }else{ // if the entity just arrive, enter the engage stage
            this.state_num ++;
            this.startEngage();
          }
        }
        break;
      case 3: // engage stage
        _spriteManager.entity.renderHealth();
        // _spriteManager.renderEngageBar(); // render everyone's engage bar
        break;
      case 4: // result stage
        if(this.mask_alp >= 100){
          this.mask_alp = 100;
          this.ifTrans = 1; // change trans state to enter
          // reset all
          _spriteManager.reset();
          _AIManager.resetPlayer();
          _stageManager.reset(); // return to the homepage
        }
        break;
    }

    if(status > 0){
      _spriteManager.update();
      _spriteManager.render();
      if(status > 1){
        if(_spriteManager.entity !== null){
          _spriteManager.entity.update();
          _spriteManager.entity.render();
          _dynamicObjManager.render();
        }
        _beatManager.render();
        if(status > 3){
          // render the result page
          fill(0, 150);
          rectMode(CORNER);
          rect(0, 0, width, height);
          _spriteManager.renderResult();
        }
      }
    }else _spriteManager.renderHomepage();
    // always check the transition
    if(this.ifTrans > 0){
      if(this.ifTrans === 1) this.startTrans(true);
      else this.startTrans(false);
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
    for(let i = 0; i < 4; i++){
      this.heros.push(new hero(162 + i * 212, height - 120, _assets.get('hero_size')[i][0], _assets.get('hero_size')[i][1], i));
    }
    // report buttons (abundaned)
    this.report_buttons = [];
    for(let i = 0; i < 4; i++){
      this.report_buttons.push(new toggle(width/6 + i * (width - width/3) / 3, height - 50, 261, 87, function(){
        _spriteManager.heros[i].ifReported = true;
      }, function(){
        _spriteManager.heros[i].ifReported = false;
      }, _assets.get('report_button').content, {text: 'REPORT', text_unpres: 'REPORTED', text_col: '255, 255, 255', text_size: 36}));
    }

    // the winning progress bar
    this.winning_bar = new powerGauge(180, 40, width - 360, 30, {color : "180, 40, 0", mode : "horizontal", max : 100, init : 50, trans: true})

    this.entity = null; // current entity
    this.background = null;
    this.background_scroll_pos = 0;

    // homepage board
    this.home_page = new homePage(width/2, height/2, 640, 360);
    // game result board
    this.game_result = new gameResult(width/2, -180, width/2, height/2, 640, 360);

    this.floating_texts = []; // floating texts
  }
  
  // reset all the sprites
  reset(){
    this.winning_bar.reset();
    this.entity = null;
    this.background = null;
    this.background_scroll_pos = 0;
    this.game_result.reset();
    this.floating_texts = [];
  }
  // update all the sprites
  update(){
    // update the background image
    if(this.background_scroll_pos > 0-width){
      this.background_scroll_pos -= 5;
    }else{ // if the background image reach the end, reset its position
      this.background_scroll_pos = 0;
    }

    this.winning_bar.update();

    // update the heros
    for(let i = 0; i < this.heros.length; i++){
      this.heros[i].update();
    }
  }
  // render the sprites to the canvas
  render(canvas = window){
    // render the winning bar
    this.winning_bar.render(canvas);
    push();
    imageMode(CORNER);
    image(_assets.get('winning_bar').content, this.winning_bar.pos_x - 20, this.winning_bar.pos_y - 7);
    textAlign(CENTER, TOP);
    textSize(36);
    stroke(0);
    strokeWeight(4);
    fill(255);
    text('WIN', width - 110, 43);
    text('LOSE', 110, 43);
    pop();

    // render the heros and report buttons
    for(let i = 0; i < this.heros.length; i++){
      this.heros[i].render(canvas);
      // this.report_buttons[i].render(canvas);
    }
    // render all the floating texts
    if(this.floating_texts.length > 0){
      for(let i in this.floating_texts){
        if(this.floating_texts[i].render(canvas)) this.floating_texts.splice(i, 1);
      }
    }
  }

  // render the title on the homepage
  renderTitle(canvas = window){
    canvas.push();
    canvas.textAlign(CENTER, TOP);
    canvas.textSize(44);
    canvas.stroke(128, 108, 101);
    canvas.strokeWeight(4);
    canvas.fill(0);
    canvas.text('TROLL DETECTOR', width/2, 34);
    if(_stageManager.isOver){
      canvas.textAlign(LEFT, TOP);
      canvas.textSize(20);
      canvas.noStroke();
      canvas.fill(180, 0, 0);
      canvas.text('All the identities have been revealed.', 160, height - 60);
    }
    canvas.pop();
  }
  // render the background image
  renderBackground(canvas = window){
    let pos = this.background_scroll_pos;
    canvas.push();
    canvas.imageMode(CORNER);
    canvas.tint(255, 168);
    canvas.image(this.background, pos, 0);
    canvas.image(this.background, pos + width, 0);
    canvas.pop();
  }
  renderEngageBar(canvas = window){
    for(let i = 0; i < 4; i++){
      this.heros[i].renderEngageBar(canvas);
    }
  }

  resetEngage(){ // reset the engagement of each hero
    for(let i = 0; i < this.heros.length; i++){
      this.heros[i].resetEngage();
    }
  }

  checkoutResult(){ // render the engage result
    // this.winning_bar.targt_value -= 50;
    if(this.entity.health > 0){
      this.winning_bar.targt_value -= this.entity.level * 5;
      _spriteManager.createFloatingText(-100, height/2, 'FAIL', {mode: 'verticle_float', size: 40, color: '220, 0, 0'});
    }else{
      this.winning_bar.targt_value += 5 + this.entity.level * 2.5;
      _spriteManager.createFloatingText(-100, height/2, 'SUCCEED', {mode: 'verticle_float', size: 40, color: '0, 220, 0'});
    }
    // update players attitudes
    for(let i = 0; i < this.heros.length; i++){
      this.heros[i].showResult();
      _AIManager.updatePlayer();
    }
    
    if(this.winning_bar.targt_value <= 0) this.winning_bar.targt_value = 0;
    if(this.winning_bar.targt_value >= this.winning_bar.max_value) this.winning_bar.targt_value = this.winning_bar.max_value;
  }

  renderHomepage(){ // render the home page
    this.home_page.render();
    // render the home page
    imageMode(CENTER);
    image(_homePage, this.home_page.pos_x, this.home_page.pos_y);
  }

  renderResult(){ // render the game result
    this.game_result.update();
    this.game_result.render(_gameResult);
    // render on the canvas
    imageMode(CENTER);
    image(_gameResult, this.game_result.pos_x, this.game_result.pos_y);
  }

  enableButtons(){ // enable report buttons
    for(let i = 0; i < this.report_buttons.length; i++){
      this.report_buttons[i].enable(true);
    }
  }
  // create a new entity
  createEntity(){
    // before creating, check the heros' levels
    let hero_lvs = [];
    for(let i in this.heros) hero_lvs.push(this.heros[i].level);
    let entity_lv = max(round(averageNum(hero_lvs)), _stageManager.rounds - 3);
    // entity_lv = _stageManager.rounds;

    let random_type = _stageManager.rounds % 4;
    let random_width = _assets.get('enemy_size')[random_type][0];
    let random_height = _assets.get('enemy_size')[random_type][1];
    this.entity = new entity(-120, height/2 - 20, width/2, height/2 - 20, random_width, random_height, random_type, entity_lv);
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
    this.otargt_x = tx; // original target x position
    this.otargt_y = ty; // original target y position
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

  // change the target position of the sprite
  changeTarget(x, y){
    this.targt_x = x;
    this.targt_y = y;
  }
}

// homepage
class homePage extends sprite{
  constructor(x, y, w, h){
    super(x, y, x, y, w, h);
    // format parameters: left edge, top edge, horizontal interval, verticle interval
    this.parameters = [50, 65, 0, 50];

    // identity cards
    this.card_board = createGraphics(284, 100);
    this.card_board.textFont(_mainFont);
    this.card_buttons = [];
    
    for(let i = 0; i < 6; i++){
      this.card_buttons.push(new dynamicButton(460, this.parameters[1] + this.parameters[3] * i, 100, 36,
        function(num = i){
          if(!_identityCards[num].enabled) _identityCards[num].enabled = true;
          else _identityCards[num].enabled = false;
          // disable other card buttons
          for(let j = 0; j < 6; j++){
            if(num !== j) _identityCards[j].enabled = false;
          }
        }, _assets.get('report_button').content, {text: 'IDENTITY',
        text_col: _playerColors[i], text_size: 15, offset_x: x - w/2, offset_y: y - h/2}));
    }
  }

  enableButtons(ifEable){
    for(let i in this.card_buttons){
      this.card_buttons[i].enable(ifEable);
    }
  }
  render(canvas = _homePage){
    let w = this.width, h = this.height, p = this.parameters;
    canvas.push();
    // render the board
    canvas.imageMode(CORNER);
    canvas.image(_assets.get("board").content, 0, 0);

    let ifRender_unbanned = -1;
    let ifRender_banned = -1;
    canvas.textSize(24);
    canvas.strokeWeight(3);
    if(_playerPool.length > 0){
      for(let i in _playerPool){
        canvas.noStroke();
        canvas.fill(64, 43, 45);
        canvas.textAlign(LEFT);
        // show the player's names
        canvas.text(_playerPool[i].name, p[0], p[1] + i * p[3]);
        canvas.fill(0, 220, 0);
        canvas.textAlign(RIGHT);
        // show the player's status
        canvas.text('ONLINE', w - p[0], p[1] + i * p[3]);
        canvas.stroke(90, 72, 62);
        canvas.line(p[0] - 10, p[1] + i * p[3] + 14, w - p[0] + 10, p[1] + i * p[3] + 14);
        // show the player's button
        _spriteManager.home_page.card_buttons[_playerPool[i].num].render(w - 208, p[1] + i * p[3] - 10, canvas);
        if(_identityCards[_playerPool[i].num].enabled) ifRender_unbanned = i;
      }
    }
    // banned players
    if(_AIManager.banned_players.length > 0){
      for(let i in _AIManager.banned_players){
        canvas.noStroke();
        canvas.fill(90);
        canvas.textAlign(LEFT);
        canvas.text(_AIManager.banned_players[i].name, p[0], p[1] + p[3] * (parseInt(i) + _playerPool.length));
        canvas.fill(180, 0, 0);
        canvas.textAlign(RIGHT);
        canvas.text('OUT', w - p[0], p[1] + p[3] * (parseInt(i) + _playerPool.length));
        canvas.stroke(172, 0, 0);
        canvas.line(p[0] - 10, p[1] + p[3] * (parseInt(i) + _playerPool.length)-10, w - p[0] + 10, p[1] + p[3] * (parseInt(i) + _playerPool.length)-10);
        // show the player's button
        _spriteManager.home_page.card_buttons[_AIManager.banned_players[i].num].render(w - 208, p[1] + p[3] * (parseInt(i) + _playerPool.length)-10, canvas);
        // check if to render the identity card
        if(_identityCards[_AIManager.banned_players[i].num].enabled) ifRender_banned = i;
      }
    }
    // render the identity card
    if(ifRender_unbanned > -1){
      _identityCards[_playerPool[ifRender_unbanned].num].render(this.card_board);
      canvas.image(this.card_board, 60, 5 + p[3] * ifRender_unbanned);
    }
    if(ifRender_banned > -1){
      _identityCards[_AIManager.banned_players[ifRender_banned].num].render(this.card_board);
      canvas.image(this.card_board, 60, 5 + p[3] * (parseInt(ifRender_banned) + _playerPool.length));
    }
    canvas.pop();
  }
}

// game result page
class gameResult extends sprite{
  constructor(x, y, tx, ty, w, h){
    super(x, y, tx, ty, w, h);

    // format parameters: left edge, top edge, horizontal interval, verticle interval, horizontal offset, verticle offset
    this.parameters = [40, 74, 95, 60, 12, 14, 20];
    // report buttons
    this.report_buttons = [];
    for(let i = 0; i < 4; i++){
      this.report_buttons.push(new toggle(560, this.parameters[1] + this.parameters[6] + this.parameters[3] * i, 100, 36,
        function(){
          _AIManager.ingame_players[i].ifOut = true;
        }, function(){
          _AIManager.ingame_players[i].ifOut = false;
        }, _assets.get('report_button').content, {text: 'KICK', text_unpres: 'KICKED',
        text_col: '200,0,0', text_unpres_col: '50,0,0', text_size: 16, offset_x: tx - w/2, offset_y: ty - h/2}));
    }

    // submit the result and back to homepage button
    this.submit = new cusButton(width/2, 495, 200, 54, function(){
      _AIManager.checkResult(); // reassign the players
      _spriteManager.game_result.submit.enable(false);
      _stageManager.ifTrans = 2; // leave the result page
    }, _assets.get('main_button').content, {text : "SUBMIT",  text_col : '0, 0, 0', text_size : 28})
  }

  // enable/disable all the buttons on the result board
  enableButtons(ifEnable){
    for(let i in this.report_buttons){
      this.report_buttons[i].enable(ifEnable);
    }
    this.submit.enable(ifEnable);
  }
  showResult(canvas){
    let hero, p = this.parameters;
    canvas.fill(64, 43, 45);
    canvas.textAlign(CENTER, TOP);
    canvas.textSize(19);
    canvas.text('Damage', p[0] + p[4] + p[2] * 2, p[1] - 30);
    canvas.text('Engage', p[0] + p[4] + p[2] * 3, p[1] - 30);
    canvas.text('Accuracy', p[0] + p[4] + p[2] * 4, p[1] - 30);
    canvas.fill(255);
    for(let i in _spriteManager.heros){
      hero = _spriteManager.heros[i];
      canvas.image(_assets.get('portraits')[i].content, p[0], p[1] + p[3] * i, 60, 45); // draw the hero portraits
      canvas.textSize(23);
      canvas.text(hero.controller.name, p[0] + 110, p[1] + p[3] * i + 12);
      canvas.textSize(18);
      canvas.text(hero.total_damage, p[0] + p[4] + p[2] * 2, p[1] + p[3] * i + p[5]); // total damage
      canvas.text(hero.time_of_attack, p[0] + p[4] + p[2] * 3, p[1] + p[3] * i + p[5]); // engage time
      canvas.text(round(100 * hero.success_hit / hero.time_of_attack) + '%', p[0] + p[4] + p[2] * 4, p[1] + p[3] * i + p[5]); // hit rate
    }
  }
  render(canvas = _gameResult){
    let x = this.pos_x, y = this.pos_y, w = this.width, h = this.height
    let game_result = '';
    canvas.push();
    // render the board
    canvas.imageMode(CORNER);
    canvas.image(_assets.get('board').content, 0, 0);
    // show the result statistics
    canvas.textAlign(LEFT, CENTER);
    this.showResult(canvas);
    // render report buttons
    for(let i in this.report_buttons){
      this.report_buttons[i].render(canvas);
    }
    canvas.pop();
    // render the result
    noStroke();
    textAlign(CENTER, TOP);
    textSize(36);
    if(_stageManager.ifWin){
      game_result = 'TEAM WIN';
      fill(0, 220, 0);
    }else{
      game_result = 'TEAM LOSE';
      fill(220, 0, 0);
    }
    text(game_result, width/2, 40);
    // render the buttons
    this.submit.render();
  }
}

// dynamic images
class entity extends sprite{
  constructor(x, y, tx, ty, w, h, type, lv = 0){
    super(x, y, tx, ty, w, h);
    this.level = lv + 1;
    this.health = 50 + lv * 50;
    this.health_gauge = new powerGauge(tx + w/2 + 30, ty - h/2 + 50, 35, 120, {max: this.health, init: this.health});
    this.size = 100;

    this.type = type;
    this.apl = 255;
  }
  // remove the sprite from the canvas
  leave(){
    if(this.health > 0){
      this.targt_x = width - this.opos_x;
      this.targt_y = this.opos_y;
    }else{ // if the health equals 0
      this.rate = 45;
      this.targt_x = this.pos_x + 120;
      this.targt_y = this.opos_y;
      _assets.get('monster_death').content.play();
    }
    this.isReady = false;
    this.isLeave = true;
  }
  update(){
    let x = this.pos_x, y = this.pos_y, tx = this.targt_x, ty = this.targt_y;
    if(x !== tx || y !== ty){ // always check if the sprite is ready
      this.move();
      if(this.health <= 0 && this.isLeave) this.apl = max(this.apl - 2, 0);
      this.isReady = false;
    }else this.isReady = true;
  }
  renderHealth(canvas = window){
    // render the enemy level
    canvas.fill(0);
    canvas.textSize(24);
    canvas.textAlign(LEFT);
    canvas.text('Lv. ' + this.level, this.pos_x + this.width/2 + 30, this.pos_y - this.height/2 + 30);
    this.health_gauge.update();
    this.health_gauge.render();
  }
  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, w = this.width, h = this.height
    let anim = floor(frameCount % 120 / 30);
    canvas.push();
    canvas.imageMode(CENTER);
    canvas.tint(255, this.apl);
    canvas.image(_assets.get('enemy_pool')[this.type].content[anim], x, y, w, h);
    canvas.pop();
  }
}

// gauge
class powerGauge extends sprite{
  // additional parameters:
  // gauge direction(string), maxium value(num), initial value(num), rate(move spd), trans(if has transition animation)
  constructor(x, y, w, h, param = {mode : "verticle", max : 100, init : 0, rate : 20, trans : false}){
    super(x, y, x, y, w, h, param.rate);
    this.mode = param.mode || "verticle";
    this.max_value = param.max || 100;
    this.initial_value = param.init || 0;
    this.value = param.init || 0;
    this.targt_value = this.value;
    this.trans_anim = param.trans || false;
  }
  reset(){
    this.value = this.initial_value;
    this.targt_value = this.initial_value;
  }
  update(){
    let x = this.pos_x, y = this.pos_y, tx = this.targt_x, ty = this.targt_y, v = this.value, tv = this.targt_value;
    if(x !== tx || y !== ty){ // always check if the sprite is ready
      this.move();
      this.isReady = false;
    }else this.isReady = true;
    if(this.trans_anim){
      this.value += (tv - v) / 30;
      if(abs(this.value - tv) < 0.5) this.value = tv;
    }else this.value = tv;
  }
  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, w = this.width, h = this.height;
    let ratio = this.value / this.max_value;
    canvas.push();
    canvas.colorMode(HSB, 100);
    canvas.rectMode(CORNER);
    // draw the power bar
    canvas.noStroke();
    canvas.fill(ratio * 35, 80, 80);
    switch(this.mode){
      case "verticle":
        canvas.rect(x, y + h * (1 - ratio), w, h * ratio);
        break;
      case "horizontal":
        canvas.rect(x, y, w * ratio, h);
        break;
      case "round":
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
class cusButton extends sprite{
  // additional parameters: button color(string), text(string), text_col(string), text_size(int), offsetX(int), offsetY(int)
  constructor(x, y, w, h, func, imgs = [], param = {
    color : "255, 255, 255", text : '', text_col : '0, 0, 0', text_size : 24, offset_x : 0, offset_y : 0
  }){
    super(x, y, x, y, w, h);
    this.offset_x = param.offset_x || 0;
    this.offset_y = param.offset_y || 0;
    
    this.func = func;
    this.img = imgs;
    this.color = param.color;
    this.text = param.text;
    this.text_color = param.text_col;
    this.text_size = param.text_size;
    this.enabled = false; // if the button is enabled
    this.Clicked = false;
  }
  
  // enable
  enable(isEnabled){
    this.enabled = isEnabled;
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
    if(this.ifMouseOn() && !_mouseBuffer){
      this.Clicked = true;
      _assets.get("button_click").content.play(); // play the button clicked sound
      this.func(); // trigger the button
      // start buffer
      _mouseBuffer = true;
      _mouseBufferTimer = setTimeout(function(){
        _mouseBuffer = false;
        clearTimeout(_mouseBufferTimer);
      }, 200);
    }else this.Clicked = false;
  }
  
  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, w = this.width, h = this.height;
    // check if the button is clicked
    if(this.enabled && _isMousePressed && !this.Clicked) this.ifClicked();
    if(!_isMousePressed && this.Clicked) this.Clicked = false;
    
    canvas.push();
    canvas.rectMode(CENTER);
    canvas.textAlign(CENTER, CENTER);
    canvas.imageMode(CENTER);
    canvas.textSize(this.text_size);
    if(!this.Clicked){
      if(this.img.length > 0) canvas.image(this.img[0], x, y);
      else{
        canvas.fill('rgb(' + this.color + ')');
        canvas.stroke(75);
        canvas.strokeWeight(3);
        canvas.rect(x, y, w, h);
      }
      // render the text
      canvas.noStroke();
      if(this.enabled) canvas.fill('rgb(' + this.text_color + ')');
      else canvas.fill(120);
      canvas.text(this.text, x, y);
    }else{
      canvas.stroke(75);
      canvas.strokeWeight(3);
      canvas.fill('rgb(' + this.color + ')');
      if(this.img.length > 0) canvas.image(this.img[1], x, y);
      else{
        canvas.fill('rgb(' + this.color + ')');
        canvas.stroke(75);
        canvas.strokeWeight(3);
        canvas.rect(x, y, w, h);
      }
      // render the text
      canvas.noStroke();
      canvas.fill('rgb(' + this.text_color + ')');
      canvas.text(this.text, x + 2, y + 2);
    }
    canvas.pop();
  }
}
class toggle extends cusButton{
  constructor(x, y, width, height, func_pres, func_unpres, imgs = [], param = {
    color: "255, 255, 255", text: '', text_unpres: '', text_col: '0, 0, 0', text_unpres_col: '180, 180, 180', text_size: 24, offset_x: 0, offset_y: 0
  }){
    super(x, y, width, height, func_pres, imgs, param);
    this.func_un = func_unpres;
    this.text_un = param.text_unpres;
    this.text_color_un = param.text_unpres_col;
    this.ifToggled = false; // inform if the toggle is toggled
  }
  // check if the button is clicked
  ifClicked(){
    if(this.ifMouseOn() && !_mouseBuffer){
      this.Clicked = true;
      _assets.get("button_click").content.play(); // play the button clicked sound
      if(!this.ifToggled){ // trigger the button
        this.func(); // if the trigger has not been toggled
        this.ifToggled = true;
      }else{
        this.func_un(); // if the trigger has been toggled
        this.ifToggled = false;
      }
      // start buffer
      _mouseBuffer = true;
      _mouseBufferTimer = setTimeout(function(){
        _mouseBuffer = false;
        clearTimeout(_mouseBufferTimer);
      }, 200);
    }else this.Clicked = false;
  }
  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, w = this.width, h = this.height;
    // check if the button is clicked
    if(this.enabled && _isMousePressed && !this.Clicked) this.ifClicked();
    if(!_isMousePressed && this.Clicked) this.Clicked = false;

    canvas.push();
    canvas.rectMode(CENTER);
    canvas.textAlign(CENTER, CENTER);
    canvas.imageMode(CENTER);
    canvas.textSize(this.text_size);
    if(!this.ifToggled){
      canvas.stroke(75);
      canvas.strokeWeight(3);
      canvas.fill('rgb(' + this.color + ')');
      if(this.img.length > 0) canvas.image(this.img[0], x, y);
      else canvas.rect(x, y, w, h);
      canvas.noStroke();
      canvas.fill('rgb(' + this.text_color + ')');
      canvas.text(this.text, x, y);
    }else{
      canvas.stroke(75);
      canvas.strokeWeight(3);
      canvas.fill('rgb(' + this.color + ')');
      if(this.img.length > 0) canvas.image(this.img[1], x, y);
      else canvas.rect(x, y, w, h);
      canvas.noStroke();
      canvas.fill('rgb(' + this.text_color_un + ')');
      canvas.text(this.text_un, x, y);
    }
    canvas.pop();
  }
}
class dynamicButton extends cusButton{
  constructor(x, y, width, height, func, imgs = [], param = {
    color: "255, 255, 255", text: '', text_col: '0, 0, 0', text_size: 24, offset_x: 0, offset_y: 0
  }){
    super(x, y, width, height, func, imgs, param);
    this.ifToggled = false; // inform if the toggle is toggled
  }
  // check if the button is clicked
  ifClicked(){
    if(this.ifMouseOn() && !_mouseBuffer){
      this.Clicked = true;
      _assets.get("button_click").content.play(); // play the button clicked sound
      this.func();
      if(!this.ifToggled){ // trigger the button
        this.ifToggled = true;
      }else{
        this.ifToggled = false;
      }
      // start buffer
      _mouseBuffer = true;
      _mouseBufferTimer = setTimeout(function(){
        _mouseBuffer = false;
        clearTimeout(_mouseBufferTimer);
      }, 200);
    }else this.Clicked = false;
  }
  render(new_x, new_y, canvas = window){
    // reposition the button
    this.pos_x = new_x;
    this.pos_y = new_y;
    let x = this.pos_x, y = this.pos_y, w = this.width, h = this.height;
    // check if the button is clicked
    if(this.enabled && _isMousePressed && !this.Clicked) this.ifClicked();
    if(!_isMousePressed && this.Clicked) this.Clicked = false;
    
    canvas.push();
    canvas.rectMode(CENTER);
    canvas.textAlign(CENTER, CENTER);
    canvas.imageMode(CENTER);
    canvas.textSize(this.text_size);
    if(!this.Clicked){
      if(this.img.length > 0) canvas.image(this.img[0], x, y);
      else{
        canvas.fill('rgb(' + this.color + ')');
        canvas.stroke(75);
        canvas.strokeWeight(3);
        canvas.rect(x, y, w, h);
      }
      // render the text
      canvas.noStroke();
      if(this.enabled) canvas.fill('rgb(' + this.text_color + ')');
      else canvas.fill(120);
      canvas.text(this.text, x, y);
    }else{
      canvas.stroke(75);
      canvas.strokeWeight(3);
      canvas.fill('rgb(' + this.color + ')');
      if(this.img.length > 0) canvas.image(this.img[1], x, y);
      else{
        canvas.fill('rgb(' + this.color + ')');
        canvas.stroke(75);
        canvas.strokeWeight(3);
        canvas.rect(x, y, w, h);
      }
      // render the text
      canvas.noStroke();
      canvas.fill('rgb(' + this.text_color + ')');
      canvas.text(this.text, x, y);
    }
    canvas.pop();
  }
}

class card{
  constructor(w, h, text, color = '255, 255, 255'){
    this.width = w;
    this.height = h;
    this.text = text;
    this.color = color;
    this.enabled = false;
  }
  render(canvas = window){
    let w = this.width, h = this.height
    canvas.push();
    canvas.rectMode(CORNER);
    canvas.textSize(14);
    canvas.textAlign(LEFT, TOP);
    canvas.textLeading(18);
    canvas.strokeWeight(6);
    canvas.stroke('rgb(' + this.color + ')');
    canvas.fill(205, 150, 129);
    canvas.rect(0, 0, w, h);
    canvas.noStroke();
    canvas.fill(0);
    canvas.text(this.text, 10, 10);
    canvas.pop();
  }
}
// floating text
class floatingText extends sprite{
  // additional parameters: text size(num), text color(string), fade out rate(num)
  constructor(x, y, txt, param = {mode : 'vertical_float', size : 26, color : '0, 0, 0', rate : 15}){
    super(x, y, x, y, 10, 10);
    switch(param.mode){
      case "vertical_float":
        this.targt_y -= 20;
        break;
      case "horizontal_flash":
        this.targt_x = width/2;
        this.rate = param.rate || 15; // fade out speed
        break;
    }
    this.txt = txt;
    this.mode = param.mode;
    this.size = param.size || 26; // size of the text
    this.color = param.color || '0, 0, 0'; // color of the text(string)
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

class hero extends sprite{
  constructor(x, y, w, h, type){
    super(x, y + 400, x, y, w, h);
    this.type = type;
    this.engage_bar = new powerGauge(x + 120, y - 50, 30, 100);

    // statistics
    this.exp = 0;
    this.level = 0;
    this.time_of_attack = 0;
    this.success_hit = 0;
    this.round_damage = 0;
    this.total_damage = 0;

    this.controller = undefined;
  }
  // reset the hero statistics
  reset(){
    this.exp = 0;
    this.level = 0;
    this.time_of_attack = 0;
    this.success_hit = 0;
    this.round_damage = 0;
    this.total_damage = 0;
    this.controller = undefined;
  }
  // check if the engage bar is full
  ifSuccess(){
    if(this.engage_bar.value < this.engage_bar.max_value) return false;
    else return true;
  }
  // engage behavior
  engage(error_result){
    if(_spriteManager.entity.health > 0){
      this.time_of_attack ++;
      // create a damage ball
      if(error_result){
        this.round_damage += 5 + this.level * 2;
        _dynamicObjManager.createFlyBall(this.pos_x + 40, this.pos_y + 40, 'attack', '180, 0, 0', 5 + this.level * 2, 2);
        _assets.get('ball_shoot').content.play(); // play the sound
        // if the attack succeed, increase the hero's exp and success attack number
        this.success_hit ++;
        this.exp += 10;
        if(this.exp >= 100){
          this.exp = 0;
          this.level = min(this.level + 1, _maxLv);
        }
      }else{
        _dynamicObjManager.createFlyBall(this.pos_x + 40, this.pos_y + 40, 'random', '180, 180, 180', 5 + this.level * 2, 2);
      }
    }
  }
  // report the round damage
  showResult(){
    let result = + this.round_damage;
    this.total_damage += result;
    this.round_damage = 0;
    _spriteManager.createFloatingText(this.pos_x, this.pos_y - 20, result, {mode: "vertical_float", size: 34, color: '180, 0, 0', rate: 50});
  }
  // reset the engage bar
  resetEngage(){
    this.round_damage = 0;
    this.engage_bar.targt_value = 0;
    this.engage_bar.value = 0;
  }
  update(){
    let x = this.pos_x, y = this.pos_y, tx = this.targt_x, ty = this.targt_y;
    if(x !== tx || y !== ty){ // always check if the sprite is ready
      this.move();
      this.isReady = false;
    }else this.isReady = true;
    // when the engage bar is full, stop decrease the engage power
    this.engage_bar.update();
  }

  renderEngageBar(canvas = window){
    // render the engage bar
    this.engage_bar.render(canvas);
  }

  render(canvas = window){
    let x = this.pos_x, y = this.pos_y, w = this.width, h = this.height
    let anim = floor(frameCount % 60 / 30);
    let hit_rate = this.time_of_attack === 0 ? 0 : this.success_hit / this.time_of_attack;
    canvas.push();
    // render the frame;
    canvas.imageMode(CORNER);
    canvas.image(_assets.get('hero_frame').content, x - 100, y - 20);
    canvas.noStroke();
    // show the player's name
    canvas.textAlign(LEFT, TOP);
    canvas.textLeading(18);
    canvas.fill(255);
    canvas.textSize(23);
    canvas.text(this.controller.name, x - 80, y + 5);
    // render the hero's statistics
    canvas.fill(0);
    canvas.textSize(15);
    canvas.text('Lv : ' + this.level + 
      '\nDMG: ' + this.total_damage + 
      '\nTOA: ' + this.time_of_attack +
      '\nHRT: ' + round(hit_rate * 100) + '%',
    x - 80, y + 33);
    // render the hero image
    canvas.image(_assets.get('hero_pool')[this.type].content[anim], x, y + 5, w, h);
    canvas.pop();
  }
}

// gravity objects
class gravityObjects{
  constructor(x, y, vx, vy){
    this.pos_x = x;
    this.pos_y = y;
    this.spd_x = vx;
    this.spd_y = vy;
    this.color = color(random(20, 220), random(20, 220), random(20, 220));
  }
  update(canvas = window){
    this.spd_y += 0.3;
    this.pos_x += this.spd_x;
    this.pos_y += this.spd_y;
    // check if the object collide with the canvas border
    let x = this.pos_x;
    let y = this.pos_y;
    if(x < 0 || x > canvas.width || y < 0 || y > canvas.height) return true;
    else return false;
  }
  render(canvas = window){
    canvas.push();
    canvas.rectMode(CENTER);
    canvas.noStroke();
    canvas.fill(this.color);
    canvas.rect(this.pos_x, this.pos_y, 6, 6);
    canvas.pop();
  }
}

// <---------- Dynamic Objects ---------->
class dynamicObjManager{
  static get(){
    if(!this.instance) this.instance = new dynamicObjManager();
    return this.instance;
  }
  constructor(){
    this.dynamicObjs = []; // all the dynamic objects to be rendered on the canvas(EXCEPT for the protagonist)
    this.flyBalls = []; // all the score balls to be rendered on the canvas
  }
  // create a new dynamic obj
  createDynamicObj(x, y, spd, size){
    this.dynamicObjs.push(new dynamicObj(x, y, spd, size));
  }
  
  // create a new fly ball
  createFlyBall(x, y, type, color, damage, spd = 2, size = 12){
    this.flyBalls.push(new flyBall(x, y, type, color, damage, spd, size));
  }
 
  // render all the dynamic objs(except for the protagonist)
  render(canvas = window){ // dynamic objs are all rendered in the play space
    let objs = this.dynamicObjs;
    let balls = this.flyBalls;
    // render primary dynamic objs
    if(objs.length > 0){
      for(let i in objs){
        objs[i].render(canvas);
        if(objs[i].ifCollideBorder(canvas)) objs.splice(i, 1); // if the obj collide with the border, remove it from dynamicObjs
      }
    }

    // render fly balls
    if(balls.length > 0){
      for(let i in balls){
        balls[i].render(canvas);
        // if the fly ball collide with the entity, remove it
        if(balls[i].ifCollideObj(_spriteManager.entity) || balls[i].ifReach(width/2, height/2 - 50)){
          _beatManager.createBeat(balls[i].pos_x, balls[i].pos_y, '180, 0, 0', 60); // create the beat
          _assets.get('ball_hit').content.play(); // play the sound
          if(_stageManager.state_num === 3){ // only the hit happens in engage stage works
            _spriteManager.entity.health -= balls[i].value;
            _spriteManager.entity.health_gauge.targt_value = max(_spriteManager.entity.health, 0);
          }
          balls.splice(i, 1);
        }
      }
    }
  }
}

// primary dynamic object
class dynamicObj{
  constructor(x, y, spd, size){
    this.pos_x = x;
    this.pos_y = y;
    this.spd = spd;
    this.size = size; // size of the collision box(diameter of the circle)
  }

  // render the dynamic obj
  render(canvas = _playSpace){
    this.move(); // before rendered, check the moving status
    canvas.fill(255);
    canvas.circle(this.pos_x, this.pos_y, this.size);
  }
  // check if the obj collide with the canvas border
  ifCollideBorder(canvas = window){
    let x = this.pos_x;
    let y = this.pos_y;
    let halfsize = this.size / 2;
    let ifX = false, ifY = false;
    if(x - halfsize <= 0 || x + halfsize >= canvas.width) ifX = true;
    if(y - halfsize <= 0 || y + halfsize >= canvas.height) ifY = true;
    return {ifX: ifX, ifY: ifY};
  }
  // check if the obj leave the canvas
  ifLeave(canvas = window){
    let x = this.pos_x;
    let y = this.pos_y;
    let size = this.size;
    if(x + size <= -50 || x - size >= canvas.width + 50 || y + size <= -50 || y - size >= canvas.height + 50)
      return true;
    else return false;
  }
  // check if the obj collide with another dynamic obj
  ifCollideObj(obj){
    let x1 = this.pos_x;
    let y1 = this.pos_y;
    let x2 = obj.pos_x;
    let y2 = obj.pos_y;
    let s1 = this.size / 2;
    let s2 = obj.size ? obj.size : (obj.width + obj.height) / 2;
    if(s1 + s2 >= dist(x1, y1, x2, y2)) return true;
    else return false;
  }
  // check if the obj reach the target point
  ifReach(targtX, targtY){
    let x = this.pos_x;
    let y = this.pos_y;
    let s = this.size;
    if(s >= dist(x, y, targtX, targtY)) return true;
  }
}

// the flying ball(with comet effect)
class flyBall extends dynamicObj{
  constructor(x, y, type, color, value, spd, size){
    super(x, y, spd, size);
    let tx = width/2, ty = height/2 - 50;
    if(type === 'attack'){
      this.dir = direct(tx, ty, this.pos_x, this.pos_y); // move toward the entity at the center of the screen
    }else if(type === 'collect'){
      this.pos_x = tx;
      this.pos_y = ty;
      this.dir = direct(tx, ty, x, y); // move from the entity at the center of the screen
    }else{
      this.dir = random(60, 120);
    }
    this.value = value;
    this.color = color;
    this.spd *= 1 + dist(tx, ty, this.pos_x, this.pos_y) / 100; // the ball flys faster when it is further from the target
    this.trace = []; // postion history of the score ball
  }
  move(){
    let spd = this.spd;
    let dir = this.dir;
    // record the trace
    if(frameCount % 3 == 0){ // interval of the trace
      let trace = this.trace;
      trace.push([this.pos_x, this.pos_y]);
      if(trace.length > 10) trace.splice(0, 1);
    }
    
    this.pos_x += spd * cos(dir);
    this.pos_y += spd * sin(dir);
  }
  render(canvas = window){
    this.move(); // before rendered, check the moving status
    // render the trace
    let trace = this.trace;
    canvas.noStroke();
    for(let i in trace){
      canvas.fill('rgba(' + this.color + ',' + map(i, 0, this.trace.length, 0, 1) * 200 + ')');
      canvas.ellipse(trace[i][0], trace[i][1], map(i, 0, 10, 0, this.size));
    }
    canvas.fill('rgb(' + this.color + ')');
    canvas.circle(this.pos_x, this.pos_y, this.size);
  }
}

// <---------- Beat ---------->
class beatManager{
  static get(count, size){
    if(!this.instance) this.instance = new beatManager(count, size);
    return this.instance;
  }
  constructor(count, size){
    this.beats = []; // all the beats to be rendered on the canvas
    this.beat_count = 40; // duration of the beat(frames)
    this.basic_beat_size = 160; // basic size of the beat(diameter of circle)
  }
  // create a new beat
  createBeat(x, y, col = '255, 255, 255', beat_size = this.basic_beat_size, beat_count = this.beat_count){
    this.beats.push(new beat(x, y, beat_count, beat_size, col));
  }
  // render all the beats
  render(){
    let beats = this.beats;
    if(beats.length > 0){
      for(let i = 0; i < beats.length; i++){
        beats[i].render();
        if(beats[i].count <= 0) beats.splice(i, 1);
      } 
    }
  }
}
class beat{
  constructor(x, y, countNum, size, col){
    this.x = x;
    this.y = y;
    this.col = col;
    this.maxCount = countNum; // duration of the beat(frames)
    this.count = this.maxCount;
    this.beat_size = size; // size of the beat(diameter of circle)
  }
  // render the beat
  render(canvas = window){
    let p = this.count / this.maxCount;
    canvas.fill('rgba(' + this.col + ',' + max(0, p * 0.5) + ')');
    canvas.circle(this.x, this.y, map(p, 0, 1, 3, 1) * this.beat_size);
    this.count--;
  }
}

// <---------- AI Manager ---------->
class AIManager{
  static get(){
    if(!this.instance) this.instance = new AIManager();
    return this.instance;
  }
  
  constructor(){
    this.ingame_players = []; // players who is playing now
    this.banned_players = []; // players who has been banned from the game
    this.engage_interval = 0;
  }

  checkStatistics(properties){ // check certain statistics of all the players
    let result_stas = [];
    for(let i in properties){
      let single_stas = [];
      for(let j in this.ingame_players){
        single_stas.push(this.ingame_players[j][properties[i]]);
      }
      result_stas.push(single_stas);
    }
    return result_stas;
  }

  assignPlayer(){ // assign players to heros
    let player_nums = []; // avoid repeat selection
    for(let j = 0; j < _playerPool.length; j++){
      player_nums.push(j);
    }
    for(let i = 0; i < 4; i++){
      let num = floor(random(0, player_nums.length));
      _spriteManager.heros[i].controller = _playerPool[player_nums[num]];
      this.ingame_players.push(_playerPool[player_nums[num]]);
      player_nums.splice(num, 1);
    }
  }
  
  engagePlayer(){ // check if the player is going to engage
    // check if the player has succeeded
    for(let i = 0; i < 4; i++){
      let engage_result = random(0, 100) < this.ingame_players[i].engage_will ? true : false;
      if(engage_result){
        let error_result = random(0, 100) > this.ingame_players[i].error_prob ? true : false;
        if(!error_result){ // if the player makes a mistake
          if(this.ingame_players[i].error_toggle){
            this.ingame_players[i].successive_error_time ++;
          }else this.ingame_players[i].successive_success_time = 0;
          this.ingame_players[i].error_toggle = true;
          this.ingame_players[i].error_time ++;
        }else{
          if(!this.ingame_players[i].error_toggle){
            this.ingame_players[i].successive_success_time ++;
          }else this.ingame_players[i].successive_error_time = 0;
          this.ingame_players[i].error_toggle = false;
          this.ingame_players[i].success_time ++;
        }
        _spriteManager.heros[i].engage(error_result);
      }
    }
  }

  updatePlayer(){ // update all the players' attitudes
    for(let i = 0; i < 4; i++){
      this.ingame_players[i].update();
    }
  }

  resetPlayer(){
    // reset all the current players' states
    for(let i = 0; i < 4; i++){
      this.ingame_players[i].reset();
    }
    this.ingame_players = []; // reset all the players
  }

  checkResult(){ // move out players to the banned player pool
    for(let i = 0; i < 4; i++){
      if(this.ingame_players[i].ifOut){
        let who = _playerPool.indexOf(this.ingame_players[i]);
        // enable the identity card
        _spriteManager.home_page.card_buttons[this.ingame_players[i].num].enable(true);
        this.banned_players.push(_playerPool.splice(who, 1)[0]);
      }
    }
  }
}

class Player{
  constructor(name, type, engage_will, error_prob){
    this.name = name;
    this.num = type;
    this.color = _playerColors[type]; // color number
    this.type = _playerTypes[type]; // player type

    this.initial_engage_will = engage_will;
    this.engage_will = engage_will;
    this.initial_error_prob = error_prob;
    this.error_prob = error_prob;

    this.successive_success_time = 0; // multiple succeed times
    this.success_time = 0; // players' in-game succeed times
    this.successive_error_time = 0; // multiple error times
    this.error_time = 0; // players' in-game error times
    this.error_toggle = false; // record last time of error

    this.ifOut = false; // inform if the player is out
  }

  reset(){ // reset the player's state
    this.engage_will = this.initial_engage_will;
    this.error_prob = this.initial_error_prob;
    this.successive_success_time = 0;
    this.success_time = 0;
    this.successive_error_time = 0;
    this.error_time = 0;
    this.error_toggle = false;
  }
  // update the player's attitudes
  update(){
    let winning_chance = _spriteManager.winning_bar.targt_value;
    switch(this.type){
      case "normal":
        // neutral player won't be influenced by others' behaviors
        break;
      case "newbie":
        // successive success or error will increase or decrease the newbie's confidence
        if(this.successive_success_time >= 3) this.error_prob = max(this.error_prob - 10, 50);
        else if(this.successive_error_time >= 3) this.error_prob = min(this.error_prob + 10, 90);
        break;
      case "irritable":
        // if one of the teammates just made 3 successive mistakes, get irrited and more likely to make mistakes
        let sec_error_tim = _AIManager.checkStatistics(['successive_error_time']);
        for(let i in sec_error_tim){
          if(sec_error_tim[i] >= 3){
            this.error_prob = min(this.error_prob + 10, 80);
            break;
          }else this.error_prob = max(this.error_prob - 5, 20);
        }
        // if the winning progress is too low, get more likely to make mistakes
        let winning_offset = _spriteManager.winning_bar.targt_value - 30;
        if(winning_offset < 0) this.error_prob = min(this.error_prob + winning_offset, 80);
        break;
      case "exhausted":
        // if the game runs too long(more than 6 rounds), start to lose concentration
        let rounds = _stageManager.rounds;
        if(rounds > 5){
          this.error_prob = min(this.error_prob + rounds * 10, 80);
        }
        break;
      case "nasty":
        // if the winning progress is too high, start trolling
        this.error_prob = min(winning_chance, 90);
        break;
      case "disruptive":
        // intentionally sabotage others, especially when the winning progress is too high
        this.engage_will = min(100 - winning_chance, 50);
        break;
    }
  }
}

// <---------- Auxiliary Functions ---------->
// calculate the angle between two pts
function direct(x1, y1, x2, y2){
  let vec0 = createVector(1, 0);
  let vec = createVector(x1 - x2, y1 - y2);
  return vec0.angleBetween(vec);
}

// calculate the average of an array
function averageNum(array){
  let sum = 0;
  for(let i in array){
    sum += array[i];
  }
  return sum / array.length;
}
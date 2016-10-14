(function( globals, document ) {

  var gameController = new GameController( document.getElementById('pizzapit') );

  globals.gravity = 0.2;
  globals.width = gameController.element.offsetWidth;
  globals.height = gameController.element.offsetHeight;
  globals.centerX = width / 2 - 75;
  globals.centerY = height / 2 - 75;
  globals.distance = 200;

  gameController
    .addBehavior( 'throbber', 'throbber', function() {

    } )
    .addBehavior( 'gravity-effect', 'bouncing-pizza', function() {

      var g = globals.gravity;
      this.velocity_y += g;

      if ( this.y > globals.height + 200) {
        // delete the sprite
        gameController.sprite_store.deleteSprite(this);
      }
    } )
    .addBehavior( 'rotation', 'pizza', function() {
      this.distance = this.baseDistance + Math.sin(globals.gameController.ticks / 10 + this.index) * 20;
      this.index += this.modifier;

      this.move_to(
        globals.centerX + this.distance * Math.sin( this.index ),
        globals.centerY + this.distance * Math.cos( this.index )
      );

      this.setSpriteRotation( U.Math.rad2deg( this.index ));
    } );

  var emitter1 = new SpriteEmitter( gameController, {
        tags: [ 'bouncing-pizza' ],
        elementClass: 'little-pizza',
        angle: -90,
        speed: 30,
        rate: 1,
        concurrency: 3,
        splay: 30,
        speed_splay: 2,
        life: 5000,
        max: 20,
        x: 200,
        y: globals.height - 200 } ),

      emitter2 = new SpriteEmitter( gameController, {
        tags: [ 'bouncing-pizza' ],
        elementClass: 'little-pizza2',
        angle: -90,
        speed: 30,
        rate: 1,
        concurrency: 3,
        splay: 30,
        speed_splay: 2,
        life: 5000,
        max: 20,
        x: globals.width - 200,
        y: globals.height - 200
      } );

  emitter1.count = 100;
  emitter2.count = 100;

  gameController.addEmitter( emitter1 );
  gameController.addEmitter( emitter2 );

  globals.pizzaCount = 10;

  function randompizzaClass() {
    var classes = [ 'pizza1', 'pizza2', 'pizza3' ];
    return classes[Math.round(Math.random() * classes.length)];
  }

  var i = 0,
      j = 0;

  for ( j = 0; j < 5; j++ ) {
    var pizzaCount = globals.pizzaCount + ( j * Math.random() * 8 );
    for ( i = 0; i < pizzaCount; i++ ) {
      var pizza_ele = document.createElement('div'),
          pizzaIndex = ( 2 * Math.PI ) / pizzaCount * i,
          distance = globals.distance + 75 * j,
          pizza = new Sprite( pizza_ele, {
            x: globals.centerX + distance * Math.sin( pizzaIndex ),
            y: globals.centerY + distance * Math.cos( pizzaIndex ),
            tags: ['pizza'],
            use_rotation: false
          });

      pizza_ele.setAttribute('class', 'pizza ' + randompizzaClass());
      pizza.index = pizzaIndex;
      pizza.distance = distance + Math.random() * 20;
      pizza.modifier = 0.015 + (Math.random() - 0.5) / 100;
      pizza.baseDistance = distance;
      pizza.setSpriteRotation( U.Math.rad2deg(pizza.index) );
      gameController.addSprite( pizza );
    }
  }

  var keyboard_driver = new KeyboardDriver(gameController.message_bus);

  gameController.message_bus.subscribe( 'before_step_frame', function() {
    if ( gameController.ticks % 100 != 0 ) { return }
    globals.centerX = gameController.element.offsetWidth / 2 - 75;
    globals.centerY = gameController.element.offsetHeight / 2 - 75;
  });

  keyboard_driver.handle( ' ', function() {
    gameController.message_bus.publish( 'pizza-blast' );
    emitter1.count = 0;
    emitter2.count = 0;
    console.log('pizza blast!');
  });

  gameController.element.addEventListener("touchstart", function() {
    gameController.message_bus.publish( 'pizza-blast' );
    emitter1.count = 0;
    emitter2.count = 0;
    console.log('pizza blast!');
  }, false);

  // attach some shit to the main window
  globals.keyboard_driver = keyboard_driver;
  globals.gameController = gameController;

  globals.debug = false;

  // ok, start it up
  gameController.run();


})( window, document );

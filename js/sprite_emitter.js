(function( globals, document ) {

  // direction, rate, spread, sprite options
  var SpriteEmitter = function( controller, options ) {
    this.controller = controller;
    this.last_emit = this.controller.ticks;

    this.x = U.default_param( options.x, 0 );
    this.y = U.default_param( options.y, 0 );

    this.rate = U.default_param( options.rate, 60 ); // 60fps, 1s.
    this.concurrency = U.default_param( options.concurrency, 1 ); // one at a time

    this.tags = U.default_param( options.tags, [] );

    this.max = U.default_param( options.max, 10 );
    this.count = 0;

    this.angle = U.default_param( options.angle, -90 );
    this.speed = U.default_param( options.speed, 20 );

    this.splay = U.default_param( options.splay, 0 ) ;
    this.speed_splay = U.default_param( options.speed_splay, 0 );

    this.life = U.default_param( options.life, 3000 );

    this.elementClass = U.default_param( options.elementClass, 'pizza' );
  };

  SpriteEmitter.prototype.setMessageBus = function( new_message_bus ) {
    // TODO: unsubscribe from existing message bus

    this.message_bus = new_message_bus;
    this.message_bus.subscribe( 'step_frame', this.signal.bind(this) );
  }

  SpriteEmitter.prototype.signal = function() {

    // console.log( { c: this.controller.ticks, le: this.last_emit, r: this.rate} )

    if ( this.controller.ticks > (this.last_emit + this.rate) ) {
      this.emit();
    }
  }


  SpriteEmitter.prototype.emit = function() {
    if ( this.count >= this.max ) {
      return;
    }

    var i = 0;
    for ( i = 0; i < this.concurrency; i++ ) {
      var element = document.createElement('div');
      element.setAttribute('class', this.elementClass);
      // this.controller.element.appendChild( element );

      var sprite = new Sprite( element, { x:this.x, y:this.y, use_rotation:true, tags: this.tags } );

      var splay_angle = this.angle + ( Math.random() * this.splay ) - ( this.splay / 2 );
      var splay_speed = this.speed + ( Math.random() * this.speed_splay ) - ( this.speed_splay / 2 );

      sprite.setAngle( splay_angle, splay_speed );
      sprite.life = this.life;

      this.controller.addSprite( sprite );

      this.count++;
    }

    this.last_emit = this.controller.ticks;
  }

  globals.SpriteEmitter = SpriteEmitter;

})( window, document );

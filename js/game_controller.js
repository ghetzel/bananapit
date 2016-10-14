window.requestAnimFrame = function(){
    return (
            window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback){
                window.setTimeout(callback, 1000 / 60);
            }
        );
}();

(function( globals, document ) {
  var GameController = function( element, options ) {
    this.ticks = 0; // incremented for each frame that's displayed.
    this.element = element;

    this.behaviors = {};
    this.emitters = [];

    this.message_bus = new MessageBus();
    this.sprite_store = new SpriteStore( this.message_bus );

    this.message_bus.subscribe( 'sprite_deleted', this.handleSpriteDeleted.bind(this) );
    this.message_bus.subscribe( 'sprite_added', this.handleSpriteAdded.bind(this) );

    document.addEventListener('keydown', function(event) {
      this.message_bus.publish('keydown', event);
    }.bind(this));

    document.addEventListener('keyup', function(event) {
      this.message_bus.publish('keyup', event);
    }.bind(this));
  };

  GameController.prototype.handleSpriteDeleted = function( type, payload ) {
    var sprite = payload.sprite,
        store = payload.store;

    this.element.removeChild( sprite.element );
  };

  GameController.prototype.handleSpriteAdded = function( type, payload ) {
    var sprite = payload.sprite,
        store = payload.store;

    this.element.appendChild( sprite.element );
  };

  GameController.prototype.addSprite = function( sprite ) {
    sprite.setMessageBus( this.message_bus );
    this.sprite_store.addSprite( sprite );

    return this;
  };


  GameController.prototype.addBehavior = function( name, behavior_finder, behavior_handler ) {
    if ( typeof behavior_handler === 'undefined' ) {
      behavior_handler = behavior_finder;
      behavior_finder = undefined;
    }
    this.behaviors[name] = [ behavior_handler, behavior_finder ] ;

    return this;
  }

  GameController.prototype.removeBehavior = function( name ) {
    delete this.behaviors[name];

    return this;
  }

  GameController.prototype.addEmitter = function( emitter ) {
    emitter.setMessageBus( this.message_bus );
    this.emitters.push( emitter );
    return this;
  }

  GameController.prototype.spritesWithTag = function( tag ) {
    return this.sprite_store.spritesWithTag( tag );
  }

  // turn on animations
  GameController.prototype.run = function(id) {
    requestAnimFrame(this.run.bind(this));
    this.step();
    this.ticks += 1;
  };

  // animate one frame
  GameController.prototype.step = function(timestamp) {
    var emitter = null,
        sprite = null,
        i = 0,
        behavior_handler = null,
        all_sprites = this.sprite_store._sprites.values(),
        sprite_finder,
        sprites;

    this.message_bus.publish( 'apply_velocity', this );

    // modify the sprite before having it step.
    for ( behavior_handler in this.behaviors ) {
      behavior_finder = this.behaviors[behavior_handler][1];
      behavior_handler = this.behaviors[behavior_handler][0];

      // if we use a finder, use that finder.
      if ( typeof behavior_finder === 'function' ) {
        sprites = behavior_finder();
      } else if ( typeof behavior_finder === 'string' ) {
        sprites = this.sprite_store.spritesWithTag( behavior_finder );
      } else {
        sprites = all_sprites;
      }

      for ( sprite in sprites ) {
        sprite = sprites[sprite];
        behavior_handler.call( sprite, this );
      }
    }

    this.message_bus.publish( 'before_step_frame', this );
    this.message_bus.publish( 'step_frame', this );
    this.message_bus.publish( 'after_step_frame', this );

    this.sprite_store.removeDeadSprites();
  };

  globals.GameController = GameController;

})( window, document );

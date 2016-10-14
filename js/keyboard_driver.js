(function( globals, document ) {
  var KeyboardDriver = function( message_bus ) {
    this.handlers = {};
    this.state = {};

    // subscribe to keydown events
    // update the key state and call any necessary keydown handlers
    message_bus.subscribe('keydown', function( msg_type, event ) {
      var key = event.which,
          was_held = this.state[key];

      this.state[key] = true;

      if ( this.handlers[key] && this.handlers[key].down && ! was_held ) {
        this.handlers[key].down(this);
      }
    }.bind(this));

    // subscribe to keyup events
    // update the key state and call any necessary keyup handlers
    message_bus.subscribe('keyup', function( msg_type, event ) {
      var key = event.which;

      this.state[key] = false;

      if ( this.handlers[key] && this.handlers[key].up ) {
        this.handlers[key].up(this);
      }
    }.bind(this));
  };

  // handle a key
  // key can be a string representation of the key (eg: 'A')
  // if you use the string representation, for letters, use capital
  // or the integer ascii code for the key as used by the normal key events
  // fires down_callback on down and up_callback on up
  // it's up to the user to bind the callbacks as needed
  // TODO: maybe put callbacks into an object and add additional options like an object to bind to?
  KeyboardDriver.prototype.handle = function( key, down_callback, up_callback ) {
    if ( typeof key === 'string' ) {
      // do any necessary key translation from string to int
      key = key.charCodeAt(0);
    }

    this.handlers[key] = { down: down_callback, up: up_callback }
  };

  globals.KeyboardDriver = KeyboardDriver;

})( window, document );

(function ( globals ) {
  var Module = (function() {

    return {

      // given a param, return the default_value if param is undefined
      // alternatively, if the param is a function and call_function is truthy, call the function.
      // the latter use-case is good if the default value is an expensive operation.
      // when using the function form, the caller should take care to bind() if needed
      default_param: function( param, default_value, call_function ) {
        if ( typeof param === 'undefined' ) {
          if ( typeof default_value === 'function' && call_function ) {
            return default_value();
          }

          return default_value;
        }

        return param;
      },

      // Math extensions:
      'Math': {
        // TAU (2π)
        'TAU': Math.PI * 2,

        // convert degrees to radians
        deg2rad: function( deg ) {
          return deg * ( Math.PI / 180 );
        },

        // convert radians to degrees
        rad2deg: function ( rad ) {
          return rad * ( 180 / Math.PI );
        }
      }

    }

  })();

  globals.U = Module;

})( window );

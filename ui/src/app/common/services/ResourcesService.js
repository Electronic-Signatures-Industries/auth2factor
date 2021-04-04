function ResourcesService($log, _) {
    var u2fErrorMap = {
        1: 'Ha ocurrido un error, intente otra vez',
        2: "Datos incorrecto, intente otra vez",
        3: 'Esta llave no esta habilitada, intente otra', // "This key isn't supported, please try another one",
        4: 'Dispositivo no activado',
        5: 'Tiempo de espera ha pasado, intente otra vez',
        // custom messages
        6: 'No se encontro llaves para este dominio',
    };
  var resource = {
      u2fError: function(codeNumber) {
          return u2fErrorMap[codeNumber];
      },
      u2fValidateError: function() {
          return 'Favor de autenticarse antes de ingresar llave de seguridad';
      },
      genericError: function(code) {
          return 'Ha ocurrido un error. Código HTTP ' + code;
      },
      expiredToken: function() {
          return 'Token o autenticación expirada';
      },
      accountNotFound: function() {
          return 'Contraseña o correo desconocido';
      },
      unauthorized: function() {
          return 'No tiene permisos o token ha expirado';
      },
      genericErrorCreateAccount: function(code) {
          return 'Error al crear cuenta de usuario. Código HTTP ' + code;
      },
      badPassword: function() {
          return 'Contraseña incorrecta';
      }
  };
    
  ResourcesService.getResource = function() {
    var resourceName = arguments[0];
    var args = _.rest(arguments);
    return resource[resourceName].call(this, args);
   };
   
   return ResourcesService;
}

angular
  .module('auth2factor.services')
  .factory('ResourcesService', ResourcesService);
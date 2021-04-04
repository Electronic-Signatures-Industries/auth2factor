/*global $rootScope:true, seguros:true, controller:true, $controller:true, expect:true, $scope:true*/

describe('Registro Controller Unit Test', function() {
  beforeEach(module('ui.router'));
  beforeEach(module('restangular'));
  beforeEach(module('ngCookies'));
  beforeEach(module('rutha.local-account'));
  beforeEach(module('angular-storage'));
  beforeEach(module('seguros.global'));
  beforeEach(module('seguros.models'));
  beforeEach(module('seguros.auth'));
  beforeEach(module('seguros.services'));
  beforeEach(module('seguros.controllers'));

  it ('should contain form defaults" ',
  inject(function($rootScope, $controller, PlanService) {
    var $scope = $rootScope.$new();
    
    var plan = PlanService.selectedPlan.prima = {
      "nombre": "Plan Particular B",
      "tipo": "particular",
      "opcion": "option_1",
      "totales": {
        "completo": "65.65",
        "sinGastosMedico": "59.32"
      },
      "links": {
        "self": {
          "value": "53fce9f302d83ab7911e419e"
        }
      }
    };

    PlanService.saveCurrent();

    var ctrl = $controller('RegistroDatosCtrl as registro', {
      $scope: $scope,
      $log: {},
      $state: {},
      $stateParams: {
        id: '53fce9f302d83ab7911e419e'
      }
    });

    var defaults = {
      general: {
        sexo: 'masculino'
      },
      adicional: {
        nacionalidad: 'Panamá',
        residencia: 'Panamá',
        provincia: 'Panamá'
      },
      vehiculo: {
        anno: 2015
      }
    };
    expect($scope.formulario).toEqual(defaults);
  }));

  

});

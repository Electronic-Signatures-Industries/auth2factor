/*global $rootScope:true, seguros:true, controller:true, $controller:true, expect:true, $scope:true*/

describe('Registro Service Unit Test', function() {
  var handler, $httpBackend;
  var polizas = {"polizas":[{"user":"molekilla@gmail.com","ramo":"AUTO","asegurado":"Rogelio Morrell","cedula":"8-713-2230","sexo":"masculino","nacimiento":"1977-12-29T05:00:00.000Z","direccion":"Villa Lucre","celular":"66731138","telefono":"3210000","provincia":"Panamá","distrito":"Panama","nacionalidad":"Panamá","residencia":"Panamá","plan":"Plan Particular A","aseguradora":"regional","opcion":"option_1","certificado":1,"_id":"100","__v":0,"updated":"2015-01-12T15:30:21.574Z","created":"2015-01-12T15:30:21.573Z","coberturas":[{"nombre":"Lesiones Corporales","descuento":0.42242,"prima":39,"incluido":false,"deducible":0,"limite":{"persona":0,"accidente":0}},{"nombre":"DAÑOS A LA PROPIEDAD AJENA","descuento":0.42242,"prima":100,"incluido":false,"deducible":0,"limite":{"persona":0,"accidente":0}},{"nombre":"GASTOS MEDICOS","descuento":0.42242,"prima":15,"incluido":false,"deducible":0,"limite":{"persona":0,"accidente":0}},{"nombre":"SERVICIOS FUNERARIOS","descuento":0.42242,"prima":2,"incluido":true,"deducible":0,"limite":{"persona":0,"accidente":0}},{"nombre":"BBA Asiste","descuento":0.42242,"prima":10,"incluido":true,"deducible":0,"limite":{"persona":0,"accidente":0}},{"nombre":"SERVICIOS FUNERARIOS","incluido":true,"prima":2},{"nombre":"BBA Asiste","incluido":true,"prima":10}],"vehiculo":[{"anno":2014,"marca":"kia","modelo":"sorrento","color":"123","motor":"123","vin":"123","placa":"123"}],"totales":{"descuento":27.731873000000004,"prima":65.65,"impuesto":39.39},"fechas":{"emision":"2015-01-12T15:30:21.571Z","vigenciaDesde":"2015-01-12T15:30:21.571Z","vigenciaHasta":"2016-01-12T15:30:21.571Z"},"estado":"P"}]};
 
  beforeEach(module('restangular'));
  beforeEach(module('ngCookies'));
  beforeEach(module('rutha.local-account'));
  beforeEach(module('angular-storage'));
  beforeEach(module('seguros.global'));
  beforeEach(module('seguros.models'));
  beforeEach(module('seguros.auth'));
  beforeEach(module('seguros.services'));
  beforeEach(inject(function(_$httpBackend_) {
    $httpBackend = _$httpBackend_;

    // POST
    handler = $httpBackend
    .when('POST', '/v1/polizas')
    .respond(201,
    {
      response: {
        status: 201
      }
    },
    {
      'Location': 'http://local/v1/polizas/1'
    });
    
    // GET One
    $httpBackend
    .when('GET', '/v1/polizas/100')
    .respond(200, 
    { 
      data: polizas
    });
    
    // GET List
    $httpBackend
    .when('GET', '/v1/polizas')
    .respond(200, 
    { 
      data: polizas
    });
    
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it ('should contain an undefined PolizaService.create2" ',
  inject(function(PolizaService) {

    expect(PolizaService.create2).toBe(undefined);
  }));
  
  describe('#get', function() {
    it ('should return one poliza" ',
    inject(function(PolizaService) {

      $httpBackend.expectGET('/v1/polizas/100');
      PolizaService
      .get('100')
      .then(function(model) {
        expect(model._id).toBe('100');
      });
      $httpBackend.flush();

    }));
  });

  describe('#list', function() {
    it ('should return a list of polizas" ',
    inject(function(PolizaService) {

      $httpBackend.expectGET('/v1/polizas');
      PolizaService
      .list()
      .then(function(models) {
        expect(models.length).toBe(1);
      });
      $httpBackend.flush();
    }));
  });
  
  describe('#create', function() {
    it ('should return missing plan error" ',
    inject(function(PolizaService, PlanService) {

      var model = {};

      expect(function() {
        PolizaService.create(model);
      })
      .toThrowError('Ningun plan ha sido seleccionado.');
    }));

    it ('should create an insurance" ',
    inject(function(PolizaService, PlanService) {
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

      PlanService.selectedPlan.total = 65.65;
      PlanService.selectedPlan.ramo = 'AUTO';
      PlanService.selectedPlan.coberturas = [
      {
          "id": 1,
          "nombre" : "Lesiones Corporales",
          "requerido" : true,
          "limite" : {
              "persona" : 5000,
              "accidente" : 10000
          },
          "prima" : 39,
          "deducible" : null
      },
      {
          "id": 2,
          "nombre" : "DAÑOS A LA PROPIEDAD AJENA",
          "requerido" : true,
          "limite" : {
              "persona" : 5000,
              "accidente" : null
          },
          "prima" : 100
      },
      {
          "id": 3,
          "nombre" : "GASTOS MEDICOS",
          "requerido" : false,
          "limite" : {
              "persona" : 500,
              "accidente" : 2500
          },
          "prima" : 15
      }
      ];

      var model = {
        general: {
          nombre: 'Jose',
          apellido: 'Lopez',
          sexo: 'Masculino',
          cedula: '8-888-888',
          nacimiento: new Date(),
          user: 'info@instaseguros.com'
        },
        vehiculo: {
          anno: 2002,
          marca: 'Toyota',
          modelo: 'Tercel',
          color: 'Rojo',
          motor: 'VLASKNSLNBS',
          vin: '122222',
          placa: '1222222a'
        },
        adicional: {
          direccion: 'El Bosque',
          celular: '66669999',
          telefono: '3986565',
          distrito: 'Panama',
          nacionalidad: 'Panamena',
          residencia: 'Panama'
        }
      };

      $httpBackend.expectPOST('/v1/polizas');
      PolizaService
      .create(model);
      $httpBackend.flush();

    }));
  });

});

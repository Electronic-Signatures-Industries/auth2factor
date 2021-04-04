/*global browser:true, expect:true */
//describe("Registro", function() {
//
//  beforeEach(function() {
//    browser.get('/app#/planes');
//  });
//
//  it ('should load registro view and match title', function() {
//    browser.get('/app#/registro/53fce9f302d83ab7911e419e');
//    expect(element(by.css('h2')).getText()).toContain('Registro');
//  });
//
//  describe("General", function() {
//    
//    beforeEach(function() {
//      browser.get('/app#/registro/53fce9f302d83ab7911e419e');
//    });
//
//    it ('should test "General" for invalid validations', function() {
//      element(by.model('general.nombre')).sendKeys('');
//      element(by.model('general.apellido')).sendKeys('');
//      expect(element.all(by.css('.help-block')).get(0).getText()).toContain('Requerido');
//      element(by.model('general.nombre')).sendKeys('John');
//      element(by.model('general.apellido')).sendKeys('Doe');
//
//      element(by.model('general.cedula')).sendKeys('');
//      element(by.model('general.correo')).sendKeys('');
//      expect(element.all(by.css('.help-block')).get(0).getText()).toContain('Requerido');
//      element(by.model('general.cedula')).sendKeys('7-777-777');
//      element(by.model('general.correo')).sendKeys('s@s.xom');
//
//      element(by.model('general.nacimiento')).sendKeys('');
//      element(by.model('general.cedula')).sendKeys('');
//
//      expect(element.all(by.css('.help-block')).get(0).getText()).toContain('Requerido');
////      expect(element.all(by.css('.help-block')).get(0).getText()).toContain('Requerido');
//      element(by.model('general.nacimiento')).sendKeys('01/01/2014');
//      element(by.model('general.correo')).click();
//      expect(element.all(by.css('.help-block')).count()).toBe(0);
//
//    });

    // it ('should test "Apellido" for invalid validations', function() {
    //   element(by.model('general.apellido')).sendKeys('123456 123456 123456 123456 123456 1 234 5 6');
    //   expect(element.all(by.css('p')).last().getText()).toContain('Apellido es requerido');
    // });

    // it ('should test "Correo" for invalid validations', function() {
    //   element(by.model('general.correo')).sendKeys('123456 123456 123456 123456 123456 1 234 5 6');
    //   expect(element.all(by.css('p')).last().getText()).toContain('Apellido es requerido');
    // });

//  });
//
//});

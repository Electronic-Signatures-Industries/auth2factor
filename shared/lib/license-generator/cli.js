'use strict';
var inquirer = require('inquirer');
var _ = require('underscore');
var fs = require('fs');
var LicenseGenerator = require('./lib/generator');
var clc = require('cli-color');

var error = clc.red.bold;
var warn = clc.yellow.bold;
var notice = clc.blue.bold;

var questions = [{
    type: 'input',
    name: 'customer',
    message: 'Nombre de Cliente: ',
    validate: function validate(value) {
        if (value && value.length > 0) {
            return true;
        } else {
            return 'Ingrese un nombre de cliente antes de continuar.';
        }
    }
}, {
    type: 'input',
    name: 'company',
    message: 'Empresa o Entidad: ',
    validate: function validate(value) {
        if (value && value.length > 0) {
            return true;
        } else {
            return 'Ingrese una empresa antes de continuar.';
        }
    }
}, {
    type: 'input',
    name: 'qty',
    message: 'Cantidad de Licencias: ',
    validate: function validate(value) {
        if (parseInt(value, 10) > 0) {
            return true;
        } else {
            return 'Ingrese una cantidad mayor a cero.';
        }
    }
}];

var text = '.....................................................................................\n' + 
               '................................ auth2factor - License Generator ..................\n' +
               '.....................................................................................\n';
var style = { '.': clc.yellowBright('=') };

process.stdout.write(clc.art(text, style));

inquirer.prompt(questions, function (answers) {

    var lic = {
        'Licensed To': answers.customer,
        Company: answers.company,
        'Number of Users Licensed': parseInt(answers.qty, 10),
        Generated: new Date()
    };

    var generator = new LicenseGenerator();
    generator.generate(lic, function(err, license) {
        fs.writeFile('license.json', JSON.stringify(license), function(err, res) {
            var result = 'Saved to license.json';
            console.log(warn(result));            
        });        
    });

});
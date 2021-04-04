angular.module('auth2factor.templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/account/confirmation.html',
    "\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"col-sm-8 col-md-12\">\n" +
    "   <h2>Confirmacion enviada</h2>\n" +
    "    Su cuenta ha sido creada, para activar la cuenta, revise su correo electronico.\n" +
    "    <hr>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/account/forgot.html',
    "\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"col-sm-7 col-sm-offset-2\">\n" +
    "    <h2>Restablece tu contraseña</h2>\n" +
    "    <div ng-class=\"{ alert:true, 'alert-danger':true }\" ng-if=\"forgot.hasErrors\"  role=\"alert\">{{ forgot.errorLabel }}</div>\n" +
    "    <form role=\"form\" name=\"form\" novalidate>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label></label>\n" +
    "        <input autocomplete=\"off\" placeholder=\"Ingrese Correo Electrónico\" type=\"email\" class=\"form-control input-sm\" \n" +
    "        ng-model=\"formulario.correo\" required name=\"correo\">\n" +
    "        <div class=\"has-error\" ng-if=\"form.$submitted || form.correo.$dirty\" ng-messages=\"form.correo.$error\">\n" +
    "         <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "         <div class=\"help-block\" ng-message=\"email\">Campo debe contener formato de correo electrónico.</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <button type=\"submit\" class=\"btn btn-primary btn-sm\" ng-click=\"forgot.send(form, formulario)\">Enviar</button>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/account/forgot_confirmation.html',
    "\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"col-sm-8 col-md-12\">\n" +
    "    <h2>Restablecimiento de contraseña en camino</h2>\n" +
    "Si tienes una cuenta registrada, te enviamos las instrucciones para completar el restablecimiento de contraseña a tu correo electrónico.\n" +
    "Si no ves el correo en tu bandeja de entrada en unos pocos minutos, mira en la carpeta de spam, de otro modo contacte al administrador para solicitar restablecimiento de contraseña. \n" +
    "    <hr>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/account/login.html',
    "<div class=\"container\">\n" +
    "    <div class=\"col-sm-6 col-sm-offset-3\">\n" +
    "        <h2 ng-if=\"!!vm.title\">{{ vm.title }}</h2>\n" +
    "        <div class=\"login-box\">\n" +
    "            <div class=\"login-logo\">\n" +
    "                <h1 class=\"logo-white-bg\">auth2factor</h1>\n" +
    "            </div>\n" +
    "                    <div ng-class=\"{ alert:true, 'alert-danger':true }\" ng-if=\"vm.hasErrors\" role=\"alert\">{{ vm.errorLabel }}</div>\n" +
    "\n" +
    "            <!-- /.login-logo -->\n" +
    "            <div class=\"panel panel-default\">\n" +
    "                <div class=\"panel-heading\">\n" +
    "                    <strong>Ingrese sus credenciales</strong>\n" +
    "                </div>\n" +
    "                <div class=\"panel-body credentials-body\">\n" +
    "                    <form role=\"form\" name=\"form\" novalidate>\n" +
    "                        <div class=\"form-group input-group\">\n" +
    "                            <span class=\"input-group-addon\"><i class=\"fa fa-tag\"></i></span>\n" +
    "                            <input  autocomplete=\"off\" placeholder=\"Ingrese correo electrónico\" type=\"email\" class=\"form-control\" ng-model=\"formulario.correo\" required name=\"correo\">\n" +
    "                        </div>\n" +
    "                            <div class=\"has-error\" ng-if=\"form.$submitted || form.correo.$dirty\" ng-messages=\"form.correo.$error\">\n" +
    "                                <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                <div class=\"help-block\" ng-message=\"email\">Campo debe contener formato de correo.</div>\n" +
    "                            </div>                        \n" +
    "                        <div class=\"form-group input-group\">\n" +
    "                            <span class=\"input-group-addon\"><i class=\"fa fa-lock\"></i></span>\n" +
    "                            <input placeholder=\"Ingrese contraseña\" type=\"password\" ng-model=\"formulario.password\" required ng-minlength=\"8\" name=\"password\" class=\"form-control\">\n" +
    "                        </div>\n" +
    "                            <div class=\"has-error\" ng-if=\"form.$submitted || form.password.$dirty\" ng-messages=\"form.password.$error\">\n" +
    "                                <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                <div class=\"help-block\" ng-message=\"minlength\">Campo debe contener al menos 8 caracteres.</div>\n" +
    "                            </div>                        \n" +
    "                        <button type=\"submit\" class=\"btn btn-primary btn-sm\" ng-click=\"vm.authenticate(form, formulario)\">Ingresar</button>\n" +
    "                        <div class=\"forgot-link\">\n" +
    "                            <p><a href=\"#forgot/{{ vm.redirectValue }}\">Olvido su contraseña?</a>\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/account/otc.html',
    "<div class=\"container\">\n" +
    "\n" +
    "        <div class=\"login-box\">\n" +
    "            <div class=\"login-logo\">\n" +
    "                <h1 class=\"logo-white-bg\">auth2factor</h1>\n" +
    "            </div>\n" +
    "    <div>\n" +
    "        <div ng-class=\"{ alert:true, 'alert-danger':true }\" ng-if=\"vm.hasErrors\" role=\"alert\">{{ vm.errorLabel }}</div>\n" +
    "        <div ng-class=\"{ alert:true, 'alert-warning':true }\" ng-if=\"vm.otcRequestLabel\" role=\"alert\">{{ vm.otcRequestLabel }}</div>\n" +
    "            <!-- /.login-logo -->\n" +
    "            <div class=\"panel panel-default\">\n" +
    "                <div class=\"panel-heading credentials-header\">\n" +
    "                    <strong>Ingrese doble factor</strong>\n" +
    "                </div>\n" +
    "                <div class=\"panel-body credentials-body\">\n" +
    "\n" +
    "\n" +
    "                    <form role=\"form\" name=\"form\" novalidate>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <input  autocomplete=\"off\" type=\"text\" ng-model=\"formulario.otp\" ng-minlength=\"6\" name=\"otp\" class=\"form-control\" required>\n" +
    "                            <div class=\"has-error\" ng-if=\"form.$submitted || form.otp.$dirty\" ng-messages=\"form.otp.$error\">\n" +
    "                                <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                <div class=\"help-block\" ng-message=\"minlength\">Campo debe contener al menos 6 caracteres.</div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <button type=\"submit\" class=\"btn btn-primary btn-sm\" ng-click=\"vm.authenticate(form, formulario)\">Verificar</button>\n" +
    "                        <div class=\"request-otc-link\">\n" +
    "                            <p><a href=\"\" ng-click=\"vm.requestOtc()\">Reenviar código</a></p>\n" +
    "                        </div>\n" +
    "                        <hr ng-if=\"vm.isU2F\">\n" +
    "                        <div ng-if=\"vm.isU2F\">\n" +
    "                        <button class=\"btn btn-primary btn-sm\" ng-click=\"vm.requestU2FLogin()\">Ingrese llave de seguridad</button>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/account/reset_confirmation.html',
    "\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"col-sm-8 col-md-12\">\n" +
    "    <h2>Cambio de contraseña exitoso!</h2>\n" +
    "Su cambio de contraseña fue exitoso.\n" +
    "    <hr>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/common/controllers/U2FModal.html',
    "<h3>Ingrese y toque dispositivo U2F ...</h3>\n" +
    "<span us-spinner=\"{ radius:30, width:8, length: 16 }\" style=\"display: block; height: 200px;\"></span>"
  );


  $templateCache.put('app/common/controllers/deleteModal.html',
    "<div class=\"container-fluid\">\n" +
    "        <div class=\"row\">{{ vm.displayQuestion }} <strong> '{{ vm.displayLabel }}'</strong>?</div>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"pull-right\">\n" +
    "<button ng-click=\"closeThisDialog()\">{{ vm.closeLabel }}</button>\n" +
    "    <button ng-click=\"confirm()\">{{ vm.confirmLabel }}</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>"
  );


  $templateCache.put('app/common/directives/GridToolbar.html',
    "<div>\n" +
    "        <ng-transclude></ng-transclude>\n" +
    "    <form class=\"form-inline pull-right\" name=\"demo.searchForm\" novalidate ng-submit=\"vm.applyGlobalSearch()\">\n" +
    "        <div class=\"input-group\">\n" +
    "            <input type=\"text\" class=\"form-control input-sm\" placeholder=\"Buscar\" name=\"searchTerm\" ng-model=\"vm.globalSearchTerm\" ng-model-options=\"{ debounce: 500 }\" />\n" +
    "            <span class=\"input-group-btn\">\n" +
    "                <button class=\"btn btn-sm btn-default\" type=\"submit\" ng-disabled=\"vm.searchForm.$invalid\">\n" +
    "                  <i class=\"fa fa-search\"></i>\n" +
    "                </button>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "        <div class=\"input-group\">\n" +
    "            <span class=\"input-group-btn\">\n" +
    "                <button class=\"btn btn-sm  btn-default\" ng-click=\"vm.pullData()\">\n" +
    "                  <i class=\"fa fa-refresh\"></i>\n" +
    "                </button>\n" +
    "            </span>\n" +
    "        </div>        \n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('app/manage/apiKeyForm.html',
    "<div class=\"page-content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-8 col-md-8\">\n" +
    "            <!-- PAGE CONTENT BEGINS -->\n" +
    "            <div class=\"col-sm-10 col-md-10\">\n" +
    "                <div class=\"box box-primary\">\n" +
    "                    <div class=\"box-header with-border\">\n" +
    "\n" +
    "                        <h1 class=\"box-title\">{{ vm.typeLabel }}\n" +
    "                <small>\n" +
    "                <i class=\"fa fa-angle-double-right\"></i>\n" +
    "                    {{ vm.key || 'Nuevo' }}\n" +
    "                </small>                    \n" +
    "                </h1>\n" +
    "                    </div>\n" +
    "                    <!-- /.box-header -->\n" +
    "                    <div ng-class=\"{ alert:true, 'alert-danger':true }\" ng-if=\"vm.hasErrors\" role=\"alert\">{{ vm.errorLabel }}</div>\n" +
    "                    <div class=\"box-body\">\n" +
    "                        <form role=\"form\" name=\"form\" novalidate>\n" +
    "                            <div class=\"form-group\" ng-if=\"!vm.canEdit\">\n" +
    "                                <label for=\"key\">Llave</label>\n" +
    "                                <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.key\" name=\"key\" placeholder=\"Ingrese llave\" maxlength=\"24\"\n" +
    "                                ng-pattern=\"/^[0-9a-zA-Z:_\\.]+$/\" required ng-readonly=\"true\">\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.key.$dirty\" ng-messages=\"form.key.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    <div class=\"help-block\" ng-message=\"pattern\">Solo puede incluir alfanuméricos, punto (.), rayita (_) y dos puntos (:).</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"description\">Descripción</label>\n" +
    "                                <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.description\" name=\"description\" placeholder=\"Ingrese descripcion\"\n" +
    "                                required>\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.description.$dirty\" ng-messages=\"form.description.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"u2fAppId\">U2F AppID</label>\n" +
    "                                <input class=\"form-control  input-sm\" type=\"text\" \n" +
    "                                ng-model=\"formulario.settings.u2fAppId\" name=\"u2fAppId\" placeholder=\"Ingrese AppID (ej. http://dominio)\"\n" +
    "                                required>\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.u2fAppId.$dirty\" ng-messages=\"form.u2fAppId.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                </div>\n" +
    "                            </div>                            \n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"ip\">IP</label>\n" +
    "                                <input class=\"form-control  input-sm\" ng-pattern=\"/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/\"\n" +
    "                                type=\"text\" ng-model=\"formulario.settings.ip\" name=\"ip\" placeholder=\"Ingrese IP\" required>\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.ip.$dirty\" ng-messages=\"form.ip.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    <div class=\"help-block\" ng-message=\"pattern\">Debe ser una dirección IP (ej: 10.0.0.1).</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"license\">Token</label>\n" +
    "                                <textarea rows=\"5\" class=\"form-control  input-sm\" \n" +
    "                                ng-model=\"formulario.settings.apiToken\" name=\"apiToken\" placeholder=\"Ingrese licencia\"\n" +
    "                                ng-readonly=\"true\"></textarea>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div class=\"col-sm-3 col-md-3 col-sm-offset-1 col-md-offset-2\">\n" +
    "                                        <button class=\"btn btn-sm btn-primary\" ng-click=\"vm.save(form, formulario)\">\n" +
    "                                            <i class=\"icon-ok\"></i> Guardar\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-sm-6 col-md-6 col-sm-offset-1\">\n" +
    "                                        <button class=\"btn btn-sm\" ng-click=\"vm.cancel()\">\n" +
    "                                            <i class=\"icon-remove\"></i> Cancelar\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </form>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- PAGE CONTENT ENDS -->\n" +
    "        </div>\n" +
    "        <!-- /.col -->\n" +
    "    </div>\n" +
    "    <!-- /.row -->\n" +
    "</div>\n" +
    "<!-- /.page-content -->"
  );


  $templateCache.put('app/manage/configForm.html',
    "<div class=\"page-content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-8 col-md-8\">\n" +
    "            <!-- PAGE CONTENT BEGINS -->\n" +
    "            <div class=\"col-sm-10 col-md-10\">\n" +
    "                <div class=\"box box-primary\">\n" +
    "                    <div class=\"box-header with-border\">\n" +
    "\n" +
    "                        <h1 class=\"box-title\">{{ vm.typeLabel }}\n" +
    "                <small>\n" +
    "                <i class=\"fa fa-angle-double-right\"></i>\n" +
    "                    {{ vm.key || 'Nuevo' }}\n" +
    "                </small>                    \n" +
    "                </h1>\n" +
    "                    </div>\n" +
    "                    <!-- /.box-header -->\n" +
    "                    <div ng-class=\"{ alert:true, 'alert-danger':true }\" ng-if=\"vm.hasErrors\" role=\"alert\">{{ vm.errorLabel }}</div>\n" +
    "                    <div class=\"box-body\">\n" +
    "                        <form role=\"form\" name=\"form\" novalidate>\n" +
    "                            <div class=\"form-group\" ng-if=\"!vm.canEdit\">\n" +
    "                                <label for=\"key\">Llave</label>\n" +
    "                                <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.key\" name=\"key\" placeholder=\"Ingrese llave\" maxlength=\"24\" ng-pattern=\"/^[0-9a-zA-Z:_\\.]+$/\" required ng-readonly=\"vm.canEdit\">\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.key.$dirty\" ng-messages=\"form.key.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    <div class=\"help-block\" ng-message=\"pattern\">Solo puede incluir alfanuméricos, punto (.), rayita (_) y dos puntos (:).</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"description\">Descripción</label>\n" +
    "                                <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.description\" name=\"description\" placeholder=\"Ingrese descripcion\" required>\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.description.$dirty\" ng-messages=\"form.description.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\" ng-if=\"vm.transports\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <label for=\"transport\">Transporte</label>\n" +
    "\n" +
    "                                    <select name=\"transport\" ng-model=\"formulario.transport\" class=\"form-control input-sm\"  ng-readonly=\"vm.canEdit\">\n" +
    "                                        <option ng-repeat=\"item in vm.transports\" ng-disabled=\"vm.canEdit\"  value=\"{{ ::item.transport }}\">{{ ::item.description}}</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div> \n" +
    "                            <div class=\"form-group\" ng-if=\"vm.adapters\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <label for=\"adapter\">Adaptador</label>\n" +
    "\n" +
    "                                    <select name=\"adapter\" ng-model=\"formulario.adapter\" class=\"form-control input-sm\" ng-readonly=\"vm.canEdit\">\n" +
    "                                        <option ng-disabled=\"vm.canEdit\" ng-repeat=\"item in vm.adapters\" value=\"{{ ::item.adapter }}\">{{ ::item.description}}</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"formulario.adapter==='ldap:ldap'\">\n" +
    "                                <div class=\"form-group\" ng-if=\"formulario.adapter==='ldap:ldap'\">\n" +
    "                                    <label for=\"url\">Url</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.url\" name=\"url\" placeholder=\"Ingrese url\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.url.$dirty\" ng-messages=\"form.url.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"baseDN\">baseDN</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.baseDN\" name=\"baseDN\" placeholder=\"Ingrese baseDN\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.baseDN.$dirty\" ng-messages=\"form.baseDN.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"username\">Username</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.username\" name=\"username\" placeholder=\"Ingrese username\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.username.$dirty\" ng-messages=\"form.username.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"password\">Password</label>\n" +
    "                                    <input type=\"password\" class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.password\" name=\"password\" placeholder=\"Ingrese password\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.password.$dirty\" ng-messages=\"form.password.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"formulario.transport==='sms:twilio'\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"fromNumber\">Número de Twilio</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.fromNumber\" name=\"fromNumber\" placeholder=\"Ingrese fromNumber\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.fromNumber.$dirty\" ng-messages=\"form.fromNumber.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"SID\">SID</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.SID\" name=\"SID\" placeholder=\"Ingrese SID\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.SID.$dirty\" ng-messages=\"form.SID.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"token\">Token</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.token\" name=\"token\" placeholder=\"Ingrese token\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.token.$dirty\" ng-messages=\"form.token.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"formulario.transport==='email:sendgrid'\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"user\">Usuario</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.user\" name=\"user\" placeholder=\"Ingrese user\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.user.$dirty\" ng-messages=\"form.user.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"apiKey\">Llave de API</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"password\" ng-model=\"formulario.settings.apiKey\" name=\"apiKey\" placeholder=\"Ingrese apiKey\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.apiKey.$dirty\" ng-messages=\"form.apiKey.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"formulario.transport==='email:smtp'\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"host\">Host</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.host\" name=\"host\" placeholder=\"Ingrese host\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.host.$dirty\" ng-messages=\"form.host.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"port\">Puerto</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.port\" name=\"port\" placeholder=\"Ingrese puerto\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.port.$dirty\" ng-messages=\"form.port.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"user\">Usuario</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.user\" name=\"user\" placeholder=\"Ingrese usuario\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.user.$dirty\" ng-messages=\"form.user.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"password\">Password</label>\n" +
    "                                    <input type=\"password\" class=\"form-control  input-sm\" ng-model=\"formulario.settings.password\" name=\"password\" placeholder=\"Ingrese password\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.password.$dirty\" ng-messages=\"form.password.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <label for=\"serviceType\" class=\"col-sm-1\">Seguridad</label>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-sm-8\">\n" +
    "                                            <div class=\"togglebutton\">\n" +
    "                                                <div>\n" +
    "                                                    <label>\n" +
    "                                                        <input type=\"checkbox\" ng-model=\"formulario.settings.secure\" name=\"secure\" checked=\"\"><span class=\"toggle\"></span> SSL\n" +
    "                                                    </label>\n" +
    "                                                </div>\n" +
    "                                                <div>\n" +
    "                                                    <label>\n" +
    "                                                        <input type=\"checkbox\" ng-model=\"formulario.settings.tls\" name=\"tls\" checked=\"\"><span class=\"toggle\"></span> TLS\n" +
    "                                                    </label>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\" ng-if=\"!vm.entity && !formulario.settings.license\">\n" +
    "                                <label for=\"value\">Valor</label>\n" +
    "                                <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.value\" name=\"value\" placeholder=\"Ingrese valor\" required>\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.value.$dirty\" ng-messages=\"form.value.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\" ng-if=\"formulario.settings && formulario.settings.license\">\n" +
    "                                <label for=\"license\">Licencia</label>\n" +
    "                                <textarea rows=\"6\" class=\"form-control  input-sm\" ng-model=\"formulario.settings.license\" name=\"license\" placeholder=\"Ingrese licencia\" required></textarea>\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.license.$dirty\" ng-messages=\"form.license.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"vm.key === 'default:system:env'\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"ip\">Timeout de confirmación</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.confirmationTokenTimeout\" name=\"confirmationTokenTimeout\" placeholder=\"Ingrese timeout\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.confirmationTokenTimeout.$dirty\" ng-messages=\"form.confirmationTokenTimeout.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"emailTransport\">Transporte de correo predeterminado</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.emailTransport\" name=\"emailTransport\" placeholder=\"Ingrese transporte\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.emailTransport.$dirty\" ng-messages=\"form.emailTransport.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label for=\"resetConfirmCodeTransport\">Transporte de restablecimiento predeterminado</label>\n" +
    "                                    <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.settings.resetConfirmCodeTransport\" name=\"resetConfirmCodeTransport\" placeholder=\"Ingrese transporte\" required>\n" +
    "                                    <div class=\"has-error\" ng-if=\"form.$submitted || form.resetConfirmCodeTransport.$dirty\" ng-messages=\"form.resetConfirmCodeTransport.$error\">\n" +
    "                                        <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div class=\"col-sm-3 col-md-3 col-sm-offset-1 col-md-offset-2\">\n" +
    "                                        <button class=\"btn btn-sm btn-primary\" ng-click=\"vm.save(form, formulario)\">\n" +
    "                                            <i class=\"icon-ok\"></i> Guardar\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-sm-6 col-md-6 col-sm-offset-1\">\n" +
    "                                        <button class=\"btn btn-sm\" ng-click=\"vm.cancel()\">\n" +
    "                                            <i class=\"icon-remove\"></i> Cancelar\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </form>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- PAGE CONTENT ENDS -->\n" +
    "        </div>\n" +
    "        <!-- /.col -->\n" +
    "    </div>\n" +
    "    <!-- /.row -->\n" +
    "</div>\n" +
    "<!-- /.page-content -->"
  );


  $templateCache.put('app/manage/configuration.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-lg-11 col-xs-12\">\n" +
    "        <div class=\"box\">\n" +
    "            <div class=\"box-header\">\n" +
    "                <h3 class=\"box-title\">Configuraciones</h3>\n" +
    "            </div>\n" +
    "            <!-- /.box-header -->\n" +
    "\n" +
    "\n" +
    "            <div class=\"box-body no-padding\">\n" +
    "\n" +
    "<div grid-toolbar source=\"vm.tableParams\" refresh=\"vm.refresh\">\n" +
    "    <ul class=\"nav nav-pills pull-left\">\n" +
    "        <li>\n" +
    "                            <button class=\"btn btn-primary\" href=\"\" ng-click=\"vm.add()\">\n" +
    "                                <strong>Agregar configuración</strong>\n" +
    "                            </button>            \n" +
    "        </li>\n" +
    "<!--\n" +
    "        <li>\n" +
    "            <a href=\"\" ng-click=\"vm.add('adapter')\">\n" +
    "                <i class=\"fa fa-plus\"></i>&nbsp; Crear adaptador\n" +
    "            </a>\n" +
    "        </li>            \n" +
    "-->\n" +
    "        <li>\n" +
    "                            <button class=\"btn btn-primary\" href=\"\" ng-click=\"vm.add('transport')\">\n" +
    "                                <strong>Agregar transporte</strong>\n" +
    "                            </button>            \n" +
    "        </li>                                               \n" +
    "    </ul>\n" +
    "</div>\n" +
    "            <div ng-show=\"vm.configuration.length == 0\">\n" +
    "                <h3>No hay configuraciones</h3>\n" +
    "            </div>\n" +
    "<table ng-table=\"vm.tableParams\" class=\"table table-responsive\" ng-show=\"vm.configuration.length > 0\">\n" +
    "    <colgroup>\n" +
    "        <col width=\"140px\" />\n" +
    "        <col width=\"140px\" />\n" +
    "        <col width=\"60px\" />\n" +
    "        <col width=\"120px\" />\n" +
    "        <col width=\"100px\" />\n" +
    "    </colgroup>\n" +
    "    <tr ng-repeat=\"item in $data\">\n" +
    "        <td title=\"'ID'\" filter=\"{ key: 'text'}\" sortable=\"'key'\">\n" +
    "            {{ item.key }}</td>\n" +
    "        <td title=\"'Descripción'\" filter=\"{ description: 'text'}\" sortable=\"'description'\">\n" +
    "            {{ item.description }}</td>\n" +
    "        <td title=\"'Tipo'\" filter=\"{ 'entity': 'text'}\" sortable=\"'entity'\">\n" +
    "            <span ng-class=\"{ label: true, 'label-primary': item.entity === 'config', 'label-info': item.entity === 'transport', 'label-success': item.entity === 'adapter' }\">{{ item.entity }}</span></td>\n" +
    "        <td title=\"'Creado'\" filter=\"{ created: 'text'}\" sortable=\"'created'\">\n" +
    "            {{ item.created | date: 'dd/MM/yyyy hh:mm' }}</td>\n" +
    "        <td>\n" +
    "            <ul class=\"nav nav-pills pull-left\">\n" +
    "                <li>\n" +
    "                <button class=\"btn btn-sm btn-default\" ng-click=\"vm.edit(item)\">\n" +
    "                  <i class=\"fa fa-pencil-square-o\"></i>\n" +
    "                </button>\n" +
    "                </li>\n" +
    "                <li ng-show=\"item.deletable\">\n" +
    "                <button class=\"btn btn-sm btn-default\" ng-click=\"vm.delete(item)\">\n" +
    "                  <i class=\"fa fa-remove\"></i>\n" +
    "                </button>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "              </div>\n" +
    "        </div>\n" +
    "    </div>"
  );


  $templateCache.put('app/manage/enrollMulti.html',
    "<div class=\"page-content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-8 col-md-8\">\n" +
    "            <!-- PAGE CONTENT BEGINS -->\n" +
    "            <div class=\"col-sm-10 col-md-10\">\n" +
    "                <div class=\"box box-primary\">\n" +
    "                    <div class=\"box-header with-border\">\n" +
    "\n" +
    "                        <h1 class=\"box-title\">Enrolamiento Batch con CSV                   \n" +
    "                </h1>\n" +
    "                    </div>\n" +
    "                    <!-- /.box-header -->\n" +
    "                    <div ng-class=\"{ alert:true, 'alert-danger':true }\" ng-if=\"vm.hasErrors\" role=\"alert\">{{ vm.errorLabel }}</div>\n" +
    "                    <div class=\"box-body\">\n" +
    "                        <div class=\"alert alert-info\" role=\"alert\">\n" +
    "                            <strong>Formato:</strong> Correo, Cuenta LDAP, Celular, Nombre, Apellido\n" +
    "                        </div>\n" +
    "                        <form role=\"form\" name=\"form\" novalidate>\n" +
    "                            <div class=\"form-group\">\n" +
    "\n" +
    "                                <div class=\"row\">\n" +
    "                                    <label for=\"grupo\">Grupo</label>\n" +
    "\n" +
    "                                    <select name=\"grupo\" ng-model=\"formulario.group\" class=\"form-control\">\n" +
    "                                        <option ng-repeat=\"item in vm.groups\" value=\"{{item.group}}\">{{item.group}}</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <label for=\"csv\">CSV</label>\n" +
    "                                </div>\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div>\n" +
    "                                        <textarea cols=\"52\" rows=\"10\" name=\"csv\" ng-model=\"formulario.csv\" required></textarea>\n" +
    "                                        <div class=\"has-error\" ng-if=\"form.$submitted || form.csv.$dirty\" ng-messages=\"form.csv.$error\">\n" +
    "                                            <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-sm-3 col-md-3 col-sm-offset-1 col-md-offset-2\">\n" +
    "                                <button class=\"btn btn-sm btn-primary\" ng-click=\"vm.save(form, formulario)\">\n" +
    "                                    <i class=\"icon-ok\"></i> Guardar\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-sm-6 col-md-6 col-sm-offset-1\">\n" +
    "                                <button class=\"btn btn-sm\" ng-click=\"vm.cancel()\">\n" +
    "                                    <i class=\"icon-remove\"></i> Cancelar\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- PAGE CONTENT ENDS -->\n" +
    "    </div>\n" +
    "    <!-- /.col -->\n" +
    "</div>\n" +
    "<!-- /.row -->\n" +
    "</div>\n" +
    "<!-- /.page-content -->"
  );


  $templateCache.put('app/manage/groupDeleteModal.html',
    "    <div class=\"container-fluid\">\n" +
    "        <div class=\"row\">Remover el grupo <strong> '{{ vm.displayDeleteLabel }}'</strong>?</div>\n" +
    "        <div class=\"row\"></div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"pull-right\">\n" +
    "<button ng-click=\"closeThisDialog()\">Cancel</button>\n" +
    "    <button ng-click=\"confirm()\">Confirm</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n"
  );


  $templateCache.put('app/manage/groupForm.html',
    "<div class=\"page-content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-8 col-md-8\">\n" +
    "            <!-- PAGE CONTENT BEGINS -->\n" +
    "            <div class=\"col-sm-10 col-md-10\">\n" +
    "                <div class=\"box box-primary\">\n" +
    "                    <div class=\"box-header with-border\">\n" +
    "\n" +
    "                        <h1 class=\"box-title\">Grupo\n" +
    "                <small>\n" +
    "                <i class=\"fa fa-angle-double-right\"></i>\n" +
    "                    {{ vm.group || 'Nuevo' }}\n" +
    "                </small>                    \n" +
    "                </h1>\n" +
    "                    </div>\n" +
    "                    <!-- /.box-header -->\n" +
    "                    <div ng-class=\"{ alert:true, 'alert-danger':true }\" ng-if=\"vm.hasErrors\" role=\"alert\">{{ vm.errorLabel }}</div>\n" +
    "                    <div class=\"box-body\">\n" +
    "                        <form role=\"form\" name=\"form\" novalidate>\n" +
    "                            <div class=\"form-group\" ng-if=\"!vm.canEdit\">\n" +
    "                                <label for=\"group\">Nombre</label>\n" +
    "                                <input class=\"form-control  input-sm\" required type=\"text\" ng-model=\"formulario.group\" name=\"group\" maxlength=\"12\" ng-pattern=\"/^[0-9a-zA-Z:_\\.]+$/\" placeholder=\"Ingrese nombre de grupo\" ng-readonly=\"vm.canEdit\">\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.group.$dirty\" ng-messages=\"form.group.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    <div class=\"help-block\" ng-message=\"pattern\">Solo puede incluir alfanumericos, punto (.), rayita (_) y dos puntos (:).</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"description\">Descripción</label>\n" +
    "                                <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.description\" name=\"description\" placeholder=\"Ingrese descripcion\" required>\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.description.$dirty\" ng-messages=\"form.description.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"row\" ng-if=\"!vm.transports\">\n" +
    "No hay adaptadores transportes\n" +
    "                                </div>                                \n" +
    "                                <div class=\"row\">\n" +
    "                                    <label for=\"transport\">Transporte</label>\n" +
    "\n" +
    "                                    <select name=\"transport\" ng-model=\"formulario.transport.id\" class=\"form-control input-sm\">\n" +
    "                                        <option ng-repeat=\"item in vm.transports\" value=\"{{ ::item.key}}\">{{ ::item.description}}</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>                             \n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"row\" ng-if=\"!vm.adapters\">\n" +
    "No hay adaptadores configurados\n" +
    "                                </div>                                \n" +
    "<!--\n" +
    "                                <div class=\"row\">\n" +
    "                                    <label for=\"adapter\">Adaptador</label>\n" +
    "\n" +
    "                                    <select ng-readonly=\"true\" name=\"adapter\" ng-model=\"formulario.adapter.id\" class=\"form-control input-sm\">\n" +
    "                                        <option ng-readonly=\"true\" ng-repeat=\"item in vm.adapters\" value=\"{{ ::item.key}}\">{{ ::item.description}}</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>                            \n" +
    "-->\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div class=\"col-sm-3 col-md-3 col-sm-offset-1 col-md-offset-2\">\n" +
    "                                        <button class=\"btn btn-sm btn-primary\" ng-click=\"vm.save(form, formulario)\">\n" +
    "                                            <i class=\"icon-ok\"></i> Guardar\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-sm-6 col-md-6 col-sm-offset-1\">\n" +
    "                                        <button class=\"btn btn-sm\" ng-click=\"vm.cancel()\">\n" +
    "                                            <i class=\"icon-remove\"></i> Cancelar\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </form>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- PAGE CONTENT ENDS -->\n" +
    "\n" +
    "    </div>\n" +
    "    <!-- /.col -->\n" +
    "</div>\n" +
    "<!-- /.row -->\n" +
    "</div>\n" +
    "<!-- /.page-content -->"
  );


  $templateCache.put('app/manage/groups.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-lg-11 col-xs-12\">\n" +
    "        <div class=\"box\">\n" +
    "            <div class=\"box-header\">\n" +
    "                <h3 class=\"box-title\">Grupos</h3>\n" +
    "            </div>\n" +
    "            <!-- /.box-header -->\n" +
    "\n" +
    "\n" +
    "            <div class=\"box-body no-padding\">\n" +
    "\n" +
    "\n" +
    "<div grid-toolbar source=\"vm.tableParams\" refresh=\"vm.refresh\">\n" +
    "    <ul class=\"nav nav-pills pull-left\">\n" +
    "        <li>\n" +
    "            <button class=\"btn btn-primary\" href=\"\" ng-click=\"vm.add()\">\n" +
    "                <strong>Agregar Grupo</strong>\n" +
    "            </button>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div ng-show=\"vm.groups.length == 0\">\n" +
    "    <h3>No hay grupos</h3>\n" +
    "</div>\n" +
    "<table ng-table=\"vm.tableParams\" class=\"table table-responsive\" ng-show=\"vm.groups.length > 0\">\n" +
    "    <colgroup>\n" +
    "        <col width=\"70px\" />\n" +
    "        <col width=\"120px\" />\n" +
    "        <col width=\"80px\" />\n" +
    "        <col width=\"120px\" />\n" +
    "        <col width=\"80px\" />\n" +
    "    </colgroup>\n" +
    "    <tr ng-repeat=\"item in $data\">\n" +
    "        <td title=\"'Grupo'\" filter=\"{ group: 'text'}\" sortable=\"'group'\">\n" +
    "            {{ item.group }}</td>\n" +
    "        <td title=\"'Descripción'\" filter=\"{ description: 'text'}\" sortable=\"'description'\">\n" +
    "            {{ item.description }}</td>\n" +
    "        <td title=\"'Transporte'\" filter=\"{ 'transport.id': 'text'}\" sortable=\"'transport.id'\">\n" +
    "            {{ item.transport.id }}</td>\n" +
    "        <td title=\"'Creado'\" filter=\"{ created: 'text'}\" sortable=\"'created'\">\n" +
    "            {{ item.created | date: 'dd/MM/yyyy hh:mm' }}</td>\n" +
    "        <td>\n" +
    "            <ul class=\"nav nav-pills pull-left\">\n" +
    "                <li>\n" +
    "                <button class=\"btn btn-sm btn-default\" ng-click=\"vm.edit(item)\">\n" +
    "                  <i class=\"fa fa-pencil-square-o\"></i>\n" +
    "                </button>\n" +
    "                </li>\n" +
    "                <li ng-show=\"item.deletable\">\n" +
    "                <button class=\"btn btn-sm btn-default\" ng-click=\"vm.delete(item)\">\n" +
    "                  <i class=\"fa fa-remove\"></i>\n" +
    "                </button>\n" +
    "            </ul>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>"
  );


  $templateCache.put('app/manage/index.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-4 col-sm-6 col-xs-12\" ng:if=\"vm.stats.users\">\n" +
    "              <div class=\"info-box bg-aqua\">\n" +
    "                <span class=\"info-box-icon\"><i class=\"fa fa-user\"></i></span>\n" +
    "                <div class=\"info-box-content\">\n" +
    "                  <span class=\"info-box-text\">Cuentas</span>\n" +
    "                  <span class=\"info-box-number\">{{ ::vm.stats.users.count }}</span>\n" +
    "                  <div class=\"progress\">\n" +
    "                    <div class=\"progress-bar\" style=\"width: 100%\"></div>\n" +
    "                  </div>\n" +
    "                  <span class=\"progress-description\">\n" +
    "                    {{ ::vm.stats.admins.count }} administrador(es)\n" +
    "                  </span>\n" +
    "                </div><!-- /.info-box-content -->\n" +
    "              </div><!-- /.info-box -->\n" +
    "            </div>\n" +
    "<div class=\"col-md-4 col-sm-6 col-xs-12\" ng:if=\"vm.stats.groups\">\n" +
    "              <div class=\"info-box bg-green\">\n" +
    "                <span class=\"info-box-icon\"><i class=\"fa fa-group\"></i></span>\n" +
    "                <div class=\"info-box-content\">\n" +
    "                  <span class=\"info-box-text\">Grupos</span>\n" +
    "                  <span class=\"info-box-number\">{{ ::vm.stats.groups.count }}</span>\n" +
    "\n" +
    "                </div><!-- /.info-box-content -->\n" +
    "              </div><!-- /.info-box -->\n" +
    "            </div>\n" +
    "<div class=\"col-md-4 col-sm-6 col-xs-12\" ng:if=\"vm.stats.logs\">\n" +
    "              <div class=\"info-box bg-yellow\">\n" +
    "                <span class=\"info-box-icon\"><i class=\"fa fa-table\"></i></span>\n" +
    "                <div class=\"info-box-content\">\n" +
    "                  <span class=\"info-box-text\">Bitácoras</span>\n" +
    "                  <span class=\"info-box-number\">{{ ::vm.stats.logs.count }}</span>\n" +
    "\n" +
    "                </div><!-- /.info-box-content -->\n" +
    "              </div><!-- /.info-box -->\n" +
    "            </div>\n" +
    "          </div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "<div class=\"content body\">\n" +
    "\n" +
    "<section id=\"introduction\">\n" +
    "  <h2 class=\"page-header\"><a href=\"#/manage#introduction\">Sobre Auth2factor</a></h2>\n" +
    "  <p class=\"lead\">\n" +
    "    Auth2factor es una solución de doble factor de autenticación OTP y U2F, la cual utiliza códigos de un solo uso (OTC: One Time Code) basados en el estándar RFC 6238 TOTP y de este modo compatibles con soft tokens como Google Authenticator y Microsoft Authenticator. Adicionalmente es compatible con llaves de seguridad U2F.\n" +
    "  </p>\n" +
    "</section><!-- /#introduction -->\n" +
    "\n" +
    "    <section id=\"docs\">\n" +
    "  <h2 class=\"page-header\"><a href=\"#/manage#docs\">Documentación</a></h2>\n" +
    "  <p class=\"lead\">\n" +
    "      Documentación en linea <a href=\"http://docs.auth2factor.com\">version 2.0</a>\n" +
    "  </p>\n" +
    "</section><!-- /#introduction -->\n" +
    "\n" +
    "    <section id=\"api\">\n" +
    "  <h2 class=\"page-header\"><a href=\"#/manage#api\">Documentación Técnica</a></h2>\n" +
    "  <p class=\"lead\">\n" +
    "    APIs y SDKs\n" +
    "  </p>\n" +
    "    <ul>\n" +
    "        <li><a href=\"api/api_docs#\">API</a>\n" +
    "        </li>\n" +
    "        <li><a href=\"https://github.com/molekilla\">SDK</a>\n" +
    "        </li>\n" +
    "        </ul>\n" +
    "</section><!-- /#introduction -->\n" +
    "\n" +
    "<section id=\"license\">\n" +
    "  <h2 class=\"page-header\"><a href=\"#/manage#license\">Licencia</a></h2>\n" +
    "    <h3>Entidad: {{ ::vm.stats.license.Company }}</h3>\n" +
    "    <h4>Contacto: {{ ::vm.stats.license['Licensed To'] }}</h4>\n" +
    "  <p>\n" +
    "Cantidad: {{ ::vm.stats.license['Number of Users Licensed'] }} licencias de usuarios  </p>\n" +
    "</section>\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('app/manage/integrations.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-lg-11 col-xs-12\">\n" +
    "        <div class=\"box\">\n" +
    "            <div class=\"box-header\">\n" +
    "                <h3 class=\"box-title\">Integraciones</h3>\n" +
    "            </div>\n" +
    "            <!-- /.box-header -->\n" +
    "\n" +
    "\n" +
    "            <div class=\"box-body no-padding\">\n" +
    "\n" +
    "<div grid-toolbar source=\"vm.tableParams\" refresh=\"vm.refresh\">\n" +
    "    <ul class=\"nav nav-pills pull-left\">              \n" +
    "        <li>\n" +
    "                            <button class=\"btn btn-primary\" href=\"\" ng-click=\"vm.addAPIKey()\">\n" +
    "                                <strong>Agregar API token</strong>\n" +
    "                            </button>            \n" +
    "        </li>                            \n" +
    "    </ul>\n" +
    "</div>\n" +
    "            <div ng-show=\"vm.configuration.length == 0\">\n" +
    "                <h3>No hay integraciones</h3>\n" +
    "            </div>\n" +
    "<table ng-table=\"vm.tableParams\" class=\"table table-responsive\" ng-show=\"vm.configuration.length > 0\">\n" +
    "    <colgroup>\n" +
    "        <col width=\"100px\" />\n" +
    "        <col width=\"120px\" />\n" +
    "        <col width=\"120px\" />\n" +
    "        <col width=\"120px\" />\n" +
    "        <col width=\"100px\" />\n" +
    "    </colgroup>\n" +
    "    <tr ng-repeat=\"item in $data\">\n" +
    "        <td title=\"'ID'\" filter=\"{ key: 'text'}\" sortable=\"'key'\">\n" +
    "            {{ item.key }}</td>\n" +
    "        <td title=\"'Descripción'\" filter=\"{ description: 'text'}\" sortable=\"'description'\">\n" +
    "            {{ item.description }}</td>\n" +
    "        <td title=\"'Atributos'\" filter=\"{ 'settings.ip': 'text'}\">\n" +
    "            <div><b>IP</b>: {{ item.settings.ip }}</div>\n" +
    "            <div ng-if=\"item.settings.u2fAppId\"><b>AppId</b>: {{ item.settings.u2fAppId }}</div></td>\n" +
    "        <td title=\"'Creado'\" filter=\"{ created: 'text'}\" sortable=\"'created'\">\n" +
    "            {{ item.created | date: 'dd/MM/yyyy hh:mm' }}</td>\n" +
    "        <td>\n" +
    "            <ul class=\"nav nav-pills pull-left\">\n" +
    "                <li>\n" +
    "                <button class=\"btn btn-sm btn-default\" ng-click=\"vm.edit(item)\">\n" +
    "                  <i class=\"fa fa-pencil-square-o\"></i>\n" +
    "                </button>\n" +
    "                </li>\n" +
    "                <li ng-show=\"item.deletable\">\n" +
    "                <button class=\"btn btn-sm btn-default\" ng-click=\"vm.delete(item)\">\n" +
    "                  <i class=\"fa fa-remove\"></i>\n" +
    "                </button>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "              </div>\n" +
    "        </div>\n" +
    "    </div>"
  );


  $templateCache.put('app/manage/logs.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-lg-11 col-xs-12\">\n" +
    "        <div class=\"box\">\n" +
    "            <div class=\"box-header\">\n" +
    "                <h3 class=\"box-title\">Bitácoras</h3>\n" +
    "            </div>\n" +
    "            <!-- /.box-header -->\n" +
    "\n" +
    "\n" +
    "            <div class=\"box-body no-padding\">\n" +
    "\n" +
    "            <div grid-toolbar source=\"vm.tableParams\" refresh=\"vm.refresh\">\n" +
    "            </div>\n" +
    "            <div ng-show=\"vm.logs.length == 0\">\n" +
    "                <h3>No hay bitacoras</h3>\n" +
    "            </div>\n" +
    "            <div class=\"datagrid\">\n" +
    "                <table ng-table=\"vm.tableParams\" class=\"table table-responsive\" ng-show=\"vm.logs.length > 0\">\n" +
    "                    <colgroup>\n" +
    "                        <col width=\"30px\" />\n" +
    "                        <col width=\"160px\" />\n" +
    "                        <col width=\"100px\" />\n" +
    "                        <col width=\"60px\" />\n" +
    "                        <col width=\"60px\" />\n" +
    "                        <col width=\"100px\" />\n" +
    "                        <col width=\"100px\" />\n" +
    "                    </colgroup>\n" +
    "                    <tr ng-repeat=\"item in $data\">\n" +
    "                        <td title=\"'Tipo'\" filter=\"{ event: 'text'}\" sortable=\"'event'\">\n" +
    "                            \n" +
    "<span ng-class=\"{ label: true, 'label-info': item.event === 'info', 'label-danger': item.event ===  'error' }\">{{ item.event }}</span></td>\n" +
    "                        <td title=\"'Descripción'\" filter=\"{ log: 'text'}\" sortable=\"'log'\">\n" +
    "                            {{ item.log }}</td>\n" +
    "                        <td class=\"center-block\" title=\"'Usuario'\" filter=\"{ user: 'text'}\" sortable=\"'user'\">\n" +
    "                            {{ item.user }}</td>\n" +
    "                        <td title=\"'IP Remoto'\" filter=\"{ remoteAddress: 'text'}\" sortable=\"'remoteAddress'\">\n" +
    "                            {{ item.remoteAddress }}</td>\n" +
    "                        <td title=\"'Llamado'\" filter=\"{ 'request.method': 'text'}\" sortable=\"'request.method'\">\n" +
    "                            {{ item.request.method }}</td>\n" +
    "                        <td title=\"'Ruta'\" filter=\"{ 'request.path': 'text'}\" sortable=\"'request.path'\">\n" +
    "                            {{ item.request.path }}</td>\n" +
    "                        <td title=\"'Creado'\" filter=\"{ created: 'text'}\" sortable=\"'created'\">\n" +
    "                            {{ item.created | date: 'dd/MM/yyyy hh:mm' }}</td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>"
  );


  $templateCache.put('app/manage/transports.html',
    "<kendo-grid options=\"vm.options\" style=\"margin-top: 40px;\"></kendo-grid>\n"
  );


  $templateCache.put('app/manage/userForm.html',
    "<div class=\"page-content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-8 col-md-8\">\n" +
    "            <!-- PAGE CONTENT BEGINS -->\n" +
    "            <div class=\"col-sm-10 col-md-10\">\n" +
    "                <div class=\"box box-primary\">\n" +
    "                    <div class=\"box-header with-border\">\n" +
    "\n" +
    "                        <h1 class=\"box-title\">Cuenta\n" +
    "                <small>\n" +
    "                <i class=\"fa fa-angle-double-right\"></i>\n" +
    "                    {{ vm.account || 'Nuevo' }}\n" +
    "                </small>                    \n" +
    "                </h1>\n" +
    "                    </div>\n" +
    "                    <!-- /.box-header -->\n" +
    "                    <div ng-class=\"{ alert:true, 'alert-danger':true }\" ng-if=\"vm.hasErrors\" role=\"alert\">{{ vm.errorLabel }}</div>\n" +
    "                    <div class=\"box-body\">\n" +
    "                        <form role=\"form\" name=\"form\" novalidate>\n" +
    "                            <div class=\"form-group\" ng-if=\"!vm.canEdit\">\n" +
    "                                <label for=\"email\">Correo Electrónico</label>\n" +
    "                                <input class=\"form-control  input-sm\" required type=\"text\" ng-model=\"formulario.email\" name=\"email\" placeholder=\"Ingrese correo\">\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.email.$dirty\" ng-messages=\"form.email.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <!--\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"ldapAccount\">Cuenta LDAP</label>\n" +
    "                        <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.ldapAccount\" name=\"ldapAccount\" placeholder=\"Ingrese cuenta LDAP\">\n" +
    "                        <div class=\"has-error\" ng-if=\"form.$submitted || form.ldapAccount.$dirty\" ng-messages=\"form.ldapAccount.$error\">\n" +
    "                            <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "-->\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"cellphone\">Celular</label>\n" +
    "                                <input class=\"form-control  input-sm\" type=\"text\" ng-pattern=\"/^[0-9]*$/\" ng-maxlength=\"16\" ng-model=\"formulario.cellphone\" name=\"cellphone\" placeholder=\"Ingrese celular (ejemplo: 50766001111)\" required>\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.cellphone.$dirty\" ng-messages=\"form.cellphone.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                    <div class=\"help-block\" ng-message=\"maxlength\">Debe ser maximo 16 digitos.</div>\n" +
    "                                    <div class=\"help-block\" ng-message=\"pattern\">Debe ser caracteres numericos.</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"firstName\">Nombre</label>\n" +
    "                                <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.firstName\" name=\"firstName\" placeholder=\"Ingrese nombre\">\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.firstName.$dirty\" ng-messages=\"form.firstName.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"lastName\">Apellido</label>\n" +
    "                                <input class=\"form-control  input-sm\" type=\"text\" ng-model=\"formulario.lastName\" name=\"lastName\" placeholder=\"Ingrese apellido\">\n" +
    "                                <div class=\"has-error\" ng-if=\"form.$submitted || form.lastName.$dirty\" ng-messages=\"form.lastName.$error\">\n" +
    "                                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "\n" +
    "                                <div class=\"row\">\n" +
    "                                    <label for=\"grupo\">Grupo</label>\n" +
    "\n" +
    "                                    <select name=\"grupo\" ng-model=\"formulario.group\" class=\"form-control input-sm\">\n" +
    "                                        <option ng-repeat=\"item in vm.groups\" value=\"{{item.group}}\">{{item.group}}</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <label for=\"serviceType\">Opciones</label>\n" +
    "                                </div>\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div>\n" +
    "                                        <div class=\"togglebutton\">\n" +
    "                                            <div ng-if=\"!vm.canEdit\">\n" +
    "                                                <label>\n" +
    "                                                    <input type=\"checkbox\" ng-model=\"formulario.hasConfirmation\" name=\"hasConfirmation\" checked=\"\"><span class=\"toggle\"></span> Debe Confirmar ?\n" +
    "                                                </label>\n" +
    "                                            </div>\n" +
    "                                            <div ng-if=\"vm.canEdit && !formulario.inactive\">\n" +
    "                                                <label>\n" +
    "                                                    <input type=\"checkbox\" ng-model=\"formulario.resetAccount\" name=\"resetAccount\" checked=\"\"><span class=\"toggle\"></span> Restablecer\n" +
    "                                                </label>\n" +
    "                                            </div>\n" +
    "                                            <div ng-if=\"formulario.inactive\">\n" +
    "                                                <label>\n" +
    "                                                    <input type=\"checkbox\" ng-model=\"formulario.enable\" name=\"enable\" checked=\"\"><span class=\"toggle\"></span> Activar\n" +
    "                                                </label>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div class=\"col-sm-3 col-md-3 col-sm-offset-1 col-md-offset-2\">\n" +
    "                                        <button class=\"btn btn-sm btn-primary\" ng-click=\"vm.save(form, formulario)\">\n" +
    "                                            <i class=\"icon-ok\"></i> Guardar\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-sm-6 col-md-6 col-sm-offset-1\">\n" +
    "                                        <button class=\"btn btn-sm\" ng-click=\"vm.cancel()\">\n" +
    "                                            <i class=\"icon-remove\"></i> Cancelar\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </form>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- PAGE CONTENT ENDS -->\n" +
    "        </div>\n" +
    "        <!-- /.col -->\n" +
    "    </div>\n" +
    "    <!-- /.row -->\n" +
    "</div>\n" +
    "<!-- /.page-content -->"
  );


  $templateCache.put('app/manage/users.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-lg-11 col-xs-12\">\n" +
    "        <div class=\"box\">\n" +
    "            <div class=\"box-header\">\n" +
    "                <h3 class=\"box-title\">Cuentas</h3>\n" +
    "            </div>\n" +
    "            <!-- /.box-header -->\n" +
    "\n" +
    "\n" +
    "            <div class=\"box-body no-padding\">\n" +
    "\n" +
    "                <div grid-toolbar source=\"vm.tableParams\" refresh=\"vm.refresh\">\n" +
    "                    <ul class=\"nav nav-pills pull-left\">\n" +
    "                        <li>\n" +
    "            <button class=\"btn btn-primary\" href=\"\" ng-click=\"vm.add()\">\n" +
    "                <strong>Agregar Usuario</strong>\n" +
    "                            </button>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "            <button class=\"btn btn-primary\" href=\"\" ng-click=\"vm.addMulti()\">\n" +
    "                <strong>Enrolar por CSV</strong>\n" +
    "            </button>                            \n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div ng-show=\"vm.users.length == 0\">\n" +
    "                    <h3>No hay usuarios</h3>\n" +
    "                </div>\n" +
    "                <table ng-table=\"vm.tableParams\" class=\"table table-responsive\" ng-show=\"vm.users.length > 0\">\n" +
    "                    <colgroup>\n" +
    "                        <col width=\"80px\" />\n" +
    "                        <col width=\"100px\" />\n" +
    "                        <col width=\"100px\" />\n" +
    "                        <col width=\"80px\" />\n" +
    "                        <col width=\"30px\" />\n" +
    "                        <col width=\"120px\" />\n" +
    "                        <col width=\"90px\" />\n" +
    "                    </colgroup>\n" +
    "                    <tr ng-repeat=\"item in $data\">\n" +
    "                        <td title=\"'Cuenta'\" filter=\"{ email: 'text'}\" sortable=\"'email'\">\n" +
    "                            {{ item.email }}</td>\n" +
    "                        <td title=\"'Nombre'\" filter=\"{ firstName: 'text'}\" sortable=\"'firstName'\">\n" +
    "                            {{ item.firstName }}</td>\n" +
    "                        <td title=\"'Apellido'\" filter=\"{ 'lastName': 'text'}\" sortable=\"'lastName'\">\n" +
    "                            {{ item.lastName }}</td>\n" +
    "                        <td title=\"'Grupo'\" filter=\"{ 'group': 'text'}\" sortable=\"'group'\">\n" +
    "                            {{ item.group }}</td>\n" +
    "                        <td title=\"'Estado'\"><span ng-class=\"{ label: true, 'label-danger': item.inactive }\">Inactivo</span></td>\n" +
    "                        <td title=\"'Creado'\" filter=\"{ created: 'text'}\" sortable=\"'created'\">\n" +
    "                            {{ item.created | date: 'dd/MM/yyyy hh:mm' }}</td>\n" +
    "                        <td>\n" +
    "                            <ul class=\"nav nav-pills pull-left\">\n" +
    "                                <li>\n" +
    "                                    <button class=\"btn btn-sm btn-default\" ng-click=\"vm.edit(item)\">\n" +
    "                                        <i class=\"fa fa-pencil-square-o\"></i>\n" +
    "                                    </button>\n" +
    "                                </li>\n" +
    "                                <li ng-show=\"item.deletable\">\n" +
    "                                    <button class=\"btn btn-sm btn-default\" ng-click=\"vm.delete(item)\">\n" +
    "                                        <i class=\"fa fa-remove\"></i>\n" +
    "                                    </button>\n" +
    "                            </ul>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>"
  );


  $templateCache.put('app/securityKeys/register.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-lg-11 col-xs-12\">\n" +
    "        <div class=\"box\">\n" +
    "            <div class=\"box-header\">\n" +
    "                <h3 class=\"box-title\">Llaves de seguridad</h3>\n" +
    "            </div>\n" +
    "            <!-- /.box-header -->\n" +
    "\n" +
    "\n" +
    "            <div class=\"box-body no-padding\">\n" +
    "\n" +
    "                <div grid-toolbar source=\"vm.tableParams\">\n" +
    "                    <ul class=\"nav nav-pills pull-left\">\n" +
    "\n" +
    "                        <li>\n" +
    "                            <button class=\"btn btn-primary\" href=\"\" ng-click=\"vm.startRegistration()\">\n" +
    "                                <strong>Enrolar dispositivo</strong>\n" +
    "                            </button>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <table ng-table=\"vm.tableParams\" class=\"table table-responsive\" ng-show=\"vm.items.length > 0\">\n" +
    "                    <tr ng-repeat=\"key in $data\">\n" +
    "                        <td title=\"'Llave'\" filter=\"{ publicKey: 'text'}\" sortable=\"'publicKey'\">\n" +
    "                            {{ key.publicKey.substring(0, 55) + '...' }}</td>\n" +
    "                        <td title=\"'Dominio'\" filter=\"{ appId: 'text'}\" sortable=\"'appId'\">\n" +
    "                            {{ key.appId }}</td>\n" +
    "                        <td>\n" +
    "                        <td title=\"'Creado'\" filter=\"{ created: 'text'}\" sortable=\"'created'\">\n" +
    "                            {{ key.created | date: 'dd/MM/yyyy hh:mm' }}</td>\n" +
    "                        <td>\n" +
    "                            <ul class=\"nav nav-pills pull-left\">\n" +
    "                                <li>\n" +
    "                                    <button class=\"btn btn-sm btn-default\" ng-click=\"vm.delete(key)\">\n" +
    "                                        <i class=\"fa fa-remove\"></i>\n" +
    "                                    </button>\n" +
    "                            </ul>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>"
  );


  $templateCache.put('app/system/activate.html',
    "<div class=\"page-content\">\n" +
    "<div class=\"row\">\n" +
    "        <div class=\"col-sm-12 col-md-12\">\n" +
    "            <form role=\"form\" name=\"form\" novalidate>\n" +
    "                <!-- PAGE CONTENT BEGINS -->\n" +
    "                <div class=\"page-header\">\n" +
    "                    <h1>Registro y activación\n" +
    "                </h1>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"col-sm-6 col-md-6\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Licencia</label>\n" +
    "                        <div class=\"row\">\n" +
    "                            <textarea required ng-model=\"formulario.license\" cols=\"50\" rows=\"15\" name=\"license\"></textarea>\n" +
    "                            <div class=\"has-error\" ng-if=\"form.$submitted || form.license.$dirty\" ng-messages=\"form.license.$error\">\n" +
    "                                <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div>\n" +
    "                                <button class=\"btn btn-sm btn-primary\" ng-click=\"vm.activate(form, formulario)\">\n" +
    "                                    <i class=\"icon-ok\"></i> Activar\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-6 col-md-6\">\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Configuración</label>\n" +
    "                        <div class=\"row\">\n" +
    "                            <textarea ng-model=\"formulario.actionConfig\" required cols=\"50\" rows=\"15\" name=\"actionConfig\"></textarea>\n" +
    "                            <div class=\"has-error\" ng-if=\"form.$submitted || form.actionConfig.$dirty\" ng-messages=\"form.actionConfig.$error\">\n" +
    "                                <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- PAGE CONTENT ENDS -->\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        <!-- /.col -->\n" +
    "    </div>\n" +
    "    <!-- /.row -->\n" +
    "</div>\n" +
    "\n" +
    "<!-- /.page-content -->"
  );


  $templateCache.put('app/user/profile.html',
    "<growl-notifications ng-if=\"vm.showInitLink\"></growl-notifications>\n" +
    "\n" +
    "<div ng-repeat=\"(id, notification) in notifications track by id\" ng-if=\"vm.showInitLink\">\n" +
    "    <growl-notification ttl=\"7000\"><div ng-class=\"{ 'callout callout-success': notification.isSuccess , 'callout callout-danger': notification.isError}\">{{ ::notification.message }}</div>\n" +
    "    </growl-notification>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\" ng-if=\"vm.showOtc\">\n" +
    "    <div class=\"col-sm-5 col-sm-offset-2\">\n" +
    "        <h2>Ingrese Código</h2>\n" +
    "        <div ng-class=\"{ alert:true, 'alert-danger':true }\" ng-if=\"vm.hasErrors\" role=\"alert\">{{ vm.errorLabel }}</div>\n" +
    "        <div ng-class=\"{ alert:true, 'alert-warning':true }\" ng-if=\"vm.otcRequestLabel\" role=\"alert\">{{ vm.otcRequestLabel }}</div>\n" +
    "        <form role=\"form\" name=\"form\" novalidate>\n" +
    "            <div class=\"form-group\">\n" +
    "                <!--        <label>Codigo</label>-->\n" +
    "                <input type=\"text\" ng-model=\"formulario.otp\" ng-minlength=\"6\" name=\"otp\" class=\"form-control input-sm\" required>\n" +
    "                <div class=\"has-error\" ng-if=\"form.$submitted || form.otp.$dirty\" ng-messages=\"form.otp.$error\">\n" +
    "                    <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                    <div class=\"help-block\" ng-message=\"minlength\">Campo debe contener al menos 6 caracteres.</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <button type=\"submit\" class=\"btn btn-primary btn-sm\" ng-click=\"vm.authenticate(form, formulario)\">Verificar</button>\n" +
    "            <div class=\"request-otc-link\">\n" +
    "                <p><a href=\"\" ng-click=\"vm.requestOtc()\">Reenviar código</a>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"page-content\" ng-if=\"!vm.showOtc\">\n" +
    "    \n" +
    "    <div class=\"row\" ng-if=\"vm.expired\">\n" +
    "        <div ng-class=\"{ alert:true, 'alert-danger':true }\" role=\"alert\">\n" +
    "            {{ vm.errorLabel }}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "                <div ng-class=\"{ alert:true, 'alert-danger':true }\" ng-if=\"vm.hasErrors\" role=\"alert\">{{ vm.errorLabel }}</div>\n" +
    "<div class=\"col-md-12 col-xs-12\" ng-if=\"vm.showInitLink\"><a href=\"/logout\">Ir a ingreso de sesión</a></div>\n" +
    "            <!-- l column -->\n" +
    "            <div class=\"col-md-6\">\n" +
    "              <!-- general form elements -->\n" +
    "              <div class=\"box box-primary\">\n" +
    "                <div class=\"box-header with-border\">\n" +
    "                  <h3 class=\"box-title\">Contraseña</h3>\n" +
    "                </div><!-- /.box-header -->\n" +
    "                <!-- form start -->\n" +
    "                <form role=\"form\" name=\"form\" novalidate>\n" +
    "                  <div class=\"box-body\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Cuenta</label>\n" +
    "                        <input type=\"text\" ng-model=\"formulario.account\" ng-readonly=\"true\" ng-minlength=\"8\" name=\"account\" class=\"form-control input-sm\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Contraseña</label>\n" +
    "                        <input type=\"password\" ng-model=\"formulario.password\" required ng-minlength=\"8\" name=\"password\" class=\"form-control input-sm\">\n" +
    "                        <div class=\"has-error\" ng-if=\"form.$submitted || form.password.$dirty\" ng-messages=\"form.password.$error\">\n" +
    "                            <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                            <div class=\"help-block\" ng-message=\"minlength\">Campo debe contener al menos 8 caracteres.</div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Confirmar Contraseña</label>\n" +
    "                        <input type=\"password\" class=\"form-control input-sm\" ng-model=\"formulario.passwordConfirmation\" required name=\"passwordConfirmation\" ng-minlength=\"8\" ng-change=\"vm.passwordMatch(form)\">\n" +
    "                        <div class=\"has-error\" ng-if=\"form.$submitted || form.passwordConfirmation.$dirty\" ng-messages=\"form.passwordConfirmation.$error\">\n" +
    "                            <div class=\"help-block\" ng-message=\"required\">Requerido.</div>\n" +
    "                            <div class=\"help-block\" ng-message=\"minlength\">Campo debe contener al menos 8 caracteres.</div>\n" +
    "                            <div class=\"help-block\" ng-message=\"nomatch\">Contraseña no ha podido ser confirmada.</div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                  </div><!-- /.box-body -->\n" +
    "\n" +
    "                  <div class=\"box-footer\">\n" +
    "                                <button class=\"btn btn-sm btn-primary\" ng-click=\"vm.resetPassword(form, formulario)\">\n" +
    "                                    <i class=\"icon-ok\"></i> Aplicar\n" +
    "                                </button>\n" +
    "                  </div>\n" +
    "                </form>\n" +
    "              </div><!-- /.box -->\n" +
    "\n" +
    "            </div><!--/.col (right) -->    \n" +
    "            <!-- r column -->\n" +
    "            <div class=\"col-md-6\">\n" +
    "              <!-- general form elements -->\n" +
    "              <div class=\"box box-primary\">\n" +
    "                <div class=\"box-header with-border\">\n" +
    "                  <h3 class=\"box-title\">OTP</h3>\n" +
    "                </div><!-- /.box-header -->\n" +
    "                <!-- form start -->\n" +
    "                <form role=\"form\">\n" +
    "                  <div class=\"box-body\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"qr\"></div>\n" +
    "                        <div class=\"qrVisibleCode\">{{ visibleCode }}</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                      <label>\n" +
    "                        <input type=\"checkbox\" ng-model=\"formulario.preferSoftToken\" name=\"preferSoftToken\" checked=\"\"><span class=\"toggle\"></span> Preferir soft token\n" +
    "                      </label>\n" +
    "                    </div>\n" +
    "                  </div><!-- /.box-body -->\n" +
    "\n" +
    "                  <div class=\"box-footer\">\n" +
    "                                                <button class=\"btn btn-sm btn-primary\" ng-click=\"vm.resetOTC(form, formulario)\">\n" +
    "                                <i class=\"icon-ok\"></i> Provisionar QR\n" +
    "                            </button>\n" +
    "                  </div>\n" +
    "                </form>\n" +
    "              </div><!-- /.box -->\n" +
    "\n" +
    "\n" +
    "            </div><!--/.col (left) -->\n" +
    "\n" +
    "          </div>\n" +
    "</div>\n" +
    "<!-- /.page-content -->"
  );

}]);

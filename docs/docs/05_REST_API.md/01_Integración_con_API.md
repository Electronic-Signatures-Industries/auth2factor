## Integración con API REST y SDK

Auth2factor incluye una interfaz de aplicativo (API) y kit de desarrollo (SDK) disponible para desarrolladores e integradores.

### REST

El API REST es la interfaz directa para implementar integraciones. Auth2factor consiste de varios conjuntos de APIs:

* **management**: Interfaces que se encargan del funcionamiento de procesos de administración.
* **profile**: Interfaces relacionadas con el restablecimiento de credenciales.
* **users**: Interfaces para autenticación y otros.

### Autenticación

Al autenticarse a `POST /api/v2/users/authenticate` se obtiene un header **X-APP-SIGN-REQUEST**, el cual permite el siguiente paso de validación OTC.

**`POST /api/v2/users/authenticate`**

##### Payload

* email: cuenta de email
* password: contrasena
* doRequestOtc: true si quiere recibir OTC inmediato, de otro modo no es enviado (para los transportes de mensajes)

##### Response Header

* X-APP-SIGN-REQUEST

### Verificación Doble Factor

Para `POST /api/v2/users/otc`, se adjunta el header **Authorization: Bearer [token]**, donde token representa el valor de **X-APP-SIGN-REQUEST**. De este llamado se obtiene el HTTP header **X-APP-BEARER**, este es válido por 24 horas en su configuración predeterminada.

**`POST /api/v1/users/otc`**

##### Payload

* code: respuesta doble factor (OTC)

##### Response Header

* X-APP-BEARER con expiración de 24 horas

Para acceder al resto de los APIs, es necesario adjuntar el token de **X-APP-BEARER** o un token pre generado (API Token) en **Authorization: Bearer [token]**.

> **Nota**: Para acceder APIs administrativos se requiere ser administrador.

### Delegación

En casos donde sea requerido usar sistemas internos de roles, el API de delegate permite delegar la autenticación del primer factor.

Para usar la delegación, debe tener enlazado el server de Auth2factor con un **API Token**. La autenticación a `POST /api/v2/users/delegate`  genera un token de 5 minutos donde se obtiene un header **X-APP-SIGN-REQUEST**, el cual permite el siguiente paso de validación OTC.

**`POST /api/v2/users/delegate`**

##### Payload

* account: cuenta de email

##### Response Header

* X-APP-SIGN-REQUEST con expiración de 5 minutos

> **Nota**: Se recomienda usar este API en escenarios server a server.

#### Otros headers

* **X-APP-RESET-RETRIES**: Cantidad de reintentos de OTC. El sistema permite hasta 4 reintentos antes de solicitar iniciar la sesión.
* **X-APP-ACCOUNT-GROUP**: Nombre del grupo o rol. Permite al integrador mayor control de autorización en sus aplicaciones.


## Consola de Administración

### Configuración de transportes 

#### Correo electrónico - Sendgrid

1. Ir a Configuración.
2. Clic en **Crear transporte**.
3. Seleccionar **Correo - Sendgrid**.
3. Ingrese los siguientes campos:
    * **Llave**: Llave única.
    * **Descripción**: Descripción del transporte configurado.
    * **Usuario**: Nombre del usuario de la cuenta.
    * **Llave de API**: Llave de la cuenta de SendGrid.

#### Correo electrónico - SMTP

1. Ir a Configuración.
2. Clic en **Crear transporte**.
3. Seleccionar **Correo - SMTP**.

##### Outlook.com
        
1. Configure los siguientes campos:
    * **Llave**: Llave única.
    * **Descripción**: Descripción del transporte configurado.
    * **Host**: smtp-mail.outlook.com.
    * **Puerto**: 587.
    * **Usuario**: La cuenta de outlook.com a utilizar.
    * **Password**: Contraseña.
    * **SSL**: No.
    * **TLS**: Si.

##### Google Apps / GMail

1. Configure los siguientes campos:
    * **Llave**: Llave única.
    * **Descripción**: Descripción del transporte configurado.
    * **Host**: smtp.gmail.com.
    * **Puerto**: 465.
    * **Usuario**: La cuenta a utilizar.
    * **Password**: Contraseña.
    * **SSL**: Si.
    * **TLS**: No.
    
##### SMTP

1. Configure los siguientes campos:
    * **Llave**: Llave única.
    * **Descripción**: Descripción del transporte configurado.
    * **Host**: Nombre de dominio.
    * **Puerto**: Puerto.
    * **Usuario**: La cuenta a utilizar.
    * **Password**: Contraseña.
    * **SSL**: Transporte seguro por capa de seguridad SSL.
    * **TLS**: Transporte seguro por capa de seguridad TLS.    
    
<div class="thumbnail">
<img src="../img/screenshots/smtp.png"  style="display: block; width: 50%">
</div>

#### SMS

1. Ir a Configuración.
2. Clic en **Crear transporte**.
3. Seleccionar **SMS - Twilio**.
4. Ingrese los siguientes campos:
    * **Llave**: Llave única.
    * **Descripción**: Descripción del transporte configurado.
    * **Número de Twilio**: Número telefónico de Twilio.
    * **SID**: Sender ID de la cuenta.
    * **Token**: Token id de la cuenta de Twilio.

#### Soft token - Móvil

1. Ir a Configuración.
2. Clic en **Crear transporte**.
3. Seleccionar **Google Authenticator**.

El cliente utiliza [Google Authenticator app](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en)


#### Soft token - Escritorio

1. Ir a Configuración.
2. Clic en **Crear transporte**.
3. Seleccionar **Google Authenticator**.

El cliente utiliza [Authenticator Chrome plugin](https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai?hl=en)


### Asociando Grupos y Usuarios

#### Grupos

##### Crear grupo

1. Ir a Grupos.
2. Clic en **Crear grupo**.
3. Ingrese nombre del grupo.
4. Ingrese descripción.
5. Seleccione transporte.
6. Seleccione adaptador.
7. Clic en guardar.

##### Editar grupo

1. Ir a Grupos.
2. Clic en un grupo de la lista.
3. Edite descripción.
5. Seleccione transporte.
6. Seleccione adaptador.
7. Clic en guardar.

#### Cuentas de Usuario

##### Enrolamiento

1. Ir a Cuentas.
2. Clic en **Crear Cuenta**.
3. Ingrese Correo Electrónico.
4. Ingrese Celular.
5. Ingrese Nombre.
6. Ingrese Apellido.
7. Seleccione el Grupo.
8. Seleccione en Opciones **Debe Confirmar**.
9. Clic en Guardar.

##### Desactivar

1. Ir a Cuentas.
2. Clic en boton de desactivar.
3. Clic en el boton **Si** del mensaje.

##### Activar

1. Ir a Cuentas.
2. Clic boton de editar.
3. Seleccione en Opciones **Activar**.

##### Restablecer

1. Ir a Cuentas.
2. Clic en boton de editar.
3. Seleccione en Opciones **Restablecer**.

##### Multiples cuentas

1. Ir a Cuentas.
2. Clic en **Enrolar por CSV**.
3. Seleccione el Grupo.
4. Ingrese el texto del CSV.
5. Click en Guardar.


### Bitácoras

Bitácoras contiene una lista de eventos del sistema. Cada entrada contiene:

* **Tipo**: Puede ser info o error.
* **Descripción**: Descripción de la entrada.
* **Usuario**: Usuario que genero la entrada.
* **IP**: IP.
* **Llamado**: Tipo de llamado HTTP.
* **Ruta**: Ruta API.
* **Creado**: Fecha y Hora.

<div class="thumbnail">
<img src="../img/screenshots/09 logs.png"  style="display: block; width: 80%">
</div>

### Configuraciones

#### Variables del sistema

1. Ir a Configuración.
2. Clic en llave **default:system:env**.
3. Edite los siguientes campos:
    * **Descripción**: Descripción.
    * **Timeout de confirmación**: Expiración del enlace de confirmación en segundos.
    * **Transporte de correo predeterminado**: Transporte de correo del sistema.
    * **Transporte de restablecimiento predeterminado**: Transporte para recibir OTC de restablecimiento, solo aplica para transportes SMS o correo electrónico.

<div class="thumbnail">
<img src="../img/screenshots/system varss.png"  style="display: block; width: 50%">
</div>



#### Licencia

1. Ir a Configuración.
2. Clic en llave **license**.
3. Edite descripción.
4. Ingrese licencia en Licencia y clic guardar.
5. Su sistema se actualizara con la nueva licencia.

<div class="thumbnail">
<img src="../img/screenshots/license.png"  style="display: block; width: 50%">
</div>



#### Llaves de API

1. Ir a Integraciones.
2. Clic en **Crear API token**.
3. Ingrese Descripción
4. Ingrese IP. Use 0.0.0.0 para habilitar cualquier IP.
5. Clic en guardar.
6. Utilice el token como Bearer con el API. Recomendamos su uso en ambientes server a server.

<div class="thumbnail">
<img src="../img/screenshots/api key.png"  style="display: block; width: 50%">
</div>



### Perfil de Cuenta

Perfil de cuenta permite establecer el soft token por medio de QR y la contraseña. Aplica por igual para el enrolamiento y restablecimiento de cuenta.

##### Contraseña


1. Ir a Perfil de Cuenta.
2. Click Continuar a Contraseña.
3. Ingrese Contraseña.
4. Ingrese Confirmar Contraseña.
5. Click Aplicar.
6. Ingrese el código.
7. Clic en Verificar.

#### OTP

1. Ir a Perfil de Cuenta.
2. Leer TOTP QR con app de token (Google Authenticator o aplicación de escritorio) o ingresar semilla manualmente.
3. Clic en Provisionar QR.
4. Ingrese el código.
5. Clic en Verificar.

<div class="thumbnail">
<img src="../img/screenshots/12 perfil - reset - enroll creds.png"  style="display: block; width: 80%">
</div>

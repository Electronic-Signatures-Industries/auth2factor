
### Autenticación

La autenticación requiere dos pasos o factores. El primer factor es una cuenta de usuario y contraseña y el segundo un código de un solo uso. Este segundo factor a su vez, puede ser generado por un soft token o enviando por medio de un transporte.

<div class="thumbnail">
<img src="../img/screenshots/01 login.png"  style="display: block; width: 70%">
</div>

El primer paso, el sistema retorna un HTTP header **X-APP-SIGN-REQUEST** o **X-U2F-SIGN-REQUEST**, el cual es de uso exclusivo para solicitar el segundo factor. Ya validado en el segundo paso, se obtiene el HTTP header **X-APP-BEARER**, este es válido por 24 horas en su configuración predeterminada. Este header puede ser usado para integraciones API a nivel de server o cliente.

#### Autenticación predeterminada (Sistema)

La autenticación predeterminada válida ambos factores con la base de datos del sistema.

### Enrolamiento

El enrolamiento es generado desde la consola de administración, como también puede ser integrado por medio de API para auto enrolamiento. En todos los casos, el usuario recibe un correo con un enlace seguro con caducidad de 30 minutos, en el cual puede establecer su contraseña y soft token.

<div class="thumbnail">
<img src="../img/screenshots/enrolar.png"  style="display: block; width: 50%">
</div>


## Introducción

### Que es auth2factor

Auth2factor es una solución de doble factor de autenticación OTP y U2F, la cual utiliza códigos de un solo uso (OTC: One Time Code) basados en el estándar RFC 6238 TOTP y de este modo compatibles con soft tokens como Google Authenticator y Microsoft Authenticator. Adicionalmente es compatible con llaves de seguridad U2F.

<div class="thumbnail">
<img src="../img/screenshots/01 login.png"  style="display: block; width: 70%">
</div>

### Requisitos de instalación

* Ubuntu Server 14.04 LTS (dedicado).
* 2 GB RAM.
* 1 CPU.
* 30 GB HDD.

### Sobre TOTP

La configuración predeterminada del TOTP es de 3 ventanas (windows), en vez de 6, lo cual evita reúso del OTC después de dichas ventanas.
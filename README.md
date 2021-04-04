
# auth2factor

Auth2factor es una solución de doble factor de autenticación OTP y U2F, la cual utiliza códigos de un solo uso (OTC: One Time Code) basados en el estándar RFC 6238 TOTP y de este modo compatibles con soft tokens como Google Authenticator y Microsoft Authenticator. Adicionalmente es compatible con llaves de seguridad U2F.

<div class="thumbnail">
<img src="./a2f-docs/img/screenshots/01 login.png"  style="display: block; width: 70%">
</div>

### Requisitos de instalación

* Ubuntu Server 14.04 LTS (dedicado).
* 2 GB RAM.
* 1 CPU.
* 30 GB HDD.

### Sobre TOTP

La configuración predeterminada del TOTP es de 3 ventanas (windows), en vez de 6, lo cual evita reúso del OTC después de dichas ventanas.
#### Activation

1. Add sample_action_config.json and sample_license.json in http://localhost/activation#/activate 

#### API Docs

[API DOCS](./a2f-docs/docs/_index.md)

#### License
* PEM `openssl genrsa -out mykey.pem 1024`
* Pub `openssl rsa -in mykey.pem -pubout > mykey.pub`

#### Mongoose Encryption Key

* Use  `openssl rand -base64 64`
* Add as environment variable `export MONGOOSE_SECRET=`
* Or use `export MONGOOSE_SECRET=scgY8qL7auf26/2Kudat3ZIbmxJJ4UJjZyABF9+j0Ni1vJi11Mpnc3z4MD2TwgNd9EqJLiA2ReunyH8jbcM1+w==;grunt serve`

#### Env vars ui
` export JWT_SECRET_SESSION=TlfIxap9Zu5J53t9Zor5BVJAW1jA1c24_SID FE_HOSTNAME=https://localhost;npm start`

#### Env vars service
` export JWT_SECRET=TlfIxap9Zu5J53t9Zor5BVJAW1jA1c24 FE_HOSTNAME=https://localhost MONGODB_CONFIG=mongodb://localhost/auth2factor MONGOOSE_SECRET=scgY8qL7auf26/2Kudat3ZIbmxJJ4UJjZyABF9+j0Ni1vJi11Mpnc3z4MD2TwgNd9EqJLiA2ReunyH8jbcM1+w== ;grunt serve`


### Installing ###
1. Clone repo
2. Rename text containing `rutha` to `your_app_name`
3. `npm install`
4. `bower install`
5. (Optional) `npm install grunt-cli -g`

`export JWT_SECRET=5J53t9Zor5BVJAW1jA1c24 FE_HOSTNAME=https://localhost MONGODB_CONFIG=mongodb://localhost/auth2factor MONGOOSE_SECRET=bla0123456789;npm test`
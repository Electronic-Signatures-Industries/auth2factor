## Flujos

### Activación de plataforma

Al iniciar la configuración de la solución, el primer paso es la activación. Aquí es donde se configura la licencia (puede ser de prueba o final) y la configuración de activación, que contiene los datos predeterminados para utilización de la plataforma.

<div class="thumbnail">
<img src="../img/screenshots/register license.png"  style="display: block; width: 70%">
</div>

> **Nota**: Es importante ingresar la licencia y la activación en formato JSON.

Para activar, navegue a **http://server/register#/activate** y copie la licencia y activación.

#### Licencia
La licencia contiene la siguiente estructura:

* **Licensed To**: El nombre de la persona, departamento u organización.
* **Company**: El nombre de la empresa.
* **Number of Users Licensed**: La cantidad de usuarios asignados a la licencia.
* **Key**: Licencia.

#### Configuración de activación
La configuración de activación consiste de tipo de activación, cuenta administrativa y configuraciones del sistema.

* **type**: Por el momento solo existe **activation**.
* **admin**: Los campos para enrolar el administrador:
    * **email**: Correo.
    * **cellphone**: Celular.
    * **password**: Contraseña.
* **configs**: Tres configuraciones son requeridas para iniciar la plataforma.

##### Transporte de Correo
El transporte de correo utilizamos Sendgrid. Aquí se configura:

* **user**: Cuenta de usuario.
* **apiKey**: apiKey es igual a la contraseña de la cuenta.

```javascript
    {
        "entity": "transport",
        "key": "DEMO:sendgrid",
        "description": "Cuenta de Sendgrid",
        "entityId": "email:sendgrid",
        "settings": {
            "user": "some_user",
            "apiKey": "xyz"
        }
    }
```

##### Variables de sistema

* **emailTransport**: Transporte de correo del sistema.
* **resetConfirmCodeTransport**: Transporte para recibir OTC de restablecimiento, solo aplica para transportes SMS o correo electrónico.
* **confirmationTokenTimeout**: Expiración del enlace de confirmación en segundos.

```javascript
    {
        "key": "default:system:env",
        "description": "default system vars",            
        "settings": {
            "emailTransport": "DEMO:sendgrid",
            "resetConfirmCodeTransport": "DEMO:sendgrid",
            "confirmationTokenTimeout": 1800
        }        
    }
```

##### Adaptador predeterminado

```javascript
    {
        "entity": "adapter",
        "key": "db:adapter",
        "description": "Sistema",
        "entityId": "default",
        "deletable": "false"
    }
```

##### Configuración de ejemplo

```javascript
{
    "type":"activation",
    "admin": {
        "email": "gmail@gmail.com",
        "cellphone": "12345",
        "password":"              "
    },
    "configs":[
        {
            "entity": "transport",
            "key": "DEMO:sendgrid",
            "description": "Cuenta de Sendgrid",
            "entityId": "email:sendgrid",
            "settings": {
                "user": "xyz",
                "apiKey": "xyz"
            }
        },
        {
            "entity": "adapter",
            "key": "db:adapter",
            "description": "Sistema",
            "entityId": "default",
            "deletable": "false"
        },
        {
            "key": "default:system:env",
            "description": "default system vars",            
            "settings": {
                "emailTransport": "DEMO:sendgrid",
                "resetConfirmCodeTransport": "DEMO:sendgrid",
                "confirmationTokenTimeout": 1800
            }        
        }        
    ]
}
```

# 2.9.0

* Bumps service to hapi 16.6
* Bumps ui to hapi 16.6
* Updates docker build to node 6.11.4
* Removes mail template compiler and message sender shared dependency plugin
* Removes jwt tokenizer and license  engine shared dependency plugin

# 2.7.1 - 2.8.0

* adds OAuth2 client credentials 

# 2.7.0

* Mgmt permissions

# 2.6.1

* Service: Migrated email images to http://assets.auth2factor.com (Azure)
* UI and API Dockerfile are based off Shared image
* Refactored to support Docker networking
* Logging refactoring for Docker support
* Bumped to angular 1.6.0

# 2.6.0

* Webpack build
* Added version in login footer
* Dockerized UI, Service and Shared
* Stronger cookie security
* Native mongodb support
* Bumped mongoose
* Added mongoose.models fallback
* Using node 6.9.0 LTS

# 2.5.4

* Support for U2F 1.1 client API for BLE support
* autocomplete="off" in otc, login and reset
* Do not send 404 if not found in reset
* Bumped to angular 1.5.0 and jQuery 2.2.4
* Fixing U2F dialog

# 2.5.3

* Fix: Missing growler in reset page
* Mejoras UI
* Bump de mongoose
* favico
* Service bumped to hapi 14.0.0
* UI bumped to hapi 14.0.0
* Upgraded Handlebars to 4.0.x


# 2.5.2

* Validates when no Bearer token is set.
* Removes self service activation and Push APIs.
* Upgraded Handlebars to 4.0.x

# 2.5.1

* Missing API in when starting flow with integration API in Bearer token.

## 2.5.0

API authentication requires HMAC

Hash format

```javascript
{
         accountRequester: 'API account',
         email: 'API account (legacy)',
         apiUniqueId: 'API Key',
         created: 'Date'       
}
```

Bearer format

`Bearer <API Key>:<HMAC>`
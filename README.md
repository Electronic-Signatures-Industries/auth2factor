# auth2factor

### Features ###

#### Activation

1. Add sample_action_config.json and sample_license.json in http://localhost/activation#/activate 

#### API Docs

[API DOCS](http://localhost:3002/api_docs)

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
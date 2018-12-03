


#Instalar versión actual de node.
nvm install stable

#Para cambiar la version del node. 
nvm use v11.0

#Ejecutar la aplicación haciendo referencia al localhost 
polymer serve --hostname 0.0.0.0 

#FIREBASE DEPLOY
#Loguearse a firebase
firebase login --no-localhost

#Crea firebase.json
firebase init

#Compilación
polymer build

#Desplegar
firebase deploy



    {
      "name": "esm-bundled",
      "browserCapabilities": [
        "es2015",
        "modules"
      ],
      "js": {
        "minify": true
      },
      "css": {
        "minify": true
      },
      "html": {
        "minify": true
      },
      "bundle": true,
      "addServiceWorker": true
    },
    {
      "name": "es6-bundled",
      "browserCapabilities": [
        "es2015"
      ],
      "js": {
        "minify": true,
        "transformModulesToAmd": true
      },
      "css": {
        "minify": true
      },
      "html": {
        "minify": true
      },
      "bundle": true,
      "addServiceWorker": true
    },
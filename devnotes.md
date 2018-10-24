


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




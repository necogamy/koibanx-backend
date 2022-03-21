# **Koibanx Challenge Backend REST API**
## *Documentación en Español*
### Autor: [Nicolás López](https://github.com/necogamy)

## **Instrucciones**
* Aclaración: La base de datos está conectada con MongoDB Atlas, por lo que no hace falta tocar nada para usar esta api. Pero se puede cambiar sin problemas la conexión.
*
+ **Importante:** copiar los valores para el archivo .env, lo que permite la conexión a la base datos, en caso de usar mi método, (MongoDB Atlas). (Lo voy a dejar al final)
+ npm install
+ npm start
+ Los endpoints son los detallados en el documento, al igual que las credenciales para BasicAuth.
+ Credenciales Basic Auth:
        
        user/username: test@koibanx.com
        pass/password: test123
+ Endpoint: POST | GET | DELETE: /api/stores
+ Endpoint: DELETE | PUT: /api/stores/:id

*
* Para probar los tests: *npm test*
* Para iniciar como desarrollo: *npm run dev:start*

## **Aclaraciones/Consideraciones**
* Si bien traté de respetar la estructura con la que me encontré, cambié cosas para poder concretar la tarea sin problemas por mi cuenta.
* A pesar de lo anterior, seguí el documento que se me brindó al pie de la letra. Por lo que, se cumplen todos los requisitos.
+ Cambié la forma de conectar la base de datos, usando MongoDB Atlas.
+ Tanto los tests como la API en sí están testeados en localhost.

## **Archivo .env**
DATABASE_USERNAME=koibanx   
DATABASE_PASSWORD=tygRD4qQZbrwcVt3   
DATABASE_DBNAME=stores-api   
DATABASE_CLUSTERURL=cluster0.q92db.mongodb.net
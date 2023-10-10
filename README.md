<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Descripcion de instalar base de datos docker

```bash
$ Instalar docker deskop
```

```bash
# development
$ Crear un archivo docker-compose.yaml

version: '3.8'

services:
  db:
    image: mysql
    restart: always
    container_name: cajeros
    volumes:
      - ./mySQL:/data/db
      - ./batm.sql:/docker-entrypoint-initdb.d/batm.sql
    environment:
      - MYSQL_ROOT_PASSWORD=alejo
      - MYSQL_DATABASE=consolidado_cajeros
    ports:
      - 3307:3306
```

# Descripcion de los campos
```bash
$ image: define la imagen a utilizar en el contenedor
$ restart: se ejecuta cada vez que inicia docker-compose
$ container_name: define el nombre del contenedor
$ - ./mySQL:/data/db: Define donde se va a guardar la base de datos, en este caso crea una carpeta mySQL y lo guarda ahi
$ - ./batm.sql:/docker-entrypoint-initdb.d/batm.sql: copia el archivo de base de datos que esta en la raiz y lo envia al docker-compose
$ environment: define las variables de entorno
$ - MYSQL_ROOT_PASSWORD=alejo: define la contraseña de root
$ - MYSQL_DATABASE=consolidado_cajeros: define el nombre de la base de datos
$ ports: define los puertos que se van a exponer, en este caso nos conectamos a traves del puerto 3307

```

### Ejecutar el contenedor
```bash
$ docker-compose up -d
```

# Conectarlo desde un cliente de base de datos
```bash
# Conectar desde table plus
$ name: nombre que queramos
$ tag: local
$ host: localhost
$ port: 3307
$ user: root
$ password: alejo
$ database: consolidado_cajeros
$ Dar click en el boton test para comprobar la conexion
```
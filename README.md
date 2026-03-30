# TFG Gamificación en Plataformas de Aprendizaje

Este es el repositorio para el **TFG sobre Gamificación en Plataformas de Aprendizaje**, creado por José María Gómez Pulido y dirigido por Antonio Calvo Morata y Pablo Gutiérrez Sánchez.\
A continuación haré una pequeña explicación sobre las configuraciones necesarias para poder utilizar este proyecto.

## 1. Creación del servidor de moodle

Para el funcionamiento de este proyecto es necesario disponer de un servidor de Moodle que poder configurar libremente como administrador, para así poder configurar la herramienta. En la siguiente carpeta de Drive pueden encontrar un archivo comprimido que contiene una máquina virtual en formato .ovf, en esa misma carpeta he dejado un instalador de VMware Workstation, que es el software que estoy usando yo para correrla, puede haber errores si se inicia la máquina virtual con otro software.\
Esta máquina virtual ya viene configurada con un servidor de moodle que tiene 3 usuarios y 2 cursos en los que hacer pruebas, además de la herramienta ya configurada.\
Para poder iniciar la máquina, se ha de utilizar el usuario "tfg" y la contraseña "123ubuntu". Una vez iniciada, se podrá acceder al moodle por [https://192.168.0.17]() (Si reconfiguran la ip de la máquina virtual por su cuenta, pueden cambiarla conscuentemente en la variable MOODLE_IP del archivo .env del backend, más detalle en la siguiente sección).\
El usuario y contraseña del administrador para moodle son "admin" y "Admin_123".

## 2. Configuracón de la aplicación (Backend y frontend)

Para correr la aplicación, necesitarán disponer de la versión **24.11.1** de node.js. Deberán de correr el comando "npm install" tanto en la raíz de esta carpeta, como en la subcarpeta client.\
Además de esto, en la siguiente carpeta de [Drive](https://drive.google.com/drive/folders/1ZBXzlbEG_OrkuqUfpVErHzPjhKBNPztr?usp=sharing) están disponibles tanto certificados para poder correr los servidores en https, como archivos con variables de entorno de node tanto para el backend como para el cliente.\
Una vez hechos estos dos pasos, corriendo tanto en la raíz como en la carpeta del cliente el comando "npm run dev" podrán probar la herramienta. Dependiendo del navegador, es posible que tengan que abrir la página del frontend en una pestaña a parte del Moodle, ya que los certificados https son autofirmados y algunos navegadores necesitan que se le otorgue permiso a la ip para abrirse. El backend está alojado en [https://localhost:3443](), y el frontend, en [https://localhost:4443]() por defecto, aunque esto es configurable en los archivos .env en el backend, y vite.config.js en el cliente.
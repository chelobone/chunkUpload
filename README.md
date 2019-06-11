# ChunkUpload
Proyecto en .NET que permite cargar archivos en chunk's

### Descripción

Este proyecto fue concebido dada una problematica recurrente: El ancho de banda no permite manejar documentos muy pesados. Tratando de emular lo que hace el chunkUpload de SharePoint, y para no tener los típicos problemas de "timeout", se desarrollo esta funcionalidad de carga de documentos en chunk's

### ¿Cómo funciona?

El proyecto está dividido en 2 partes: un servicio web (asmx) y la presentación (aspx, js). Se desarrollaron 3 métodos para la carga, y están detallados en el código fuente:

- BeginUploadFile
- UploadChunk
- EndUploadFile

Estos métodos interactuan con la presentación, que fue desarrollada con jQuery.

Esta parte usa [Promises](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Promise) para manejar (cuando se envían y de que tamaño deben ser) los paquetes de datos que van al servidor 

El archivo principal es el siguiente

- chunk.js

Este archivo se encarga de interactuar con el servicio y sus métodos, manejando las llamadas mediante Promises, así cuando termina de enviar la data al servidor, se prepara para enviar el siguiente y así hasta finalizar.

### Prerequisitos

Este proyecto, para efectos de la DEMO, utilizó algunos controls de jQWidgets [chelobone](https://www.jqwidgets.com/)

Los controles utilizados fueron:

```
jqxcore.js
jqxprogressbar.js
jqxwindow.js
jqx.summer.css
jqx.base.css
```

Además, se utilizó la librería de jQuery

```
jquery-3.3.1.min.js
```

## Autores

* **Marcelo Friz** - *Trabajo inicial* - [chelobone](https://github.com/chelobone)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

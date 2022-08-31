# Trabajo Práctico Final Backend (Melisa Puig)

Este trabajo corresponde al TP final del curso de Backend de Coder House de Melisa Puig.

## Uso

### Correr el aplicativo

Se debe configurar el archivo .env (se dejaron las variables de ejemplo para poder levantarlo).
Y utilizar

```bash
npm run dev
```

Correrá en el puerto especificado.
Respecto de tener configuración de producción y de testeo, esto se cumple modificando el archivo .env (y esto, entiendo, es responsabilidad de donde corra. El archivo .env del servidor final debería ser distinto del de entorno local).

Si transcurre mucho tiempo, puede ocurrir un error "autentication error". El mismo suele ser a causa de Ethereal email. Cada cierto tiempo elimina las cuentas creadas, de modo que debería crearse otra.

### Postman

El repositorio cuenta con una colección de postman para poder interactuar con la API REST. La misma pedirá en autenticación un header authorization con un JWT. Es posible obtener el token de la sesión en el frontend.

Para obtenerlo:

1. Registrar el propio usuario (o loguearse).
1. Abrir la consola
1. Aparecerá en consola el token del usuario actualizado ("Bearer aaaa.bbbb.cccc")
1. Copiar el mismo en las opciones de Auth de Postman de la colección.

Todas las APIs funcionan. El aplicativo nunca fue cargado accediendo directamente a la base de datos, sino que a través de su propia API REST.

### Frontend

El frontend fue realizado con handlebars, al estilo SSR. Aunque la consulta a los productos la realiza por AJAX:

El frontend cuenta con un menú con todas las opciones requeridas en la consigna (productos | carrito | chat | configuración ). Al presionar click en un producto se generará la vista específica para ese producto.

## Aclaraciones generales

- En muchas partes la consigna pareciera requerir un frontend. Se respetaron las URLS para el frontend, pero no para la API REST. La API REST se ubica siempre detrás de "/api".

- El trabajo fue realizado en Typescript porque me pareció más fácil de desarrollar sin cometer errores (protege mucho frente a errores de tipeo o mal manejo de propiedades).

- Donde hubo conflicto (como, por ejemplo, realizar renderizador en pug y en handlebars a la vez), se priorizó lo que apareciera en requisitos a evaluar.

- No se diferenció la URL para websocket para obtener los mails porque la consigna no es clara. ¿Un usuario debería poder ver los mails de los demás? Cada usuario solo ve sus chats.

- No se aplicó la vista al frontend /productos/:categoria porque entra en conflicto con /productos/:id . Se priorizó la segunda (porque tenía más sentido). Para poder aplicar el filtrado por categoría, se agregó un dropdown en el frontend con las categorías disponibles.

- Socket.io no se aplicó con typescript porque la librería socket.io tiene un error de typescript ajeno a mí ("node_modules/socket.io/dist/namespace.d.ts(15,42): error TS2344: Type 'ListenEvents' does not satisfy the constraint 'EventsMap'.").

- Cada usuario únicamente tiene un carrito (para evitar complejizar la aplicación).

- Se agregó el stock check en la lógica de la aplicaicón (no se generará la orden si no alcanza el stock disponible).

- Se pueden ver las órdenes generadas por el usuario en la API REST en /api/orders.

- El stock se puede editar a través del PUT de la API REST.

## Posibilidades de mejora.

- Se podría comprimir para ocupar menos ancho de banda utilizando normalizr entre el servidor y el cliente. No fue realizado para mantener la simplicidad del código, siendo que no apareció entre los requisitos a evaluar.

- El frontend es muy mejorable (se podría utilizar alguna librería como React, además de mejorar los estilos, no usar alertas, etc.). Se priorizó trabajar en la lógica del backend porque es lo que sería evaluado.

- Se podría perfeccionar el uso de logs a través de una librería como winston, para homogeneizar los logs.

- Agregar cuestiones de seguridad informática: como un captcha para registrar o loguear al usuario, o controlar mejor las sesiones del websocket (por ejemplo, obteniendo el usuario a partir del token).

- Se podrían mejorar los mails enviados al administrador. Los mails hechos son de ejemplo, para demotrar que se puede realizar el envío con HTML. La estética de los mails corresponde más a frontend.

- Se podrían agregar tests unitarios o end to end. No se agregaron porque requerían mucho tiempo y no estaban solicitados en los criterios a evaluar.

# Wicklow · Código fuente editable

Esta copia contiene la versión refinada del menú digital, el perrito cartoon actualizado y las mejoras visuales del listado.

## Abrir

Descomprime el ZIP completo. Abre la carpeta Wicklow en VS Code y usa Live Server sobre dist/index.html.
También puedes ejecutar desde la carpeta Wicklow:

    python -m http.server 8080 --directory dist

Abre http://localhost:8080. No necesitas instalar paquetes de npm.
Puedes abrir dist/index.html directamente, pero un servidor local es preferible para que la selección se conserve de forma consistente entre páginas.

## Archivos que puedes editar

- dist/index.html: bienvenida y perrito.
- dist/menu.html: selección de categorías.
- dist/comida.html y dist/compartir.html: comida y entradas.
- dist/cervezas.html, whisky.html, cocteles.html, destilados.html, aperitivos.html y sinalcohol.html: categorías de bebidas.
- dist/recomienda.html: recomendaciones de Bonifacio.
- dist/buscar.html: búsqueda general.
- dist/style.css: estilos base.
- dist/refinement.css: diseño actualizado, fuentes, logos y animaciones; se carga después de style.css y tiene prioridad en reglas equivalentes.
- dist/app.js: búsqueda, filtros, microinteracciones y animaciones progresivas.
- dist/assets/: imágenes, logos y fuentes locales.
- catalog.json: catálogo original editable, con nombres, descripciones y precios.
- build.cjs: plantillas y generador de todos los HTML y de dist/catalog.js.
- validate.cjs: comprobaciones del catálogo, referencias y selección.

## Cómo modificar el catálogo o las plantillas

Necesitas Node.js para regenerar, pero no para abrir el sitio.
Desde la carpeta Wicklow ejecuta:

    node build.cjs

Esto sobrescribe los HTML de dist y dist/catalog.js. Si cambias textos, estructura, enlaces o logos directamente en un HTML, pasa también el cambio a build.cjs si quieres conservarlo al regenerar.
Para cambiar productos o precios, edita catalog.json y ejecuta el generador: así se mantienen sincronizados el HTML y la búsqueda. No cambies únicamente el precio visible del HTML.
Los estilos, app.js y los archivos de assets no se sobrescriben al regenerar.

Comprobación opcional:

    node validate.cjs

La comprobación conserva la referencia de 318 productos; actualiza ese número en validate.cjs si agregas o eliminas productos intencionalmente.

## Imágenes y logos

- assets/dog-v2.webp: perrito actual.
- assets/wicklow-logo.jpg: logo original Wicklow (recorte visual mediante CSS).
- assets/categories.webp: imagen que agrupa las ocho fotos de categorías; las clases photo-0 a photo-7 muestran cada zona usando background-position.

Para usar ocho fotografías independientes, cambia la imagen de fondo y background-size/background-position de cada clase photo-N en refinement.css. Las mismas clases se usan en las cabeceras de categorías.

## Publicar por tu cuenta

Sube el contenido completo de dist a un alojamiento estático, conservando sus subcarpetas. index.html debe quedar en la raíz pública.
El sitio utiliza HTML separados, CSS y JavaScript sin framework. No requiere backend. Esta versión funciona únicamente como menú digital de consulta: no tiene carrito, selección ni envío de pedidos.

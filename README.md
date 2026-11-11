# Wicklow — Backstage Menu / V2

Menú digital de Wicklow Irish Pub, basado en el proyecto recibido y su manual de identidad. Rediseño del 11 de noviembre de 2026.

## Abrir y publicar

- Descomprime el ZIP y abre `index.html` en tu navegador. No requiere instalación para consultar el menú.
- Para editar el catálogo, cambia `catalog.json` y ejecuta `npm run build`. Se genera `catalog.js` para permitir abrir el menú sin servidor.
- `npm test` comprueba coherencia de datos, archivos, referencias y equivalencia entre fuente y publicación.
- Para Render/Vercel: comando de compilación `npm run build`; directorio de publicación `dist`.
- `backstage.html` conserva un punto de entrada compatible. Las categorías aceptan `#cat=whisky` y enlaces previos `?cat=whisky`.

## Dirección visual

Backstage editorial: verde, negro, papel, cartel de concierto y Bonifacio. Se conservan las ocho ilustraciones de categoría y la ilustración de brindis, sin recortarlas ni redibujarlas. La cabecera utiliza el archivo horizontal blanco y transparente proporcionado por el propietario, sin alteraciones ni recreación tipográfica. Mantiene su relación de aspecto en escritorio y móvil.

El verde `#4c8c2b` es una aproximación digital de Pantone 363, no una equivalencia de impresión certificada. Las superficies oscuras, claros y neutros son acompañamientos de interfaz. Arial se conserva para la interfaz. La cabecera usa la fuente Barlow Condensed original por petición explícita del propietario. Las ilustraciones originales mantienen su color.

## Qué cambió

- Portada editorial, sello, textura discreta y composición de Bonifacio en formato de cartel.
- Titulares con entrada escalonada; transiciones de navegación con View Transitions cuando el navegador las admite; alternativa inmediata cuando no.
- Aparición de tarjetas al entrar en pantalla, interacciones de puntero suaves y cinta continua. Sin bibliotecas ni servicios externos.
- Cabecera persistente, menú lateral nativo accesible, navegación con teclado, cierre con Escape y foco de contenido al cambiar de sección.
- Respeto automático de `prefers-reduced-motion`, sin botón de pausa ni pausa al pasar el cursor. Ninguna animación oculta contenido si falta soporte.
- Búsqueda en whisky y destilados; filtros por región; orden por precio/nombre; opciones de comida para compartir.
- “Ando jodido”: presupuesto por producto de $100/$150/$200/$300. No es una promoción ni cambia precios. Los preparados de tarro se muestran como aparecen en el catálogo; no implican cerveza incluida.
- Presentaciones separadas cuando el texto fuente incluye tamaño y precio explícitos.

## Datos conservados

Se mantienen los 318 registros originales en ocho categorías. La presentación genera 328 opciones al separar tamaños explícitos, sin inventar productos o precios. Los registros de recomendaciones aparecen también en su sección correspondiente cuando así lo indica el origen. El filtro económico evita duplicados por nombre y precio.

El contenido de origen contiene marcas, precios y clasificaciones que no han sido verificados comercialmente. Esta entrega conserva esos datos; no los actualiza con precios de internet. No hay carrito, pedidos, cobros, promociones inventadas ni integración POS.

## Referencias consultadas

- Paper Tiger — Awwwards Site of the Day, 17 de enero de 2026. Fuente del estudio: https://www.papertiger.com/blog-posts/paper-tiger-wins-awwwards-site-of-the-day-for-website-redesign ; sitio inspeccionado: https://www.papertiger.com/
  Aplicación al diseño: escala tipográfica, humor de marca, bloques editoriales y transiciones cuidadas. No se reutilizó su código ni sus assets.
- Longbow — Awwwards Site of the Day, 12 de julio de 2026, según la reseña fechada https://dokle.design/awards/longbow-awwwards-site-of-the-day ; el estudio confirma el premio en https://main.digitalbutlers.team/awards . También obtuvo CSS Design Awards WOTD el 9 de junio de 2026: https://www.cssdesignawards.com/sites/longbow/49430/ .
  Aplicación al diseño: jerarquía fuerte, contraste entre titulares y detalle, imágenes protagonistas y movimiento contenido.

Las fichas directas de Awwwards no respondieron durante la consulta; se contrastaron los reconocimientos con las fuentes indicadas. Esta entrega no afirma haber ganado premios ni garantiza puntuaciones de jurados o Lighthouse.

## Verificación realizada

- Compilación estática y validador de datos/archivos.
- Ocho categorías en navegador: 5/11/33/169/32/27/22/29 opciones visibles respectivamente.
- Búsqueda combinada con región, orden ascendente, resultado vacío y restablecimiento.
- Presupuesto de $150 sin resultados por encima del límite.
- Navegación atrás, apertura/cierre de menú y Escape.
- Revisión visual de escritorio y vistas responsivas de 320, 390 y 768 px; corrección de desbordamiento de títulos en pantallas pequeñas.
- Revisado en Chromium. No se afirma una prueba física en dispositivos iOS/Android ni una auditoría exhaustiva de accesibilidad.

## Archivos principales

`index.html` y `backstage.html`: estructura. `concepts.css`: diseño responsive y movimiento. `concepts.js`: navegación y filtros. `catalog.json`: datos editables. `catalog.js`: copia para navegador. `build.cjs`: publicación. `validate.cjs`: verificación. `assets`: imágenes originales y logotipo extraído del manual.

## Ajuste V2.1

Logo Backstage original sin bloque blanco. Eliminado el control de pausa y su preferencia guardada. Cinta de doce frases repetidas en dos grupos idénticos, con ancho mínimo de ventana para cerrar el ciclo sin huecos. Sidebar verde con texto blanco, estados de interacción verdes y separadores suaves.

## Nombres de categorías V2.2

Los nombres visibles se actualizan a Las de Boni, Échale al buche, Cheve, Oro líquido, Mezclas del pecado, Al grano, Pa' ir calentando, Sin pecado y Ando jodido. Se conservan las claves y rutas anteriores. Los archivos de catálogo, productos, precios y descripciones permanecen intactos.

## Ajuste V2.3

Sustituido el wordmark tipográfico por la imagen horizontal blanca adjunta por el propietario. Archivo conservado byte por byte en assets/wicklow-logo-white-horizontal.png. Tamaño responsive con proporciones originales y fondo transparente.

## Ajuste V2.4

CTA de portada con texto “VER LA CARTA” y flecha SVG descendente, sin emojis. El acceso de cabecera lleva a la sección de categorías, también desde el detalle de productos. Eliminado el menú lateral y sus eventos. Se mantienen las pestañas entre categorías.

### V2.5 — Un solo acceso a la carta
Se retira el botón bajo “Poca vergüenza” y sus estilos. Se conserva el botón de la topbar con acceso directo a la carta, sin sidebar. El resto del diseño y el catálogo permanecen intactos.

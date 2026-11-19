# Avance de Obra 4D · SDP (v5)

Widget personalizado para **ArcGIS Experience Builder 1.17.0** (ArcGIS Enterprise 11.5, ArcGIS Maps SDK for JavaScript 4.32).

Combina la **funcionalidad completa y robustez del widget original** (soporte de escena 3D autónoma sin depender obligatoriamente de un widget de mapa, fallback automático de datos, detección por URL de servicio y expresiones regulares, y publicación de fuente de datos de salida) con la **estética moderna Calcite Dark Slate y personalización de v3/v4** (paleta de colores, tarjetas con bordes finos, timeline interactivo con Curva S SVG, badges de estado, sliders personalizados, panel de configuración con edición fluida `allowClear` y compatibilidad nativa con URLs e IDs de ítems de ArcGIS Enterprise).

---

## Características Principales

1. **Modo Dual de Visualización:**
   - **Conectado a Widget de Mapa:** Si seleccionas un widget de Mapa en la configuración, controla y sincroniza la escena 3D de ese mapa.
   - **Modo Autónomo (Sin Mapa):** Si no seleccionas ningún widget de mapa, el widget abre automáticamente la escena 3D oficial de la SDP (`WEB_SCENE`: `id 839de5bdfa814f60b2a1baa743bc7f56`) en su propia caja 3D con un botón para expandir/colapsar el panel flotante (`Avance 4D ▸` / `◂`).

2. **Detección Robusta de Capas (Triple Respaldo):**
   - **Por Configuración:** Capas seleccionadas manualmente en el panel de configuración (`layerIdE15`, `layerIdI16`, `layerIdE16`, `layerIdVolumetry`).
   - **Por URL de Servicio:** Reconoce los endpoints oficiales de las capas de escena alojadas (`SECTION_URLS`).
   - **Por Título (Regex):** Autodetecta `E15`, `I16`, `E16` y `Volumetría` si los títulos coinciden con el estándar.

3. **Origen de Datos Flexible e Institucional (Soporte ArcGIS Enterprise):**
   - **Ítems de Portal Enterprise:** Puedes pegar directamente el ID de 32 caracteres del archivo JSON subido a tu Enterprise o la URL REST (`https://.../sharing/rest/content/items/<itemId>/data`).
   - **Servidor Interno / IIS / Hosting:** Puedes ingresar la URL directa a un archivo `.json` o carpeta (ej. `https://servidor-entidad/datos-plmb/avance-elements.json`).
   - **100% Limpio y Autónomo:** No tiene dependencias fijas de repositorios externos ni fallbacks a cuentas personales de terceros.
   - **Edición Fluida:** La casilla incluye botón `allowClear` para borrar y cambiar la URL o ID fácilmente.

4. **Simulación 4D y Panel de Cronograma:**
   - Deslizador de fecha de corte con pasos configurables (1 día, 1 semana, 1 mes) y animación de reproducción continua (▶ / ❚❚).
   - Casilla de *Timelapse*: oculta elementos no iniciados a la fecha de corte.
   - Cálculo instantáneo de KPIs: % Programado, % Real reportado, Brecha de atraso/adelanto en puntos y recuento de elementos atrasados.
   - Gráfico de Curva S programada vectorial en SVG con línea de corte móvil y punto de avance real actual.
   - Barra de desglose acumulado por categorías de cronograma (Construido, Atrasado, En ejecución, Inicia en 30 días, Más adelante, Sin programación).

5. **Interoperabilidad (Fuente de Datos de Salida):**
   - Expone la fuente de datos `Elementos de avance` con 22 atributos para enlazar bidireccionalmente con widgets nativos de Experience Builder (Gráfico, Tabla, Filtro y Lista).

6. **Herramientas 3D:**
   - Encuadre rápido de todas las estaciones visibles (`Encuadrar`).
   - Plano de corte interactivo (`Cortar` - Slice).
   - Giro orbital continuo (`Girar` - Spin).
   - Control continuo de transparencia del terreno con navegación subterránea desbloqueada.

---

## Registro en GitHub Pages y ArcGIS Enterprise

1. **Subir a GitHub:**
   Crea o actualiza el repositorio en GitHub con el contenido de esta carpeta `avance-obra-escena-sdp-v5` y activa:
   **Settings → Pages → Deploy from branch → main / (root)**.

2. **Registrar en el Portal:**
   - En el portal de ArcGIS Enterprise: **Contenido → Nuevo elemento → Aplicación → Widget de Experience Builder**.
   - URL del manifiesto: `https://<tu-usuario>.github.io/<tu-repositorio>/manifest.json`.
   - Comparte el elemento con tu organización o público.

3. **Uso en Experience Builder:**
   - Agrega el widget a tu experiencia desde la sección **Personalizado** bajo el nombre **Avance de Obra 4D · SDP (v5)**.

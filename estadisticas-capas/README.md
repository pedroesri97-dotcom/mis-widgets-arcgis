# Widget de Estadísticas de Capas - Manual Técnico, de Seguridad y Protocolos

Widget analítico oficial para **ArcGIS Experience Builder (versión 1.17+)**, desarrollado bajo los estándares del **ArcGIS Calcite Design System** en modo oscuro neutro. Proporciona tarjetas de indicadores cuantitativos (KPIs) vinculadas dinámicamente a la visibilidad y datos de capas geográficas en mapas 2D y escenas 3D, incorporando ventanas emergentes modales configurables para el detalle metodológico de cada indicador.

---

## 1. Propósito y Alcance del Widget

El widget centraliza y expone métricas territoriales cuantitativas en tiempo real:
- **Sincronización Bidireccional con Exploración Territorial:** Detecta de forma continua las capas encendidas en el aplicativo (a través del catálogo temático unificado o de los mapas operacionales) y despliega exclusivamente las estadísticas pertinentes.
- **Independencia Total de Vista (2D y 3D):** Los indicadores apuntan a los servicios geográficos canónicos. La tarjeta estadística persiste y calcula sus valores de manera idéntica ya sea que el usuario se encuentre interactuando en la vista plana (Web Map 2D) o en la escena tridimensional (Web Scene 3D).
- **Recuento Global o Métricas por Capa:** Admite el cálculo consolidado de todas las capas activas (`★ Todas las capas activas`) o el cálculo individual por capa mediante operaciones analíticas (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`).
- **Ventana Emergente de Información Metodológica:** Cada indicador cuenta con un botón de información `(i)` que despliega un diálogo Calcite con el valor principal registrado, descripción detallada, metadatos oficiales y hasta 3 estadísticas complementarias opcionales calculadas sobre la misma capa.

---

## 2. Estructura de la Carpeta y Archivos

El widget cumple estrictamente la arquitectura modular de extensiones personalizadas de ArcGIS Experience Builder:

```text
estadisticas-capas/
│
├── manifest.json              # Manifiesto técnico institucional del widget y dependencias
├── config.json                # Plantilla de configuración inicial por defecto
├── README.md                  # Manual técnico, arquitectura de seguridad y protocolos
│
└── src/
    ├── config.ts              # Contratos de datos TypeScript e interfaces inmutables
    │
    ├── runtime/               # Código fuente del entorno de ejecución (Runtime)
    │   ├── widget.tsx         # Componente React principal: consultas espaciales, portal DOM y renderizado
    │   └── style.ts           # Definición de estilos Calcite Dark (paleta gris neutra y tipografía oficial)
    │
    └── setting/               # Panel de administración en el diseñador de Experience Builder
        └── setting.tsx        # Interfaz de configuración: enlace a mapas, definición de campos y modales
```

### Descripción de Componentes:
1. **`manifest.json`**: Declara los metadatos de extensión (`name`, `version`, `author: Equipo de Desarrollo SIG`, dependencias `jimu-arcgis`).
2. **`config.json`**: Esquema de arranque con valores iniciales limpios.
3. **`src/config.ts`**: Define interfaces seguras (`StatType`, `ExtraModalStat`, `InfoModalConfig`, `LayerStatCardConfig`, `IMConfig`).
4. **`src/runtime/widget.tsx`**: Implementa el ciclo de vida del widget, el formateo numérico con estándar nacional (`es-CO`), la ejecución de consultas analíticas (`queryFeatures`, `queryFeatureCount`) y el montaje del diálogo modal en el DOM raíz mediante portales.
5. **`src/runtime/style.ts`**: Define las clases CSS basadas en variables de diseño Calcite, empleando tonos grises planos, bordes sutiles de 1px y ausencia total de efectos artificiales o resplandores.
6. **`src/setting/setting.tsx`**: Panel de configuración vertical y ordenado para seleccionar capas, asociar campos numéricos, definir textos y parametrizar las ventanas emergentes.

---

## 3. Protocolos de Seguridad y Calidad de Código

El desarrollo del widget se rige por directrices estrictas de seguridad de la información y robustez operativa:

### 3.1. Sanitización y Prevención de Inyecciones
- Todas las consultas a capas vectoriales y tabulares se construyen empleando la API estructurada de ArcGIS Maps SDK (`FeatureLayer.createQuery()`, `Query.outStatistics`).
- No se realiza concatenación manual de cadenas SQL con entradas externas ni ejecución de código arbitrario (`eval`, `Function()`, `innerHTML` con datos de usuario).
- La normalización de cadenas de búsqueda de capas se ejecuta mediante funciones deterministas con eliminación de diacríticos (`String.normalize('NFD')`) y caracteres no alfanuméricos.

### 3.2. Aislamiento DOM y Prevención de Superposición
- El diálogo modal de información se monta directamente en el nodo raíz `document.body` a través de `ReactDOM.createPortal`. Esto evita que contenedores padres (como paneles laterales o barras divisoras con `overflow: hidden` o `z-index` locales) corten la ventana o generen artefactos visuales superpuestos.
- El evento de clic en el contenido modal utiliza `stopPropagation()` para evitar cierres accidentales al interactuar con el diálogo.

### 3.3. Prevención de Fugas de Memoria (Memory Leaks)
- **Control de Montaje:** Todos los efectos asíncronos (`useEffect`) incorporan banderas de control (`isMounted = false`) para impedir actualizaciones de estado (`setState`) sobre componentes desmontados.
- **Limpieza de Suscripciones:** Los escuchadores de eventos globales (`window.addEventListener('exb_active_layers_change')`) y temporizadores periódicos (`setInterval`) se desuscriben y limpian en la función de retorno del efecto.
- **Control de Consultas en Vuelo (In-Flight Requests):** Se mantiene una referencia de claves en curso (`inFlightRef`) para evitar consultas duplicadas o redundantes hacia el servidor ArcGIS Server / ArcGIS Online cuando la capa ya se encuentra en proceso de cálculo.

### 3.4. Seguridad en Enlaces Externos
- Cualquier hipervínculo saliente configurado en el modal incluye obligatoriamente los atributos `rel="noopener noreferrer"` y `target="_blank"`. Esto previene ataques de navegación inversa (*reverse tabnabbing*) y garantiza que la pestaña principal no comparta su contexto con el destino.

### 3.5. Protección de Credenciales y Sesiones
- El widget no almacena credenciales, tokens ni contraseñas en archivos locales ni en el almacenamiento web (`localStorage`).
- Todas las consultas de datos operan sobre la sesión activa administrada por el núcleo de Experience Builder (`jimu-core` y `IdentityManager`).

---

## 4. Especificaciones del Sistema de Diseño Calcite

El widget se integra de manera homogénea con la suite de ArcGIS siguiendo los lineamientos de **Calcite Design System**:

| Elemento | Token / Valor | Justificación Técnica |
| :--- | :--- | :--- |
| **Fondo Base** | `#1f1f1f` | Gris oscuro neutro oficial de superficie Calcite Dark |
| **Superficie de Tarjeta** | `#262626` | Superficie plana contrastante sin reflejos ni gradientes |
| **Bordes** | `1px solid #333333` | Delimitación nítida y austera según el estándar de interfaz Esri |
| **Color de Acento** | `#007ac2` (Hover: `#00619b`) | Azul institucional Calcite Brand para elementos interactivos |
| **Tipografía** | `"Segoe UI", -apple-system, Roboto, sans-serif` | Pila tipográfica estándar de ArcGIS Enterprise |
| **Valores Numéricos** | `font-size: 24px–26px`, `font-weight: 600` | Legibilidad jerárquica sin saturación visual |
| **Bordes Redondeados** | `2px–3px` | Geometría sobria y discreta, evitando radios excesivos |
| **Formato Numérico** | `Intl.NumberFormat('es-CO')` | Puntos para miles y comas para decimales (`56.689`) |

---

## 5. Protocolo de Configuración y Despliegue

Para desplegar y configurar el widget en una aplicación de Experience Builder:

1. **Vinculación de Mapa:**
   - En el panel de configuración, seleccionar el widget de Mapa que contiene las vistas 2D y 3D del proyecto.
2. **Definición de Indicadores:**
   - Hacer clic en **+ Agregar estadística**.
   - **Capa vinculada:** Seleccionar del menú desplegable la capa temática que detonará el indicador al encenderse (o elegir `★ Todas las capas activas` para recuentos globales).
   - **Título de la tarjeta:** Indicar el nombre descriptivo institucional del indicador.
   - **Origen:** Seleccionar *Cálculo sobre la capa* (para procesar en tiempo real atributos geográficos) o *Valor fijo manual*.
   - **Tipo de cálculo:** Seleccionar `COUNT`, `SUM`, `AVG`, `MIN` o `MAX`.
   - **Campo numérico:** Seleccionar el campo numérico del servicio sobre el cual se aplicará la operación estadística.
   - **Formato:** Ajustar decimales (`0`, `1`, `2`) y unidad de medida (`edificaciones`, `ha`, `predios`, etc.).
3. **Parametrización de la Ventana Emergente:**
   - Definir el título y la descripción explicativa del indicador.
   - *(Opcional)* Con el botón **+ Agregar estadística al modal**, incorporar hasta 3 estadísticas complementarias que calculen otros campos de la misma capa (por ejemplo, área construida, promedio de altura o valor máximo).
   - Indicar la fuente oficial, fecha de actualización y frecuencia.
   - *(Opcional)* Configurar el texto y la URL del botón de enlace externo.

---

## 6. Mantenimiento y Soporte Institucional

- **Autoría:** Equipo de Desarrollo SIG
- **Versión de Compatibilidad:** ArcGIS Experience Builder Developer Edition 1.17.0+ / ArcGIS Maps SDK for JavaScript 4.31+
- **Licencia:** Apache License 2.0
- **Políticas de Mantenimiento:** Cualquier actualización debe preservar la integridad de los contratos TypeScript en `src/config.ts`, respetar los estilos neutros de Calcite y asegurar la compatibilidad simultánea con vistas cartográficas 2D y escenas 3D.

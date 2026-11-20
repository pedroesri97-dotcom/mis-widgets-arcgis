# Manual Técnico de Arquitectura y Operación
## Widget: Control de Tiempo y Sombras 3D (`control-tiempo-3d`)
### Plataforma: ArcGIS Experience Builder 1.17 / ArcGIS Maps SDK for JavaScript 4.x
**Autor:** Equipo de Desarrollo SIG  
**Versión:** 1.17.0  
**Licencia:** Apache-2.0  
**Fecha de Publicación:** Octubre 2026  

---

### 1. Resumen Ejecutivo y Propósito
El widget **Control de Tiempo y Sombras 3D** (`control-tiempo-3d`) es un componente de extensión personalizado para ArcGIS Experience Builder diseñado para proporcionar control interactivo sobre el modelo de iluminación solar diurna, cálculo de sombras volumétricas y simulación del ciclo diurno en escenas tridimensionales (`SceneView`).

El componente está optimizado para su ejecución en entornos de visualización geoespacial de alta fidelidad (como gemelos digitales urbanos), manteniendo estricta adherencia al sistema de diseño **Calcite Design System** y una integración visual nativa con el catálogo de **Capas Temáticas** y el panel de **Estadísticas de Capas**.

---

### 2. Especificación Técnica y Funcional

#### 2.1 Control Horario y Ciclo Solar (Daylight & Solar Azimuth)
- **Rango Operativo:** Ciclo continuo de 24 horas (00:00 a 24:00 horas) con resolución granular de 0.05 horas (3 minutos).
- **Proyección Solar:** Al actualizar el control deslizante, se calcula y asigna en tiempo real una instancia `Date` al objeto `sceneView.environment.lighting.date`.
- **Efemérides:** El componente utiliza una fecha estándar para garantizar una curva de iluminación solar cenital y sombras dinámicas físicamente coherentes.
- **Reproductor Animado:** Motor de reproducción fluida basado en `requestAnimationFrame` con control de velocidad seleccionable (`0.5x`, `1.0x`, `2.0x`).

#### 2.2 Sombras Volumétricas Directas (Direct Shadows)
- **Propiedad Controlada:** `sceneView.environment.lighting.directShadowsEnabled`.
- **Comportamiento:** Alterna el cálculo y renderizado en tiempo real de sombras proyectadas por capas de malla 3D integrada (`IntegratedMeshLayer`), capas de objetos 3D (`SceneLayer`), edificaciones volumétricas y arbolado urbano.

#### 2.3 Detección Automática de Escenas 3D (SceneView Filter)
- El widget verifica continuamente la tipología de la vista activa a través de `JimuMapView.view.type === '3d'`.
- En caso de operar sobre una vista bidimensional (`MapView`), el componente suspende los ciclos de renderizado y presenta una tarjeta informativa Calcite indicando la necesidad de alternar a una escena tridimensional para la simulación.

---

### 3. Estructura de Archivos del Módulo

```text
client/your-extensions/widgets/control-tiempo-3d/
├── config.json               # Configuración predeterminada de inicialización
├── icon.svg                  # Iconografía Calcite del componente
├── manifest.json             # Manifiesto y metadatos de extensión para Experience Builder
├── README.md                 # Documentación técnica institucional
└── src/
    ├── config.ts             # Definición de interfaces TypeScript y tipos inmutables
    ├── runtime/
    │   ├── style.ts          # Tokens CSS del sistema Calcite Dark Slate
    │   └── widget.tsx        # Lógica de renderizado y sincronización con SceneView
    └── setting/
        └── setting.tsx       # Panel de configuración para el constructor Experience Builder
```

---

### 4. Parámetros de Configuración (`Config`)

| Propiedad | Tipo | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `headerTitle` | `string` | `"Tiempo y Sombras 3D"` | Título visible en la barra superior del widget |
| `defaultHour` | `number` | `13.0` | Hora inicial de posicionamiento solar (1:00 p. m.) |
| `animationSpeed` | `number` | `1.0` | Factor multiplicador de avance en la reproducción animada |
| `defaultShadows` | `boolean` | `true` | Estado inicial del conmutador de sombras directas |

---

### 5. Compatibilidad y Dependencias
- **ArcGIS Experience Builder:** Versión 1.17.0 o superior.
- **ArcGIS Maps SDK for JavaScript:** Versión 4.28+ (núcleo de Experience Builder).
- **Dependencias de Módulo:** `jimu-core`, `jimu-arcgis`, `jimu-ui`.
- **Navegadores Soportados:** Navegadores modernos compatibles con WebGL 2.0 (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

---

### 6. Protocolos de Seguridad y Calidad
1. **Entorno Seguro:** El widget opera estrictamente dentro del marco de seguridad de la sesión del usuario en ArcGIS Enterprise / Portal for ArcGIS.
2. **Sin Tokens en Código:** No requiere claves API fijas ni almacenamiento de credenciales.
3. **Manejo Seguro del DOM:** Todas las operaciones de manipulación visual se gestionan a través del ciclo de vida de React y la API oficial de ArcGIS.

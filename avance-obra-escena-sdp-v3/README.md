# Manual Técnico de Arquitectura y Operación
## Widget: Avance de Obra 4D · SDP (`avance-obra-escena-sdp`)
### Plataforma: ArcGIS Experience Builder 1.17 / ArcGIS Maps SDK for JavaScript 4.x
**Autor:** Equipo de Desarrollo SIG  
**Versión:** 1.17.0  
**Licencia:** Apache-2.0  
**Fecha de Actualización:** Octubre 2026  

---

### 1. Resumen Ejecutivo y Propósito
El widget **Avance de Obra 4D · SDP** (`avance-obra-escena-sdp`) es un componente analítico y de simulación temporal para ArcGIS Experience Builder 1.17, diseñado para la supervisión y visualización 4D del proyecto Primera Línea del Metro de Bogotá (PLMB) sobre las Estaciones E15, I16 y E16.

El widget opera bajo una arquitectura **100% agnóstica y segura**: se conecta directamente a la escena 3D (`Web Scene`) configurada en el widget de Mapa de Experience Builder desde el Portal institucional, **sin almacenar URLs de servicios, escenas predeterminadas ni credenciales en el código fuente**.

---

### 2. Especificaciones y Capacidades Técnicas

#### 2.1 Conexión con Escena del Portal e Insumos de Capas
- **Vinculación con Widget de Mapa:** Se conecta a la vista 3D (`SceneView`) provista por el widget de Mapa nativo de Experience Builder.
- **Mapeo Flexible de Capas:** Desde el panel de configuración, el usuario puede seleccionar en menús desplegables las capas de escena presentes en su Web Scene correspondientes a:
  - Estación 15 (`layerIdE15`)
  - Interestación 16 (`layerIdI16`)
  - Estación 16 (`layerIdE16`)
  - Volumetría contextual (`layerIdVolumetry`)
  - Si no se configuran manualmente, el widget autodetecta de forma inteligente las capas por su título (`E15`, `I16`, `E16`, `Volumetria`).

#### 2.2 Modos de Visualización Cromática
- **Estado de Avance:** Clasificación de los elementos constructivos según su porcentaje reportado (`Terminado`, `En curso`, `No iniciado`, `Sin dato`).
- **Cronograma (4D):** Renderizado dinámico según la fecha de corte seleccionada (`Construido`, `Atrasado`, `En ejecución`, `Inicia en 30 días`, `Más adelante`, `Sin programación`).
- **Colores del Modelo:** Visualización con los materiales y texturas originales del modelado BIM/Revit.

#### 2.3 Curva S y Panel de Simulación Temporal
- **Deslizador Temporal Continuo:** Selección interactiva de fecha de corte con avance por pasos ajustables (1 día, 1 semana, 1 mes).
- **Reproductor Animado:** Control de reproducción continua para simular el avance progresivo de la infraestructura en el tiempo.
- **Gráfico de Curva S:** Curva de avance programado acumulado vs. reporte real consolidado con cálculo instantáneo de indicadores clave (Planeado %, Real %, Brecha de atraso/adelanto en puntos y recuento de elementos retrasados).

#### 2.4 Gestión Espacial y Volumetría
- **Filtrado de Volumetría Urbana:** Ocultamiento automatizado de las edificaciones que intersecan la huella de las estaciones para evitar solapamientos visuales.
- **Transparencia del Terreno:** Control continuo de la opacidad de la superficie para inspección de infraestructura subterránea y cimentaciones.
- **Herramientas de Exploración 3D:** Encuadre espacial rápido, plano de corte volumétrico interactivo (`Slice`) y giro orbital continuo (`Spin`).

#### 2.5 Interoperabilidad y Fuente de Datos de Salida
- Genera y expone automáticamente la fuente de datos `Elementos de avance` para sincronización bidireccional con widgets nativos de Experience Builder (Gráfico, Tabla, Filtro y Lista).

#### 2.6 Personalización Visual e Institucional
- **Títulos de Interfaz:** Personalización de los encabezados principales y tarjetas de control.
- **Etiquetas de Secciones y Modos:** Modificación de los textos internos de cada estación constructiva, capa de volumetría, modos de color y estados de avance.
- **Paleta Cromática Integral:** Ajuste de colores institucionales de acento, botones, fondo de tarjetas, estados constructivos 3D y curvas de cronograma 4D.

---

### 3. Estructura de Archivos del Módulo

```text
client/your-extensions/widgets/avance-obra-escena-sdp/
├── config.json               # Configuración predeterminada institucional (sin URLs privadas)
├── icon.svg                  # Iconografía oficial del widget
├── manifest.json             # Metadatos y manifiesto para Experience Builder
├── README.md                 # Manual técnico institucional
└── src/
    ├── config.ts             # Tipos TypeScript inmutables
    ├── output-schema.ts      # Esquema de la fuente de datos publicada
    ├── runtime/
    │   ├── avance-schedule.ts        # Reglas de cálculo temporal 4D y efemérides
    │   ├── avance-schedule-panel.tsx # Panel de control de cronograma y curva S
    │   ├── package-footprint.ts      # Geometría y huellas prediales de estaciones
    │   └── widget.tsx                # Componente principal con diseño Calcite Dark Slate
    └── setting/
        └── setting.tsx       # Panel de configuración con selección de capas de la escena
```

---

### 4. Protocolos de Seguridad y Calidad
- **100% Libre de Credenciales y URLs Privadas:** No expone credenciales, tokens, IDs de escenas ni enlaces de servidores en el código fuente.
- **Aislamiento Total de Datos:** Si alguien extrae la carpeta del widget, no podrá descargar datos geográficos ni consultar endpoints de la entidad.
- **Rendimiento Optimizado:** Consultas memoizadas, limitación de resaltado masivo (`HIGHLIGHT_LIMIT = 5000`) y renderizado por lotes para mantener una tasa constante de 60 FPS en el visor 3D.

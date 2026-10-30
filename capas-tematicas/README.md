# Widget de Capas Temáticas Bogotá - Manual Técnico y de Usuario

Widget interactivo para **ArcGIS Experience Builder (versión 1.17+)**, diseñado para la exploración y gestión integral de información territorial en **dos y tres dimensiones (2D y 3D)**. Cuenta con un diseño moderno de tema oscuro basado en el sistema de diseño **Calcite** y una interfaz fluida y optimizada.

---

## 1. Propósito del Widget

El objetivo principal de este widget es centralizar el encendido, apagado, transparencia y consulta de capas geográficas organizadas de forma lógica y amigable para cualquier usuario.

### ¿Qué problemas resuelve?
- **Control Unificado 2D y 3D:** Al encender o apagar una capa en el panel, el cambio se refleja de manera automática tanto en el mapa plano (Web Map 2D) como en la escena tridimensional (Web Scene 3D), ya que ambos entornos consultan los mismos servicios geográficos oficiales.
- **Independencia de Capas:** Cada capa funciona de manera autónoma. Encender una capa específica (por ejemplo, *Canalización* en Telecomunicaciones o *Parque* en Arbolado y Parques) no enciende las demás capas hermanas, salvo que el usuario decida conscientemente encender el subgrupo o la categoría completa.
- **Aislamiento Estricto:** La capa *Fachadas* controla exclusivamente los elementos correspondientes a fachadas, sin cruzarse ni mezclarse con capas de volumetría u otros elementos 3D.
- **Transparencia Interactiva en Fachadas v2:** La capa *Fachadas v2* dispone de un control deslizante (*slider*) que permite regular su opacidad del 0% al 100% en tiempo real sin recargar el mapa.
- **Visibilidad Continua en Todas las Escalas (Metro y BIM):** Elimina las restricciones de escala (`minScale` y `maxScale` fijados en 0) tanto en la capa principal como en todos sus componentes hijos y contenedores superiores. Esto asegura que las estaciones de metro, modelos BIM y estructuras se mantengan visibles con nitidez a cualquier distancia de zoom, sin desvanecerse al acercarse o alejarse.

---

## 2. Estructura de la Carpeta y Archivos

El widget sigue la arquitectura modular oficial de ArcGIS Experience Builder:

```text
capas-tematicas/
│
├── manifest.json              # Ficha técnica del widget (nombre, versión, dependencias jimu-arcgis)
├── config.json                # Plantilla de configuración inicial con las categorías y capas
├── icon.svg                   # Ícono vectorial oficial para el catálogo del diseñador
├── README.md                  # Manual técnico y guía de usuario completa
│
└── src/
    ├── config.ts              # Definición de estructuras de datos e interfaces TypeScript
    │
    ├── runtime/               # Código de ejecución en la aplicación web final
    │   ├── widget.tsx         # Componente React principal (lógica de sincronización 2D/3D y UI)
    │   └── style.ts           # Definición de estilos Calcite con tema oscuro (Dark Slate)
    │
    └── setting/               # Panel de configuración en el diseñador de Experience Builder
        └── setting.tsx        # Interfaz administrativa para enlazar mapas, editar, agregar y borrar capas
```

### Descripción sencilla de cada archivo:
1. **`manifest.json`**: Es el carné de identidad del widget. Le informa a ArcGIS Experience Builder quién es el widget, qué dependencias necesita (como `jimu-arcgis`) y las dimensiones iniciales recomendadas.
2. **`config.json`**: Guarda los valores por defecto que se cargan la primera vez que se agrega el widget a una aplicación nueva.
3. **`src/config.ts`**: Contrato de datos en TypeScript. Garantiza que las capas, categorías y propiedades tengan siempre los tipos correctos (títulos, colores, identificadores).
4. **`src/runtime/widget.tsx`**: El motor del widget. Escucha la interacción del usuario (clics en casillas, deslizador de transparencia, botones de acordeón) y se comunica con el mapa y la escena mediante la API de ArcGIS.
5. **`src/runtime/style.ts`**: La hoja de estilos visuales. Aplica la paleta de colores, tipografías, bordes redondeados y transiciones suaves para garantizar una experiencia visual elegante.
6. **`src/setting/setting.tsx`**: La herramienta para el administrador. Permite vincular el widget al mapa 2D y a la escena 3D, crear nuevas capas, cambiar nombres o colores, y eliminar capas que no se necesiten.

---

## 3. Organización Temática de las Capas

El widget organiza la información en categorías principales y subgrupos lógicos:

### 1. INFORMACIÓN BASE (17 Capas)
- **Fachadas v2** *(Primera capa, cuenta con control deslizante de transparencia)*
- **Zona piloto**
- **Fachadas** *(Aislada de forma independiente)*
- **Ortofotomosaico urbano de Bogotá D.C. Año 2025**
- **Subgrupo Telecomunicaciones:**
  - *Canalización*
  - *Poste telecomunicaciones*
  - *Armario Telefónico*
- **Subgrupo Acueducto:**
  - *Sumidero Sanitario Combinado*
  - *Red troncal sanitario combinado*
  - *Red Local Sanitario Combinado*
  - *Hidrante*
- **Subgrupo Equipamientos:**
  - *Equipamiento Salud*
  - *Equipamiento Educativo*
  - *Equipamiento Cultura*
  - *Equipamiento Bienestar Social*
- **Subgrupo Arbolado y parques:**
  - *Parque*
  - *Arbolado urbano*

### 2. ESTACIONES DE METRO (11 Capas)
- **Subgrupo Estación 16:**
  - *L1T1 1310 416 CON ED EST MO 0001*
  - *L1T1 1300 416 CON ED EST MO 0002*
  - *L1T1 1300 416 CON ED EST MO 0001*
  - *L1T1 1150 316 CON ED EST MO 0001*
  - *L1T1 1100 316 CON ED EST MO 0001*
  - *L1T1 0000 316 CON ED ARQ MO 0001 V00*
- **Subgrupo Estación 15:**
  - *L1T1 1150 315 CON ED EST MO 0001*
  - *L1T1 1100 315 CON ED EST MO 0001*
  - *L1T1 0000 315 CON ED ARQ MO 0001 V00*
- **Subgrupo Intersección:**
  - *L1T1 0000 399 CON IN ARQ MO 0001 V00*
  - *L1T1 0000 399 CON IN ARQ MO 0002 V00*

### 3. SOCIAL (6 Capas)
- *Limitaciones permanentes manzana*
- *Manzana sisbén promedio*
- *Personas por hogar*
- *Número de cuartos*
- *Puntos de sisben*
- *Puntos sisbén promedio*

### 4. ECONÓMICO (7 Capas)
- **Subgrupo Valor Suelo Comercial:** *Sector*, *Lote*, *Manzana*
- *Actividad Económica cambio*
- *Actividad económica*
- **Subgrupo Nuevos Proyectos:** *Proyectos Bogotá*, *Lote*

### 5. URBANÍSTICO (4 Capas)
- *Potencial Edificatorio*
- **Subgrupo Movilidad:** *Estación Metro*, *PSITP*, *Estación Troncal*

### 6. AMBIENTE (2 Capas)
- *Mapa ruido 2d - Niveles de Ruido (dB)*
- *Simulación Calidad Aire Bogotá*

---

## 4. Optimizaciones de Rendimiento y Tiempo de Carga

Para asegurar que el widget abra de inmediato y responda en milisegundos sin congelar la pantalla ni sobrecargar el procesador del equipo, se implementaron cuatro optimizaciones técnicas clave:

1. **Caché Inteligente de Capas (`candidatesCacheRef`):**
   - *Antes:* Cada vez que se encendía o apagaba una capa, el código recorría todo el árbol del mapa y de la escena desde cero (hasta 50 veces consecutivas).
   - *Ahora:* El árbol de capas se analiza una sola vez y se almacena en memoria de acceso ultrarrápido durante 3.5 segundos. La búsqueda de coincidencias toma menos de 0.1 milisegundos.

2. **Aislamiento del Reloj en Tiempo Real (`LiveClock`):**
   - *Antes:* El reloj de la cabecera actualizaba el estado principal del widget cada segundo, provocando que todas las categorías y 50 tarjetas de capas se re-dibujaran innecesariamente 60 veces por minuto.
   - *Ahora:* El reloj está encapsulado en un subcomponente independiente memoizado. El segundero avanza fluidamente sin tocar ni recalcular el listado de capas.

3. **Escaneo Adaptativo de Vistas (`scanAllViews`):**
   - En lugar de ejecutar consultas en bucles infinitos cada 2 segundos, el widget busca los mapas rápidamente durante los primeros instantes (1.5 segundos). Una vez detectadas las vistas 2D y 3D, el ritmo de comprobación se desacelera automáticamente a 8 segundos para ahorrar memoria y batería.

4. **Prevención de Re-renderizados en Configuración (`setting.tsx`):**
   - El panel de edición compara si las capas detectadas en el mapa cambiaron antes de disparar actualizaciones de estado. Si la lista es idéntica, no genera repintes en pantalla.

---

## 5. Seguridad, Privacidad y Gobernanza de Datos

El diseño de este widget cumple estrictamente con los estándares de seguridad de la información corporativa e institucional:

1. **Cero Exposición de Credenciales o Tokens:**
   - El código **no contiene contraseñas, claves de API, tokens privados ni URLs internas quemadas**.
2. **Autenticación Nativa y Delegada:**
   - La comunicación con los servicios geográficos se gestiona a través de la infraestructura autenticada de **ArcGIS Enterprise / Portal**, respetando de manera automática los permisos, grupos y roles asignados a cada usuario en la plataforma.
3. **Protección contra Inyecciones (XSS):**
   - Todas las etiquetas, títulos y nombres introducidos por los usuarios en el panel de configuración son saneados y renderizados mediante enlaces seguros de React, impidiendo la ejecución de scripts maliciosos.
4. **Almacenamiento Local Seguro:**
   - La sincronización entre widgets secundarios utiliza eventos seguros en memoria (`CustomEvent`) y `sessionStorage` transitorio, sin almacenar información personal ni identificable.

---

## 6. Instrucciones de Uso y Configuración

### Para el Usuario Final:
1. **Encender/Apagar una capa:** Haz clic sobre cualquier fila para conmutar la visibilidad de esa capa tanto en el mapa 2D como en la escena 3D.
2. **Encender/Apagar un subgrupo:** Haz clic en la casilla de selección ubicada en la cabecera del subgrupo (por ejemplo, *Telecomunicaciones*).
3. **Ajustar transparencia en Fachadas v2:** En la primera capa (*Fachadas v2*), desliza la barra horizontal hacia la derecha o izquierda para variar el nivel de transparencia de 0% a 100%.
4. **Acciones Rápidas:** Utiliza los botones **TODAS** o **NINGUNA** en la parte superior derecha de cada categoría para encender o apagar rápidamente todo el bloque.

### Para el Diseñador en Experience Builder:
1. Selecciona el widget en el lienzo de Experience Builder para abrir el panel lateral de configuración.
2. En la sección **Mapa y Escena**, asegúrate de que se encuentren seleccionados los widgets de Mapa (2D) y Escena (3D) de tu aplicación.
3. En la sección **Categorías y Capas**:
   - Puedes seleccionar cualquier categoría en el menú desplegable.
   - Para reordenar una capa, usa las flechas **↑** (Subir) o **↓** (Bajar).
   - Para modificar el nombre visible o el nombre correspondiente en el mapa/escena, haz clic sobre la capa para desplegar sus propiedades.
   - Para **eliminar una capa** (incluso las capas predeterminadas), haz clic en el botón **✕** (Eliminar).
   - Para **crear una nueva capa**, haz clic en el botón **+ Agregar Capa**, ingresa el título, selecciona el subgrupo opcional y haz clic en **Guardar Capa**.

---

## 7. Preguntas Frecuentes

**¿Por qué al encender una capa de Telecomunicaciones o Arbolado no se encienden las demás?**
Porque cada elemento cuenta con un filtro estricto por identificador y nombre limpio, garantizando que el comando de visibilidad actúe únicamente sobre el servicio específico solicitado.

**¿Qué ocurre si cambio de nombre una capa en mi Web Map de ArcGIS?**
Basta con abrir el panel de configuración del widget, seleccionar la capa correspondiente y actualizar el campo *"Nombre en Web Map"* con el nuevo título exacto.

**¿Se pueden restaurar los valores de fábrica si se borraron capas por error?**
Sí. En la parte inferior del panel de configuración existe el botón *"Restaurar categorías predeterminadas"* que restituye la configuración canónica original.

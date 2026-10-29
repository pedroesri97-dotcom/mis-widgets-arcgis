# Avance de obra (escena) · SDP

Copia del widget *Avance de obra (escena)* compilada para el **portal de la SDP** (`sinupotdes.sdp.gov.co/portalp`,
ArcGIS Enterprise 11.5, Experience Builder **1.17.0**, ArcGIS Maps SDK for JavaScript **4.32**).

Abre en su propio recuadro el web scene «Avance de obra - PLMB» del portal de la SDP (o trabaja sobre un widget Mapa
elegido en la configuración) y colorea E15, I16 y E16 por estado de avance o por cronograma (4D), con fecha de corte,
reproducción, curva programada, corte, giro y la volumetría sin los edificios que tocan las estaciones. Publica la
fuente de datos «Elementos de avance» para los widgets de Gráfico, Tabla, Filtro y Lista.

## Registro en el portal

1. Publica este repositorio en GitHub y activa **Settings → Pages → Deploy from branch → main / (root)**.
2. En el portal: **Contenido → Nuevo elemento → Aplicación → Widget de Experience Builder**, con la URL
   `https://dureyes97.github.io/avance-obra-escena-sdp/manifest.json`. Comparte el elemento.
3. En el Experience Builder del portal, agrega **Avance de obra (escena) · SDP** desde los widgets personalizados y, en
   su configuración, revisa la **URL de los datos** (por defecto `https://dureyes97.github.io/avance-plmb`).

Registrar widgets requiere un rol con ese privilegio en el portal.

## Diferencias con la versión de Experience Builder 1.21

- `manifest.json`: nombre `avance-obra-escena-sdp`, `version` y `exbVersion` 1.17.0.
- Los archivos `.tsx` usan JSX clásico (`/** @jsxRuntime classic */` y `jsx` de `jimu-core`): la versión 1.21
  compila JSX contra `jimu-core/emotion`, que no existe en Experience Builder 1.17.

`dist/` se compiló con Experience Builder Developer 1.21 (`WIDGET_NAME=avance-obra-escena-sdp`, modo producción) y se
comprobó contra los archivos que sirve el portal: todos los nombres que importa de `jimu-core`, `jimu-arcgis` y
`jimu-ui` existen en su versión 1.17, y los nueve módulos `esri/*` existen en su API 4.32.

## Datos

El widget lee `data/avance-elements.json` y `predial-station-footprints.json` de la URL de los datos
(repositorio [avance-plmb](https://github.com/dureyes97/avance-plmb)). Sin ellos la escena se ve, pero sin colores
de avance, panel 4D ni huellas.

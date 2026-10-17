# Plantillas de Tours PV y su relación con el documento

Los RF-xx corresponden a la numeración de los requerimientos del sistema (sección 11.1.2 del documento);
los TS/UT/IT/PE/VL son los casos de prueba de la sección 17.

## Sitio público

| Plantilla | Ruta sugerida | Requerimientos | Pruebas |
|---|---|---|---|
| `home.html` | `GET /` | RF de consulta de tours y yates | TS-01, TS-02 |
| `experiencias.html` | `GET /tours` | Consulta de tours | TS-01 |
| `yates.html` | `GET /yates` | Consulta y comparación de yates | TS-02 |
| `tour-detalle.html` | `GET /tours/{id}` | RF-8, RF-9 + consulta de disponibilidad | TS-03 a TS-06, PE-03/04 |
| `yate-detalle.html` | `GET /yates/{id}` | RF-8, RF-9, RF-10 + consulta de disponibilidad | TS-03 a TS-06, UT-03, VL-05 |
| `pago.html` | `GET /pago` y `POST /checkout/stripe` | RF-17, RF-20, RF-21 | TS-11, IT-05 |
| `confirmacion.html` | `GET /reservas/{codigo}/confirmacion` | RF-14, RF-17, RF-18, RF-19 | TS-07, IT-03 |
| `comprobante.html` | `GET /comprobante/{codigo}` | RF-19 | IT-06 |
| `consulta-reserva.html` | `GET /mis-reservas` y `POST /mis-reservas` | RF-16 | TS-08 |
| `mi-reserva.html` | `GET /mis-reservas/{codigo}` | RF-16 (consultar, modificar, cancelar) | TS-08, TS-09, TS-10 |
| `pago-rechazado.html` | `GET /pago/rechazado` | RF-17, RF-18 (flujos alternativos de CU-04) | TS-11 |

> El aviso de "horario no disponible" ya no es una página: vive dentro de `tour-detalle.html` y
> `yate-detalle.html` (RF-9, TS-06). Para verlo abre la página con `?demo=no-disponible`.
> En Laravel se devuelve con `back()->withInput()->withErrors(['disponibilidad' => '...'])`.

## Panel administrativo

| Plantilla | Ruta sugerida | Requerimientos | Pruebas |
|---|---|---|---|
| `admin-login.html` | `GET/POST /admin/login` | RF-1 a RF-7 | TS-12, TS-13 |
| `admin-dashboard.html` | `GET /admin/dashboard` | Panel general | |
| `admin-tours.html` | `/admin/tours` | RF-23 | TS-14 |
| `admin-yates.html` | `/admin/yates` | RF-10, RF-24 | TS-15, UT-03 |
| `admin-clientes.html` | `/admin/clientes` | RF-25 + promociones | TS-16 |
| `admin-reservas.html` | `/admin/reservas` | RF-12, RF-22, RF-26 | TS-17 |
| `admin-pagos.html` | `/admin/pagos` | RF-18, RF-22 (diagrama 4.1.7) | IT-05 |
| `admin-reportes.html` | `/admin/reportes` | RF-27 | TS-18 |

## Pendiente de definir

- Política de reembolso del anticipo (hoy `mi-reserva.html` no promete devoluciones).
- Máximo de horas por renta de yate y máximo de personas por tour (valores límite VL-03, VL-04).
- Horarios de salida y cupo por salida de cada tour (hoy los horarios están fijos en `tour-detalle.html`).
- Interfaz en inglés.
- Plantillas de correo: confirmación con código y promociones.

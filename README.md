# Modulo Operador y Control de Acceso - LAIKA Club (laika-operador)

Terminal web de control de acceso, validacion optica de boletos y gestion de incidencias en torniquetes y puertas para el personal de campo y staff de LAIKA Club.

---

## 1. Descripcion General

El modulo `laika-operador` proporciona una interfaz optimizada para dispositivos portatiles, tablets y estaciones de computo instaladas en los puntos de acceso a eventos. Su objetivo primordial es ejecutar la lectura instantanea de codigos QR, verificar la autenticidad criptografica del pase digital en el microservicio transaccional de boletos, bloquear ingresos duplicados y documentar incidencias operativas en tiempo real.

La aplicacion esta desacoplada del frontend publico y canaliza sus peticiones de forma segura mediante el API Gateway Pilgrim en el puerto 8000.

---

## 2. Stack Tecnologico

- **Framework Web**: React 19.2.8
- **Empaquetador y Servidor de Desarrollo**: Vite 8.2.2
- **Escaneo Optico de Codigos QR (Camara / Dispositivo)**: html5-qrcode 2.3.8
- **Enrutamiento**: React Router DOM 7.18.3
- **Metricas y Visualizacion de Flujo de Entrada**: Recharts 3.10.1 y Plotly.js 4.0.0
- **Comunicacion en Tiempo Real**: Socket.IO Client 4.8.3
- **Estilos Modulares**: Styled-Components 6.5.3
- **Iconografia**: Lucide React 1.41.0
- **Linter de Alto Rendimiento**: Oxlint 1.79.0
- **Cliente HTTP**: Axios 1.20.0

---

## 3. Arquitectura y Comunicacion

- **Puerto Local**: 3030 (rango de red asignado para el rol operador: 3030-3039)
- **API Gateway (Pilgrim)**: `http://localhost:8000/api/staff` y `/api/tickets/verify`
- **Mecanismo de Autenticacion**: Cabecera `Authorization: Bearer <token>` emitida con rol `operador` o `admin`.

```
[ Camara / Scanner Fisico ]
            |
            v
[ laika-operador (Vite SPA - Puerto 3030) ]
            |
            | Peticion POST /api/tickets/verify
            v
[ Pilgrim API Gateway (Puerto 8000) ]
            |
            +---> /api/tickets/verify  ---> Microservicio Tickets (Puerto 8202)
            +---> /api/staff/*         ---> Microservicio Tickets / Admin (8202 / 8102)
```

### Logica de Validacion y Maquina de Estados
Cada lectura de boleto transita por la maquina de estados del microservicio `laika_tickets`:
- `VALID_ACCESS`: Boleto legitimo, titular identificado y puerta habilitada. El estado transmuta inmediatamente de `active` a `used` para invalidar segundas lecturas.
- `ALREADY_REDEEMED`: Boleto ya canjeado previamente. Se emite alerta inmediata en pantalla con la hora exacta del ingreso original para neutralizar fraude o duplicacion de capturas de pantalla.
- `INVALID_CODE`: El codigo escaneado no corresponde a ningun registro en la base de datos o fue revocado por cancelacion/reembolso.

---

## 4. Funcionalidades Principales

1. **Terminal de Escaneo Optico de Alta Velocidad**:
   - Acceso nativo a la camara trasera de dispositivos moviles o lectores USB.
   - Procesamiento de video continuo con deteccion automatica de codigos QR.
   - Entrada manual asistida para ingreso de codigos alfanumericos de contingencia.

2. **Indicador Visual y Sonoro de Estatus de Acceso**:
   - Respuesta inmediata en pantalla con senales visuales de alto contraste (verde para autorizacion, rojo para rechazo, amarillo para advertencia).
   - Informacion del titular, zona, fila y numero de asiento asignado.

3. **Registro y Clasificacion de Incidencias**:
   - Registro instantaneo de anomalias (boleto danado, persona no acreditada, asiento duplicado, solicitud de atencion especial).
   - Notificacion directa al equipo de administracion central.

4. **Contador de Aforo en Puerta**:
   - Conteo acumulado de asistentes ingresados por puerta asignada.
   - Indicador de ritmo de ingreso por minuto.

---

## 5. Estructura del Proyecto

```
laika-operador/
├── src/
│   ├── components/          # Componentes visuales y terminal de escaneo
│   │   ├── Scanner/         # Integracion con html5-qrcode
│   │   ├── StatusBadge/     # Indicadores semanticos de validacion
│   │   └── IncidentForm/    # Formulario rapido de reporte
│   ├── hooks/               # Custom hooks de validacion y camara
│   ├── pages/               # Vistas de la terminal operativa
│   │   ├── Terminal/        # Pantalla principal de escaneo de boletos
│   │   ├── Incidents/       # Bitacora de contingencias de acceso
│   │   └── Metrics/         # Graficas de afluencia por torniquete
│   ├── services/            # Clientes HTTP para comunicacion con la API
│   ├── styles/              # Paleta dark contrast adaptada para campo
│   ├── App.jsx              # Enrutador
│   └── main.jsx             # Punto de entrada
├── package.json
└── vite.config.js
```

---

## 6. Instalacion y Puesta en Marcha

### Prerrequisitos
- Node.js version 18 o superior.
- Navegador con permisos de acceso a camara (HTTPS o localhost).
- API Gateway Pilgrim activo en el puerto 8000.

### Instalacion de Dependencias
```bash
cd laika-operador
npm install
```

### Ejecucion en Entorno de Desarrollo
```bash
npm run dev
```
La aplicacion estara disponible en `http://localhost:3030`. Para pruebas desde dispositivos moviles en la misma red local, accede mediante la IP local de la maquina anfitriona (ejemplo: `http://192.168.1.X:3030`).

### Analisis Estatico con Oxlint
```bash
npm run lint
```

### Compilacion para Produccion
```bash
npm run build
```
Genera la distribucion para despliegue en servidores web o quioscos en `dist/`.

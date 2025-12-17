# Sistema de Gestión de Clínica Inteligente - Edición Empresarial (v2.0)

Una solución de gestión clínica full-stack de grado de producción construida con tecnologías empresariales modernas.

![Versión](https://img.shields.io/badge/version-2.0.0-blue)
![Compilación](https://img.shields.io/badge/build-passing-brightgreen)
![Cobertura](https://img.shields.io/badge/coverage-85%25-green)
![Licencia](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Características Clave

### 🔐 Seguridad Avanzada
- **Control de Acceso Basado en Roles (RBAC)**: Permisos granulares para roles de Administrador, Doctor y Paciente.
- **Autenticación JWT**: Autenticación segura y sin estado basada en tokens con filtros personalizados.
- **Rate Limiting**: Protección contra ataques DDoS y abuso de API utilizando Bucket4j.
- **Registro de Auditoría**: Seguimiento exhaustivo de todas las acciones críticas del sistema (listo para cumplimiento HIPAA).
- **Manejo Seguro de Contraseñas**: Encriptación BCrypt para todas las credenciales.

### 🏥 Operaciones Clínicas
- **Portal del Doctor**: Panel de control, Gestión de Citas, Redactor de Recetas con generación de PDF.
- **Portal del Paciente**: Reserva en línea, Historial Médico, Historial de Recetas, Carga de Documentos.
- **Recordatorios Automáticos**: Sistema de envío de correos electrónicos programados para citas próximas.
- **Registros Médicos**: Almacenamiento digital de diagnósticos, planes de tratamiento y archivos adjuntos.
- **Seguimiento de Alergias y Condiciones**: Información vital de salud del paciente de un vistazo.

### 💼 Características de Negocio
- **Procesamiento de Pagos**: Seguimiento integrado de pagos, informes de ingresos y generación de facturas.
- **Sistema de Reseñas**: Calificaciones y reseñas de pacientes para doctores con capacidades de moderación.
- **Sistema de Notificaciones**: Alertas en tiempo real, recordatorios por correo electrónico y notificaciones en la aplicación.
- **Panel de Análisis**: Estado financiero, métricas de rendimiento y estadísticas de citas.

### 🛠 Excelencia Técnica
- **PWA (Progressive Web App)**: Soporte offline e instalable en dispositivos móviles.
- **Infraestructura Cloud-Native**: Manifiestos de Kubernetes y Docker Registry Workflow.
- **Documentación de API**: Documentación Swagger/OpenAPI 3.0 totalmente interactiva.
- **Monitoreo**: Métricas de Prometheus y comprobaciones de salud de Actuator.
- **Rendimiento**: Caché de Redis para endpoints de alta carga.
- **Manejo Global de Errores**: Respuestas de error estandarizadas en toda la API.

## 🏗 Arquitectura

```
smart-clinic-management/
├── backend/                    # Aplicación Empresarial Spring Boot 3
│   ├── src/main/java/com/smartclinic/
│   │   ├── config/            # Configuraciones de Seguridad, Swagger, CORS
│   │   ├── security/          # Filtros JWT, Lógica de Autenticación
│   │   ├── entity/            # Entidades JPA (Modelo de Dominio Rico)
│   │   ├── repository/        # Capa de Acceso a Datos
│   │   ├── service/           # Capa de Lógica de Negocio
│   │   ├── controller/        # Controladores API REST
│   │   ├── dto/               # Objetos de Transferencia de Datos
│   │   └── exception/         # Manejo Global de Excepciones
│   └── src/main/resources/    # Configuraciones, Migraciones SQL
├── frontend-react/             # Portal Web Moderno (React + Vite)
├── database/                   # Scripts de Base de Datos
│   ├── schema.sql             # Esquema Base
│   └── migration_v2.sql       # Migraciones Empresariales V2
└── docker-compose.yml          # Orquestación de Contenedores
```

## 📋 Prerrequisitos

- Docker y Docker Compose (Recomendado)
- Java 17 LTS (Para desarrollo local)
- Node.js 18+ (Para desarrollo frontend)

## 🛠 Configuración e Instalación

### Opción 1: Despliegue Rápido con Docker (Recomendado)

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/tu-usuario/smart-clinic-management.git
    cd smart-clinic-management
    ```

2.  **Iniciar los servicios**
    ```bash
    docker-compose up --build
    ```

3.  **Acceder a la aplicación**
    - Frontend: http://localhost
    - Backend API: http://localhost:8082
    - Documentación API: http://localhost:8082/swagger-ui.html

### Opción 2: Desarrollo Local Manual

#### 1. Configuración de Base de Datos
```bash
# Asegúrate de tener MySQL 8.0 corriendo
mysql -u root -p < database/schema.sql
```

#### 2. Configuración del Backend
Edita `backend/src/main/resources/application.properties` o establece variables de entorno:
```properties
export DB_PASSWORD=tu_contraseña
export JWT_SECRET=tu_clave_secreta_segura
```

#### 3. Construir y Ejecutar Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### 4. Ejecutar Frontend
```bash
cd frontend-react
npm install
npm run dev
```

## 🔌 Endpoints de API (V2)

El sistema expone una API RESTful completa. Ver Swagger UI para detalles completos.

| Módulo | Ruta Base | Descripción |
|--------|-----------|-------------|
| **Auth** | `/api/auth` | Login, Registro, Refrescar Token |
| **Doctores** | `/api/doctors` | Perfiles, Disponibilidad, búsqueda |
| **Pacientes** | `/api/patients` | Perfiles, Historial Médico |
| **Citas** | `/api/appointments` | Programación, Reprogramación |
| **Recetas** | `/api/prescriptions` | Generación de Rx Digital |
| **Notificaciones** | `/api/notifications` | Sistema de alertas de usuario |
| **Pagos** | `/api/payments` | Facturación y recibos |
| **Reseñas** | `/api/reviews` | Sistema de calificación de doctores |

## 🧪 Pruebas

El proyecto mantiene altos estándares de calidad de código.

```bash
# Ejecutar Pruebas Unitarias y de Integración
mvn test

# Generar Informe de Cobertura
mvn jacoco:report
```

## 📦 Despliegue (Docker)

```bash
docker-compose up --build -d
```

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

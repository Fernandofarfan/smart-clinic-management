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
- **Registro de Auditoría**: Seguimiento exhaustivo de todas las acciones críticas del sistema (listo para cumplimiento HIPAA).
- **Manejo Seguro de Contraseñas**: Encriptación BCrypt para todas las credenciales.

### 🏥 Operaciones Clínicas
- **Portal del Doctor**: Panel de control, Gestión de Citas, Redactor de Recetas con generación de PDF.
- **Portal del Paciente**: Reserva en línea, Historial Médico, Historial de Recetas, Carga de Documentos.
- **Registros Médicos**: Almacenamiento digital de diagnósticos, planes de tratamiento y archivos adjuntos.
- **Seguimiento de Alergias y Condiciones**: Información vital de salud del paciente de un vistazo.

### 💼 Características de Negocio
- **Procesamiento de Pagos**: Seguimiento integrado de pagos, informes de ingresos y generación de facturas.
- **Sistema de Reseñas**: Calificaciones y reseñas de pacientes para doctores con capacidades de moderación.
- **Sistema de Notificaciones**: Alertas en tiempo real, recordatorios por correo electrónico y notificaciones en la aplicación.
- **Panel de Análisis**: Estado financiero, métricas de rendimiento y estadísticas de citas.

### 🛠 Excelencia Técnica
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
├── frontend/                   # Portal Web Moderno (Migrando a React)
├── database/                   # Scripts de Base de Datos
│   ├── schema.sql             # Esquema Base
│   └── migration_v2.sql       # Migraciones Empresariales V2
└── docker-compose.yml          # Orquestación de Contenedores
```

## 📋 Prerrequisitos

- Java 17 LTS
- Maven 3.9+
- MySQL 8.0+
- Redis (Opcional, para caché)
- Servidor SMTP (Opcional, para correos - por defecto usa Mailtrap)

## 🛠 Configuración e Instalación

### 1. Configuración de Base de Datos
```bash
# Crear base de datos y aplicar migraciones
mysql -u root -p < database/schema.sql
mysql -u root -p < database/migration_v2.sql
```

### 2. Configuración del Backend
Edita `backend/src/main/resources/application.properties` para que coincida con tu entorno:
```properties
spring.datasource.password=tu_contraseña
jwt.secret=tu_clave_secreta_segura
spring.mail.username=tu_usuario_correo
```

### 3. Construir y Ejecutar
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Accede a la Documentación de la API en: http://localhost:8080/swagger-ui.html

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

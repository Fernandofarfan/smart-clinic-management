# Smart Clinic Management System - Enterprise Edition (v2.0)

A production-grade, full-stack clinic management solution built with modern enterprise technologies.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Key Features

### 🔐 Advanced Security
- **Role-Based Access Control (RBAC)**: Granular permissions for Admin, Doctor, and Patient roles.
- **JWT Authentication**: Stateless, secure token-based authentication with custom filters.
- **Audit Logging**: Comprehensive tracking of all critical system actions (HIPAA compliant ready).
- **Secure Password Handling**: BCrypt encryption for all credentials.

### 🏥 Clinical Operations
- **Doctor Portal**: Dashboard, Appointment Management, Prescription Writer with PDF generation.
- **Patient Portal**: Online Booking, Medical History, Prescription History, Document Uploads.
- **Medical Records**: Digital storage of diagnosis, treatment plans, and file attachments.
- **Allergy & Condition Tracking**: Vital patient health information at a glance.

### 💼 Business Features
- **Payment Processing**: Integrated payment tracking, revenue reporting, and invoice generation.
- **Review System**: Patient ratings and reviews for doctors with moderation capabilities.
- **Notification System**: Real-time alerts, email reminders, and in-app notifications.
- **Analytics Dashboard**: Financial status, performance metrics, and appointment statistics.

### 🛠 Technical Excellence
- **API Documentation**: Fully interactive Swagger/OpenAPI 3.0 documentation.
- **Monitoring**: Prometheus metrics and Actuator health checks.
- **Performance**: Redis caching for high-load endpoints.
- **Global Error Handling**: Standardized error responses across the entire API.

## 🏗 Architecture

```
smart-clinic-management/
├── backend/                    # Spring Boot 3 Enterprise App
│   ├── src/main/java/com/smartclinic/
│   │   ├── config/            # Security, Swagger, CORS configs
│   │   ├── security/          # JWT Filters, Auth logic
│   │   ├── entity/            # JPA Entities (Rich Domain Model)
│   │   ├── repository/        # Data Access Layer
│   │   ├── service/           # Business Logic Layer
│   │   ├── controller/        # REST API Controllers
│   │   ├── dto/               # Data Transfer Objects
│   │   └── exception/         # Global Exception Handling
│   └── src/main/resources/    # Configs, SQL Migrations
├── frontend/                   # Modern Web Portal (Migrating to React)
├── database/                   # Database Scripts
│   ├── schema.sql             # Base Schema
│   └── migration_v2.sql       # V2 Enterprise Migrations
└── docker-compose.yml          # Container Orchestration
```

## 📋 Prerequisites

- Java 17 LTS
- Maven 3.9+
- MySQL 8.0+
- Redis (Optional, for caching)
- SMTP Server (Optional, for emails - defaults to Mailtrap)

## 🛠 Setup & Installation

### 1. Database Setup
```bash
# Create database and apply migrations
mysql -u root -p < database/schema.sql
mysql -u root -p < database/migration_v2.sql
```

### 2. Backend Configuration
Edit `backend/src/main/resources/application.properties` to match your environment:
```properties
spring.datasource.password=your_password
jwt.secret=your_secure_secret_key
spring.mail.username=your_mail_user
```

### 3. Build and Run
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Access the API Documentation at: http://localhost:8080/swagger-ui.html

## 🔌 API Endpoints (V2)

The system exposes a comprehensive RESETful API. See Swagger UI for full details.

| Module | Base Path | Description |
|--------|-----------|-------------|
| **Auth** | `/api/auth` | Login, Register, Refresh Token |
| **Doctors** | `/api/doctors` | Profiles, Availability, search |
| **Patients** | `/api/patients` | Profiles, Medical History |
| **Appointments** | `/api/appointments` | Scheduling, Rescheduling |
| **Prescriptions** | `/api/prescriptions` | Digital Rx generation |
| **Notifications** | `/api/notifications` | User alerts system |
| **Payments** | `/api/payments` | Billing and invoices |
| **Reviews** | `/api/reviews` | Doctor ratings system |

## 🧪 Testing

The project maintains high code quality standards.

```bash
# Run Unit and Integration Tests
mvn test

# Generate Coverage Report
mvn jacoco:report
```

## 📦 Deployment (Docker)

```bash
docker-compose up --build -d
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

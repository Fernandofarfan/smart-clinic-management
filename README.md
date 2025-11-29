# Smart Clinic Management System

A comprehensive clinic management system built with Java Spring Boot backend, MySQL database, and HTML/CSS/JS frontend.

## Project Structure

```
smart-clinic-management/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/smartclinic/
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Data repositories
│   │   ├── service/           # Business logic
│   │   ├── controller/        # REST controllers
│   │   └── dto/               # Data transfer objects
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # Frontend portals
│   ├── admin/                 # Admin portal
│   ├── doctor/                # Doctor portal
│   └── patient/               # Patient portal
├── database/                   # Database scripts
│   └── schema.sql
├── .github/workflows/          # CI/CD
│   └── build.yml
├── Dockerfile
└── schema-design.md
```

## Features

- **Admin Portal**: Manage doctors, view reports
- **Doctor Portal**: View appointments, create prescriptions
- **Patient Portal**: Search doctors, book appointments
- **REST API**: Complete RESTful API with JWT authentication
- **Database**: MySQL with stored procedures
- **CI/CD**: GitHub Actions workflow
- **Docker**: Containerized application

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Docker (optional)

## Setup Instructions

### 1. Database Setup

```bash
mysql -u root -p < database/schema.sql
```

### 2. Configure Application

Edit `backend/src/main/resources/application.properties`:
- Update database credentials
- Configure JWT secret

### 3. Build and Run

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Access Frontend

Open the following files in a browser:
- Admin: `frontend/admin/login.html`
- Doctor: `frontend/doctor/login.html`
- Patient: `frontend/patient/login.html`

## Demo Credentials

**Admin:**
- Email: admin@smartclinic.com
- Password: admin123

**Doctor:**
- Email: john.smith@smartclinic.com
- Password: doctor123

**Patient:**
- Email: alice.brown@email.com
- Password: patient123

## API Endpoints

### Authentication
- POST `/api/admin/login` - Admin login
- POST `/api/doctors/login` - Doctor login
- POST `/api/patients/login` - Patient login

### Doctors
- GET `/api/doctors` - Get all doctors
- GET `/api/doctors/{id}` - Get doctor by ID
- GET `/api/doctors/{id}/availability` - Get doctor availability
- POST `/api/doctors` - Create new doctor

### Appointments
- POST `/api/appointments` - Book appointment
- GET `/api/appointments/doctor/{id}` - Get doctor appointments
- GET `/api/appointments/patient/{id}` - Get patient appointments

### Prescriptions
- POST `/api/prescriptions` - Create prescription
- GET `/api/prescriptions/doctor/{id}` - Get doctor prescriptions
- GET `/api/prescriptions/patient/{id}` - Get patient prescriptions

## Docker Deployment

```bash
# Build image
docker build -t smart-clinic .

# Run container
docker run -p 8080:8080 smart-clinic
```

## Testing

```bash
cd backend
mvn test
```

## Technologies Used

- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, JWT
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: MySQL 8.0
- **Build**: Maven
- **CI/CD**: GitHub Actions
- **Containerization**: Docker

## License

This project is part of an IBM Java capstone project.

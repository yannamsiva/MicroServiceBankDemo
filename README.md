# Digital Banking System - Full Stack Project

## 🏦 Project Overview

A complete Digital Banking System with microservice architecture, featuring user authentication, account management, transaction history, and fund transfer capabilities.

## 🏗️ Architecture

### Frontend (Node.js + Express)
- **Location**: `frontend/`
- **Port**: 3000
- **Technology**: HTML, CSS, JavaScript, Bootstrap 5, Node.js, Express

### Backend (Spring Boot)
- **Location**: `backend/`
- **Port**: 8080
- **Technology**: Java 11, Spring Boot 2.7.18, Hibernate, JWT, H2 Database

## 🚀 Quick Start

### Prerequisites
- Java 11 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Running the Application

#### 1. Start Frontend
```bash
cd frontend
npm install
npm start
```
Frontend will be available at: http://localhost:3000

#### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```
Backend API will be available at: http://localhost:8080/api

#### 3. Using Docker (Alternative)
```bash
docker-compose up
```

## 📁 Project Structure

```
DBS/
├── frontend/                 # Node.js Frontend
│   ├── pages/               # HTML pages
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript modules
│   ├── server.js            # Express server
│   └── package.json         # Node.js dependencies
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/       # Java source code
│   ├── src/main/resources/  # Configuration files
│   ├── pom.xml             # Maven dependencies
│   └── Dockerfile          # Backend container
├── docker-compose.yml       # Multi-container setup
└── README.md               # This file
```

## 🎯 Features Implemented

### Frontend Features
- ✅ **User Authentication**: Login/Register with validation
- ✅ **Dashboard**: Account balance overview and recent transactions
- ✅ **Transaction History**: Filterable transaction list with search
- ✅ **Fund Transfer**: Internal and external transfer system
- ✅ **Profile Management**: User profile and security settings
- ✅ **Responsive Design**: Mobile-first Bootstrap 5 design
- ✅ **Modern UI/UX**: Beautiful animations and interactions

### Backend Features
- ✅ **Spring Boot Microservice**: RESTful API architecture
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Database Design**: Normalized relational database with Hibernate
- ✅ **User Management**: Complete user CRUD operations
- ✅ **Security**: Password encryption, CORS, validation
- ✅ **Docker Support**: Containerized deployment

## 🔧 Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom styles with animations
- **JavaScript (ES6+)**: Modern JavaScript with modules
- **Bootstrap 5**: Responsive UI framework
- **Node.js**: Server-side JavaScript
- **Express.js**: Web application framework

### Backend
- **Java 11**: Core programming language
- **Spring Boot 2.7.18**: Application framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Data access layer
- **Hibernate**: ORM framework
- **H2 Database**: In-memory database
- **JWT**: JSON Web Tokens for authentication
- **Maven**: Build tool and dependency management

### DevOps & Tools
- **Docker**: Containerization
- **Git**: Version control
- **JUnit**: Unit testing (backend)
- **CORS**: Cross-origin resource sharing

## 🗄️ Database Schema

### Users Table
- User authentication and profile information
- Security settings (2FA, notifications)
- Account status and timestamps

### Accounts Table
- Multiple account types (Savings, Checking, Investment, Credit)
- Account balances and status
- User relationships

### Transactions Table
- Transaction history with types (Credit, Debit, Transfer)
- Amount, description, and status
- Account relationships and timestamps

## 🔐 Security Features

- **JWT Authentication**: Secure token-based sessions
- **Password Encryption**: BCrypt hashing
- **CORS Configuration**: Frontend-backend integration
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Hibernate ORM protection

## 📱 Demo Credentials

- **Email**: `demo@example.com`
- **Password**: `Password123!`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/{id}` - Get user by ID

### Health & Monitoring
- `GET /api/actuator/health` - Application health
- `GET /api/actuator/info` - Application info

## 🐳 Docker Deployment

### Build and Run with Docker
```bash
# Build and run both services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

### Individual Container Builds
```bash
# Frontend
cd frontend
docker build -t dbs-frontend .

# Backend
cd backend
docker build -t dbs-backend .
```
## 🚀 Deployment

### Local Development
1. Start frontend: `cd frontend && npm start`
2. Start backend: `cd backend && mvn spring-boot:run`
3. Access frontend: http://localhost:3000
4. Access backend API: http://localhost:8080/api

### Production Deployment
1. Build Docker images
2. Configure environment variables
3. Deploy with docker-compose
4. Set up reverse proxy (nginx)
5. Configure SSL certificates

## 🔧 Configuration

### Frontend Configuration
- Server port: 3000
- API base URL: http://localhost:8080/api
- CORS settings for backend integration

### Backend Configuration
- Server port: 8080
- Database: H2 in-memory
- JWT secret and expiration
- CORS settings for frontend

#### Frontend Issues
- **Port 3000 in use**: Change port in `frontend/server.js`
- **API connection errors**: Check backend is running on port 8080
- **CORS errors**: Verify CORS configuration in backend

#### Backend Issues
- **Port 8080 in use**: Change `server.port` in `application.properties`
- **Database connection**: Check H2 console at http://localhost:8080/h2-console
- **JWT errors**: Verify JWT secret in configuration

#### Docker Issues
- **Container build failures**: Check Dockerfile syntax
- **Port conflicts**: Change ports in docker-compose.yml
- **Volume mounting**: Verify file permissions

# Check Docker containers
docker ps
docker logs <container-name>

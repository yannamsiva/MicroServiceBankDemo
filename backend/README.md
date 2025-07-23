# Digital Banking System - Backend

A comprehensive digital banking system built with Spring Boot, MySQL, and JWT authentication.

## 🗄️ Database: MySQL

This project uses **MySQL 8.0** as the primary database.

### Database Configuration
- **Database Name**: `digital_banking`
- **Username**: `root` (default)
- **Password**: `password` (configurable)
- **Port**: `3306`

## 🚀 Quick Start

### Prerequisites
- Java 11 or higher
- Maven 3.6+
- MySQL 8.0
- Node.js (for frontend)

### 1. Install MySQL

#### On macOS (using Homebrew):
```bash
brew install mysql
brew services start mysql
```

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### On Windows:
Download and install MySQL from the official website.

### 2. Setup MySQL Database

```bash
# Connect to MySQL as root
mysql -u root -p

# Create database (or run the setup script)
CREATE DATABASE digital_banking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit MySQL
exit
```

### 3. Configure Database Connection

Update `src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/digital_banking?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### 4. Run the Application

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean compile

# Run the application
mvn spring-boot:run
```

The application will automatically create the database tables on startup.

## 🏗️ Architecture

### Database Schema
- **users** - User accounts and profiles
- **accounts** - Bank accounts (savings, checking, etc.)
- **transactions** - Financial transactions

### API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID

### Security
- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration for frontend integration

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start all services (MySQL, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build backend image
docker build -t dbs-backend ./backend

# Run with MySQL
docker run -d --name dbs-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=digital_banking \
  -p 3306:3306 \
  mysql:8.0

# Run backend
docker run -d --name dbs-backend \
  -p 8080:8080 \
  --link dbs-mysql:mysql \
  dbs-backend
```

## 🔧 Configuration

### Environment Variables
- `SPRING_DATASOURCE_URL` - MySQL connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `APP_JWT_SECRET` - JWT signing secret
- `APP_JWT_EXPIRATION` - JWT expiration time

### Database Properties
- **DDL Auto**: `create-drop` (recreates tables on startup)
- **Show SQL**: Enabled for development
- **Dialect**: MySQL8Dialect

## 📊 Database Management

### Connect to MySQL
```bash
mysql -u root -p digital_banking
```

### View Tables
```sql
SHOW TABLES;
```

### View Data
```sql
SELECT * FROM users;
SELECT * FROM accounts;
SELECT * FROM transactions;
```

## 🧪 Testing

```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify
```

## 📝 API Documentation

### Authentication
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Password123!"}'
```

### Users
```bash
# Get all users
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔍 Troubleshooting

### Common Issues

1. **MySQL Connection Failed**
   - Ensure MySQL is running: `brew services list` (macOS)
   - Check credentials in `application.properties`
   - Verify database exists: `SHOW DATABASES;`

2. **Port Already in Use**
   - Check if MySQL is running on port 3306
   - Check if Spring Boot is running on port 8080

3. **Database Tables Not Created**
   - Check MySQL logs for errors
   - Verify database permissions
   - Check Hibernate dialect configuration

### Logs
```bash
# View application logs
tail -f logs/application.log

# View MySQL logs
sudo tail -f /var/log/mysql/error.log
```

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Documentation](https://jwt.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 
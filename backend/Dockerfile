FROM openjdk:11-jdk-slim

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build the application
RUN mvn clean package -DskipTests

# Create a non-root user
RUN addgroup --system app && adduser --system --ingroup app app

# Copy the built jar
RUN cp target/digital-banking-system-1.0.0.jar app.jar

# Change ownership
RUN chown app:app app.jar

# Switch to non-root user
USER app

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 
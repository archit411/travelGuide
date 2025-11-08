FROM openjdk:17-jdk-slim
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests
EXPOSE 8080
<<<<<<< HEAD
CMD ["java", "-jar", "target\travelGuide-0.0.1-SNAPSHOT.jar"]
=======
CMD ["java", "-jar", "target/travelGuide-0.0.1-SNAPSHOT.jar"]
>>>>>>> f0e2c030965a38f1fcabd0422a137e4e895e57aa

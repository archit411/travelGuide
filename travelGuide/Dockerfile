FROM openjdk:17-jdk-slim
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "C:\Users\archi\git\TripEasy4u_prod\travelGuide\travelGuide\target\travelGuide-0.0.1-SNAPSHOT.jar"]


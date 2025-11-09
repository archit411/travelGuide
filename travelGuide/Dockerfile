FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
CMD ["sh", "-c", "java -Dspring.datasource.url=$SPRING_DATASOURCE_URL \
    -Dspring.datasource.username=$SPRING_DATASOURCE_USERNAME \
    -Dspring.datasource.password=$SPRING_DATASOURCE_PASSWORD \
    -Djwt.secret=$JWT_SECRET \
    -jar target/travelGuide-0.0.1-SNAPSHOT.jar"]


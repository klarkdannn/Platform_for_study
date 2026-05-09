# Стадия 1: сборка JAR
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests -q

# Стадия 2: запуск (JDK нужен для javac внутри сервиса)
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/executor.jar app.jar
EXPOSE 4000
CMD ["java", "-jar", "app.jar"]

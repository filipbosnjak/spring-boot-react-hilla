FROM openjdk:17
FROM node:latest
FROM maven:latest

WORKDIR /app

COPY pom.xml .

COPY . .
RUN mvn clean package -Pproduction

CMD ["java", "-jar", "target/users-crud.jar"]

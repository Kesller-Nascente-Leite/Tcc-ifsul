FROM openjdk:21-jdk

LABEL authors="Kesller"

WORKDIR /app

COPY  target/back-end-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java","jar","/app/app.jar"]
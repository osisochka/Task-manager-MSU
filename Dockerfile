FROM gradle:8.12 AS build

WORKDIR /app
COPY . .

RUN ./gradlew clean bootJar --no-daemon --info

FROM eclipse-temurin:23-jre-alpine-3.21

WORKDIR /app
COPY --from=build /app/build/libs/WeAre8eqD-0.0.1-SNAPSHOT.jar app.jar

CMD ["java", "-jar", "/app/app.jar"]

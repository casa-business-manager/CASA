FROM ubuntu:22.04

# set up environment for frontend and backend development

RUN apt-get clean && apt-get update && apt-get install -y \
  sudo \
  openjdk-21-jdk \
  mariadb-server

VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
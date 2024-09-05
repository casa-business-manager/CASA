FROM ubuntu:22.04

RUN apt-get clean && apt-get update && apt-get install -y \
  sudo \
  openjdk-21-jdk \
  mariadb-server

VOLUME /tmp
COPY deployment/*.sh entrypoint.sh
COPY deployment/*.jar app.jar

ENTRYPOINT ["./entrypoint.sh"]
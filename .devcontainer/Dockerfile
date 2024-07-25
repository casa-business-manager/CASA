FROM ubuntu:22.04

# set up environment for frontend and backend development

RUN apt-get clean && apt-get update && apt-get install -y \
  sudo \
  wget \
  curl \
  git \
  nodejs \
  make \
  openjdk-21-jdk \
  mariadb-server

# install maven
RUN wget https://dlcdn.apache.org/maven/maven-3/3.9.8/binaries/apache-maven-3.9.8-bin.tar.gz \
  && tar -xvf apache-maven-3.9.8-bin.tar.gz
RUN mv apache-maven-3.9.8 /opt/
ENV M2_HOME=/opt/apache-maven-3.9.8/
ENV PATH="$M2_HOME/bin:$PATH"

# mariadb is handled in entrypoint.sh
# TODO: run db in its own container, and expose the ports

# install npm and libraries
RUN curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
RUN sudo -E bash nodesource_setup.sh
RUN sudo apt-get install -y nodejs

# Useful shortcuts
RUN echo 'alias kill3000="fuser -k -n tcp 3000"' >> /etc/bash.bashrc
RUN echo 'alias kill8080="fuser -k -n tcp 8080"' >> /etc/bash.bashrc
RUN echo 'alias mvnStart="mvn spring-boot:run"' >> /etc/bash.bashrc
RUN echo 'alias dualStart="(cd /workspaces/CASA/frontend && npm start) & (cd /workspaces/CASA/backend && mvnStart)"' >> /etc/bash.bashrc
RUN echo "alias resetDB='sudo mariadb -e \"DROP DATABASE casa;\"; sudo mariadb -e \"CREATE DATABASE casa;\"'" >> /etc/bash.bashrc


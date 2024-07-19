FROM ubuntu:22.04

# set up environment for frontend and backend development

RUN apt-get clean && apt-get update && apt-get install -y \
  sudo \
  wget \
  curl \
  mariadb-server \
  nodejs \
  git 

# install java jdk
RUN wget https://download.oracle.com/java/22/latest/jdk-22_linux-x64_bin.tar.gz \
  && tar -xvf jdk-22_linux-x64_bin.tar.gz
RUN mv jdk-22.0.2 /opt/
ENV JAVA_HOME=/opt/jdk-22.0.2
ENV PATH="$JAVA_HOME/bin:$PATH"
	# do not use curly braces like ${PATH} because that's apparantly the host OS's PATH variable, not the container's

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
RUN echo 'alias kill3000="fuser -k -n tcp 3000"' >> ~/.bashrc
RUN echo 'alias kill8080="fuser -k -n tcp 8080"' >> ~/.bashrc
RUN echo "alias resetDB='sudo mariadb -e \"DROP DATABASE casa;\"; sudo mariadb -e \"CREATE DATABASE casa;\"'" >> ~/.bashrc

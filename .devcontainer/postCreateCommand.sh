#!/bin/bash

# Git settings
RUN git config --global push.default current 

# install frontend dependencies
(cd frontend && npm install --verbose);

#!/bin/bash

# Git settings
git config --global push.default current 
git config --global --add safe.directory ${containerWorkspaceFolder}

# install frontend dependencies
(cd frontend && npm install --verbose);

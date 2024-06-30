# Developer Guide
Internal documentation

## Dev Containers
First time setup guide:

1. Install [Dev Container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension on VS Code, and make sure Docker is installed.
2. Press F1 and select **Dev Containers: Reopen in Container**, and it should reopen your VS Code. The first time might take longer to load because it has to download and cache things.
3. Generate a new ssh key and set up your github with it. Then set your username and email with 
```git config --global user.name "FIRST_NAME LAST_NAME"```
and
```git config --global user.email "MY_NAME@example.com"```.
4. Install the **Recommended Java Extensions** as well as the **Spring Boot Tools** extension.
5. Done! Environment should be configured now and can be reopened when you reopen VS Code (Docker must be running). You can also go to `File > Open Recent > .../CASA [Dev Container]`. If you ever have to recreate your dev container, youll have to repeat steps 2-4.
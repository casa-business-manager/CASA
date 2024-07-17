# Developer Guide
Internal documentation

## Dev Containers
### First time setup guide:

1. Install [Dev Container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension on VS Code, and make sure Docker is installed.
2. Press F1 and select **Dev Containers: Reopen in Container**, and it should reopen your VS Code. The first time might take longer to load because it has to download and cache things.
3. Install the **Recommended Extensions** that pops up at the bottom right, or find them in the extensions tab. Most important are the **Extension Pack for Java** as well as the **Spring Boot Tools** extensions.
4. (Possibly optional) You may already an ssh key set up and working with the container. However, sometimes it will not find your ssh key. If needed, generate a new ssh key with `ssh-keygen` and set up your github with it. Then set your username and email with 
```git config --global user.name "FIRST_NAME LAST_NAME"```
and
```git config --global user.email "MY_NAME@example.com"```.
5. Done! Environment should be configured now and can be reopened when you reopen VS Code (Docker must be running). You can also go to `File > Open Recent > .../CASA [Dev Container]`. If you ever have to recreate your dev container, you'll have to repeat steps 2-4. Also, the devcontainer will only run `npm install` once when it is created so you won't have to start another download, but this might fail or the dependencies might change. After the devcontainer's initial creation you will have to rerun `npm install` and handle your own frontend packages as needed.

### FAQ
- "My VS Code says that the JDK was not found and the path it tries is on my local machine - not my container!"
1. Open your VS Code `settings.json` file (not the one in `/.vscode`)
2. Comment out the line with key `"java.home"`
3. Restart your devcontainer

- "Where are the recommended extensions?"
1. Open the VS Code "Extensions" menu from the sidebar
2. In the search bar, enter `@recommended`
3. Install the extensions
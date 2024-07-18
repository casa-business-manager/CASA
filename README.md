# Developer Guide
Internal documentation

## Dev Containers
### First time setup guide:

1. Install [Docker](https://www.docker.com/products/docker-desktop/), and get the [Dev Container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension on VS Code. If you are on Windows, you must have [WSL](https://learn.microsoft.com/en-us/windows/wsl/install#install-wsl-command) as well.
2. If you are using WSL, make sure you have an SSH key within it that is connected to GitHub.
3. Within VS Code, press F1 and select **Dev Containers: Clone Repository in Container Volume**, and it should bring up an option to select a repository to clone. Either paste in the repository URL or select an option through GitHub (you may need to sign in through GitHub). This will reopen your VS Code to the cloned repository inside the container. The first time might take longer to load because it has to download and cache things.
4. Install the **Recommended Extensions** that pops up at the bottom right, or find them in the extensions tab by searching ***@recommended***. Most important are the **Extension Pack for Java** as well as the **Spring Boot Tools** extensions as these are needed to run the backend.
5. (Possibly optional) You may already an ssh key set up and working with the container. However, sometimes it will not find your ssh key. If needed, generate a new ssh key with `ssh-keygen` and set up your github with it. Then set your username and email with 
```git config --global user.name "FIRST_NAME LAST_NAME"```
and
```git config --global user.email "MY_NAME@example.com"```.
6. Done! Environment should be configured now and can be reopened when you reopen VS Code (Docker must be running). You can also go to `File > Open Recent > .../CASA [Dev Container]`. If you ever have to recreate your dev container, you'll have to repeat steps 3-4. Also, the devcontainer will only run `npm install` once when it is created so you won't have to start another download, but this might fail or the dependencies might change. After the devcontainer's initial creation you will have to rerun `npm install` and handle your own frontend packages as needed.

### FAQ
- "My VS Code says that the JDK was not found and the path it tries is on my local machine - not my container!"
1. Open your VS Code `settings.json` file (not the one in `/.vscode`)
2. Comment out the line with key `"java.home"`
3. Restart your devcontainer

- "I'm getting a permission issue with GitHub after selecting an account"
1. When the menu pops up and you have to select an account, select "sign in with a new account"
2. If prompted, just enter in your existing account.
3. If they ask again, repeat this process.
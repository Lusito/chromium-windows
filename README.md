# chromium for windows installer

[![License](https://img.shields.io/badge/License-zlib/libpng-blue.svg)](https://github.com/Lusito/chromium-windows/blob/master/LICENSE)

Easily install and update Chromium for Windows

### What does it do?

When this package is installed, you'll get a command line tool `update-chromium`, which follows these steps:

- It downloads the latest 64bit chromium development build (as zip) from the official source (no third-party build):
  - `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Win_x64%2F`
- It removes `%LOCALAPPDATA%\Chromium\` except for `%LOCALAPPDATA%\Chromium\User Data`
- It extracts the chromium build into `%LOCALAPPDATA%\Chromium\`

### Installation via NPM

- To install the installer (this package), run:
  - ```npm install -g chromium-windows```
  - This will not install chromium itself!
- To install or update chromium run:
  - ```update-chromium```

**Important:** The last step needs to be manually executed by you in regular intervals, as there is no background task checking for updates!

### Set up environment variables

The developer build for chromium will nag about missing api keys. To fix this, you'll need to set 3 environment variables:

- GOOGLE_API_KEY => no
- GOOGLE_DEFAULT_CLIENT_ID => no
- GOOGLE_DEFAULT_CLIENT_SECRET => no

There are 3 ways to do this:

#### 1. Set them globally in the system properties dialog.

- Open the "System Properties" dialog
- Select the "Advanced" tab
- Press the "Environment variables..." button
- Add new user or system variables as seen above

#### 2. Set them globally via setx
This essentially does the same thing as above (for user variables).

Open a terminal and enter:
```batch
setx GOOGLE_API_KEY "no"
setx GOOGLE_DEFAULT_CLIENT_ID "no"
setx GOOGLE_DEFAULT_CLIENT_SECRET "no"
````

#### 3. Configure a custom chromium shortcut like this

This is good if you only want to set this for this instance of chromium (or if you're not allowed to change user/system environment variables)

Set this as target:
```
C:\Windows\System32\cmd.exe /c "SET GOOGLE_API_KEY=no && SET GOOGLE_DEFAULT_CLIENT_ID=no && SET GOOGLE_DEFAULT_CLIENT_SECRET=no && START /D ^"%LOCALAPPDATA%\Chromium\" chrome.exe"
```

And this as "Start in":
```
%LOCALAPPDATA%\Chromium
```

### Report isssues

Something not working quite as expected? Do you need a feature that has not been implemented yet? Check the [issue tracker](https://github.com/Lusito/chromium-windows/issues) and add a new one if your problem is not already listed. Please try to provide a detailed description of your problem, including the steps to reproduce it.

### Contribute

Awesome! If you would like to contribute with a new feature or submit a bugfix, fork this repo and send a pull request. Please, make sure all the unit tests are passing before submitting and add new ones in case you introduced new features.

### License

The chromium windows installer has been released under the [zlib/libpng](https://github.com/Lusito/chromium-windows/blob/master/LICENSE) license, meaning you
can use it free of charge, without strings attached in commercial and non-commercial projects. Credits are appreciated but not mandatory.

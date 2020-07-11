IITC-Plugin Kit
============
Addon developing framework for IITC - Ingress Intel Total Conversation.

If you don't know IITC or the game Ingress your landed on the wrong website.
See [www.ingress.com](https://www.ingress.com/), [iitc.app](iitc.app) or [iitc.me](iitc.me)


With this framework you can ...
- use Typescript for addon developing
- create a new plugin with a single command
- split your code into multiple files
- directly include images or css files
- debug your code inside the browser
- ...


Required software
============
- [nodejs](https://nodejs.org)
- [yarn](https://yarnpkg.com)


Starting a new plugin
============

In a new directory run:
```
yarn add iitcpluginkit
```
to install this framework.

```
yarn ipk
```
will help you creating all configuration files and the main plugin file.

At this point you already have a working plugin. You only have to fill in your new ideas.



Build & Install your plugin
============
The short way: ```yarn autobuild```

This will build your plugin and start a local file server you can use to install it.
Additional it will watch for files changes and rebuild your plugin if required.
So while autobuild is running open [localhost:8100](localhost:8100) and install or update your plugin.

If you prefer the manual way: run ```yarn build``` to build your plugin inside the `/dist/` folder.

see [Yarn Tool commands](#Yarn-Tool-commands)


Coding
==================
At this point `yarn ipk` should already had created your plugin main file. Default: /src/Main.ts. 
That's were you start coding. `init()` will be called on plugin start. This is you entry point.

Most of the common used IITC functions should be already availible. If you're not sure what you need or what function IITC provides you could look at _./nodes_modules/iitcpluginkit/src/types/iitc_ or take a look at the real iitc-code.

A coding tutorial will be available soon.



Yarn Tool commands
==================

| Command | Description |
| --- | --- |
| `yarn build` | alias for `yarn build:dev` |
| `yarn build:dev` | developer build |
| `yarn build:prod` | production build |
| `yarn start` | runs a fileserver for the 'out'-directory |
| `yarn autobuild` | auto rebuild on filechange & running the fileserver |


Developer vs Production build
==================
The production code will not include sourcemaps or console commands and the resulting javascript code is minimized.

The version number will not contain the build-date in production code. So you should make sure the correct version number is set by setting a git-tag or changing the version number in your plugin.json.


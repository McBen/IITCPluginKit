v1.8.2
- dependencies update
- fixed svg import
 
v1.8.1
- dependencies update
- fixed highlighter definition
- added AT_PLAYER in chat data

v1.8.0
- add changelog options (will include a text file into the release build)

v1.7.0
- compress production build "a little bit"
  remove comments, remove console.log (except error & warn)
- allow custom icon (plugin.json: icon)

v1.6.0
- more chat defines
- add main class access example

v1.5.0
- Added ESLint helper to init script
- Postcss v8 update (had to remove postcss-simple-vars & postcss-color-function)
- No icon in meta file

v1.4.0
- webpack v5
- fixed niantic_parameter definition
- file-server: use special link for mobile
- add "banner" option in GMAddon

v1.3.0
 (ups)

v1.2.0
- Images are nolonger any type
  use:
    import imageTarget from "../images/target.svg";
  instead of:
    import * from imageTarget from "../images/target.svg";

- Android definitions
- Field definition
- portalDetail definition
- Improved Hook definition
- Fixed a Chat definition
- Some fileserver tweaks
- dependencies updated


v1.1.1
- Fixed LineEndings
- New Option to enable minimizer (default off - for code reviews)

v1.1
- New "downloadURL" in plugin config
- updated dependencys
- Fix debug namespace

v1.0.1
- fix missed rename 

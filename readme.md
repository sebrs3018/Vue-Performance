Core Vitals Training

- Setup:

  - As expected we should install the project with npm install, but, since we are using http-server and workbox, we have to install the former globally and
    configure the latter:

    1. HTTP-Server global installation: npm install --global http-server (https://www.npmjs.com/package/http-server)
    2. Workbox configuration: npx workbox wizard (https://developer.chrome.com/docs/workbox/the-ways-of-workbox/)

  - Typescript (https://vuejs.org/guide/typescript/overview.html#volar-takeover-mode):
    - In order to make this project work on VSCode, you will need to install the plugin called: Volar and Volar Typescript which enables type checking on our SFC
    - Improving typescript checker performace on VSCode: enable Volar Takeover

- Runnning the application

  - To have a prod build:
    - npm run build
  - In order to have a http-server which compresses the output files and provide caching capabilites use the following script:
    - npm run http-server

- ## LCP:
- ## CLS:
- ## FID:

Cache policy (according to Google)

- We should consider delivering a static file for a long time (at least 31536000s which corrisponds to 1 year!)
- Source: https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl/?utm_source=lighthouse&utm_medium=devtools

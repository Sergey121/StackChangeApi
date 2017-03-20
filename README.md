## Prerequisites

1. Install `Nodejs` version `v6.9.x` or `higer`. [How install](https://nodejs.org/en/)
2. Install `yarn` for your system. [How install](https://yarnpkg.com/en/docs/getting-started).

## Installation

1. Clone the project to your local machine
2. Go to project folder
    ```
    cd <workspace>/<folder-name>
    ```
3. Install all dependencies. Run
    ```
    yarn install
    ```
4. Build the project
   * `npm run server` - the server will be running on page `localhost:8000`
   * `npm run serber:min` - the server will be running with uglified scripts
   * `npm run build` - will compile all scripts without running the local server 
   * `npm run build:prod` - all js files will be bundled and minified. 

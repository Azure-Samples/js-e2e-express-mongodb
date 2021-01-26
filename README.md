---
page_type: sample
languages:
- javascript
- nodejs
name: "JavaScript end-to-end - deploy Express.js MongoDB app to App Service from Visual Studio Code"
description: "Deploy the Express.js application which connects to MongoDB to Azure App Service (on Linux) and a CosmosDB."
products:
- azure
- vs-code
- azure-app-service
- azure-cosmos-db
---
# JavaScript end-to-end Express.js app with a MongoDB database

For a complete tutorial, please use the [Microsoft Documentation tutorial found here](https://docs.microsoft.com/azure/developer/javascript/tutorial/web-app-mongodb). 

The sample code is a JavaScript server written with Express.js and the native MongoDB API. The user adds data ( 2 text fields), can view data, and delete a single row or all rows. 

The programming work is done for you, this tutorial focuses on using the local and remote Azure environments successfully from inside Visual Studio Code with Azure extensions.

The tutorial demonstrates how to load and run the project locally with VSCode, using extensions, was well as how to run the code remotely on an App service. The tutorial includes creating a CosmosDB resource for the Mongo API, getting the connection information and setting that in the app service configuration setting to connect to a cloud database. 

## Sample application

The Node.js app consists of the following elements:

* **Express.js server** hosted on port 8080
* **React (cra)** hosted on 3000, with a proxy to 8080
* **MongoDB native API** functions to insert, delete, and find data
    * Either running local mongo or setting the connection string


## Features

This project framework provides the following features:

* Create Azure app resource
    * Create web app resource
    * Deploy Express.js app to web app resource
    * Set app configuration settings
* Create CosmosDB resource 
    * Create database resource for use with MongoDB API
    * Get connection string

## Getting Started

1. Clone or download repo.
1. Follow tutorial to create resources with Visual Studio Code extensions.
    * Create web app resource, to host Express.js app
    * Create CosmosDB resource, to host MongoDB database

## Create or use existing Azure Subscription 

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-appservice-extension&mktingSource=vscode-tutorial-appservice-extension).

## Installation

The server's package.json has all the scripts to control both client and server.

1. Install the client's dependencies:

   ```javascript
    cd clients && npm install
    ```

1. Install the server's dependencies:

   ```javascript
    cd ../server && npm install
    ```

1. Run both client and server.

    ```javascript
    npm run start:full
    ```

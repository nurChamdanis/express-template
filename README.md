# About

> **TL;DR** ExpressJS, VueJS, ReactJS cookbook, with evergreen recipes and templates (CRUD, CI/CD, QA, Testing, Cloud container deployment, Web Components, ES Modules, etc.) to develop applications faster, while reducing the need for rewrite or refactoring due to changes in dependencies.

Latest Version [0.7.0](https://github.com/ais-one/cookbook/releases/tag/0.7.0) - Released 2023 Sep 01 0830 +8GMT. åSee changes history in [CHANGELOG.md](CHANGELOG.md) and discuss [here](https://github.com/es-labs/express-template/discussions)

## IMPORTANT [Read Me First](https://github.com/es-labs/es-labs.github.io/wiki)

## IMPORTANT [Requirements](https://github.com/es-labs/es-labs.github.io/wiki/2-Requirements,-Projects-And-Features#general-requirements)


# QUICK START - ON YOUR LOCAL MACHINE

## Getting Started

1a. `fork` template repo into a new public or private repo
1b. OR `clone` template repo, remove existing .get and push to a new public or private repo
2. set new remote called `upstream` fetch from template repo, push disallowed

### Install

```bash
# clone repo
git clone https://github.com/es-labs/express-template.git
cd cookbook

# install dependencies for specific workspace projects
# see package.json for shortcut scripts
npm i --workspace=js-node/expressjs
npm i --workspace=js-node/dbdeploy

# install for all workspace projects
npm i --workspaces

# OR install only for express backend
npm run ex:build # see ./package.json scripts
```

### Migrate DB And Seed DB

Go to [dbdeploy](../dbdeploy/README.md) project and follow instructions for creating local development db on sqlite

### Run ExpressJS Backend - development environment

```bash
npm run ex:start # NODE_ENV=development npm run app --workspace=js-node/expressjs in package.json
# use ex:start:win for Windows OS

# OR to include eslint checks
NODE_ENV=development npm run app:lint --workspace=js-node/expressjs ? ok?
```

**NOTES**
- MongoDB examples needs MongoDB to work. To resolve, chose one of the methods to install MongoDB in **docs/backend/mongodb/install.md**
- If some env entries are not present there maybe some console log errors (but it is ok to ignore) and websockets will not work. Quick start is still usable. Use the README.md to fill up


**Visit the following URLs**
- http://127.0.0.1:3000/api/healthcheck - app is running normally
- http://127.0.0.1:3000 - Website served by Express with functional samples and demos
- http://127.0.0.1:3000/api-docs - OpenAPI documentation

### No bundler frontend

- See [vue-nobundler]()
- Served from [http://127.0.0.1:3000/native/index.html]()
- import only vue & vue-router at index.html
- export const store = reactive({}) used [instead of Vuex](https://pinia.vuejs.org/introduction.html#Why-should-I-use-Pinia-)

### Testing

- To run unit & integration test on **/api/categories** endpoint. E2E testing is **Work In Progress**
- TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in **js-node/expressjs/app-template-sample/tests**

TBD see package.json

```bash
# run in development only
npm run test
```

### Long Running Processes

For long running processes such as tcp server (event mode, streaming mode), serial server, kafka producer, consumer, cron-triggered process, etc.

See [js-node/README.md](js-node/README.md)

### Vite SPA Setup & Run - development environment

See [https://github.com/es-labs/vue-antd-template]().

Why No SSR or SSG:
- potential slow rendering by server app, added complexity in code, rehydration errors, added complexity in server
- https://github.com/nuxt/nuxt.js/issues/8102
- prefer static sites and lazy loaded SPA for now

---

## SAML, OIDC, OAuth

- SAML & OIDC: requires keycloak to be setup and express server to be run
  - Setup and Configure [Keycloak](docker-devenv/keycloak/README.md)
- You can test out on [sso.html](http://127.0.0.1:3000/sso.html). The file source is [js-node/expressjs/public/demo-express/sso.html]()
- for SAML and OIDC... credentials is `test` / `test`, redirect to the keycloak IDP
- Refer also to the following files
  - ./js-node/expressjs/router/saml.js
  - ./js-node/expressjs/router/oidc.js
  - ./js-node/expressjs/router/oauth.js **requires setup of github account and configs**

## Fido2

Refer to following files for SPA sample (uses fido2-lib in backend)
- [js-node/expressjs/router/fido.js]()
- [js-node/expressjs/public/demo-express/fido.html]()

## Push Notification
**Note:** For Push Notification
Refer to following files for SPA sample
- [js-node/expressjs/router/webpush.js]()
- [js-node/expressjs/public/demo-express/pn.html]()
- Uses Webpush or Google FCM
- Using Google FCM, setup your firebase account and messaging, also setup FCM server key in backend
- Using self hosted webpush is also supported and available
- You can test PWA Push notifications using Webpush or FCM on Dashboard page depending on **.env.<environment>** file configuration (need to be on 127.0.0.1).
- Click the following buttons in order (see their output in console.log and screen):
  - sub PN (subscribe)
  - Test PN (send a test message to user id 1 - on sqlite)
  - Unsub PN (unsubscribe)


## Configuration

- ./js-node/expressjs/.env
  - non-sensitive config values
- ./js-node/expressjs/.env.secret
  - values that are secret

- JSON values are supported
- For more sentitive configs, `Vault` service should be considered

---


## CI/CD & Cloud Deployment

### Cloud Services

The following Google Cloud Platform (GCP) services are used
- Container Registry
- Cloud Run
- Cloud Storage

Refer to [doc/deployment/home.md](doc/deployment/home.md) for documentation on deployments

### Deployment Using Github Actions

- .github/workflows/manual-gcp-expressjs.yml (Manually deploy js-node/expressjs to GCP CloudRun)
  - selectable inputs
    - environment (uat for now, development does not deploy anything)
    - service (default = app-sample)
    - branch

**NOTE** config/secret contents will not be in repo for CI/CD (so you can get errors), those should be put in VAULT

Current secrets
- GCP_PROJECT_ID
- GCP_SA_KEY
- VAULT_uat, passed in as VAULT

```
# do not merge
VAULT="unused"

# connect to a hashicorp vault and obtain secrets to merge
VAULT={ url, token } # base64 encoded

 # pass in secrets, this way is insecure and not a good way to send in secrets
VAULT={ secrets: { ... all your secrets here } } # base64 encoded
```

---


















## Project Strcuture

https://softwareengineering.stackexchange.com/questions/338597/folder-by-type-or-folder-by-feature
https://kentcdodds.com/blog/how-i-structure-express-apps


+- .github/ : github related CICD and automations
+- docker-devenv/ : docker for development environment
+- docs/ : documentation
+- git-hooks : git hooks
+- js-node/ : nodejs applications (db deployment, express API, scalable-websockets, kafka, cron triggered, long running processes) see [js-node/README.md]()
+- vue-nobundler/ : frontend (Vue3 no bundler) - See [vue-nobundler/README.md](vue-nobundler/README.md) for Project Structure
+- .editorconfig
+- .gitignore
+- BACKLOG.md
+- CHANGELOG.md
+- LICENCE
+- package.json
+- README.md


```
+- apps : custom apps are here in this folder
|  +- app-sample/ : sample custom application (prefixed with app-)
|  |  +- controllers/
|  |  +- deploy/ : deployment folder (see README.md within the deploy folder)
|  |  +- models/
|  |  +- openapi/ : OpenAPI yaml files
|  |  +- public/ : for serving static files - website
|  |  |  +- demo-express/ (127.0.0.1:3000/)
|  |  |  +- vue-nobundler/ (127.0.0.1:3000/native/index.html)
|  |  +- routes/ : application REST API & websocket setup
|  |  +- tables/ : configurable table & crud
|  |  +- tests/ : Jest tests for custom application
|  |  +- uploads/ : for file uploads
|  |  +- graphql-schema.js : application GraphQL schemas and resolvers
|  |  +- dev.sqlite3 : sqlite DB with schema and data
|  |  +- package.json : for app libraries
|  |  +- test-playground.mongodb : mongoDB client VSCode plugin (MongoDB for VS Code - mongodb.mongodb-vscode)
|  |  +- test.http : rest API commands testing VSCode plugin (Rest Client - humao.rest-client)
|  |  +- test.py: run python from express
+- git-hooks/ : pre-commit and other hooks here
+- middlewares/ : common middlewares
+- router/ : common route / controller & services
+- tests/ : Jest tests for expressjs
+- .dockerignore
+- .editorconfig
+- .env.sample
+- .eslintrc.js
+- .gitignore
+- app.js : the express app boilerplate
+- CHANGELOG.md
+- deploy.sh: GCP deployment script
+- Dockerfile
+- ecosystem.config.js: for pm2
+- index.js
+- jest.config.js: JEST testing
+- LICENCE
+- package.json
+- README.md
```

## If You Want To Use DTOs

https://stackoverflow.com/questions/62504764/entities-dtos-in-javascript

- Use AJV
- ORM with Modeling

## Relational Database Schema

### Simple Relation
 * books <- 1 --- 1 -> categories - one book belongs to one category
 * books <- M --- N -> authors - one book has many authors, and an author can have more than 1 book
 * books <- 1 --- M -> pages - one book has many pages

### Simple Table Schema
 * authors - id, name
 1, author1
 2, author2

 * categories - id, name
 1, cat1
 2, cat2

 * books - id, name, categoryId
 1, book1, 1
 2, book2, 1

 * pages - id, name, bookId
 1, pageA, 1
 2, pageB, 1
 3, pageC, 2
 4, pageD, 2
 5, pageE, 2

 * book_author - bookId, authorId
 1, 1
 1, 2
 2, 1
 2, 2


### CRUD Routes
[* === COMPLETED, ** === TESTED]
* POST /auth/signup
* POST /auth/login
* GET /auth/logout
* POST /auth/otp

* POST /api/authors
* PATCH /api/authors/:id
* GET /api/authors/:id
* GET /api/authors

* POST /api/categories
* PATCH /api/categories/:id
* GET /api/categories/:id
* GET /api/categories

* POST /api/books
* PATCH /api/books/:id
* GET /api/books/:id
* GET /api/books

* POST /books/:id/pages - add page to book
* DELETE /pages/:id - remove page from book
* PATCH /pages/:id - edit a page

* POST /books/:id/authors/:authorId - relate author to book
* DELETE /books/:id/authors/:authorId - unrelate author to book



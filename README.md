# Description

An Express Template

## Read Me FIRST!

TBD... Instructions on working with templates

## Setup

1. setup to allow incoming merge from upstream template update

```bash
# run once only after
# - clone, or
# - fork, or
# - deleting .git and running git init
./setup-upstream.sh
```

2. setup for your project

# copy the sample environment

```bash
# setup your env file
cp .env.sample .env

# to make your custom app you can either
# - 1. continue development in apps/app-sample
# - 2. rename apps/app-sample and develop from there
# - 3. make a copy of apps/app-sample and rename it and work from there
```

In `src/apps/apploader.js`, change the `web-sample` to the folder you are using for development

3. Important notes for development

- change only the package.json in apps/web-sample
- do note any conflicts to resolve for anything outside the apps folder when merging from upstream
- feedback for improvement is welcome

4. Updating the template

```bash
git fetch upstream
git merge upstream/main
```

---

# About

> **TL;DR** ExpressJS, VueJS, ReactJS cookbook, with evergreen recipes and templates (CRUD, CI/CD, QA, Testing, Cloud container deployment, Web Components, ES Modules, etc.) to develop applications faster, while reducing the need for rewrite or refactoring due to changes in dependencies.

Latest Version [0.7.0](https://github.com/ais-one/cookbook/releases/tag/0.7.0) - Released 2023 Sep 01 0830 +8GMT. åSee changes history in [CHANGELOG.md](CHANGELOG.md) and discuss [here](https://github.com/es-labs/express-template/discussions)

## IMPORTANT [Read Me First](https://github.com/es-labs/es-labs.github.io/wiki)

## IMPORTANT [Requirements](https://github.com/es-labs/es-labs.github.io/wiki/2-Requirements,-Projects-And-Features#general-requirements)

# QUICK START - ON YOUR LOCAL MACHINE

## Getting Started

1a. `fork` template repo into a new public or private repo
1b. OR `clone` template repo, remove existing .get and push to a new public or private repo 2. set new remote called `upstream` fetch from template repo, push disallowed

### Install & Run

```bash
# clone repo
git clone https://github.com/es-labs/express-template.git
cd express-template
npm i

# start
npm run start # see ./package.json scripts
# windows npm run start:win

# OR to include eslint checks - linux
NODE_ENV=development npm run app:lint # ok?
```

Local development sample sqlite DB `apps/app-sample/dev.sqlite3` already created and populated

If need to **migrate** and **seed**, refer to `dbdeploy` package in `tools` workspace of [https://github.com/es-labs/jscommon]()

**Visit the following URLs**

- http://127.0.0.1:3000/api/healthcheck - app is running normally
- http://127.0.0.1:3000 - Website served by Express with functional samples and demos
- http://127.0.0.1:3000/api-docs - OpenAPI documentation

**NOTES**

- MongoDB sample codes needs MongoDB to work
- If some env entries are not present there maybe some console log errors (but it is ok to ignore) and websockets will not work. Quick start is still usable. Use the README.md to fill up

### No bundler frontend

- See [apps/app-sample/public/vue-nobundler]()
- Served from [http://127.0.0.1:3000/native/index.html]()
- import only vue & vue-router at index.html
- export const store = reactive({}) used [instead of Vuex](https://pinia.vuejs.org/introduction.html#Why-should-I-use-Pinia-)

### Testing - TBD

- To run unit & integration test on **/api/categories** endpoint. E2E testing is **Work In Progress**
- TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in **apps/app-sample/tests**

See package.json

```bash
# run in development only
npm run test
```

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
- You can test out on [sso.html](http://127.0.0.1:3000/sso.html). The file source is [public/demo-express/sso.html]()
- for SAML and OIDC... credentials is `test` / `test`, redirect to the keycloak IDP
- for OAUTH **requires setup of github account and configs**
- Refer also to the following files
  - router/auth.js

## Fido2

Refer to following files for SPA sample (uses fido2-lib in backend)

- [router/fido.js]()
- [public/demo-express/fido.html]()

## Push Notification

**Note:** For Push Notification
Refer to following files for SPA sample

- [router/webpush.js]()
- [public/demo-express/pn.html]()
- Uses Webpush or Google FCM
- Using Google FCM, setup your firebase account and messaging, also setup FCM server key in backend
- Using self hosted webpush is also supported and available
- You can test PWA Push notifications using Webpush or FCM on Dashboard page depending on **.env.<environment>** file configuration (need to be on 127.0.0.1).
- Click the following buttons in order (see their output in console.log and screen):
  - sub PN (subscribe)
  - Test PN (send a test message to user id 1 - on sqlite)
  - Unsub PN (unsubscribe)

## Configuration

- .env : non-sensitive config values
- .env.secret: values that are secret (should be in `vault` service for production)
- JSON values are supported

---

## CI/CD & Cloud Deployment

### Deployment Using Github Actions

- .github/workflows/manual-gcp-expressjs.yml **TBD**
  - selectable inputs
    - environment (uat for now, development does not deploy anything)
    - service (default = app-sample)
    - branch

**NOTE** config/secret contents will not be in repo for CI/CD (so you can get errors), those should be put in VAULT

Current secrets

- GCP_PROJECT_ID, GCP_SA_KEY

```bash
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

```
+- .github/ : github related CICD and automations
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

- books <- 1 --- 1 -> categories - one book belongs to one category
- books <- M --- N -> authors - one book has many authors, and an author can have more than 1 book
- books <- 1 --- M -> pages - one book has many pages

### Simple Table Schema

- authors - id, name
  1, author1
  2, author2

- categories - id, name
  1, cat1
  2, cat2

- books - id, name, categoryId
  1, book1, 1
  2, book2, 1

- pages - id, name, bookId
  1, pageA, 1
  2, pageB, 1
  3, pageC, 2
  4, pageD, 2
  5, pageE, 2

- book_author - bookId, authorId
  1, 1
  1, 2
  2, 1
  2, 2

### CRUD Routes

[* === COMPLETED, ** === TESTED]

- POST /auth/signup
- POST /auth/login
- GET /auth/logout
- POST /auth/otp

- POST /api/authors
- PATCH /api/authors/:id
- GET /api/authors/:id
- GET /api/authors

- POST /api/categories
- PATCH /api/categories/:id
- GET /api/categories/:id
- GET /api/categories

- POST /api/books
- PATCH /api/books/:id
- GET /api/books/:id
- GET /api/books

- POST /books/:id/pages - add page to book
- DELETE /pages/:id - remove page from book
- PATCH /pages/:id - edit a page

- POST /books/:id/authors/:authorId - relate author to book
- DELETE /books/:id/authors/:authorId - unrelate author to book

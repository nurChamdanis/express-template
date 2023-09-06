# Description

An Express Template

## Read Me FIRST!

[https://github.com/ais-one/cookbook#important---read-me-first]()

## Setup

1. setup to allow incoming merge from upstream template update

run once only after you `clone`, or `fork` or `delete .git and run git init`

```bash
./setup-upstream.sh
```

2. setup for your custom code

```bash
# setup your env file
cp apps/.env.sample apps/.env
# move properties with secrets to apps/.env.secret
```

- You can develop custom code in `apps/app-sample` or rename it or copy it to another folder name
- In apps/apploader.js, change `app-sample` to the folder you are using

3. Important notes for development

- userland changes only in the `apps` folder
- do note any conflicts to resolve when merging from upstream

4. Updating the template

Ensure that you have commited your changes and pushed to remote origin first before running commands below:

```bash
git fetch upstream
git merge upstream/main
# or
git merge upstream/main --allow-unrelated-histories
```

There may be some template related merge conflicts to resolve.

---

## Install & Run & Test

```bash
# clone repo
git clone https://github.com/es-labs/express-template.git
cd express-template
npm i
cd apps/<your custom development folder> default is `app-sample`
npm i

cd ../../.. # go back up
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
- http://127.0.0.1:3000/docs - OpenAPI documentation
- http://127.0.0.1:3000/native/index.html - 

**NOTES**

- Mongo DB
  - MongoDB sample codes needs MongoDB to work
  - If some env entries are not present there maybe some console log errors (but it is ok to ignore) and websockets will not work. Quick start is still usable. Use the README.md to fill up

- No bundler frontend
  - import only vue & vue-router at index.html, pure vanilla JS no webpack or other bundler
  - export const store = reactive({}) used [instead of Vuex](https://pinia.vuejs.org/introduction.html#Why-should-I-use-Pinia)

Unit & Integration Tests:

- To run unit & integration test on **/api/categories** endpoint. E2E testing is **Work In Progress**
- TO TEST EVERYTHING PLEASE change describe.only(...) to describe(...) in the test scripts in **apps/app-sample/tests**

See package.json

```bash
# run in development only
npm run test
```

### Vite SPA Setup & Run - development environment

See [https://github.com/es-labs/vue-antd-template]() for a SPA frontend template that can be used with projects based on this template

---

## SAML, OIDC, OAuth

- SAML & OIDC: requires [Keycloak](docker-devenv/keycloak/README.md) to be setup and express server to be run
- You can test out on [sso.html](http://127.0.0.1:3000/sso.html). The file source is [apps/app-sample/public/demo-express/sso.html]()
- for SAML and OIDC... credentials is `test` / `test`, redirect to the keycloak IDP
- for OAUTH **requires setup of github account and configs**
- Refer to the following file [router/auth.js]()

## Fido2 - TO TEST

Refer to following files for SPA sample (uses fido2-lib in backend)

- [apps/app-sample/public/demo-express/fido.html]()
  - you might need to use nip service for a "pseudo-domain" to test locally
  - take note of and use the private IP on your local machine
- [apps/app-sample/routes/fido.js]()
- you will need Windows Hello or similar service on OSX

## Push Notification

- ensure that you enable permissions for the browser
- sometimes the notifications may be blocked by company policy, you may get a push event, but no notification pops-up
- Refer to following files for SPA sample
  - [apps/app-sample/routes/webpush.js]()
  - [apps/app-sample/public/demo-express/pn.html]()
- Uses Webpush or Google FCM, Webpush is easier (sample config uses Webpush and runs on http://127.0.0.1:3000)
- Click the following buttons in order (see their output in console.log and screen):
  - (1) Subscribe PN, (2) Send And Receive Test PN, (3) Unsubscribe PN
- For Google FCM, setup your firebase account and messaging, also FCM server key in backend

## Configuration (Environment Files)

- .env : non-sensitive config values
- .env.secret : values that are secret (should be in `vault` service for production)
- JSON values are supported, be aware of syntax errors when setting up

---

## CI/CD & Cloud Deployment

### Deployment Using Github Actions - TODO

- .github/workflows/manual-gcp-expressjs.yml **TODO**
  - selectable inputs
    - environment (uat for now, development does not deploy anything)
    - branch

**NOTE** config/secret contents will not be in repo for CI/CD (so you can get errors), those should be put in VAULT

Current Github Secrets

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
|  |  |  +- demo-express/
|  |  |  +- vue-nobundler/
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
+- deploy.sh: TODO deployment script
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

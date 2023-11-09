const path = require('path')
const dotenv = require('dotenv')

const { NODE_ENV } = process.env

dotenv.config({ path: path.join(process.cwd(), 'apps', `.env.${NODE_ENV}`), override: true } )
dotenv.config({ path: path.join(process.cwd(), 'apps', `.env.secret.${NODE_ENV}`), override: true } )

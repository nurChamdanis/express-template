const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(process.cwd(), 'apps', '.env'), override: true } )
dotenv.config({ path: path.join(process.cwd(), 'apps', '.env.secret'), override: true } )

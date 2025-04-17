// const path = require('path')
// const dotenv = require('dotenv')
// 
// const { NODE_ENV } = process.env
// dotenv.config({ path: path.join(process.cwd(), 'apps', `.env.${NODE_ENV}`), override: true }) 
// dotenv.config({ path: path.join(process.cwd(), 'apps', `.env.secret.${NODE_ENV}`), override: true } )
//  

// 
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV || 'dev';
const baseEnvPath = path.join(process.cwd(), 'apps', `.env.${NODE_ENV}`);
const secretEnvPath = path.join(process.cwd(), 'apps', `.env.secret.${NODE_ENV}`);

// read and checking up env
function loadAndInspectEnv(filePath, label) {
  if (fs.existsSync(filePath)) {
    const result = dotenv.config({ path: filePath, override: true }); 
    if (result.parsed) {
      Object.entries(result.parsed).forEach(([key, value]) => {
        const isBool = value === 'true' || value === 'false';
        console.log(`- ${key} = ${value}${isBool ? ' (bool-like string)' : ''}`);
      });
    }     
  }  
}
 
loadAndInspectEnv(baseEnvPath, `.env.${NODE_ENV}`);
loadAndInspectEnv(secretEnvPath, `.env.secret.${NODE_ENV}`); 

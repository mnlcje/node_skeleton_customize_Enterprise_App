# node_skeleton_customize_Enterprise_App

# Development Configuration Steps For oFlow API

### Pre-requisites
- Node Js 6.10 LTS Version [Download Link](https://nodejs.org/en/download/)
- Yarn Package Manager [Download Link](https://yarnpkg.com/en/docs/install)



> It's a one time activity for setting up node environment. 
> The above steps are required only if you haven't configured Node Js 

### Installation
 Install the dependencies and devDependencies and start dev server

yarn install
npm run start


### Release Build

npm run prod

# Why We need tsconfig.json file
https://dzone.com/articles/what-is-the-tsconfigjson-configuration-file


# process.env
https://codeburst.io/process-env-what-it-is-and-why-when-how-to-use-it-effectively-505d0b2831e7

https://hub.packtpub.com/building-better-bundles-why-processenvnodeenv-matters-optimized-builds/

webpack.config.js
------------------------------
      new webpack.DefinePlugin({
        'process.env': {
          OFLOW_ENV: JSON.stringify(env),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        },


nodeman prod/qas :
-----------------------
"env": {
    "OFLOW_ENV": "dev",
    "NODE_ENV": "development"
  },

config/app.settings.ts
---------------------------------      
public static Env = process.env.OFLOW_ENV;

module.exports = {
    apps: [{
      name: "testosterone_bot",
      script: "src/main.ts",
      interpreter: "node",
      interpreter_args: "--loader ts-node/esm",
      watch: false,
      autorestart: true,
    }]
  };
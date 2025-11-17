require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.20",
  },
};

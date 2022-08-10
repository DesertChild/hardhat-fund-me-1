const { network } = require("hardhat")
const { developmentChains } = require("../hardhat.config")

module.exports = async hre => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const DECIMALS = 8
    const INITIAL_ANSWER = 200000000000
    const chainId = network.config.chainId
    if (chainId == 31337) {
        log("Local Network detected!!deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        })
        log("Mocks deployed!!")
        log("--------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]

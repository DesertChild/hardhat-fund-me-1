//import

//function
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
module.exports = async hre => {
    const { getNamedAccounts, deployment } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const { verify } = require("../utils/verify")

    //if chainId is X use address y
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress

    if (chainId == 31337) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    /*
    the idea of mock contract : if a contract (in this case a pricefeed) does not exist on a certain blockchain, (
        in this case the local hardhat host
    ),
    we deploy a minimal version of it for our local host.
    */

    //when going for localhost for hardhat we want to use a mock
    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("---------------------------------**********************")
}

module.exports.tags = ["all", "fundme"]

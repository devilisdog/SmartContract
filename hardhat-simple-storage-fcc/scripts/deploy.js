//imports
const { ethers } = require("hardhat")
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )

    console.log("deploying contract...")

    const simpleStorage = await SimpleStorageFactory.deploy()

    await simpleStorage.waitForDeployment()
    console.log("simpleStorage deployed to:", await simpleStorage.getAddress())
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying GlacierPayments to Avalanche Fuji Testnet...\n");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "AVAX\n");

  // Deploy contract
  const GlacierPayments = await hre.ethers.getContractFactory("GlacierPayments");
  const glacierPayments = await GlacierPayments.deploy();

  await glacierPayments.waitForDeployment();

  const address = await glacierPayments.getAddress();

  console.log("✅ GlacierPayments deployed to:", address);
  console.log("\n📋 Contract Info:");
  console.log("   - Network: Avalanche Fuji Testnet");
  console.log("   - Chain ID: 43113");
  console.log("   - Explorer: https://testnet.snowtrace.io/address/" + address);
  
  console.log("\n🔧 Add this to your .env file:");
  console.log(`NEXT_PUBLIC_GLACIER_CONTRACT_ADDRESS=${address}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=43113`);
  
  console.log("\n✨ Testing contract functions...");
  
  // Test calculateUploadCost
  const oneMBInBytes = 1048576;
  const cost = await glacierPayments.calculateUploadCost(oneMBInBytes);
  console.log(`   - Cost for 1MB file: ${hre.ethers.formatEther(cost)} AVAX`);
  
  const tenMBInBytes = 10485760;
  const cost10MB = await glacierPayments.calculateUploadCost(tenMBInBytes);
  console.log(`   - Cost for 10MB file: ${hre.ethers.formatEther(cost10MB)} AVAX`);
  
  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

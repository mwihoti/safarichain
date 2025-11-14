import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the ETHSafariComments contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployETHSafariComments: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("ETHSafariComments", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployETHSafariComments;

deployETHSafariComments.tags = ["ETHSafariComments"];
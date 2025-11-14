// utils/gasless.ts
import { createSmartAccountClient } from "permissionless";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY || "your-pimlico-api-key";

const publicClient = createPublicClient({
  transport: http("https://rpc.sepolia.org"),
});

const pimlicoClient = createPimlicoClient({
  transport: http(`https://api.pimlico.io/v2/sepolia/rpc?apikey=${PIMLICO_API_KEY}`),
});

export const createGaslessSmartAccount = async (walletClient: any) => {
  if (!walletClient) throw new Error("Wallet client not available");

  const signer = {
    signMessage: walletClient.signMessage.bind(walletClient),
    getAddress: () => walletClient.account.address,
    signTypedData: walletClient.signTypedData.bind(walletClient),
  };

  const simpleAccount = await toSimpleSmartAccount(publicClient, {
    signer,
    factoryAddress: "0x9406Cc6185a346906296840746125a0E44976454f", // simple account factory
    entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // entry point v0.6
  });

  const smartAccountClient = createSmartAccountClient({
    account: simpleAccount,
    chain: sepolia,
    bundlerTransport: http(`https://api.pimlico.io/v1/sepolia/rpc?apikey=${PIMLICO_API_KEY}`),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  });

  return smartAccountClient;
};

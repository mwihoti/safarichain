                          // utils/gasless.ts
                          import { createSmartAccountClient } from "permissionless";
                          import { toSimpleSmartAccount } from "permissionless/accounts";
                          import { createPimlicoClient } from "permissionless/clients/pimlico";
                          import { type WalletClient, createPublicClient, http, isAddress } from "viem";
                          import { sepolia } from "viem/chains";

                          const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY ?? "";
                          if (!PIMLICO_API_KEY) throw new Error("Missing NEXT_PUBLIC_PIMLICO_API_KEY");

                          const publicClient = createPublicClient({
                            transport: http("https://rpc.sepolia.org"),
                          });

                          const pimlicoPaymaster = createPimlicoClient({
                            transport: http(`https://api.pimlico.io/v2/sepolia/rpc?apikey=${PIMLICO_API_KEY}`),
                          });

                          const ENTRY_POINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" as const;
                          const FACTORY = "0x9406Cc6185a346906296840746125a0E44976454" as const; // Fixed: removed trailing 'f'

                          export const createGaslessSmartAccount = async (walletClient: WalletClient, userAddress?: string) => {
                            // 1. Validate walletClient
                            if (!walletClient) throw new Error("Wallet client not available");

                            // 2. Validate account
                            if (!walletClient.account && !userAddress) throw new Error("Wallet account not loaded");

                            // 3. Validate address is a proper hex
                            const address = userAddress || (await walletClient.getAddress());
                            if (!address || !isAddress(address)) {
                              throw new Error(`Invalid address: ${address}`);
                            }

                            console.log("Using wallet address:", address);
                            console.log("walletClient.account:", walletClient.account);

                            const account = await toSimpleSmartAccount({
                              client: publicClient,
                              owner: walletClient,
                              factoryAddress: FACTORY,
                              entryPoint: ENTRY_POINT,
                            });

                            return createSmartAccountClient({
                              account,
                              chain: sepolia,
                              bundlerTransport: http(`https://api.pimlico.io/v1/sepolia/rpc?apikey=${PIMLICO_API_KEY}`),
                              paymaster: pimlicoPaymaster,
                              userOperation: {
                                estimateFeesPerGas: async () => {
                                  const price = await pimlicoPaymaster.getUserOperationGasPrice();
                                  return price.fast;
                                },
                              },
                            });
                          };
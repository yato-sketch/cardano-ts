import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import { LimitFunction } from "p-limit";
import paginate from "./paginate.js";
import { fetchWithFallback } from "./utils.js";

const find = (
  blockfrost: BlockFrostAPI,
  tokenId: string,
  limit: LimitFunction
) => {
  return limit(() =>
    fetchWithFallback(() => blockfrost.assetsAddresses(tokenId), [])
  );
};

const findOfPolicy = (
  blockfrost: BlockFrostAPI,
  policyId: string,
  limit: LimitFunction,
  parallel: number
) =>
  paginate(
    (page) => blockfrost.assetsPolicyById(policyId, { page }),
    limit,
    parallel
  );

const findAll = async (
  blockfrost: BlockFrostAPI,
  policyId: string,
  limit: LimitFunction,
  parallel: number
): Promise<string[]> => {
  const tokens = await findOfPolicy(blockfrost, policyId, limit, parallel);

  return (
    await Promise.all(
      tokens.map(async ({ asset }) => {
        return (await find(blockfrost, asset, limit)).map(
          (result) => result.address
        );
      })
    )
  ).flat();
};

export { find, findAll, findOfPolicy };

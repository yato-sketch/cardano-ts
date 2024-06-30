import { LimitFunction } from "p-limit";
import { fetchWithFallback } from "./utils.js";

const paginate = async <T>(
  query: (page: number) => Promise<T[]>,
  limit: LimitFunction,
  parallel: number
): Promise<T[]> => {
  let page = 1;
  const results: T[] = [];

  while (true) {
    let resultCount = 0;
    results.push(
      ...(
        await Promise.all(
          Array.from({ length: parallel }, async () => {
            const pages = await limit(() =>
              fetchWithFallback(() => query(page++), [])
            );

            if (pages.length) resultCount++;

            return pages;
          })
        )
      ).flat()
    );

    if (resultCount < parallel) break;
  }

  return results;
};

export default paginate;

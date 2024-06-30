import { BlockfrostServerError } from "@blockfrost/blockfrost-js";

const fetchWithFallback = async <T>(
  func: () => Promise<T>,
  defaultReturn: T
): Promise<T> => {
  try {
    return await func();
  } catch (error) {
    if (error instanceof BlockfrostServerError && error.status_code === 404)
      return defaultReturn;
    else throw error;
  }
};

export { fetchWithFallback };

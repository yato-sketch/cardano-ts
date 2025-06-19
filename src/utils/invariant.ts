const prefix: string = "Invariant failed";

/**
 * Asserts that a condition is true, throwing an error if it's not
 * @param condition - The condition to check
 * @param message - Optional message to include in the error
 * @throws Error if the condition is false
 */
export const invariant: (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any,
  message?: string | (() => string)
) => asserts condition = (condition, message?: string | (() => string)) => {
  if (condition) {
    return;
  }

  const provided: string | undefined =
    typeof message === "function" ? message() : message;

  // Options:
  // 1. message provided: `${prefix}: ${provided}`
  // 2. message not provided: prefix
  const value: string = provided ? `${prefix}: ${provided}` : prefix;
  throw new Error(value);
};

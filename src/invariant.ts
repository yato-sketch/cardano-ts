const prefix: string = "Invariant failed";

const invariant: (
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

export default invariant;

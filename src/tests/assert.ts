import { test } from "supertape";

const equal = <T>(name: string, condition: () => T, expected: T) => {
  test(name, (t) => {
    t.equal(condition(), expected);
    t.end();
  });
};

const Assert = {
  equal,
};

export default Assert;

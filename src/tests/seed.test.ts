import { Seed } from "@cardano-ts/node";
import Assert from "tests/assert";

const seeds = [
  "neck trend supply announce because claw fiscal chimney initial popular flock congress drip mobile gun caution enjoy rely loud thing cruel devote demise garlic",
  "exit brisk private front neither gravity clay apple oxygen core royal sport voyage index tide feature public abuse suggest fog foot cabbage exact proud",
];
const addresses = [
  {
    testnet:
      "addr_test1qrjf3zy84k2t9d63ca0jqa5t25qskaxwxl2wyjuavd67dqyge5dfhl3lxnlxy0gx4xg2mn29mxf500uz8qa99ynyl37st9cn2c",
    mainnet:
      "addr1q8jf3zy84k2t9d63ca0jqa5t25qskaxwxl2wyjuavd67dqyge5dfhl3lxnlxy0gx4xg2mn29mxf500uz8qa99ynyl37sgn9nx8",
  },
  {
    testnet:
      "addr_test1qrpng9g3pp76yssvtjt406uvy7p0v548zhg390ja3t9ur0jkrr3frnh4939wcxkmklw2tusj946dl3f93gety8y9y9xq4hkgap",
    mainnet:
      "addr1q8png9g3pp76yssvtjt406uvy7p0v548zhg390ja3t9ur0jkrr3frnh4939wcxkmklw2tusj946dl3f93gety8y9y9xqkptg37",
  },
];
const keys = [
  "ed25519e_sk1kplt5w2v7ewgmez5rr0w3gyefx20ha4t766k46tvsw3024tkhfpryy6ytg9vdjl2jmncvdz2etwxuvzr9cmuxh57zmmfwjrms5q628s4mcvz0",
  "ed25519e_sk1mprka8g24qa5guxghmgw3yygptdv5z3x3r57efwlyuv73w634fxkvkfrmvm0tl2epkhxugakav2tm7vrwn338duhzr3fvn9pxz6hqkgprmq58",
];

seeds.forEach((_, i) => {
  Assert.equal(
    `seed${i}: getAddress defaults to testnet`,
    () => new Seed(seeds[i]).getAddress(),
    addresses[i].testnet
  );

  Assert.equal(
    `seed${i}: getAddress explicit testnet`,
    () => new Seed(seeds[i], "testnet").getAddress(),
    addresses[i].testnet
  );

  Assert.equal(
    `seed${i}: getAddress mainnet`,
    () => new Seed(seeds[i], "mainnet").getAddress(),
    addresses[i].mainnet
  );

  Assert.equal(
    `seed${i}: getPrivateKey`,
    () => new Seed(seeds[i]).getPrivateKey(),
    keys[i]
  );
});

/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Erc165Contract } from "./Erc165";
import { Erc20Contract } from "./Erc20";
import { Erc721Contract } from "./Erc721";
import { Erc777Contract } from "./Erc777";

declare global {
  namespace Truffle {
    interface Artifacts {
      require(name: "ERC165"): Erc165Contract;
      require(name: "ERC20"): Erc20Contract;
      require(name: "ERC721"): Erc721Contract;
      require(name: "ERC777"): Erc777Contract;
    }
  }
}

export { Erc165Contract, Erc165Instance } from "./Erc165";
export { Erc20Contract, Erc20Instance } from "./Erc20";
export { Erc721Contract, Erc721Instance } from "./Erc721";
export { Erc777Contract, Erc777Instance } from "./Erc777";

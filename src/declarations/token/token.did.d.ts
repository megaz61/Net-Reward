import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'addFaucetFunds' : (arg_0: bigint) => Promise<string>,
  'balanceOf' : (arg_0: Principal) => Promise<bigint>,
  'getFaucetBalance' : () => Promise<bigint>,
  'getRemainingTokens' : () => Promise<bigint>,
  'getSymbol' : () => Promise<string>,
  'getTotalUsers' : () => Promise<bigint>,
  'payOut' : () => Promise<string>,
  'transfer' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
}

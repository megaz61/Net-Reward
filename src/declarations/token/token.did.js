export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addFaucetFunds' : IDL.Func([IDL.Nat], [IDL.Text], []),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getFaucetBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getRemainingTokens' : IDL.Func([], [IDL.Nat], ['query']),
    'getSymbol' : IDL.Func([], [IDL.Text], ['query']),
    'getTotalUsers' : IDL.Func([], [IDL.Nat], ['query']),
    'payOut' : IDL.Func([], [IDL.Text], []),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };

import { useWeb3React } from "@web3-react/core";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Reference: https://react-redux.js.org/using-react-redux/usage-with-typescript
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSignTypedDataV4 = () => {
  const { library: web3 } = useWeb3React();

  const signTypedDataV4 = (account, message) => {
    return new Promise<string>((resolve, reject) => {
      web3.currentProvider.send(
        {
          method: "eth_signTypedData_v4",
          params: [account, message],
          from: account
        },
        (err, sig) => {
          if (err) {
            reject(err);
          } else {
            resolve(sig.result);
          }
        }
      );
    });
  };

  return signTypedDataV4;
};

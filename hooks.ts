import { useEffect, useState } from "react";
import * as types from "./types";
import * as bookmark from "./lib/bookmark";
import * as localStorage from "./lib/localStorage";
import { useWeb3React } from "@web3-react/core";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Reference: https://react-redux.js.org/using-react-redux/usage-with-typescript
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const useSignature = () => {};

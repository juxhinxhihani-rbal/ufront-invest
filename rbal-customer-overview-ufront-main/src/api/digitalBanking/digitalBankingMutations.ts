import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useMutation } from "react-query";
import {
  blockMobile,
  fetchBlockDigitalBanking,
  fetchNonValidSsnDigitalBanking,
  fetchRegisterDigitalBanking,
  fetchUnblockDigitalBanking,
  fetchupgradeDigitalBanking,
  fetchValidSsnDigitalBanking,
} from "./digitalBankingApi";
import {
  BlockMobileResponse,
  RegisterDigitalBankingResponse,
  UnblockResponseDto,
  UpgradeDigitalBankingResponse,
  BlockDigitalUserResponse,
  SsnDigitalBankingResponse,
} from "./digitalBankingApi.types";

type BlockMobileParams = {
  customerId: number;
  isTokenChecked: boolean;
  isCrontoChecked: boolean;
};

export function useBlockMobileMutation() {
  return useMutation<BlockMobileResponse, HttpClientError, BlockMobileParams>({
    mutationFn: ({ customerId, isTokenChecked, isCrontoChecked }) =>
      blockMobile(customerId, isTokenChecked, isCrontoChecked),
  });
}

export function useValidSsnDigitalBanking() {
  return useMutation<SsnDigitalBankingResponse, HttpClientError, number>({
    mutationFn: (customerId) => fetchValidSsnDigitalBanking(customerId),
  });
}

export function useNonValidSsnDigitalBanking() {
  return useMutation<SsnDigitalBankingResponse, HttpClientError, number>({
    mutationFn: (customerId) => fetchNonValidSsnDigitalBanking(customerId),
  });
}

export function useRegisterDigitalBanking() {
  return useMutation<RegisterDigitalBankingResponse, HttpClientError, number>({
    mutationFn: (customerId) => fetchRegisterDigitalBanking(customerId),
  });
}

export function useUpgradeDigitalBanking() {
  return useMutation<UpgradeDigitalBankingResponse, HttpClientError, number>({
    mutationFn: (customerId) => fetchupgradeDigitalBanking(customerId),
  });
}

export function useBlockDigitalBanking(
  customerId: number,
  isForBlock: boolean
) {
  return useMutation<BlockDigitalUserResponse, HttpClientError>({
    mutationFn: () => fetchBlockDigitalBanking(customerId, isForBlock),
  });
}

export function useUnblockDigitalBanking() {
  return useMutation<UnblockResponseDto, HttpClientError, number>({
    mutationFn: (customerId) => fetchUnblockDigitalBanking(customerId),
  });
}

import {
  BranchResponse,
  UserResponse,
} from "~/features/dictionaries/dictionariesQueries";
import { BankCertificateAccount } from "../bankCertificate/bankCertificateApi.types";
import { RetailAccountNumberListDto } from "../retailAccount/retailAccount.types";

import {
  ActionTypeItem,
  AdressedToDto,
  ChoosingReasonDto,
  CustomerRiskClassificationDto,
  CustomerSegmentEventData,
  EducationDto,
  InstitutionDto,
  MinistryDto,
  MultiSelectDto,
  NaceCodeDto,
  PlanProductDto,
  ProfessionDto,
  RiskRatingDto,
  TypesOfCertificatesDto,
} from "./dictionariesApi.types";

export const riskRatingMapper = (
  data: RiskRatingDto[]
): { name: string; id: number }[] => {
  return data.map((dto) => ({
    name: dto.description ?? "",
    id: dto.riskRatingId,
  }));
};

export const planProductsMapper = (
  data: PlanProductDto[]
): { name: string; id: number }[] => {
  return data.map((dto) => ({
    name: dto.lineOfBusiness ?? "",
    id: dto.lineOfBusinessId,
  }));
};

export const customerMapDataFromCustomerSegmentSelection = (
  data: CustomerSegmentEventData
): {
  boaSegmentId: number;
  boaSegment: string;
  boaDescription: string;
  naceCodeId: number;
  planProductId: number;
} => {
  return {
    boaSegmentId: data.boaSegmentId,
    boaSegment: data.boaSegment,
    boaDescription: data.boaDescription,
    naceCodeId: data.naceCodeId,
    planProductId: data.planProductId,
  };
};

export const customerRiskClassificationsMapper = (
  data: CustomerRiskClassificationDto[]
): { name: string; id: number }[] => {
  return data.map((dto) => ({
    name: dto.description ?? "",
    id: dto.customerRiskId,
  }));
};

export const naceCodesMapper = (
  data: NaceCodeDto[]
): { name: string; id: number }[] => {
  return data.map((dto) => ({
    name: dto.naceCode,
    id: dto.economicActivityKeId,
  }));
};

export const educationLevelsMapper = (
  data: EducationDto[]
): { name: string; id: number }[] => {
  return data.map((dto) => ({
    name: dto.educationLevel ?? "",
    id: dto.educationLevelId ?? 0,
  }));
};

export const choosingReasonsMapper = (
  data: ChoosingReasonDto[]
): { name: string; id: number }[] => {
  return data.map((dto) => ({
    name: dto.choosingReasonName ?? "",
    id: dto.choosingReasonId ?? 0,
  }));
};

export const professionsMapper = (
  data: ProfessionDto[]
): { name: string; id: number }[] => {
  return data.map((dto) => ({
    name: dto.profession ?? "",
    id: dto.professionId ?? 0,
  }));
};

export const ministriesMapper = (
  data: MinistryDto[]
): { name: string; id: number }[] => {
  return data.map((dto) => ({
    name: dto.ministry ?? "",
    id: dto.ministryId ?? 0,
  }));
};

export const institutionsMapper = (
  data: InstitutionDto[]
): { name: string; id: number }[] => {
  return data.map((dto) => ({
    name: dto.dicastery ?? "",
    id: dto.dicasteryId ?? 0,
  }));
};

export const multiSelectMapper = (
  data: MultiSelectDto[]
): { label: string; value: number }[] => {
  return data.map((dto) => ({
    label: dto.name,
    value: dto.id,
  }));
};

export const retailAccountNumberMapper = (
  data?: RetailAccountNumberListDto[]
): { name: string; id: number }[] => {
  return (data ?? []).map((dto) => ({
    name: dto.retailAccountNumber + " - " + dto.accountNumber ?? "",
    id: dto.productId ?? 0,
  }));
};

export const branchesMapper = (
  data?: BranchResponse[]
): { name: string; id: number }[] => {
  return (data ?? []).map((dto) => ({
    name: dto.branchName ?? "",
    id: dto.branchId ?? 0,
  }));
};

export const usersMapper = (
  data?: UserResponse[]
): { name: string; id: number }[] => {
  return (data ?? []).map((dto) => ({
    name: dto.user ?? "",
    id: dto.userId ?? 0,
  }));
};

export const typesOfCertificatesMapper = (
  data?: TypesOfCertificatesDto[]
): { name: string; id: number }[] => {
  return (data ?? []).map((dto) => ({
    name: dto.type ?? "",
    id: dto.valueMember ?? 0,
  }));
};

export const addressedToMapper = (
  data?: AdressedToDto[]
): { name: string; id: number }[] => {
  return (data ?? []).map((dto) => ({
    name: dto.addressed ?? "",
    id: dto.valueMember ?? 0,
  }));
};

export const customerRetailAccountMapper = (
  data?: BankCertificateAccount[]
): { name: string; id: number }[] => {
  return (data ?? []).map((dto) => ({
    name: dto.retailAccount + " - " + dto.accountNumber ?? "",
    id: dto.productId ?? 0,
  }));
};

export const statementAuthorizedPersonsMapper = (
  data?: { idParty: number; reportName: string }[]
): { name: string; id: number }[] => {
  return (data ?? []).map((dto) => ({
    name: dto.reportName ?? "",
    id: dto.idParty ?? 0,
  }));
};

export const actionTypeMapper = (
  data?: ActionTypeItem[]
): { name: string; id: number }[] => {
  return (data ?? []).map((dto) => ({
    name: dto.actionType ?? "",
    id: dto.actionId ?? 0,
  }));
};

export const countriesMapper = (
  countries: { name: string; id: number }[]
): { name: string; id: number }[] => {
  return countries.sort((a, b) => a.name.localeCompare(b.name));
};

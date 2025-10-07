export const test = null;

export interface TaxSourceItem {
  id: number;
  name: string;
}

export interface EducationDto {
  educationLevelId: number;
  educationLevel?: string;
}

export interface ProfessionDto {
  professionId?: number;
  profession?: string;
}

export interface MinistryDto {
  ministryId?: number;
  code?: string;
  ministry?: string;
}

export interface InstitutionDto {
  dicasteryId?: number;
  dicastery?: string;
  cityId?: number;
  code?: string;
  ministryId?: number;
}

export interface RiskRatingDto {
  riskRatingId: number;
  riskRating?: string;
  description?: string;
}

export interface PlanProductDto {
  lineOfBusinessId: number;
  lineOfBusiness?: string;
  description?: string;
}

export interface CustomerRiskClassificationDto {
  customerRiskId: number;
  customerRisk?: string;
  description?: string;
}

export interface ChoosingReasonDto {
  choosingReasonId: number | undefined;
  choosingReasonName: string | undefined;
}

export interface NaceCodeDto {
  economicActivityKeId: number;
  economicActivityKe: string;
  naceCode: string;
}

export interface MultiSelectDto {
  id: number;
  name: string;
}

export interface CustomerSegmentEventData {
  boaSegmentId: number;
  boaSegment: string;
  boaDescription: string;
  naceCodeId: number;
  planProductId: number;
}

export interface AdressedToDto {
  valueMember: number;
  addressed: string;
}

export interface TypesOfCertificatesDto {
  valueMember: number;
  type: string;
}

export interface ActionTypeItem {
  actionId: number;
  actionType: string;
}

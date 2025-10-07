import { SegmentCriteriaId } from "./Components/SegmentCriteriaId";
import { BooleanValue } from "./Components/BooleanValue";
import { ReviewRow } from "./Components/ReviewRow";
import { AccountOfficerId } from "./Components/AccountOfficerId";
import { PremiumService } from "./Components/PremiumService";
import { CountryId } from "./Components/CountryId";
import { CityId } from "./Components/CityId";
import { GenderId } from "./Components/GenderId";
import { MartialStatusId } from "./Components/MartialStatusId";
import { DocumentTypeId } from "./Components/DocumentTypeId";
import { IssuerId } from "./Components/IssuerId";
import { Prefix } from "./Components/Prefix";
import { MainSegmentId } from "./Components/MainSegmentId";
import { CustomerSegmentId } from "./Components/CustomerSegmentId";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { formatIntlLocalDate } from "@rbal-modern-luka/luka-portal-shell";
import { FatcaDocumentType } from "./Components/FatcaDocumentType";
import { FatcaStatusType } from "./Components/FatcaStatusType";
import { DiligenceEmployType } from "./Components/DiligenceEmployType";
import { EducationLevelId } from "./Components/EducationLevelId";
import { ProffesionId } from "./Components/ProfessionId";
import { PurposeOfBankRelationTypeIds } from "./Components/PurposeOfBankRelationTypeIds";
import { CurrencyIds } from "./Components/CurrencyIds";
import { SourceFundTypeIds } from "./Components/SourceFundTypeIds";
import { ChoosingReasonId } from "./Components/ChoosingReasonId";
import { BandId } from "./Components/BandId";
import { TransactionFrequencyId } from "./Components/TransactionFrequencyId";
import { Change } from "~/common/utils";
import { DocumentTypeIdWalkIn } from "./Components/DocumentTypeIdWalkIn";
import { ServiceId } from "./Components/ServiceId";
import { CityIdWalkin } from "./Components/CityIdWalkin";

interface ReviewValueDifferenceProps {
  row: Change;
  initialFormValues?: CustomerDto;
}

export const ReviewValueDifference = ({ row }: ReviewValueDifferenceProps) => {
  if (typeof row?.newValue === "boolean" || typeof row.oldValue === "boolean") {
    return <BooleanValue row={row} />;
  }

  switch (row.key) {
    case "customerInformation.mainSegmentId":
      return <MainSegmentId row={row} />;
    case "customerInformation.customerSegmentId":
      return <CustomerSegmentId row={row} />;
    case "customerInformation.premiumData.accountOfficerId":
      return <AccountOfficerId row={row} />;
    case "customerInformation.premiumData.segmentCriteriaId":
      return <SegmentCriteriaId row={row} />;
    case "customerInformation.premiumData.premiumService":
      return <PremiumService row={row} />;
    case "customerInformation.address.countryId":
    case "customerInformation.personalInfo.nationalityId":
    case "customerInformation.personalInfo.countryOfBirthId":
    case "additionalInformation.alternativeAddress.countryResidenceId":
    case "additionalInformation.alternativeAddress.citizenshipId":
    case "additionalInformation.alternativeAddress.stateOfTaxPaymentId":
    case "basicInformation.addressInformation.countryId":
    case "basicInformation.personalInformation.nationalityId":
    case "basicInformation.personalInformation.countryOfBirthId":
      return <CountryId row={row} />;
    case "customerInformation.address.cityId":
      return <CityId segment={"address"} row={row} />;
    case "basicInformation.addressInformation.cityId":
      return <CityIdWalkin segment={"addressInformation"} row={row} />;
    case "basicInformation.personalInformation.cityId":
      return <CityIdWalkin segment={"personalInformation"} row={row} />;
    case "customerInformation.personalInfo.genderId":
    case "basicInformation.personalInformation.genderId":
      return <GenderId row={row} />;
    case "customerInformation.personalInfo.martialStatusId":
    case "basicInformation.personalInformation.martialStatusId":
      return <MartialStatusId row={row} />;
    case "customerInformation.document.typeId":
      return <DocumentTypeId row={row} />;
    case "basicInformation.documentData.typeId":
      return <DocumentTypeIdWalkIn row={row} />;
    case "customerInformation.document.issuerId":
    case "basicInformation.documentData.issuerId":
      return <IssuerId row={row} />;
    case "customerInformation.contact.prefix":
      return <Prefix row={row} />;
    case "customerInformation.serviceInformation.premiumServiceId":
      return <ServiceId row={row} />;
    case "additionalInformation.employment.profession.professionId":
    case "additionalInformation.employmentData.professionId":
      return <ProffesionId row={row} />;
    case "additionalInformation.amlData.educationLevelId":
    case "basicInformation.amlInformation.educationLevelId":
      return <EducationLevelId row={row} />;
    case "additionalInformation.choosingReason.choosingReasonId":
      return <ChoosingReasonId row={row} />;
    case "dueDiligence.sourceOfIncome.sourceFundTypeIds":
      return <SourceFundTypeIds row={row} />;
    case "dueDiligence.bankingProducts.purposeOfBankRelationTypeIds":
      return <PurposeOfBankRelationTypeIds row={row} />;
    case "dueDiligence.cashTransactions.transactionFrequencyId":
      return <TransactionFrequencyId row={row} />;
    case "dueDiligence.cashTransactions.bandId":
      return <BandId row={row} />;
    case "dueDiligence.cashTransactions.currencyIds":
      return <CurrencyIds row={row} />;
    case "customerInformation.personalInfo.birthdate":
    case "customerInformation.document.issueDate":
    case "customerInformation.document.expiryDate":
    case "additionalInformation.amlData.deathDate":
    case "crs.crsDetails.crsSCDate":
    case "crs.crsDetails.crsActionExpireDate":
    case "crs.crsDetails.enhanceReviewDateCrs":
    case "fatca.fatcaInformation.documentaryDeadline":
    case "fatca.fatcaInformation.documentaryDate":
    case "fatca.fatcaInformation.statusDate":
    case "basicInformation.personalInformation.birthdate":
    case "basicInformation.documentData.issueDate":
    case "basicInformation.documentData.expiryDate":
    case "basicInformation.amlInformation.deathDate":
      return (
        <ReviewRow
          oldValue={formatIntlLocalDate(row.oldValue?.toString())}
          newValue={formatIntlLocalDate(row.newValue?.toString())}
          fieldKey={row.key}
        />
      );
    case "dueDiligence.employment.employmentTypeId":
      return <DiligenceEmployType row={row} />;
    case "fatca.fatcaInformation.documentType":
      return <FatcaDocumentType row={row} />;
    case "fatca.fatcaInformation.status":
      return <FatcaStatusType row={row} />;
    default:
      return (
        <ReviewRow
          oldValue={row.oldValue}
          newValue={row.newValue}
          fieldKey={row.key}
        />
      );
  }
};

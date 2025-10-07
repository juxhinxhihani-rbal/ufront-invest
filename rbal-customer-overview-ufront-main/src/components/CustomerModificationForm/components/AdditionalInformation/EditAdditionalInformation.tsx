import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Icon, Text } from "@rbal-modern-luka/ui-library";
import { useContext, useEffect, useState } from "react";
import { CollapsibleSegment } from "~/components/CollapsibleSegment/CollapsibleSegment";
import { CBConsent } from "./components/CBConsent/CBConsent";
import { Employment } from "./components/Employment/Employment";
import { MarketableCustomer } from "./components/MarketableCustomer/MarketableCustomer";
import { editAdditionalInformationI18n } from "./EditAdditionalInformation.i18n";
import { Aml } from "./components/Aml/Aml";
import { Boa } from "./components/Boa/Boa";
import { AlternativeAddress } from "./components/AlternativeAddress/AlternativeAddress";
import { AddedInformation } from "./components/AddedInformation/AddedInformation";
import { ChoosingReason } from "./components/ChoosingReason/ChoosingReason";
import { CustomerFormContext } from "../../context/CustomerFormContext";
import { useDataFromCustomerSegmentQuery } from "~/features/dictionaries/dictionariesQueries";
import { AddedInfoEnums } from "~/modules/ResegmentCustomer/types";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import { showBoaConsent } from "~/common/utils";
import { CustomerDto } from "~/api/customer/customerApi.types";

export const EditAdditionalInformation = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);
  const { isCreateMode } = customerFormContext;
  const { setValue, watch } = customerFormContext.form;
  const formValues = watch();

  const customerSegmentId =
    formValues?.customerInformation?.customerSegmentId ?? 0;
  const birthDate = formValues?.customerInformation?.personalInfo?.birthdate
    ? new Date(formValues?.customerInformation?.personalInfo?.birthdate)
    : undefined;

  const { data: dataFromCustomerSegment, isFetched } =
    useDataFromCustomerSegmentQuery(customerSegmentId, birthDate);

  const [isCbModalOpen, setIsCbModalOpen] = useState(false);
  const [isMarketableModalOpen, setIsMarketableModalOpen] = useState(false);

  const handleCb = (isCbConfirmed: boolean) => {
    setValue("additionalInformation.cbConsent.cbConsentAgreed", isCbConfirmed, {
      shouldValidate: true,
    });
    setIsCbModalOpen(false);
  };

  const handleMarketable = (isMarketableConfirmed: boolean) => {
    setValue(
      "additionalInformation.marketableCustomer.marketableCustomer",
      isMarketableConfirmed,
      {
        shouldValidate: true,
      }
    );
    setIsMarketableModalOpen(false);
  };

  useEffect(() => {
    if (dataFromCustomerSegment && isFetched && isCreateMode) {
      setValue(
        "additionalInformation.addedInfo.planProductId",
        dataFromCustomerSegment?.planProductId
      );
      setValue(
        "additionalInformation.addedInfo.naceCodeId",
        dataFromCustomerSegment?.naceCodeId
      );
      setValue(
        "additionalInformation.boaData.boaSegmentId",
        dataFromCustomerSegment?.boaSegmentId
      );
      setValue(
        "additionalInformation.boaData.boaSegment",
        dataFromCustomerSegment?.boaSegment
      );
      setValue(
        "additionalInformation.boaData.description",
        dataFromCustomerSegment?.boaDescription
      );
      setValue(
        "additionalInformation.addedInfo.amlExemptionId",
        AddedInfoEnums.AmlExemptionId
      );
      setValue(
        "additionalInformation.addedInfo.custRiskClassificationId",
        AddedInfoEnums.CustRiskClassificationId
      );
    }
  }, [isFetched, dataFromCustomerSegment, setValue, isCreateMode]);

  return (
    <Stack gap="8">
      <CollapsibleSegment<CustomerDto>
        title={tr(editAdditionalInformationI18n.employment)}
        formKey="additionalInformation.employment"
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <Employment />
      </CollapsibleSegment>
      <CollapsibleSegment<CustomerDto>
        title={tr(editAdditionalInformationI18n.aml)}
        formKey="additionalInformation.amlData"
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <Aml />
      </CollapsibleSegment>
      <CollapsibleSegment<CustomerDto>
        title={tr(editAdditionalInformationI18n.boa)}
        formKey="additionalInformation.boaData"
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <Boa />
      </CollapsibleSegment>
      <CollapsibleSegment<CustomerDto>
        title={tr(editAdditionalInformationI18n.alternativeAddress)}
        formKey="additionalInformation.alternativeAddress"
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <AlternativeAddress />
      </CollapsibleSegment>
      <CollapsibleSegment<CustomerDto>
        title={tr(editAdditionalInformationI18n.choosingReasonId)}
        formKey="additionalInformation.choosingReason"
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <ChoosingReason />
      </CollapsibleSegment>
      <CollapsibleSegment<CustomerDto>
        title={tr(editAdditionalInformationI18n.addedInformation)}
        formKey="additionalInformation.addedInfo"
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <AddedInformation />
      </CollapsibleSegment>

      <CollapsibleSegment<CustomerDto>
        title={tr(editAdditionalInformationI18n.marketableCustomer)}
        formKey="additionalInformation.marketableCustomer"
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <Icon
          style={{ position: "relative", top: "20px" }}
          fgColor="green600"
          type="hint-filled"
          onClick={() => setIsMarketableModalOpen(true)}
        />
        <MarketableCustomer
          name="additionalInformation.marketableCustomer.marketableCustomer"
          text={
            customerFormContext.form.getValues().additionalInformation
              ?.marketableCustomer?.branchOrDigital
          }
        />
        <ConfirmModal
          isOpen={isMarketableModalOpen}
          title={tr(editAdditionalInformationI18n.marketableTitle)}
          onConfirm={() => handleMarketable(true)}
          onCancel={() => handleMarketable(false)}
          preventClose={true}
        >
          <Stack gap="4">
            <Text
              text={tr(editAdditionalInformationI18n.marketableStatement)}
            />
            <Text
              text={tr(editAdditionalInformationI18n.marketableDescription)}
            />
            <Text
              text={tr(editAdditionalInformationI18n.marketableParagraph1)}
            />
            <Text
              text={tr(editAdditionalInformationI18n.marketableParagraph2)}
            />
            <Text
              text={tr(editAdditionalInformationI18n.marketableParagraph3)}
            />
            <Text
              text={tr(editAdditionalInformationI18n.marketableParagraph4)}
            />
            <Text
              text={tr(editAdditionalInformationI18n.marketableParagraph5)}
            />
            <Text
              text={tr(editAdditionalInformationI18n.marketableParagraph6)}
            />
          </Stack>
        </ConfirmModal>
      </CollapsibleSegment>

      {showBoaConsent(customerSegmentId) && (
        <CollapsibleSegment<CustomerDto>
          title={tr(editAdditionalInformationI18n.cbConsentAgreed)}
          formKey="additionalInformation.cbConsent"
          isOpenByDefaul
          errors={customerFormContext.form.formState?.errors}
        >
          <Icon
            style={{ position: "relative", top: "20px" }}
            fgColor="green600"
            type="hint-filled"
            onClick={() => setIsCbModalOpen(true)}
          />
          <CBConsent
            name="additionalInformation.cbConsent.cbConsentAgreed"
            text={
              customerFormContext.form.getValues().additionalInformation
                ?.cbConsent?.branchOrDigital
            }
          />
          <ConfirmModal
            isOpen={isCbModalOpen}
            title={tr(editAdditionalInformationI18n.cbConsentTitle)}
            onConfirm={() => handleCb(true)}
            onCancel={() => handleCb(false)}
            preventClose={true}
          >
            <Stack gap="4">
              <Text
                text={tr(editAdditionalInformationI18n.cbConsentStatement)}
              />
              <Text
                text={tr(editAdditionalInformationI18n.cbConsentDescription)}
              />
              <Text
                text={tr(editAdditionalInformationI18n.cbConsentParagaph1)}
              />
              <Text
                text={tr(editAdditionalInformationI18n.cbConsentParagaph2)}
              />
              <Text
                text={tr(editAdditionalInformationI18n.cbConsentParagaph3)}
              />
              <Text
                text={tr(editAdditionalInformationI18n.cbConsentParagaph4)}
              />
            </Stack>
          </ConfirmModal>
        </CollapsibleSegment>
      )}
    </Stack>
  );
};

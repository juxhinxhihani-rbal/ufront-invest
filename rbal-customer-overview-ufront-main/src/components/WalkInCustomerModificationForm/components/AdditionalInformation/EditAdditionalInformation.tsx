import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useContext, useState } from "react";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { WalkInCustomerFormContext } from "../../context/WalkInCustomerFormContext";
import { CollapsibleSegment } from "~/components/CollapsibleSegment/CollapsibleSegment";
import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";
import { additionalInformationI18n } from "./EditAdditionalInformation.i18n";
import { EditEmploymentData } from "./components/EditEmploymentData/EditEmploymentData";
import { EditAlternativeAddress } from "./components/EditAlternativeAddress/EditAlternativeAddress";
import { EditFatcaInformation } from "./components/EditFatcaInformation/EditFatcaInformation";
import { EditMarketableCustomer } from "./components/EditMarketableCustomer/EditMarketableCustomer";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";

export const EditAdditionalInformation = () => {
  const { tr } = useI18n();
  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);
  const { setValue } = walkInCustomerFormContext.form;

  const [isMarketableModalOpen, setIsMarketableModalOpen] = useState(false);

  const handleMarketable = (isMarketableConfirmed: boolean) => {
    setValue(
      "additionalInformation.marketableCustomer",
      isMarketableConfirmed,
      {
        shouldValidate: true,
      }
    );
    setIsMarketableModalOpen(false);
  };

  return (
    <Stack gap="8">
      <CollapsibleSegment<WalkInCustomerDto>
        formKey="additionalInformation.employmentData"
        title={tr(additionalInformationI18n.employmentData)}
        isOpenByDefaul
        errors={walkInCustomerFormContext.form.formState?.errors}
      >
        <EditEmploymentData />
      </CollapsibleSegment>

      <CollapsibleSegment<WalkInCustomerDto>
        formKey="additionalInformation.alternativeAddress"
        title={tr(additionalInformationI18n.alternativeAddress)}
        isOpenByDefaul
        errors={walkInCustomerFormContext.form.formState?.errors}
      >
        <EditAlternativeAddress />
      </CollapsibleSegment>

      <CollapsibleSegment<WalkInCustomerDto>
        formKey="additionalInformation.fatcaInformation"
        title={tr(additionalInformationI18n.fatcaInformation)}
        isOpenByDefaul
        errors={walkInCustomerFormContext.form.formState?.errors}
      >
        <EditFatcaInformation />
      </CollapsibleSegment>

      <CollapsibleSegment<WalkInCustomerDto>
        formKey="additionalInformation.marketableCustomer"
        title={tr(additionalInformationI18n.marketableCustomer)}
        isOpenByDefaul
        errors={walkInCustomerFormContext.form.formState?.errors}
      >
        <Icon
          style={{ position: "relative", top: "13px" }}
          fgColor="green600"
          type="hint-filled"
          onClick={() => setIsMarketableModalOpen(true)}
        />
        <EditMarketableCustomer name="additionalInformation.marketableCustomer" />
        <ConfirmModal
          isOpen={isMarketableModalOpen}
          title={tr(additionalInformationI18n.marketableTitle)}
          onConfirm={() => handleMarketable(true)}
          onCancel={() => handleMarketable(false)}
          preventClose={true}
        >
          <Stack gap="4">
            <Text text={tr(additionalInformationI18n.marketableStatement)} />
            <Text text={tr(additionalInformationI18n.marketableDescription)} />
            <Text text={tr(additionalInformationI18n.marketableParagraph1)} />
            <Text text={tr(additionalInformationI18n.marketableParagraph2)} />
            <Text text={tr(additionalInformationI18n.marketableParagraph3)} />
            <Text text={tr(additionalInformationI18n.marketableParagraph4)} />
            <Text text={tr(additionalInformationI18n.marketableParagraph5)} />
            <Text text={tr(additionalInformationI18n.marketableParagraph6)} />
          </Stack>
        </ConfirmModal>
      </CollapsibleSegment>
    </Stack>
  );
};

import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack } from "@rbal-modern-luka/ui-library";
import { debounce } from "lodash";
import { useContext, useEffect, useRef } from "react";
import { checkIfCustomerExists } from "~/api/customer/customerApi";
import { ExistsMode } from "~/api/customer/customerApi.types";
import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";
import { CollapsibleSegment } from "~/components/CollapsibleSegment/CollapsibleSegment";
import { validateDoubleCustomerFields } from "~/components/CustomerModificationForm/validators/createCustomerValidation";
import { showError } from "~/components/Toast/ToastContainer";
import { toasterNotificationI18n } from "~/modules/EditWalkInCustomer/Translations/ToasterNotification.i18n";
import { WalkInCustomerFormContext } from "../../context/WalkInCustomerFormContext";
import { EditAddressData } from "./components/EditAddressData/EditAddressData";
import { EditAmlData } from "./components/EditAmlData/EditAmlData";
import { EditContactData } from "./components/EditContactData/EditContactData";
import { EditPersonalData } from "./components/EditPersonalData/EditPersonalData";
import { EditPersonalDocumentData } from "./components/EditPersonalDocumentData/EditPersonalDocumentData";
import { basicInformationI18n } from "./EditBasicInformation.i18n";

export const EditBasicInformation = () => {
  const { tr } = useI18n();
  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);
  const isCreateMode = walkInCustomerFormContext.isCreateMode;

  const { watch } = walkInCustomerFormContext.form;
  const firstName = watch("basicInformation.personalInformation.firstName");
  const lastName = watch("basicInformation.personalInformation.lastName");
  const fatherName = watch("basicInformation.personalInformation.fatherName");
  const birthdate = watch("basicInformation.personalInformation.birthdate");
  const birthplace = watch("basicInformation.personalInformation.birthplace");
  const personalDocumentNumber = watch("basicInformation.documentData.ssn");
  const previousValuesRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      firstName &&
      lastName &&
      fatherName &&
      birthdate &&
      birthplace &&
      personalDocumentNumber
    ) {
      const validationSchema = validateDoubleCustomerFields(tr);
      const fieldsData = {
        firstName,
        lastName,
        personalDocumentNumber,
        birthdate,
        fatherName,
        birthplace,
      };
      const currentValuesString = JSON.stringify(fieldsData);

      if (previousValuesRef.current !== currentValuesString) {
        const debouncedCheck = debounce(async () => {
          try {
            await validationSchema.validate(fieldsData, { abortEarly: false });

            const customerCheckData = {
              firstName,
              lastName,
              personalDocumentNumber,
              birthdate,
              fatherName,
              birthplace,
            };

            const exists = await checkIfCustomerExists(
              customerCheckData,
              isCreateMode ? ExistsMode.Create : ExistsMode.Update
            );
            if (exists) {
              showError(tr(toasterNotificationI18n.walkInCustomerExist));
            }
          } catch (error) {
            console.error("error");
          }
        }, 3000);

        void debouncedCheck();
        previousValuesRef.current = currentValuesString;
        return () => {
          debouncedCheck.cancel();
        };
      }
    }
  }, [
    firstName,
    lastName,
    fatherName,
    birthdate,
    birthplace,
    personalDocumentNumber,
    isCreateMode,
    tr,
  ]);

  return (
    <Stack gap="8">
      <CollapsibleSegment<WalkInCustomerDto>
        formKey="basicInformation.personalInformation"
        title={tr(basicInformationI18n.personalData)}
        isOpenByDefaul
        errors={walkInCustomerFormContext.form.formState?.errors}
      >
        <EditPersonalData />
      </CollapsibleSegment>

      <CollapsibleSegment<WalkInCustomerDto>
        formKey="basicInformation.documentData"
        title={tr(basicInformationI18n.personalDocumentData)}
        isOpenByDefaul
        errors={walkInCustomerFormContext.form.formState?.errors}
      >
        <EditPersonalDocumentData />
      </CollapsibleSegment>

      <CollapsibleSegment<WalkInCustomerDto>
        formKey="basicInformation.addressInformation"
        title={tr(basicInformationI18n.addressData)}
        isOpenByDefaul
        errors={walkInCustomerFormContext.form.formState?.errors}
      >
        <EditAddressData />
      </CollapsibleSegment>

      <CollapsibleSegment<WalkInCustomerDto>
        formKey="basicInformation.contactData"
        title={tr(basicInformationI18n.contactData)}
        isOpenByDefaul
        errors={walkInCustomerFormContext.form.formState?.errors}
      >
        <EditContactData />
      </CollapsibleSegment>

      <CollapsibleSegment<WalkInCustomerDto>
        formKey="basicInformation.amlInformation"
        title={tr(basicInformationI18n.amlData)}
        isOpenByDefaul
        errors={walkInCustomerFormContext.form.formState?.errors}
      >
        <EditAmlData />
      </CollapsibleSegment>
    </Stack>
  );
};

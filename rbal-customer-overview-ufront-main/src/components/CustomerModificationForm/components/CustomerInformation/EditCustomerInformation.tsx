import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack } from "@rbal-modern-luka/ui-library";
import { useContext, useEffect, useRef } from "react";
import { CollapsibleSegment } from "~/components/CollapsibleSegment/CollapsibleSegment";
import {
  PremiumSegments,
  ServiceProviderSegments,
} from "~/modules/ResegmentCustomer/types";
import { EditAddressData } from "./components/EditAddressData/EditAddressData";
import { EditContactData } from "./components/EditContactData/EditContactData";
import { EditPersonalData } from "./components/EditPersonalData/EditPersonalData";
import { EditPersonalDocumentData } from "./components/EditPersonalDocumentData/EditPersonalDocumentData";
import { EditPremiumData } from "./components/EditPremiumData/EditPremiumData";
import { EditServiceData } from "./components/EditServiceData/EditServiceData";
import { customerInformationI18n } from "./CustomerInformation.i18n";
import { EditBankData } from "../Resegmentation/EditBankData/EditBankData";
import { CustomerFormContext } from "../../context/CustomerFormContext";
import { checkIfCustomerExists } from "~/api/customer/customerApi";
import { showError } from "~/components/Toast/ToastContainer";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";
import { debounce } from "lodash";
import { validateDoubleCustomerFields } from "../../validators/createCustomerValidation";
import { CustomerDto, ExistsMode } from "~/api/customer/customerApi.types";
import { useParams } from "react-router";

interface EditCustomerInformationProps {
  isResegmentation?: boolean;
  midasDate?: string;
}

export const EditCustomerInformation = ({
  isResegmentation,
  midasDate,
}: EditCustomerInformationProps) => {
  const { customerId = "" } = useParams();
  const { tr } = useI18n();
  const customerFormContext = useContext(CustomerFormContext);
  const isCreateMode = customerFormContext.isCreateMode;

  const { watch } = customerFormContext.form;
  const watchCustomerSegmentId = watch("customerInformation.customerSegmentId");
  const firstName = watch("customerInformation.personalInfo.firstName");
  const lastName = watch("customerInformation.personalInfo.lastName");
  const fatherName = watch("customerInformation.personalInfo.fatherName");
  const birthdate = watch("customerInformation.personalInfo.birthdate");
  const birthplace = watch("customerInformation.personalInfo.birthplace");
  const personalDocumentNumber = watch("customerInformation.document.ssn");
  const previousValuesRef = useRef<string | null>(null);

  const isPremium =
    PremiumSegments[watchCustomerSegmentId as PremiumSegments] !== undefined;

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
              isCreateMode
                ? customerId
                  ? ExistsMode.Update
                  : ExistsMode.Create
                : ExistsMode.Update
            );
            if (exists) {
              showError(tr(toasterNotificationI18n.customerExist));
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
    customerId,
    isCreateMode,
    tr,
  ]);

  return (
    <Stack gap="8">
      {PremiumSegments[watchCustomerSegmentId as PremiumSegments] &&
        isResegmentation && (
          <CollapsibleSegment<CustomerDto>
            formKey="customerInformation.premiumData"
            title={tr(customerInformationI18n.premiumData)}
            isOpenByDefaul
            errors={customerFormContext.form.formState?.errors}
          >
            <EditPremiumData />
          </CollapsibleSegment>
        )}

      {customerFormContext.isCreateMode && (
        <CollapsibleSegment<CustomerDto>
          formKey="customerInformation.bankData"
          title={tr(customerInformationI18n.bankData)}
          isOpenByDefaul
          errors={customerFormContext.form.formState?.errors}
        >
          <EditBankData />
        </CollapsibleSegment>
      )}

      {PremiumSegments[watchCustomerSegmentId as PremiumSegments] &&
        customerFormContext.isCreateMode && (
          <CollapsibleSegment<CustomerDto>
            formKey="customerInformation.premiumData"
            title={tr(customerInformationI18n.premiumData)}
            isOpenByDefaul
            errors={customerFormContext.form.formState?.errors}
          >
            <EditPremiumData />
          </CollapsibleSegment>
        )}

      <CollapsibleSegment<CustomerDto>
        formKey="customerInformation.personalInfo"
        title={tr(customerInformationI18n.personalData)}
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <EditPersonalData />
      </CollapsibleSegment>

      {(ServiceProviderSegments[
        watchCustomerSegmentId as ServiceProviderSegments
      ] ||
        PremiumSegments[watchCustomerSegmentId as PremiumSegments]) && (
        <CollapsibleSegment<CustomerDto>
          formKey="customerInformation.serviceInformation"
          title={tr(customerInformationI18n.serviceData)}
          isOpenByDefaul
          errors={customerFormContext.form.formState?.errors}
        >
          <EditServiceData isPremium={isPremium} />
        </CollapsibleSegment>
      )}

      <CollapsibleSegment<CustomerDto>
        formKey="customerInformation.address"
        title={tr(customerInformationI18n.addressData)}
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <EditAddressData />
      </CollapsibleSegment>

      <CollapsibleSegment<CustomerDto>
        formKey="customerInformation.document"
        title={tr(customerInformationI18n.personalDocumentData)}
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <EditPersonalDocumentData midasDate={midasDate} />
      </CollapsibleSegment>

      <CollapsibleSegment<CustomerDto>
        formKey="customerInformation.contact"
        title={tr(customerInformationI18n.contactData)}
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <EditContactData />
      </CollapsibleSegment>
    </Stack>
  );
};

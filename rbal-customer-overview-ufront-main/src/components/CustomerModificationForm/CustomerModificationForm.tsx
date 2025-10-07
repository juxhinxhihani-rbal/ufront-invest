import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Stack,
  StepperContext,
  Tab,
  Tabs,
  useTabs,
} from "@rbal-modern-luka/ui-library";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { EditCustomerTabs } from "~/modules/EditCustomer/types";
import { EditAdditionalInformation } from "./components/AdditionalInformation/EditAdditionalInformation";
import { EditDueDiligence } from "./components/DueDiligence/EditDueDiligence";
import { EditCustomerInformation } from "./components/CustomerInformation/EditCustomerInformation";
import { customerModificationFormI18n } from "./CustomerModificationForm.i18n";
import { styles } from "./CustomerModificationForm.styles";
import { FormKeys } from "~/features/types/commonTypes";
import { EditCRS } from "./components/CRS/EditCRS";
import { CustomerFormContext } from "./context/CustomerFormContext";
import { EditFatca } from "./components/Fatca/EditFatca";
import {
  getFatcaUsIndiciaObject,
  isFatcaActive,
} from "~/modules/EditCustomer/utils";
import { format } from "date-fns";
import { useMidasDateQuery } from "~/features/midas/midasQueries";

interface CustomerModificationFormProps {
  header: React.ReactElement;
  isResegmentation?: boolean;
}

export const CustomerModificationForm = ({
  header,
  isResegmentation,
}: CustomerModificationFormProps) => {
  const { customerId = "" } = useParams();
  const [midasDate, setMidasDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const customerFormContext = useContext(CustomerFormContext);
  const { form, isCreateMode, submitHandler, initialCustomerFormValues } =
    customerFormContext;
  const { getValues, trigger, handleSubmit } = form;
  const { tr } = useI18n();
  const { gotoNextStep } = useContext(StepperContext);

  const tabs = useTabs(EditCustomerTabs.CustomerInformation);
  const errors = customerFormContext.form.formState.errors;
  const isDirty = customerFormContext.form.formState.isDirty;
  const customerInformation = getValues("customerInformation");

  const nationalityId = getValues(
    "customerInformation.personalInfo.nationalityId"
  );
  const documentTypeId = getValues("customerInformation.document.typeId");
  const birthCountryId = getValues(
    "customerInformation.personalInfo.countryOfBirthId"
  );
  const livingCountryId = getValues("customerInformation.address.countryId");
  const mobileCountryCode = getValues(
    "customerInformation.contact.countryCodeMobile"
  );
  const crs = getValues("crs");
  const fatcaUsIndicia = getFatcaUsIndiciaObject(customerInformation, crs);

  const midasDateQuery = useMidasDateQuery();

  useEffect(() => {
    if (isResegmentation) {
      void trigger([
        "crs",
        "additionalInformation",
        "customerInformation.mainSegmentId",
        "customerInformation.customerSegmentId",
        "customerInformation.document",
        "customerInformation.personalInfo",
        "customerInformation.address",
        "customerInformation.auditInfo",
        "dueDiligence",
      ]);
    }
    if (!isCreateMode && initialCustomerFormValues) {
      void trigger();
    }
  }, [isResegmentation, trigger, isCreateMode, initialCustomerFormValues]);

  useEffect(() => {
    if (midasDateQuery.data) {
      const dateFormat = format(midasDateQuery.data, "yyyy-MM-dd");
      setMidasDate(dateFormat);
    }
  }, [midasDateQuery]);

  useEffect(() => {
    if (!isFatcaActive(fatcaUsIndicia)) {
      void trigger("fatca.fatcaInformation");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trigger,
    nationalityId,
    documentTypeId,
    birthCountryId,
    livingCountryId,
    mobileCountryCode,
    crs?.crsTaxInformation,
  ]);

  const checkIfContainError = (values: FormKeys<CustomerDto>) => {
    return Object.keys(errors).some((errorKey) =>
      values.includes(errorKey as FormKeys<CustomerDto>)
    );
  };

  const handleSaveButton = (
    isFatcaActive: boolean
  ): {
    label: string;
    action: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  } => {
    const saveButton = handleSubmit(
      isCreateMode || customerFormContext.isResegmentation
        ? submitHandler
        : handleGoToNextStep
    );
    const handleGoToNextTab = (
      e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
      tabs.setActiveTabId(nextTab);
      window.scrollTo({ top: 0, left: 0 });
      e.currentTarget.blur();
    };

    const numberOfDisabledTabs = (isFatcaActive: boolean) => {
      return isFatcaActive ? 0 : 1;
    };

    const saveOption = {
      label: tr(customerModificationFormI18n.saveAndPrint),
      action: saveButton,
    };
    const nextOption = {
      label: tr(customerModificationFormI18n.next),
      action: handleGoToNextTab,
    };

    if (!tabs.activeTabId || !customerFormContext.isCreateMode) {
      return saveOption;
    }
    const tabsArray = Object.values(EditCustomerTabs);
    const numberOfTabs = tabsArray.length;
    const numberOfActiveTabs =
      numberOfTabs - numberOfDisabledTabs(isFatcaActive);
    const activeTabNumber =
      Object.values(EditCustomerTabs).indexOf(
        tabs.activeTabId as EditCustomerTabs
      ) + 1;
    const nextTab = tabsArray[activeTabNumber];
    if (numberOfActiveTabs === activeTabNumber) {
      return saveOption;
    }
    return nextOption;
  };

  const hasError = Object.keys(errors).length > 0;

  const handleGoToNextStep = () => {
    if (!hasError) {
      gotoNextStep();
    }
  };

  return (
    <>
      <Stack gap="32">
        {header}

        <Stack>
          <Tabs tabs={tabs}>
            <Tab
              text={tr(customerModificationFormI18n.tabs.customerInformation)}
              tabId={EditCustomerTabs.CustomerInformation}
              hasError={checkIfContainError("customerInformation")}
            />

            <Tab
              text={tr(customerModificationFormI18n.tabs.additionalInformation)}
              tabId={EditCustomerTabs.AdditionalInformation}
              hasError={checkIfContainError("additionalInformation")}
            />

            <Tab
              text={tr(customerModificationFormI18n.tabs.dueDiligence)}
              tabId={EditCustomerTabs.DueDiligence}
              hasError={checkIfContainError("dueDiligence")}
            />

            <Tab
              text={tr(customerModificationFormI18n.tabs.crs)}
              tabId={EditCustomerTabs.Crs}
              hasError={checkIfContainError("crs")}
            />

            <Tab
              text={tr(customerModificationFormI18n.tabs.fatca)}
              tabId={EditCustomerTabs.Fatca}
              disabled={!isFatcaActive(fatcaUsIndicia)}
              hasError={checkIfContainError("fatca")}
            />
          </Tabs>
        </Stack>

        <Stack>
          {(() => {
            switch (tabs.activeTabId) {
              case EditCustomerTabs.CustomerInformation:
                return (
                  <EditCustomerInformation
                    isResegmentation={isResegmentation}
                    midasDate={midasDate}
                  />
                );
              case EditCustomerTabs.AdditionalInformation:
                return <EditAdditionalInformation />;
              case EditCustomerTabs.Fatca:
                return <EditFatca />;
              case EditCustomerTabs.DueDiligence:
                return <EditDueDiligence />;
              case EditCustomerTabs.Crs:
                return <EditCRS midasDate={midasDate} />;
              default:
                return null;
            }
          })()}
        </Stack>
      </Stack>

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(customerModificationFormI18n.cancel)}
          as={Link}
          to={`/customers/${customerId}`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
        />

        <Button
          text={handleSaveButton(isFatcaActive(fatcaUsIndicia)).label}
          colorScheme="yellow"
          css={styles.button}
          onClick={(e) => {
            handleSaveButton(isFatcaActive(fatcaUsIndicia)).action(e);
          }}
          disabled={!isCreateMode && !isDirty}
        />
      </Stack>
    </>
  );
};

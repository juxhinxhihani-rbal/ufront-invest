import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Stack,
  StepperContext,
  Tab,
  Tabs,
  useTabs,
} from "@rbal-modern-luka/ui-library";
import { MouseEvent, useContext } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FormKeys } from "~/features/types/commonTypes";
import { WalkInCustomerFormContext } from "./context/WalkInCustomerFormContext";
import { styles } from "../CustomerModificationForm/CustomerModificationForm.styles";
import { walkInCustomerModificationFormI18n } from "./WalkInCustomerModificationForm.i18n";
import { EditWalkInCustomerTabs } from "~/modules/EditWalkInCustomer/types";
import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";
import { EditBasicInformation } from "./components/BasicInformation/EditBasicInformation";
import { EditAdditionalInformation } from "./components/AdditionalInformation/EditAdditionalInformation";

interface WalkInCustomerModificationFormProps {
  header: React.ReactElement;
}

export const WalkInCustomerModificationForm = ({
  header,
}: WalkInCustomerModificationFormProps) => {
  const { customerId } = useParams();
  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);
  const { form, isCreateMode, submitHandler } = walkInCustomerFormContext;
  const { handleSubmit } = form;
  const { tr } = useI18n();
  const { gotoNextStep } = useContext(StepperContext);

  const tabs = useTabs(EditWalkInCustomerTabs.BasicInformation);
  const errors = walkInCustomerFormContext.form.formState.errors;
  const isDirty = walkInCustomerFormContext.form.formState.isDirty;

  const checkIfContainError = (values: FormKeys<WalkInCustomerDto>) => {
    return Object.keys(errors).some((errorKey) =>
      values.includes(errorKey as FormKeys<WalkInCustomerDto>)
    );
  };

  const handleSaveButton = (): {
    label: string;
    action: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  } => {
    const saveButton = handleSubmit(
      isCreateMode ? submitHandler : handleGoToNextStep
    );
    const handleGoToNextTab = (
      e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
      tabs.setActiveTabId(nextTab);
      window.scrollTo({ top: 0, left: 0 });
      e.currentTarget.blur();
    };

    const saveOption = {
      label: tr(walkInCustomerModificationFormI18n.save),
      action: saveButton,
    };

    const nextOption = {
      label: tr(walkInCustomerModificationFormI18n.next),
      action: handleGoToNextTab,
    };

    if (!tabs.activeTabId || !walkInCustomerFormContext.isCreateMode) {
      return saveOption;
    }
    const tabsArray = Object.values(EditWalkInCustomerTabs);
    const numberOfTabs = tabsArray.length;
    const activeTabNumber = Object.values(EditWalkInCustomerTabs).indexOf(
      tabs.activeTabId as EditWalkInCustomerTabs
    );
    const nextTab = tabsArray[activeTabNumber + 1];
    if (activeTabNumber === numberOfTabs - 1) {
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
              text={tr(
                walkInCustomerModificationFormI18n.tabs.basicInformation
              )}
              tabId={EditWalkInCustomerTabs.BasicInformation}
              hasError={checkIfContainError("basicInformation")}
            />

            <Tab
              text={tr(
                walkInCustomerModificationFormI18n.tabs.additionalInformation
              )}
              tabId={EditWalkInCustomerTabs.AdditionalInformation}
              hasError={checkIfContainError("additionalInformation")}
            />
          </Tabs>
        </Stack>

        <Stack>
          {(() => {
            switch (tabs.activeTabId) {
              case EditWalkInCustomerTabs.BasicInformation:
                return <EditBasicInformation />;
              case EditWalkInCustomerTabs.AdditionalInformation:
                return <EditAdditionalInformation />;
              default:
                return null;
            }
          })()}
        </Stack>
      </Stack>

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(walkInCustomerModificationFormI18n.cancel)}
          as={Link}
          to={`/customers/walkIn/${customerId}`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
        />

        <Button
          text={handleSaveButton().label}
          colorScheme="yellow"
          css={styles.button}
          onClick={(e) => {
            handleSaveButton().action(e);
          }}
          disabled={!isCreateMode && !isDirty}
        />
      </Stack>
    </>
  );
};

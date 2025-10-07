import React, { useCallback } from "react";
import { Stack, Icon, Text } from "@rbal-modern-luka/ui-library";
import { useForm } from "react-hook-form";
import { ListCustomersParams } from "~/modules/CustomerListingPage/types";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { customerListingFormI18n } from "./CustomerListingForm.i18n";
import { styles } from "./CustomerListingForm.styles";

import { customerListingPageI18n } from "../../CustomerListingPage.i18n";

// Assuming styles are defined elsewhere in your codebase

interface CustomerListingFormProps {
  initialValues: ListCustomersParams;
  onValidSubmit: (initialValues: ListCustomersParams) => void;
}

export const CustomerListingForm: React.FC<CustomerListingFormProps> = ({
  initialValues,
  onValidSubmit,
}) => {
  const { tr } = useI18n();
  const form = useForm<ListCustomersParams>({ defaultValues: initialValues });

  // Utilize the watch function to monitor field values
  const fullNameContainsValue = form.watch("fullNameContains");
  const customerNoValue = form.watch("customerNo");
  const retailAccountNoValue = form.watch("retailAccountNo");

  const handleValidSubmit = useCallback(
    (values: ListCustomersParams) => {
      onValidSubmit(values);
    },
    [onValidSubmit]
  );

  const handleClearInput = useCallback(
    (field: keyof ListCustomersParams) => {
      form.setValue(field, "");
    },
    [form]
  );

  const formFields = {
    customerNo: form.register("customerNo"),
    retailAccountNo: form.register("retailAccountNo"),
    fullNameContains: form.register("fullNameContains"),
  };

  const handleClearFullNameInput = useCallback(() => {
    handleClearInput("fullNameContains");
  }, [handleClearInput]);

  const handleClearCustomerNoInput = useCallback(() => {
    handleClearInput("customerNo");
  }, [handleClearInput]);

  const handleClearRetailAccountNoInput = useCallback(() => {
    handleClearInput("retailAccountNo");
  }, [handleClearInput]);

  return (
    <Stack
      id="customer-listing-form"
      as="form"
      gap="56"
      onSubmit={form.handleSubmit(handleValidSubmit)}
      customStyle={styles.form}
    >
      <Stack id="customer-listing-form-search-fields" gap="8" d="v">
        {/* <Text weight="bold" css={styles.titleText} text="Search customer" /> */}

        <Text
          id="customer-listing-form-title"
          size="32"
          weight="bold"
          fgColor="gray800"
          customStyle={styles.titleText}
          text={tr(customerListingPageI18n.title)}
        />

        <Text
          id="customer-listing-form-subtitle"
          size="12"
          fgColor="gray200"
          text={tr(customerListingFormI18n.search)}
        />
        <button
          id="customer-listing-form-submit-button"
          type="submit"
          css={styles.hiddenSubmitButton}
          aria-hidden="true"
        ></button>
      </Stack>

      <Stack d="h" customStyle={styles.inputsWrapper}>
        <Stack gap="8" d="h" customStyle={styles.inputContainer}>
          <Icon type="search" size="20" />

          <input
            css={styles.input}
            id="customer-listing-form-retail-account-no-input"
            placeholder={tr(customerListingFormI18n.fields.fullName)}
            {...formFields.fullNameContains}
            maxLength={80}
            autoFocus
          />

          {fullNameContainsValue && (
            <Icon
              type="close"
              size="16"
              css={styles.clearInputIcon}
              onClick={handleClearFullNameInput}
            />
          )}
        </Stack>

        <Stack customStyle={styles.separator} />

        <Stack gap="8" d="h" customStyle={styles.inputContainer}>
          <Icon type="man-butterfly" size="20" />

          <input
            id="customer-listing-form-customer-input"
            css={styles.input}
            placeholder={tr(customerListingFormI18n.fields.customerNo)}
            {...formFields.customerNo}
            maxLength={20}
          />

          {customerNoValue && (
            <Icon
              id="customer-listing-form-clear-customer-input-icon"
              type="close"
              size="16"
              css={styles.clearInputIcon}
              onClick={handleClearCustomerNoInput}
            />
          )}
        </Stack>

        <Stack
          id="customer-listing-form-separator"
          customStyle={styles.separator}
        />

        <Stack gap="8" d="h" customStyle={styles.inputContainer}>
          <Icon type="safe" size="20" />

          <input
            id="input"
            css={styles.input}
            placeholder={tr(customerListingFormI18n.fields.retailAccountNo)}
            {...formFields.retailAccountNo}
            maxLength={50}
          />

          {retailAccountNoValue && (
            <Icon
              type="close"
              size="16"
              css={styles.clearInputIcon}
              onClick={handleClearRetailAccountNoInput}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

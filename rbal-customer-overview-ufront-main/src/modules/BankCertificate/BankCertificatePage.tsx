import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Card,
  Container,
  Loader,
  Stack,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { css, Theme } from "@emotion/react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { Select } from "~/components/Select/Select";
import { bankCertificateI18n } from "./BankCertificatePage.i18n";
import { Input } from "~/components/Input/Input";
import { Textarea } from "~/components/Textarea/Textarea";
import { BankCertificateTable } from "./BankCertificateTable/BankCertificateTable";
import {
  useAddressedToTypes,
  useTypesOfCertificates,
} from "~/features/dictionaries/dictionariesQueries";
import { yupResolver } from "@hookform/resolvers/yup";
import { bankCertificateValidation } from "./validators/bankCertificateValidation";
import { BankCertificateFormValues } from "./types";
import { handleOpenPdf } from "~/features/files/files";
import { useState } from "react";
import { OverlayLoader } from "../CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { DocumentTypes } from "~/features/hooks/useCustomerAttachments/useCustomerAttachments";
import { customerRetailAccountMapper } from "~/api/dictionaries/dictionariesMappers";
import { useBankCertificateCommission } from "~/api/bankCertificate/bankCertificateMutations";
import { lowerFirst } from "lodash";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import {
  useBankCertificateAccountsQuery,
  useBankCertificateCommissionAccountsQuery,
} from "~/features/bankCertificates/bankCertificateQueries";
import { useSelectAccounts } from "./BankCertificateTable/hooks/useSelectAccounts";

const styles = {
  filters: (t: Theme) =>
    css({
      paddingTop: tokens.scale(t, "16"),
    }),
  actions: css({
    justifyContent: "flex-end",
  }),
  field: css({
    maxWidth: "32%",
  }),
  row: css({ alignItems: "flex-end" }),
};

export const BankCertificatePage = () => {
  const { tr } = useI18n();
  const { customerId = "" } = useParams();

  const typesOfCertificates = useTypesOfCertificates();
  const addressedToTypes = useAddressedToTypes();
  const bankCertificateAccountsQuery =
    useBankCertificateAccountsQuery(customerId);
  const bankCertificateCommissionAccounts =
    useBankCertificateCommissionAccountsQuery(customerId);

  const { mutate: processCommission, isLoading: isProcessingCommission } =
    useBankCertificateCommission();

  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid: isFormValid },
  } = useForm<BankCertificateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(bankCertificateValidation(tr)) as any,
  });

  const {
    selectedAccountNumbers,
    toggleSelectAccount,
    isAccountSelected,
    isAllAccountsSelected,
    toggleSelectAllAccounts,
  } = useSelectAccounts({
    accounts: bankCertificateAccountsQuery.query.data ?? [],
  });

  const paymentAccountWatcher = watch("paymentAccountId");
  const certificateTypeWatcher = watch("certificateTypeId");

  const handleProcessCommission = () => {
    const errors: string[] = [];

    if (!paymentAccountWatcher) {
      setError("paymentAccountId", {
        type: "manual",
        message: tr(bankCertificateI18n.paymentAccountRequired),
      });
      errors.push("paymentAccountId");
    }

    if (!certificateTypeWatcher) {
      setError("certificateTypeId", {
        type: "manual",
        message: tr(bankCertificateI18n.certificateTypeRequired),
      });
      errors.push("certificateTypeId");
    }
    if (
      errors.length === 0 &&
      paymentAccountWatcher &&
      certificateTypeWatcher
    ) {
      clearErrors(["paymentAccountId", "certificateTypeId"]);
      processCommission(
        { productId: paymentAccountWatcher, reportId: certificateTypeWatcher },
        {
          onSuccess: (response) => {
            const messageCode = tr(
              bankCertificateI18n.processCommissionMessages[
                lowerFirst(
                  response.message.toString()
                ) as keyof typeof bankCertificateI18n.processCommissionMessages
              ]
            );
            if (response.isSuccess) {
              showSuccess(messageCode);
            } else {
              showWarning(messageCode);
            }
          },
          onError: () => {
            showError(tr(bankCertificateI18n.errorWhenProcessingCommission));
          },
        }
      );
      return;
    }
  };

  const certificateTypeSwitch = (certificateTypeId: number): string => {
    switch (certificateTypeId) {
      case 2006:
        return DocumentTypes.BankingStatementNonStandart;
      case 2007:
        return DocumentTypes.BankingStatementPial;
      case 2008:
        return DocumentTypes.BankingStatementPien;
      default:
        return "";
    }
  };

  const handleGenerateCertificate = (values: BankCertificateFormValues) => {
    const params = new URLSearchParams({
      documentTemplateCode: certificateTypeSwitch(
        values.certificateTypeId ?? 0
      ),
      idAddressedTo: values.addressedToId
        ? values.addressedToId.toString()
        : "",
    });

    if (values.branchAuthorizer) {
      params.append("userAuthorizer", values.branchAuthorizer);
    }
    if (values.notes) {
      params.append("notes", values.notes);
    }
    if (selectedAccountNumbers) {
      params.append("accountsJson", JSON.stringify(selectedAccountNumbers));
    }

    handleOpenPdf(
      `/api/customer-overview/customers/${customerId}/customer-documents/certificates?${params.toString()}`,
      setLoading
    );
  };

  const handleClearFilters = () => {
    const clearFilters: BankCertificateFormValues = {
      paymentAccountId: undefined,
      certificateTypeId: undefined,
      addressedToId: undefined,
      branchAuthorizer: "",
      notes: "",
    };
    reset(clearFilters);
  };

  return (
    <>
      <Container as="main">
        {loading && (
          <OverlayLoader
            label={tr(bankCertificateI18n.pleaseWait)}
            isCenteredIcon
          />
        )}
        {isProcessingCommission && (
          <OverlayLoader
            label={tr(bankCertificateI18n.processingcommission)}
            isCenteredIcon
          />
        )}
        <Stack>
          <BackCustomerView to={`/customers/${customerId}`} />
          <Card>
            <Text
              text={tr(bankCertificateI18n.header)}
              size="24"
              lineHeight="32"
              weight="bold"
            />
            <Stack customStyle={styles.filters} gap="16">
              <Stack>
                <Stack d="h" customStyle={styles.row}>
                  <Select
                    id="paymentAccountId"
                    label={tr(bankCertificateI18n.paymentAccount)}
                    name={"paymentAccountId"}
                    control={control}
                    data={customerRetailAccountMapper(
                      bankCertificateCommissionAccounts.data
                    )}
                    inputStyle={styles.field}
                    errorMessage={errors.paymentAccountId?.message}
                  />
                  <Stack>
                    <Button
                      type="button"
                      text={tr(bankCertificateI18n.payCommission)}
                      colorScheme="yellow"
                      icon="money"
                      variant="solid"
                      onClick={handleProcessCommission}
                    />
                  </Stack>
                </Stack>
              </Stack>
              <Stack gap="16">
                <Stack d="h">
                  <Select
                    id="certificateTypeId"
                    label={tr(bankCertificateI18n.certificateType)}
                    name={"certificateTypeId"}
                    control={control}
                    data={typesOfCertificates.data}
                    inputStyle={styles.field}
                    errorMessage={errors.certificateTypeId?.message}
                  />
                  <Select
                    id="addressedToId"
                    label={tr(bankCertificateI18n.addressedTo)}
                    name={"addressedToId"}
                    control={control}
                    data={addressedToTypes.data}
                    inputStyle={styles.field}
                    errorMessage={errors.addressedToId?.message}
                  />
                  <Input
                    id="branchAuthorizer"
                    label={tr(bankCertificateI18n.branchAuthorizer)}
                    register={register("branchAuthorizer")}
                    inputStyle={styles.field}
                  />
                </Stack>
                <Stack d="h">
                  <Textarea
                    label={tr(bankCertificateI18n.notes)}
                    id="notes"
                    name="notes"
                    control={control}
                    isDisabled={watch("addressedToId") !== 4}
                  />
                </Stack>
                <Stack d="h" customStyle={styles.actions}>
                  <Button
                    type="button"
                    text={tr(bankCertificateI18n.generateCertificate)}
                    colorScheme="yellow"
                    icon="pdf"
                    variant="solid"
                    disabled={!isFormValid}
                    onClick={handleSubmit(handleGenerateCertificate)}
                  />
                  <Button
                    type="button"
                    text={tr(bankCertificateI18n.clear)}
                    colorScheme="yellow"
                    icon="clear-ring"
                    variant="outline"
                    onClick={handleClearFilters}
                  />
                </Stack>
              </Stack>

              <Stack>
                {bankCertificateAccountsQuery.query.isLoading ? (
                  <Loader withContainer={false} linesNo={4} />
                ) : (
                  <BankCertificateTable
                    accounts={bankCertificateAccountsQuery.query.data ?? []}
                    toggleSelectAccount={toggleSelectAccount}
                    isAccountSelected={isAccountSelected}
                    isAllAccountsSelected={isAllAccountsSelected}
                    toggleSelectAllAccounts={toggleSelectAllAccounts}
                  />
                )}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

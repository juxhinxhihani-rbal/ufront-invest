import { useCallback, useContext, useMemo, useState } from "react";
import { css, Theme } from "@emotion/react";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Input,
  Stack,
  StepperContext,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import {
  useReadAccountCurrenciesQuery,
  useReadAccountProductsQuery,
  useCreateRetailAccount,
} from "~/features/retailAccount/retailAccountQueries";
import { useForm } from "react-hook-form";
import { RetailAccountFormValues } from "../types";
import { HttpClientError, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { accountDetailsI18n } from "./AccountDetails.i18n";
import { InputLabel } from "~/components/InputLabel/InputLabel";
import { RetailAccountContext } from "../CreateRetailAccountSwitch/CreateRetailAccountSwitch";
import { FeedbackPage } from "~/components/FeedbackPage/FeedbackPage";
import { useCounter } from "~/features/hooks/useCounter";
import { AccountDetailsLoader } from "./AccountDetailsLoader/AccountDetailsLoader";
import { Select } from "~/components/Select/Select";
import {
  AccountProductResponse,
  CurrencyItem,
} from "~/api/retailAccount/retailAccount.types";
import { getRetailAccountValidation } from "../validators/retailAccountValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorCode } from "~/api/enums/ErrorCode";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { UseQueryResult } from "react-query";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { useNavigate } from "react-router";

const styles = {
  container: css({
    position: "relative",
  }),
  inputContainer: css({
    flexWrap: "wrap",
  }),
  saveButton: css({
    width: "fit-content",
  }),
  wideInput: css({
    minWidth: "22.5rem",
  }),
  feedbackPageContainer: (t: Theme) =>
    css({
      textAlign: "center",

      "& svg": {
        width: tokens.scale(t, "80", true),
        height: tokens.scale(t, "80", true),
      },
    }),
};

interface AccountDetailsProps {
  customerId: string;
  customerQuery: UseQueryResult<CustomerDto, HttpClientError>;
}

const formatCurrencies = (
  data: CurrencyItem[] = []
): { id: string; name: string }[] => {
  return data?.map(({ currencyCode }) => ({
    id: currencyCode,
    name: currencyCode,
  }));
};

const formatProduct = (
  data: AccountProductResponse[] = []
): { id: string; name: string }[] => {
  return data?.map(({ id, name }) => ({
    id: id.toString(),
    name,
  }));
};

export const AccountDetails: React.FC<AccountDetailsProps> = (props) => {
  const { customerId, customerQuery } = props;
  const { tr } = useI18n();
  const navigate = useNavigate();

  const [createAccountError, setCreateAccountError] =
    useState<HttpClientError>();

  const { gotoNextStep } = useContext(StepperContext);
  const { setResponse } = useContext(RetailAccountContext);

  const {
    formState: { errors, isValid: isFormValid },
    control,
    register,
    handleSubmit,
    watch,
  } = useForm<RetailAccountFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(getRetailAccountValidation(tr)) as any,
  });

  const { count: requestDuration, startCounting, stopCounting } = useCounter();

  const formValues = watch();

  const idempotencyKey = useMemo(() => {
    return uuidv4();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.productId, formValues.currencyCode, formValues.accountName]);

  const customerSegmentId =
    customerQuery?.data?.customerInformation?.customerSegmentId;

  const accountProductQuery = useReadAccountProductsQuery(customerSegmentId);

  const accountCurrencyQuery = useReadAccountCurrenciesQuery(
    formValues.productId,
    customerSegmentId
  );

  const createRetailAccountMutation = useCreateRetailAccount(
    customerId,
    idempotencyKey
  );

  const handleSuccessfulSubmit = useCallback(
    (values: RetailAccountFormValues) => {
      startCounting();
      createRetailAccountMutation.mutate(values, {
        onSuccess: (response) => {
          showSuccess(
            tr(
              accountDetailsI18n.accountCreatedSuccessfully,
              response.retailAccountNumber
            ) as string
          );
          stopCounting();
          setResponse(response);
          gotoNextStep();
        },
        onError: (response) => {
          if (response.code === ErrorCode.ValidationException) {
            showWarning(tr(accountDetailsI18n.segmentValidationError));
          } else if (response.code === ErrorCode.InvalidCustomerDataException) {
            showError(response.title as string);
            navigate(`/customers/${customerId}/edit-customer`);
          } else {
            setCreateAccountError(response);
          }
          stopCounting();
        },
      });
    },
    [
      startCounting,
      createRetailAccountMutation,
      stopCounting,
      setResponse,
      gotoNextStep,
      tr,
      navigate,
      customerId,
    ]
  );

  const handleGoBack = () => {
    setCreateAccountError(undefined);
  };

  if (createAccountError) {
    return (
      <FeedbackPage
        customContaierStyles={styles.feedbackPageContainer}
        title={
          <Text
            size="32"
            lineHeight="48"
            weight="bold"
            text={tr(accountDetailsI18n.errorTitle)}
          />
        }
        text={
          <Text
            size="16"
            lineHeight="24"
            text={
              <>
                {tr(accountDetailsI18n.errorDescription)}
                <br />
                {tr(accountDetailsI18n.errorSubDescription)}
              </>
            }
          />
        }
        icon="retry-with-errors"
        withPadding={false}
        cta={
          <Button
            colorScheme="yellow"
            text={tr(accountDetailsI18n.goBack)}
            onClick={handleGoBack}
          />
        }
      />
    );
  }

  return (
    <Stack gap="32" customStyle={styles.container}>
      {createRetailAccountMutation.isLoading && (
        <AccountDetailsLoader requestDuration={requestDuration} />
      )}

      <Text size="24" weight="bold" text={tr(accountDetailsI18n.header)} />

      <Stack d="h" gap="32" customStyle={styles.inputContainer}>
        <Select
          id="productId"
          control={control}
          name="productId"
          label={tr(accountDetailsI18n.accountProduct)}
          isRequired
          errorMessage={errors.productId?.message}
          data={formatProduct(accountProductQuery.query.data)}
        />

        <Select
          id="currencyCode"
          control={control}
          label={tr(accountDetailsI18n.accountCurrency)}
          isRequired
          name="currencyCode"
          disabled={!Number(formValues.productId)}
          errorMessage={errors.currencyCode?.message}
          data={formatCurrencies(accountCurrencyQuery.query.data?.currencies)}
        />
        <Stack gap="8" customStyle={styles.wideInput}>
          <InputLabel
            label={tr(accountDetailsI18n.accountName)}
            htmlFor="accountName"
          />

          <Input {...register("accountName")} id="accountName" />
        </Stack>
      </Stack>

      <Button
        variant="solid"
        colorScheme="green"
        text={tr(accountDetailsI18n.submitButton)}
        css={styles.saveButton}
        disabled={!isFormValid}
        onClick={handleSubmit(handleSuccessfulSubmit)}
      />
    </Stack>
  );
};

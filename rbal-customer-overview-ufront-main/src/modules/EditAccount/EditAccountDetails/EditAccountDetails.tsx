import {
  Button,
  Stack,
  StepperContext,
  Text,
} from "@rbal-modern-luka/ui-library";
import { useContext } from "react";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { EditAccountFormContext } from "../context/EditAccountFormContext";
import { Select } from "~/components/Select/Select";
import { Input } from "~/components/Input/Input";
import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { editAccountViewDetailsI18n } from "../EditAccountViewDetails/EditAccountViewDetails.i18n";
import { Textarea } from "~/components/Textarea/Textarea";
import { useAccountClosingReasonsQuery } from "~/features/dictionaries/dictionariesQueries";
import { showWarning } from "~/components/Toast/ToastContainer";
import { AccountCommissions } from "~/api/retailAccount/retailAccount.types";
import { editAccountViewI18n } from "../EditAccountView.i18n";
import { useLocation, useNavigate, useParams } from "react-router";

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
  gridContainer: css({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  }),
};

export const EditAccountDetails = () => {
  const { customerNumber = "", accountId = "" } = useParams();
  const numericAccountId = parseInt(accountId);
  const { tr } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const { customer, authorizedPersons } = location.state || {};

  const accountFormContext = useContext(EditAccountFormContext);
  const isAccountClosing = accountFormContext.isAccountClosing;
  const {
    control,
    register,
    setValue,
    trigger,
    formState: { errors },
  } = accountFormContext.form;
  const accountClosingReasonQuery = useAccountClosingReasonsQuery();
  const { gotoNextStep } = useContext(StepperContext);

  const handleGoToNextStep = async () => {
    if (isAccountClosing && accountClosingReasonQuery.data) {
      const selectedReasonId =
        accountFormContext.form.getValues().accountClosureReasons.reasonId;
      const selectedReasonName =
        accountClosingReasonQuery?.data.find(
          (item) => item.reasonId === selectedReasonId
        )?.reasonName ?? "";
      setValue("accountClosureReasons.reasonName", selectedReasonName);
    }
    const currentValues =
      accountFormContext.form.getValues().accountCommissions;
    const initialAccountDetailValues =
      accountFormContext.initialCustomerFormValues?.accountCommissions;

    const hasChanges = Object.keys(currentValues).some((key) => {
      const typedKey = key as keyof AccountCommissions;

      const currentValue = currentValues[typedKey];
      const initialValue = initialAccountDetailValues[typedKey];

      if (currentValue === null || initialValue === null) {
        return currentValue !== initialValue;
      }

      return Number(currentValue) !== Number(initialValue);
    });

    if (!isAccountClosing && !hasChanges) {
      showWarning(tr(editAccountViewI18n.changeOneFieldOnAmendWarning));
      return;
    }

    if (isAccountClosing) {
      const isValid = await trigger();
      if (!isValid) {
        return;
      }
    }
    gotoNextStep();
  };

  return (
    <Stack gap="32">
      <Stack>
        <RowHeader
          pb="4"
          label={
            <Text
              text={tr(editAccountViewDetailsI18n.customerAccountSectionTitle)}
              weight="bold"
              size="16"
            />
          }
        />
        <Stack d="h" customStyle={styles.inputContainer}>
          <Input
            id="name"
            label={tr(editAccountViewDetailsI18n.name)}
            register={register("customerDetails.name")}
            disabled
          />
          <Input
            id="surname"
            label={tr(editAccountViewDetailsI18n.surname)}
            register={register("customerDetails.surname")}
            disabled
          />
          <Input
            id="fatherName"
            label={tr(editAccountViewDetailsI18n.fatherName)}
            register={register("customerDetails.fatherName")}
            disabled
          />
          <Input
            id="customerNumber"
            label={tr(editAccountViewDetailsI18n.customerNumber)}
            register={register("customerDetails.customerNumber")}
            disabled
          />
          <Input
            id="mainSegment"
            label={tr(editAccountViewDetailsI18n.mainSegment)}
            register={register("customerDetails.mainSegment")}
            disabled
          />
          <Input
            id="customerSegment"
            label={tr(editAccountViewDetailsI18n.customerSegment)}
            register={register("customerDetails.customerSegment")}
            disabled
          />
        </Stack>
      </Stack>

      <Stack>
        <RowHeader
          pb="4"
          label={
            <Text
              text={tr(editAccountViewDetailsI18n.accountNumberSectionTitle)}
              weight="bold"
              size="16"
            />
          }
        />
        <Stack d="h" customStyle={styles.gridContainer}>
          <Input
            id="accountNumber"
            label={tr(editAccountViewDetailsI18n.accountNumber)}
            register={register("accountNumber")}
            disabled
            isFullWidth={true}
          />
          <Input
            id="retailAccountNumber"
            label={tr(editAccountViewDetailsI18n.retailAccountNumber)}
            register={register("retailAccountNumber")}
            disabled
            isFullWidth={true}
          />
          <Input
            id="iban"
            label={tr(editAccountViewDetailsI18n.iban)}
            register={register("iban")}
            disabled
            isFullWidth={true}
          />
          <Input
            id="accountName"
            label={tr(editAccountViewDetailsI18n.accountName)}
            register={register("accountName")}
            disabled
            isFullWidth={true}
          />
        </Stack>
      </Stack>
      <Stack>
        <RowHeader
          pb="4"
          label={
            <Text
              text={tr(editAccountViewDetailsI18n.accountSegmentSectionTitle)}
              weight="bold"
              size="16"
            />
          }
        />
        <Stack d="h" customStyle={styles.gridContainer}>
          <Input
            id="currency"
            label={tr(editAccountViewDetailsI18n.currency)}
            register={register("currency")}
            disabled
            isFullWidth={true}
          />
          <Input
            id="accountStatementFrequency"
            label={tr(editAccountViewDetailsI18n.accountStatementFrequency)}
            register={register("accountStatementFrequency")}
            disabled
            isFullWidth={true}
          />
          <Input
            id="accountName"
            label={tr(editAccountViewDetailsI18n.accountProduct)}
            register={register("accountName")}
            disabled
            isFullWidth={true}
          />
          <Stack
            customStyle={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: "5rem",
            }}
          >
            <Checkbox
              name={"isActive"}
              text={tr(editAccountViewDetailsI18n.isActive)}
              control={control}
              disabled
            />
            <Checkbox
              name={"abcFlag"}
              text={tr(editAccountViewDetailsI18n.abcFlag)}
              control={control}
              disabled
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack>
        <RowHeader
          pb="4"
          label={
            <Text
              text={tr(editAccountViewDetailsI18n.commisionSectionTitle)}
              weight="bold"
              size="16"
            />
          }
        />
        <Stack d="h" customStyle={styles.gridContainer}>
          <Input
            id="maintainance"
            type="number"
            label={tr(editAccountViewDetailsI18n.maintainance)}
            register={register("accountCommissions.maintainance")}
            isFullWidth={true}
            errorMessage={errors.accountCommissions?.maintainance?.message}
          />
          <Input
            id="minimumBalance"
            type="number"
            label={tr(editAccountViewDetailsI18n.minimumBalance)}
            register={register("accountCommissions.minimumBalance")}
            isFullWidth={true}
            errorMessage={errors.accountCommissions?.minimumBalance?.message}
          />
          <Input
            id="closeCommission"
            type="number"
            label={tr(editAccountViewDetailsI18n.closeCommission)}
            register={register("accountCommissions.closeCommission")}
            isFullWidth={true}
            errorMessage={errors.accountCommissions?.closeCommission?.message}
          />
          <Input
            id="accountToPostInterest"
            label={tr(editAccountViewDetailsI18n.accountToPostInterest)}
            register={register("accountCommissions.accountToPostInterest")}
            errorMessage={
              errors.accountCommissions?.accountToPostInterest?.message
            }
            isFullWidth={true}
          />
        </Stack>
      </Stack>
      <Stack>
        {isAccountClosing && (
          <>
            <RowHeader
              pb="4"
              label={
                <Text
                  text={tr(editAccountViewDetailsI18n.closeAccount)}
                  weight="bold"
                  size="16"
                />
              }
            />
            <Stack d="h" customStyle={styles.inputContainer}>
              <Select
                id="reasonId"
                label={tr(editAccountViewDetailsI18n.reasonId)}
                name={"accountClosureReasons.reasonId"}
                control={control}
                isRequired={isAccountClosing}
                data={accountClosingReasonQuery.data?.map((item) => ({
                  id: item.reasonId,
                  name: item.reasonName,
                }))}
                errorMessage={errors.accountClosureReasons?.reasonId?.message}
              />
              <Textarea
                id="closingReasonDetail"
                label={tr(editAccountViewDetailsI18n.closingReasonDetails)}
                name="closingReasonDetail"
                control={control}
              />
            </Stack>
          </>
        )}
      </Stack>
      <Stack d="h" customStyle={{ marginTop: 20, justifyContent: "flex-end" }}>
        <Button
          text={tr(editAccountViewI18n.cancelButton)}
          colorScheme="red"
          variant="outline"
          onClick={() => {
            navigate(
              `/customers/${customerNumber}/account-details/${numericAccountId}`,
              {
                state: { customer, authorizedPersons },
              }
            );
          }}
        />
        <Button
          text={tr(editAccountViewI18n.saveButton)}
          colorScheme="yellow"
          onClick={() => {
            void handleGoToNextStep();
          }}
        />
      </Stack>
    </Stack>
  );
};

import { TrFunction, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Stack, Table, Text } from "@rbal-modern-luka/ui-library";
import { useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { compareChanges } from "~/common/utils";
import { ReviewRow } from "~/components/ReviewValueDifference/Components/ReviewRow";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { EditAccountFormContext } from "../context/EditAccountFormContext";
import { editAccountViewI18n } from "../EditAccountView.i18n";
import { editAccountViewDetailsI18n } from "../EditAccountViewDetails/EditAccountViewDetails.i18n";

const getLabel = (fieldKey: string) => {
  let cleanedKey = fieldKey;
  if (fieldKey.includes(".")) {
    cleanedKey = fieldKey.split(".").pop() as string;
  }
  const label =
    editAccountViewDetailsI18n[
      cleanedKey as keyof typeof editAccountViewDetailsI18n
    ];

  return label ?? "";
};

export const EditAccountReview = () => {
  const { customerNumber = "", accountId = "" } = useParams();
  const numericAccountId = parseInt(accountId);
  const navigate = useNavigate();

  const { tr } = useI18n();
  const editAccountFormContext = useContext(EditAccountFormContext);
  const { getValues } = editAccountFormContext.form;
  const isAccountClosing = editAccountFormContext.isAccountClosing;

  const accountReviewTableConfig = {
    cols: ["150px", "150px", "150px"],
    headers: (tr: TrFunction) => [
      tr(editAccountViewI18n.attribute),
      tr(editAccountViewI18n.oldData),
      tr(editAccountViewI18n.newData),
    ],
  };

  const changedDataTableHeaders = accountReviewTableConfig.headers(tr);

  const currentAccountFormValues = useMemo(
    () => editAccountFormContext.form.watch().accountCommissions,
    [editAccountFormContext]
  );

  const initialAccountFormValues = useMemo(
    () => editAccountFormContext.initialCustomerFormValues.accountCommissions,
    [editAccountFormContext]
  );

  const currentClosingReason = getValues("accountClosureReasons.reasonName");
  const initialClosingReason =
    editAccountFormContext.initialCustomerFormValues.accountClosureReasons
      .reasonName;
  const currentClosingReasonDetail = getValues("closingReasonDetail");
  const initialClosingReasonDetail =
    editAccountFormContext.initialCustomerFormValues.closingReasonDetail;

  const changedFields = useMemo(() => {
    return compareChanges(initialAccountFormValues, currentAccountFormValues);
  }, [initialAccountFormValues, currentAccountFormValues]);

  return (
    <Stack gap="40">
      <Stack gap="4">
        <RowHeader
          withBorder={false}
          label={
            <Text
              text={tr(editAccountViewI18n.changedDataTableHeader)}
              weight="bold"
              size="16"
            />
          }
        />
        <Table
          cols={accountReviewTableConfig.cols}
          headers={changedDataTableHeaders}
        >
          {changedFields.map((change) => (
            <ReviewRow
              key={`${change.key}`}
              oldValue={String(change.oldValue)}
              newValue={change.newValue}
              label={tr(
                getLabel(change.key as keyof typeof editAccountViewDetailsI18n)
              )}
            />
          ))}
          {isAccountClosing && (
            <>
              <ReviewRow
                key={`reasonName`}
                oldValue={initialClosingReason}
                newValue={currentClosingReason}
                label={tr(editAccountViewDetailsI18n.reasonId)}
              />
              {currentClosingReasonDetail && (
                <ReviewRow
                  key={`closingReasonDetail`}
                  oldValue={initialClosingReasonDetail}
                  newValue={currentClosingReasonDetail}
                  label={tr(editAccountViewDetailsI18n.closingReasonDetails)}
                />
              )}
            </>
          )}
        </Table>
      </Stack>
      <Stack d="h" customStyle={{ marginTop: 20, justifyContent: "flex-end" }}>
        <Button
          text={tr(editAccountViewI18n.cancelButton)}
          colorScheme="red"
          variant="outline"
          onClick={() => {
            navigate(
              `/customers/${customerNumber}/account-details/${numericAccountId}`
            );
          }}
        />
        <Button
          text={tr(editAccountViewI18n.saveButton)}
          colorScheme="yellow"
          onClick={editAccountFormContext.form.handleSubmit(
            editAccountFormContext.submitHandler
          )}
        />
      </Stack>
    </Stack>
  );
};

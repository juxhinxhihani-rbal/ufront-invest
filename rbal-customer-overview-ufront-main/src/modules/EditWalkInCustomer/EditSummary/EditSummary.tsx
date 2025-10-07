import { css } from "@emotion/react";
import { TrFunction, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Stack,
  StepperContext,
  Table,
  Text,
} from "@rbal-modern-luka/ui-library";
import { useContext, useMemo } from "react";
import { compareChanges, groupByTabName } from "~/common/utils";
import { ReviewValueDifference } from "~/components/ReviewValueDifference/ReviewValueDifference";
import { getLabel } from "~/components/ReviewValueDifference/utils";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { editCustomerValuesI18n } from "~/modules/EditCustomer/Translations/EditCustomerValues.i18n";
import { EditWalkInCustomerSteps } from "../types";
import { editSummaryI18n } from "./EditSummary.i18n";

const styles = {
  backButton: css({
    textDecoration: "none",
  }),
  confirmButton: css({
    width: "fit-content",
    textDecoration: "none",
  }),
  center: css({
    justifyContent: "center",
    alignItems: "center",
  }),
  buttonsWrapper: css({
    justifyContent: "space-between",
  }),
};

interface EditSummaryProps {
  stepIdx: number;
}

export const EditSummary = ({ stepIdx }: EditSummaryProps) => {
  const { tr } = useI18n();

  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);
  const customerReviewTableConfig = {
    cols: ["150px", "150px", "150px"],
    headers: (tr: TrFunction) => [
      tr(editSummaryI18n.headers.attribute),
      tr(editSummaryI18n.headers.olddata),
      tr(editSummaryI18n.headers.newdata),
    ],
  };

  const currentFormValues = useMemo(
    () => walkInCustomerFormContext.form.watch(),
    [walkInCustomerFormContext]
  );

  const initialCustomerFormValues = useMemo(
    () => walkInCustomerFormContext.initialWalkInCustomerFormValues,
    [walkInCustomerFormContext]
  );

  const tableHeaders = customerReviewTableConfig.headers(tr);

  const tableRows = useMemo(
    () => compareChanges(initialCustomerFormValues, currentFormValues),
    [currentFormValues, initialCustomerFormValues]
  );

  const groupedData = useMemo(() => groupByTabName(tableRows), [tableRows]);

  const { setActiveStep } = useContext(StepperContext);

  const goBack = () => {
    setActiveStep(EditWalkInCustomerSteps.EditData);
  };

  return (
    <Stack gap="40">
      <Stack gap="4">
        <Text
          size="24"
          weight="bold"
          text={tr(editSummaryI18n.summary, stepIdx + 1)}
        />
        <Text size="14" text={tr(editSummaryI18n.subtitle)} />
      </Stack>

      <Stack gap="24">
        {groupedData.map((row) => {
          return (
            <Stack gap="4" key={row.key}>
              <RowHeader
                label={
                  <Text
                    size="16"
                    weight="bold"
                    text={tr(
                      getLabel(row.key as keyof typeof editCustomerValuesI18n)
                    )}
                  />
                }
              />
              <Table
                cols={customerReviewTableConfig.cols}
                withGrayHeaderBorder
                headers={tableHeaders}
              >
                {row.data.map((row) => (
                  <ReviewValueDifference key={row.key} row={row} />
                ))}
              </Table>
            </Stack>
          );
        })}
      </Stack>

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(editSummaryI18n.back)}
          colorScheme="red"
          variant="outline"
          onClick={goBack}
          css={styles.backButton}
        />

        <Button
          variant="solid"
          colorScheme="yellow"
          text={tr(editSummaryI18n.done)}
          onClick={walkInCustomerFormContext.form.handleSubmit(
            walkInCustomerFormContext.submitHandler
          )}
          css={styles.confirmButton}
        />
      </Stack>
    </Stack>
  );
};

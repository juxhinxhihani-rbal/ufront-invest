import { useContext, useMemo } from "react";
import { TrFunction, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { css, Theme } from "@emotion/react";
import {
  Button,
  Stack,
  StepperContext,
  Table,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { editSummaryI18n } from "./EditSummary.i18n";
import { EditUserSteps } from "../types";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { compareChanges, groupByTabName } from "~/common/utils";
import { ReviewValueDifference } from "~/components/ReviewValueDifference/ReviewValueDifference";
import { TaxInformationTable } from "~/modules/CustomerOverview/CRS/components/TaxInformation/TaxInformationTable";
import { getLabel } from "~/components/ReviewValueDifference/utils";
import { editCustomerValuesI18n } from "../Translations/EditCustomerValues.i18n";

const styles = {
  backButton: css({
    textDecoration: "none",
  }),
  confirmButton: css({
    width: "fit-content",
    textDecoration: "none",
  }),
  documentRow: (t: Theme) =>
    css({
      justifyContent: "space-between",
      padding: `${tokens.scale(t, "10")} 0`,
      height: tokens.scale(t, "56"),
      boxSizing: "border-box",
      borderBottom: `1px solid ${tokens.color(t, "gray150")}}`,
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

  const customerFormContext = useContext(CustomerFormContext);
  const customerReviewTableConfig = {
    cols: ["150px", "150px", "150px"],
    headers: (tr: TrFunction) => [
      tr(editSummaryI18n.headers.attribute),
      tr(editSummaryI18n.headers.olddata),
      tr(editSummaryI18n.headers.newdata),
    ],
  };

  const currentFormValues = useMemo(
    () => customerFormContext.form.watch(),
    [customerFormContext]
  );

  const initialCustomerFormValues = useMemo(
    () => customerFormContext.initialCustomerFormValues,
    [customerFormContext]
  );

  const tableHeaders = customerReviewTableConfig.headers(tr);

  const tableRows = useMemo(
    () => compareChanges(initialCustomerFormValues, currentFormValues),
    [currentFormValues, initialCustomerFormValues]
  );

  const groupedData = useMemo(() => groupByTabName(tableRows), [tableRows]);

  const { setActiveStep } = useContext(StepperContext);

  const goBack = () => {
    setActiveStep(EditUserSteps.EditData);
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
          switch (true) {
            case row.key.includes("crs.crsTaxInformation"):
              return (
                <Stack gap="4">
                  <RowHeader
                    label={
                      <Text
                        size="16"
                        weight="bold"
                        text={tr(editCustomerValuesI18n.crsTaxInformation)}
                      />
                    }
                  />
                  <TaxInformationTable
                    taxInformations={currentFormValues.crs.crsTaxInformation}
                  />
                </Stack>
              );
            default:
              return (
                <Stack gap="4">
                  <RowHeader
                    label={
                      <Text
                        size="16"
                        weight="bold"
                        text={tr(
                          getLabel(
                            row.key as keyof typeof editCustomerValuesI18n
                          )
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
          }
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
          onClick={customerFormContext.form.handleSubmit(
            customerFormContext.submitHandler
          )}
          css={styles.confirmButton}
        />
      </Stack>
    </Stack>
  );
};

import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack } from "@rbal-modern-luka/ui-library";
import { useContext } from "react";
import { CollapsibleSegment } from "~/components/CollapsibleSegment/CollapsibleSegment";
import {
  useDiligenceEmployTypes,
  useSourceFundsTypes,
  useDiligenceBandTypes,
  useTransactionCurrencyTypes,
  useFrequencyTypes,
  useFetchPurposeOfBankRelationTypes,
} from "~/features/dictionaries/dictionariesQueries";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import { editDueDiligenceI18n } from "./EditDueDiligence.i18n";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { HasCashTransaction } from "./components/HasCashTransaction/HasCashTransaction";
import { ClientHasManagerialPosition } from "./components/ClientHasManagerialPosition/ClientHasManagerialPosition";
import { styles } from "./EditDueDiligence.styles";
import { MultiSelect } from "~/components/MultiSelect/MultiSelect";
import { Textarea } from "~/components/Textarea/Textarea";
import { CustomerDto } from "~/api/customer/customerApi.types";

export const EditDueDiligence = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const {
    control,
    formState: { errors },
    watch,
    register,
  } = customerFormContext.form;

  const hasCashTransaction = watch(
    "dueDiligence.cashTransactions.hasCashTransaction"
  );

  const isCustomerSegmentSelected = watch(
    "customerInformation.customerSegmentId"
  );

  const diligenceEmployTypesQuery = useDiligenceEmployTypes();
  const sourceFundsTypesQuery = useSourceFundsTypes();
  const diligenceBandTypes = useDiligenceBandTypes();
  const transactionCurrencyTypes = useTransactionCurrencyTypes();
  const frequencyTypes = useFrequencyTypes();
  const purposeOfBankRelationTypesQuery = useFetchPurposeOfBankRelationTypes();

  return (
    <Stack gap="8">
      <CollapsibleSegment<CustomerDto>
        title={tr(editDueDiligenceI18n.employmentSection)}
        isOpenByDefaul={true}
        formKey="dueDiligence.employment"
        errors={customerFormContext.form.formState?.errors}
      >
        <Stack d="v" gap="4" customStyle={styles.fill}>
          <Select
            id="employmentTypeId"
            label={tr(editDueDiligenceI18n.employmentTypeId)}
            name={"dueDiligence.employment.employmentTypeId"}
            control={control}
            errorMessage={
              errors.dueDiligence?.employment?.employmentTypeId?.message
            }
            data={diligenceEmployTypesQuery.data}
            isRequired
            shouldGrow
            disabled={!isCustomerSegmentSelected}
          />
          <ClientHasManagerialPosition name="dueDiligence.employment.clientHasManagerialPosition" />
        </Stack>
      </CollapsibleSegment>

      <CollapsibleSegment<CustomerDto>
        title={tr(editDueDiligenceI18n.reasonOfUseSection)}
        isOpenByDefaul={true}
        formKey="dueDiligence.reasonOfUse"
        errors={customerFormContext.form.formState?.errors}
      >
        <Textarea
          label={tr(editDueDiligenceI18n.volumeOfUse)}
          id="volumeOfUse"
          placeholder={tr(editDueDiligenceI18n.volumeOfUsePlaceholder)}
          name="dueDiligence.reasonOfUse.volumeOfUse"
          errorMessage={errors.dueDiligence?.reasonOfUse?.volumeOfUse?.message}
          control={control}
          isRequired
          isDisabled={!isCustomerSegmentSelected}
        />
      </CollapsibleSegment>

      <CollapsibleSegment<CustomerDto>
        title={tr(editDueDiligenceI18n.sourceOfIncomeSection)}
        isOpenByDefaul={true}
        formKey="dueDiligence.sourceOfIncome"
        errors={customerFormContext.form.formState?.errors}
      >
        <MultiSelect
          id="sourceFundTypeIds"
          name="dueDiligence.sourceOfIncome.sourceFundTypeIds"
          control={control}
          label={tr(editDueDiligenceI18n.sourceFundTypeIds)}
          options={sourceFundsTypesQuery.data}
          errorMessage={
            errors.dueDiligence?.sourceOfIncome?.sourceFundTypeIds?.message
          }
          shouldGrow
          isRequired
          isDisabled={!isCustomerSegmentSelected}
        />
      </CollapsibleSegment>

      <CollapsibleSegment<CustomerDto>
        title={tr(editDueDiligenceI18n.bankingProductsSection)}
        isOpenByDefaul={true}
        formKey="dueDiligence.bankingProducts"
        errors={customerFormContext.form.formState?.errors}
      >
        <MultiSelect
          id="purposeOfBankRelationTypeIds"
          name="dueDiligence.bankingProducts.purposeOfBankRelationTypeIds"
          control={control}
          label={tr(editDueDiligenceI18n.purposeOfBankRelationTypeIds)}
          options={purposeOfBankRelationTypesQuery.data}
          errorMessage={
            errors.dueDiligence?.bankingProducts?.purposeOfBankRelationTypeIds
              ?.message
          }
          shouldGrow
          isRequired
          isDisabled={!isCustomerSegmentSelected}
        />
      </CollapsibleSegment>

      <CollapsibleSegment<CustomerDto>
        title={tr(editDueDiligenceI18n.cashTransactionsSection)}
        isOpenByDefaul={true}
        formKey="dueDiligence.cashTransactions"
        errors={customerFormContext.form.formState?.errors}
      >
        <Stack customStyle={styles.fill} d="v">
          <HasCashTransaction name="dueDiligence.cashTransactions.hasCashTransaction" />
          <Stack d="h">
            <Select
              id="transactionFrequencyId"
              label={tr(editDueDiligenceI18n.transactionFrequencyId)}
              name={"dueDiligence.cashTransactions.transactionFrequencyId"}
              control={control}
              errorMessage={
                errors.dueDiligence?.cashTransactions?.transactionFrequencyId
                  ?.message
              }
              data={frequencyTypes.data}
              shouldGrow
              disabled={!hasCashTransaction}
            />

            <Input
              id="averageTransactionAmount"
              label={tr(editDueDiligenceI18n.averageTransactionAmount)}
              register={register(
                "dueDiligence.cashTransactions.averageTransactionAmount"
              )}
              errorMessage={
                errors.dueDiligence?.cashTransactions?.averageTransactionAmount
                  ?.message
              }
              shouldGrow
              disabled={!hasCashTransaction}
            />
          </Stack>
          <Stack d="h">
            <Select
              id="bandId"
              label={tr(editDueDiligenceI18n.bandId)}
              name={"dueDiligence.cashTransactions.bandId"}
              control={control}
              errorMessage={
                errors.dueDiligence?.cashTransactions?.bandId?.message
              }
              data={diligenceBandTypes.data}
              shouldGrow
              disabled={!hasCashTransaction}
            />

            <MultiSelect
              id="currencyIds"
              name="dueDiligence.cashTransactions.currencyIds"
              control={control}
              label={tr(editDueDiligenceI18n.currencyIds)}
              options={transactionCurrencyTypes.data}
              shouldGrow
              isDisabled={!hasCashTransaction}
            />
          </Stack>
        </Stack>
      </CollapsibleSegment>
    </Stack>
  );
};

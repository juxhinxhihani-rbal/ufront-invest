import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Loader, Stack, Text } from "@rbal-modern-luka/ui-library";
import { Link, useParams } from "react-router-dom";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import { roundupCardsConfigDataI18n } from "./RoundupCardsConfigData.i18n";
import { styles } from "./RoundupCardsConfigData.styles";
import { useRoundsupCardsConfig } from "./useRoundupCardsConfig";

export const RoundupCardsConfigureData = () => {
  const { tr } = useI18n();
  const { customerId } = useParams();
  const {
    control,
    errors,
    financialRuleBands,
    isFetching,
    register,
    handleSubmit,
    onContinue,
  } = useRoundsupCardsConfig();

  return (
    <Stack>
      <Stack gap="4" customStyle={styles.header}>
        <Text
          text={tr(roundupCardsConfigDataI18n.title)}
          size="24"
          lineHeight="32"
          weight="bold"
        />

        <Text
          text={tr(roundupCardsConfigDataI18n.subtitle)}
          fgColor="gray550"
        />
      </Stack>

      <Stack gap="14" customStyle={styles.contentWrapper}>
        {isFetching ? (
          <Loader withContainer={false} linesNo={3} />
        ) : (
          <Stack>
            <Stack d="h" gap="14">
              <Stack customStyle={styles.selectContainer}>
                <Select
                  id="roundupBand"
                  label={tr(roundupCardsConfigDataI18n.roundupBandLabel)}
                  name="cardsRoundUp.bandId"
                  control={control}
                  data={financialRuleBands}
                  errorMessage={errors?.cardsRoundUp?.bandId?.message}
                  isRequired
                />
              </Stack>

              <Input
                id="roundupFrequency"
                label={tr(roundupCardsConfigDataI18n.roundupFrequencyLabel)}
                value={tr(roundupCardsConfigDataI18n.perTransactionLabel)}
                disabled
                isRequired
              />
            </Stack>

            <Input
              id="roundupCurrency"
              label={tr(roundupCardsConfigDataI18n.roundupCurrencyLabel)}
              register={register("cardsRoundUp.currency")}
              errorMessage={errors?.cardsRoundUp?.currency?.message}
              disabled
              isRequired
            />
          </Stack>
        )}
      </Stack>

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(roundupCardsConfigDataI18n.cancelButtonLabel)}
          as={Link}
          to={`/customers/${customerId}/financial-automation`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
        />

        <Button
          text={tr(roundupCardsConfigDataI18n.continueButtonLabel)}
          colorScheme="yellow"
          css={styles.button}
          onClick={handleSubmit(onContinue)}
        />
      </Stack>
    </Stack>
  );
};

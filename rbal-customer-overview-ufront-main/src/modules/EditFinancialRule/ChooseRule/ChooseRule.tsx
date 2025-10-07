import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Loader,
  Stack,
  StepperContext,
  Text,
} from "@rbal-modern-luka/ui-library";
import { useContext } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { Banner } from "~/components/Banner/Banner";
import { SelectableCard } from "~/components/SelectableCard/SelectableCard";
import { useFinancialRulesQuery } from "~/features/roundUpAccount/roundUpAccountQueries";
import { FinancialRuleContext } from "../context/FinancialRuleContext";
import { EditFinancialRulesForm } from "../EditFinancialRuleSwitch/types";
import { chooseRuleI18n } from "./ChooseRule.i18n";
import { styles } from "./ChooseRule.styles";

export const ChooseRule = () => {
  const { tr } = useI18n();
  const { customerId } = useParams();
  const { gotoNextStep } = useContext(StepperContext);
  const { setSelectedRuleId } = useContext(FinancialRuleContext);
  const { data: rules, isLoading } = useFinancialRulesQuery();
  const { control, setValue } = useFormContext<EditFinancialRulesForm>();

  const ruleId = useWatch({ control, name: "ruleId" });
  return (
    <Stack>
      <Stack gap="4" customStyle={styles.header}>
        <Text
          text={tr(chooseRuleI18n.title)}
          size="24"
          lineHeight="32"
          weight="bold"
        />

        <Text text={tr(chooseRuleI18n.subtitle)} fgColor="gray550" />
      </Stack>

      <Banner
        title={tr(chooseRuleI18n.bannerTitle)}
        description={tr(chooseRuleI18n.bannerSubTitle)}
      />

      <Stack gap="14" customStyle={styles.contentWrapper}>
        {isLoading ? (
          <Loader withContainer={false} linesNo={3} />
        ) : (
          rules?.map((rule) => (
            <SelectableCard
              key={rule.id}
              title={rule.name}
              isActive={rule.id === ruleId}
              onClick={() => {
                setValue("ruleId", rule.id);
                setSelectedRuleId(rule.id);
              }}
            />
          ))
        )}
      </Stack>

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(chooseRuleI18n.cancelButtonLabel)}
          as={Link}
          to={`/customers/${customerId}/financial-automation`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
        />

        <Button
          text={tr(chooseRuleI18n.continueButtonLabel)}
          colorScheme="yellow"
          css={styles.button}
          disabled={!ruleId || isLoading}
          onClick={gotoNextStep}
        />
      </Stack>
    </Stack>
  );
};

import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Card,
  Container,
  Stack,
  Step,
  Stepper,
  StepperContext,
  useStepper,
} from "@rbal-modern-luka/ui-library";
import { editFinancialRuleI18n } from "./EditFinancialRule.i18n";
import { styles } from "./EditFinancialRule.styles";
import { EditFinancialRuleSwitch } from "./EditFinancialRuleSwitch/EditFinancialRuleSwitch";
import { EditFinancialRuleSteps } from "./types";

export const EditFinancialRuleView = () => {
  const { tr } = useI18n();
  const steps = useStepper({
    stepsCount: 5,
    preventGoBack: true,
  });

  return (
    <Container as="main">
      <Card>
        <Stack d="h" customStyle={styles.container}>
          <Stack gap="32" customStyle={styles.navigationContainer}>
            <Stepper config={steps}>
              <Step
                icon="filter"
                stepIdx={EditFinancialRuleSteps.ChooseRule}
                text={tr(editFinancialRuleI18n.chooseRule)}
              />
              <Step
                icon="edit"
                stepIdx={EditFinancialRuleSteps.SelectAccount}
                text={tr(editFinancialRuleI18n.selectAccount)}
              />

              <Step
                icon="settings"
                stepIdx={EditFinancialRuleSteps.Configure}
                text={tr(editFinancialRuleI18n.configure)}
              />
              <Step
                icon="drag"
                stepIdx={EditFinancialRuleSteps.Review}
                text={tr(editFinancialRuleI18n.review)}
              />
              <Step
                icon="doc-attachment"
                stepIdx={EditFinancialRuleSteps.Summary}
                text={tr(editFinancialRuleI18n.documents)}
              />
            </Stepper>
          </Stack>

          <Stack customStyle={styles.contentContainer}>
            <StepperContext.Provider value={steps}>
              <EditFinancialRuleSwitch />
            </StepperContext.Provider>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};

import {
  Card,
  Container,
  Stack,
  Step,
  Stepper,
  StepperContext,
  useStepper,
} from "@rbal-modern-luka/ui-library";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { RemoveAuthorizedPersonSteps } from "./types";
import { removeAuthorizedPersonPageI18n } from "./RemoveAuthorizedPersonView.i18n";
import { RemoveAuthorizedPersonSwitch } from "./RemoveAuthorizedPersonSwitch/RemoveAuthorizedPersonSwitch";
import { styles } from "./RemoveAuthorizedPersonView.styles";

export const RemoveAuthorizedPersonView: React.FC = () => {
  const { tr } = useI18n();

  const steps = useStepper({
    initialStepIdx: RemoveAuthorizedPersonSteps.RemovePerson,
    stepsCount: 2,
    preventGoBack: true,
  });

  return (
    <Container as="main">
      <Card>
        <Stack d="h" customStyle={styles.container}>
          <Stack gap="32" customStyle={styles.navigationContainer}>
            <Stepper config={steps}>
              <Step
                icon="edit"
                stepIdx={RemoveAuthorizedPersonSteps.RemovePerson}
                text={tr(removeAuthorizedPersonPageI18n.removePerson)}
              />
              <Step
                icon="drag"
                stepIdx={RemoveAuthorizedPersonSteps.Attachments}
                text={tr(removeAuthorizedPersonPageI18n.attachments)}
              />
            </Stepper>
          </Stack>

          <Stack customStyle={styles.contentContainer}>
            <StepperContext.Provider value={steps}>
              <RemoveAuthorizedPersonSwitch />
            </StepperContext.Provider>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};

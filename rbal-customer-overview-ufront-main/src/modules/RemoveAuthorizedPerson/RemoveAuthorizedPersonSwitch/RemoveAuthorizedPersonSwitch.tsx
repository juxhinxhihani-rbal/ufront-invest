import { useContext } from "react";
import { Stack, StepperContext } from "@rbal-modern-luka/ui-library";
import { styles } from "./RemoveAuthorizedPersonSwitch.styles";
import { RemoveAuthorizedPersonSteps } from "../types";
import { EditAttachments } from "~/components/EditAttachments/EditAttachments";
import { CustomerAttachmentsContext } from "~/context/AttachmentsContext";
import { useNavigate, useParams } from "react-router";
import { ReviewRemovedAuthorizedPerson } from "../ReviewRemovedAuthorizedPerson/ReviewRemovedAuthorizedPerson";
import { useCustomerAuthorizedPersonsQuery } from "~/features/customer/customerQueries";
import { editAttachmentsI18n } from "~/components/EditAttachments/EditAttachments.i18n";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { CustomerAuthorizedPersonsResponse } from "~/api/customer/customerApi.types";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";
import { DocumentTypes } from "~/features/hooks/useCustomerAttachments/useCustomerAttachments";

const isPrintAction = true;
export const RemoveAuthorizedPersonSwitch = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { customerId = "", authorizedPersonId } = useParams();
  const { activeStepIdx } = useContext(StepperContext);
  const { handleDocumentAction } = useDocumentHandler({
    customerId,
    authorizedPersonId,
  });

  const authorizedPersonsQuery = useCustomerAuthorizedPersonsQuery(
    Number(customerId)
  );
  const authorizedPersonsList = authorizedPersonsQuery.query.data;

  const onDocumentAction = (setLoading: (isLoading: boolean) => void) => {
    handleDocumentAction(
      DocumentTypes.RevokeAccountRights,
      isPrintAction,
      setLoading
    );
  };

  return (
    <Stack gap="24" customStyle={styles.container}>
      {(() => {
        switch (activeStepIdx) {
          case RemoveAuthorizedPersonSteps.RemovePerson:
            return (
              <ReviewRemovedAuthorizedPerson
                customerId={customerId}
                selectedAuthorizedPerson={
                  authorizedPersonsList?.find(
                    (customer) =>
                      customer.idParty.toString() === authorizedPersonId
                  ) ?? ({} as CustomerAuthorizedPersonsResponse)
                }
                stepIdx={activeStepIdx + 1}
              />
            );
          case RemoveAuthorizedPersonSteps.Attachments:
            return (
              <EditAttachments
                customerId={customerId}
                customerContext={CustomerAttachmentsContext}
                stepIdx={activeStepIdx + 1}
                handleDocumentAction={onDocumentAction}
                fileName={tr(editAttachmentsI18n.authorizationForm)}
                onSubmit={() => navigate(`/customers/${customerId}`)}
              />
            );
          default:
            return null;
        }
      })()}
    </Stack>
  );
};

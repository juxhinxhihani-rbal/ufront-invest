import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Container,
  Stack,
  Card,
  Text,
  Button,
  useToggle,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { useNavigate, useParams } from "react-router";
import { specimenAuthorizationDetailsI18n } from "./SpecimenAuthorizationDetails.i18n";
import { specimenAuthorizationDetailsStyles } from "./SpecimenAuthorizationDetails.styles";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import { css } from "@emotion/react";
import { useCustomerSpecimenDetails } from "~/features/customer/customerQueries";
import { useAuthorizeOrRejectSpecimenSignature } from "~/api/authorization/authorizationMutations";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { showError, showSuccess } from "~/components/Toast/ToastContainer";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { customerAuthorizationDetailsI18n } from "../Customer/CustomerAuthorizationDetails.i18n";
import { useStatusesQuery } from "~/features/dictionaries/dictionariesQueries";
import { useMemo } from "react";
import { AuthorizationStatusType } from "~/api/authorization/authorizationApi.types";

export const SpecimenAuthorizationDetails = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { customerId = "" } = useParams();
  const rejectModal = useToggle(false);
  const authorizeModal = useToggle(false);
  const { query: specimenSignatureQuery } =
    useCustomerSpecimenDetails(customerId);
  const specimenDetails = specimenSignatureQuery.data;
  const baseImgUrl = specimenDetails?.encodedSpecimen;
  const { mutate: authorizeSpecimen, isLoading: isAuthorizedOrRejected } =
    useAuthorizeOrRejectSpecimenSignature();

  const statusQuery = useStatusesQuery();

  const authorizableCustomerStatuses = useMemo(() => {
    return (
      statusQuery.data?.filter(
        (status) =>
          status.statusType === AuthorizationStatusType.Signature &&
          status.isAuthorizable
      ) ?? []
    );
  }, [statusQuery.data]);

  const isSpecimenAuthorizable = authorizableCustomerStatuses.some(
    (status) => status.status === specimenDetails?.status
  );

  if (specimenSignatureQuery.isLoading) {
    return (
      <div
        css={css({
          margin: "10% 25%",
        })}
      >
        <Loader withContainer={false} />
      </div>
    );
  }

  return (
    <>
      {isAuthorizedOrRejected && (
        <OverlayLoader
          label={tr(customerAuthorizationDetailsI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <Container as="main">
        <Stack>
          <BackCustomerView
            to={"/customers/authorization?tab=specimens"}
            customerNumber={specimenDetails?.customerNumber ?? ""}
            customerName={specimenDetails?.customerName ?? ""}
            status={specimenDetails?.status ?? ""}
            statusColor={specimenDetails?.color ?? ""}
          />
          <Card>
            <Text
              text={tr(specimenAuthorizationDetailsI18n.imageTitle)}
              weight="bold"
              customStyle={specimenAuthorizationDetailsStyles.details}
            />
            <div css={specimenAuthorizationDetailsStyles.imageWrapper}>
              <img
                src={`data:image/jpeg;base64,${baseImgUrl}`}
                alt="Signature"
                style={{ maxWidth: "100%", height: "auto" }}
              ></img>
            </div>

            <Stack
              d="h"
              customStyle={{ marginTop: 32, justifyContent: "flex-end" }}
            >
              <Button
                text={tr(specimenAuthorizationDetailsI18n.reject)}
                colorScheme="red"
                variant="outline"
                disabled={!isSpecimenAuthorizable}
                onClick={rejectModal.toggle}
              />
              <Button
                text={tr(specimenAuthorizationDetailsI18n.authorize)}
                colorScheme="yellow"
                disabled={!isSpecimenAuthorizable}
                onClick={authorizeModal.toggle}
              />
            </Stack>
          </Card>
        </Stack>
      </Container>
      <ConfirmModal
        isOpen={rejectModal.isOn}
        preventClose={true}
        title={tr(specimenAuthorizationDetailsI18n.rejectModalTitle)}
        description={tr(
          specimenAuthorizationDetailsI18n.rejectModalDescription
        )}
        onCancel={rejectModal.off}
        onConfirm={() => {
          rejectModal.off();
          authorizeSpecimen(
            { customerId: customerId, isApproved: false },
            {
              onSuccess: (isSuccessful) => {
                if (isSuccessful) {
                  showSuccess(
                    tr(specimenAuthorizationDetailsI18n.specimenRejectedSuccess)
                  );
                  navigate("/customers/authorization?tab=specimens");
                } else
                  showError(
                    tr(specimenAuthorizationDetailsI18n.specimenRejectedFailed)
                  );
              },
              onError: () => console.log("error"),
            }
          );
        }}
      />
      <ConfirmModal
        isOpen={authorizeModal.isOn}
        preventClose={true}
        title={tr(specimenAuthorizationDetailsI18n.authorizeModalTitle)}
        description={tr(
          specimenAuthorizationDetailsI18n.authorizeModalDescription
        )}
        onCancel={authorizeModal.off}
        onConfirm={() => {
          authorizeModal.off();
          authorizeSpecimen(
            { customerId: customerId, isApproved: true },
            {
              onSuccess: (isSuccessful) => {
                if (isSuccessful) {
                  showSuccess(
                    tr(
                      specimenAuthorizationDetailsI18n.specimenAuthorizedSuccess
                    )
                  );
                  navigate("/customers/authorization?tab=specimens");
                } else {
                  showError(
                    tr(
                      specimenAuthorizationDetailsI18n.specimenAuthorizedFailed
                    )
                  );
                }
              },
              onError: () => console.log("error"),
            }
          );
        }}
      />
    </>
  );
};

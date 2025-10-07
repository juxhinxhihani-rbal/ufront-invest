import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Card,
  Container,
  Stack,
  Loader,
  useToggle,
  Icon,
} from "@rbal-modern-luka/ui-library";
import { lowerFirst } from "lodash";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  useApproveCrsChanges,
  useRejectCrsChanges,
} from "~/api/authorization/authorizationMutations";
import { ErrorCode } from "~/api/enums/ErrorCode";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import { FullPageFeedback } from "~/components/FullPageFeedback/FullPageFeedback";
import { Textarea } from "~/components/Textarea/Textarea";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { useReadAuthorizationCrsQuery } from "~/features/authorization/authorizationQueries";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { customerOverviewPageI18n } from "~/modules/CustomerOverview/CustomerOverviewPage.i18n";
import { crsAuthorizationDetailsi18n } from "./CrsAuthorizationDetails.i18n";
import { CrsAuthorizationView } from "./CrsAuthorizationView";

export const CrsAuthorizationDetails = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();

  const rejectModal = useToggle(false);
  const authorizeModal = useToggle(false);

  const { customerId = "" } = useParams();

  const crsAuthorizationDetailsForm = useForm<{ description: string }>();
  const watchDescription = crsAuthorizationDetailsForm.watch("description");

  const crsQuery = useReadAuthorizationCrsQuery(customerId);

  const { mutate: approveChanges, isLoading: isApproving } =
    useApproveCrsChanges();

  const { mutate: rejectChanges, isLoading: isRejecting } =
    useRejectCrsChanges();

  const crs = crsQuery.data;

  const handleApproveCrs = () => {
    approveChanges(customerId, {
      onSuccess: (response) => {
        const messageCode = tr(
          crsAuthorizationDetailsi18n.approveResponseMessages[
            lowerFirst(
              response.approveMessage.toString()
            ) as keyof typeof crsAuthorizationDetailsi18n.approveResponseMessages
          ]
        );
        if (response.isAuthorized) {
          showSuccess(messageCode);
        } else {
          showWarning(messageCode);
        }
        navigate("/customers/authorization?tab=crs");
      },
      onError: () => {
        showError(tr(crsAuthorizationDetailsi18n.errorWhenApprovingCrs));
      },
    });
    return;
  };

  const handleRejectCrs = () => {
    if (!watchDescription) {
      return crsAuthorizationDetailsForm.setError("description", {
        type: "manual",
        message: tr(crsAuthorizationDetailsi18n.descriptionRequired),
      });
    }
    crsAuthorizationDetailsForm.clearErrors("description");
    rejectChanges(
      { customerId, description: watchDescription },
      {
        onSuccess: (response) => {
          const messageCode = tr(
            crsAuthorizationDetailsi18n.rejectResponseMessages[
              lowerFirst(
                response.message.toString()
              ) as keyof typeof crsAuthorizationDetailsi18n.rejectResponseMessages
            ]
          );
          if (response.isRejected) {
            showSuccess(messageCode);
          } else {
            showWarning(messageCode);
          }
          navigate("/customers/authorization?tab=crs");
        },
        onError: () => {
          showError(tr(crsAuthorizationDetailsi18n.errorWhenRejectingCrs));
        },
      }
    );
    return;
  };

  if (crsQuery.isLoading) {
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

  if (!crsQuery.data || crsQuery.error?.code === ErrorCode.CustomerNotFound) {
    return (
      <FullPageFeedback
        title={tr(crsAuthorizationDetailsi18n.errorTitle)}
        text={tr(
          crsAuthorizationDetailsi18n.customerNotFound,
          customerId ?? "none"
        )}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={{ textDecoration: "none" }}
            as={Link}
            to={"/customers/authorization?tab=crs"}
            colorScheme="yellow"
            text={tr(
              customerOverviewPageI18n.error.unsupportedClientType.button
            )}
          />
        }
      />
    );
  }

  return (
    <>
      {(isRejecting || isApproving) && (
        <OverlayLoader
          label={tr(crsAuthorizationDetailsi18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <ConfirmModal
        isOpen={authorizeModal.isOn}
        preventClose={true}
        title={tr(crsAuthorizationDetailsi18n.authorizeModalTitle)}
        description={tr(crsAuthorizationDetailsi18n.authorizeModalDescription)}
        onCancel={authorizeModal.off}
        onConfirm={() => {
          authorizeModal.off();
          handleApproveCrs();
        }}
      />
      <ConfirmModal
        isOpen={rejectModal.isOn}
        preventClose={true}
        title={tr(crsAuthorizationDetailsi18n.rejectModalTitle)}
        description={tr(crsAuthorizationDetailsi18n.rejectModalDescription)}
        onCancel={rejectModal.off}
        onConfirm={() => {
          rejectModal.off();
          handleRejectCrs();
        }}
      />
      <Container as="main">
        <Stack>
          <BackCustomerView
            to={"/customers/authorization?tab=crs"}
            customerNumber={
              crs?.customerInformation.basicData.customerNumber ?? ""
            }
            customerName={
              crs?.customerInformation.personalData.firstName +
                " " +
                crs?.customerInformation.personalData.lastName ?? ""
            }
            status={crs?.customerStatus.status ?? ""}
            statusColor={crs?.customerStatus.color ?? ""}
          />
          <Card>
            <CrsAuthorizationView crs={crs} />
            <Stack customStyle={{ paddingBottom: "2rem" }}>
              <Textarea
                label={tr(crsAuthorizationDetailsi18n.description)}
                id="description"
                name="description"
                errorMessage={
                  crsAuthorizationDetailsForm.formState.errors.description
                    ?.message
                }
                control={crsAuthorizationDetailsForm.control}
                isRequired
              />
            </Stack>
            <Stack
              d="h"
              customStyle={{
                justifyContent: "flex-end",
                marginTop: 32,
              }}
            >
              <Button
                text={"Reject"}
                colorScheme="red"
                variant="outline"
                onClick={rejectModal.toggle}
              />
              <Button
                text={"Approve"}
                colorScheme="yellow"
                onClick={authorizeModal.toggle}
              />
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

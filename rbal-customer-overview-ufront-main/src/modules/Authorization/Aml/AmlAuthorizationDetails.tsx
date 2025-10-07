import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Card,
  Container,
  Stack,
  useToggle,
  Loader,
  Icon,
} from "@rbal-modern-luka/ui-library";
import { useNavigate, useParams } from "react-router";
import {
  useApproveAmlChanges,
  useRejectAmlChanges,
} from "~/api/authorization/authorizationMutations";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { amlAuthorizationDetailsi18n } from "./AmlAuthorization.i18n";
import { useReadAuthorizationAmlQuery } from "~/features/authorization/authorizationQueries";
import { Textarea } from "~/components/Textarea/Textarea";
import { useForm } from "react-hook-form";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { Input } from "~/components/Input/Input";
import { lowerFirst } from "lodash";
import { format } from "date-fns";
import { ErrorCode } from "~/api/enums/ErrorCode";
import { Link } from "react-router-dom";
import { FullPageFeedback } from "~/components/FullPageFeedback/FullPageFeedback";
import { customerOverviewPageI18n } from "~/modules/CustomerOverview/CustomerOverviewPage.i18n";
import { AmlAuthorizationView } from "./AmlAuthorizationView";

type AmlAuthorizationForm = {
  complianceComment: string;
  isApproveWithConditions: boolean;
  conditionDate: string;
};

export const AmlAuthorizationDetails = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();

  const rejectModal = useToggle(false);
  const authorizeModal = useToggle(false);

  const { customerId = "" } = useParams();

  const amlAuthorizationDetailsForm = useForm<AmlAuthorizationForm>();
  const { control, register } = amlAuthorizationDetailsForm;
  const watchComplianceComment =
    amlAuthorizationDetailsForm.watch("complianceComment");
  const watchIsApproveWithConditions = amlAuthorizationDetailsForm.watch(
    "isApproveWithConditions"
  );
  const watchConditionDate = amlAuthorizationDetailsForm.watch("conditionDate");

  const amlQuery = useReadAuthorizationAmlQuery(customerId);

  const { mutate: approveChanges, isLoading: isApproving } =
    useApproveAmlChanges();

  const { mutate: rejectChanges, isLoading: isRejecting } =
    useRejectAmlChanges();

  const handleApproveAml = () => {
    if (!watchComplianceComment) {
      amlAuthorizationDetailsForm.setError("complianceComment", {
        type: "manual",
        message: tr(amlAuthorizationDetailsi18n.complianceCommentRequired),
      });
      if (watchIsApproveWithConditions && !watchConditionDate) {
        amlAuthorizationDetailsForm.setError("conditionDate", {
          type: "manual",
          message: tr(amlAuthorizationDetailsi18n.conditionDateRequired),
        });
      }
      return;
    }
    if (watchIsApproveWithConditions && !watchConditionDate) {
      return amlAuthorizationDetailsForm.setError("conditionDate", {
        type: "manual",
        message: tr(amlAuthorizationDetailsi18n.conditionDateRequired),
      });
    }

    amlAuthorizationDetailsForm.clearErrors("complianceComment");
    amlAuthorizationDetailsForm.clearErrors("conditionDate");

    approveChanges(
      {
        customerId,
        description: watchComplianceComment,
        expireDate: watchConditionDate,
      },
      {
        onSuccess: (response) => {
          const messageCode = tr(
            amlAuthorizationDetailsi18n.approveResponseMesages[
              lowerFirst(
                response.message.toString()
              ) as keyof typeof amlAuthorizationDetailsi18n.approveResponseMesages
            ]
          );
          if (response.isApproved) {
            showSuccess(messageCode);
          } else {
            showWarning(messageCode);
          }
          navigate("/customers/authorization?tab=aml");
        },
        onError: () => {
          showError(tr(amlAuthorizationDetailsi18n.errorWhenApprovingAml));
        },
      }
    );
    return;
  };

  const handleRejectAml = () => {
    if (!watchComplianceComment) {
      return amlAuthorizationDetailsForm.setError("complianceComment", {
        type: "manual",
        message: tr(amlAuthorizationDetailsi18n.complianceCommentRequired),
      });
    }
    amlAuthorizationDetailsForm.clearErrors("complianceComment");
    rejectChanges(
      { customerId, description: watchComplianceComment },
      {
        onSuccess: (response) => {
          const messageCode = tr(
            amlAuthorizationDetailsi18n.rejectResponseMesages[
              lowerFirst(
                response.message.toString()
              ) as keyof typeof amlAuthorizationDetailsi18n.rejectResponseMesages
            ]
          );
          if (response.isRejected) {
            showSuccess(messageCode);
          } else {
            showWarning(messageCode);
          }
          navigate("/customers/authorization?tab=aml");
        },
        onError: () => {
          showError(tr(amlAuthorizationDetailsi18n.errorWhenRejectingAml));
        },
      }
    );
    return;
  };

  const aml = amlQuery.data;

  if (amlQuery.isLoading) {
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

  if (!amlQuery.data || amlQuery.error?.code === ErrorCode.CustomerNotFound) {
    return (
      <FullPageFeedback
        title={tr(amlAuthorizationDetailsi18n.errorTitle)}
        text={tr(
          amlAuthorizationDetailsi18n.customerNotFound,
          customerId ?? "none"
        )}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={{ textDecoration: "none" }}
            as={Link}
            to={"/customers/authorization?tab=aml"}
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
          label={tr(amlAuthorizationDetailsi18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <ConfirmModal
        isOpen={authorizeModal.isOn}
        preventClose={true}
        title={tr(amlAuthorizationDetailsi18n.authorizeModalTitle)}
        description={tr(amlAuthorizationDetailsi18n.authorizeModalDescription)}
        onCancel={authorizeModal.off}
        onConfirm={() => {
          authorizeModal.off();
          handleApproveAml();
        }}
      />
      <ConfirmModal
        isOpen={rejectModal.isOn}
        preventClose={true}
        title={tr(amlAuthorizationDetailsi18n.rejectModalTitle)}
        description={tr(amlAuthorizationDetailsi18n.rejectModalDescription)}
        onCancel={rejectModal.off}
        onConfirm={() => {
          rejectModal.off();
          handleRejectAml();
        }}
      />
      <Container as="main">
        <Stack>
          <BackCustomerView
            to={"/customers/authorization?tab=aml"}
            customerNumber={
              aml?.customerInformation.personalData?.customerNumber ?? ""
            }
            customerName={
              aml?.customerInformation.personalData?.name +
                " " +
                aml?.customerInformation.personalData?.surname ?? ""
            }
            status={aml?.customerInformation.customerStatus.status ?? ""}
            statusColor={aml?.customerInformation.customerStatus.color ?? ""}
          />
          <Card>
            <AmlAuthorizationView aml={aml} />
            <Stack customStyle={{ paddingBottom: "2rem" }}>
              <Textarea
                label={tr(amlAuthorizationDetailsi18n.complianceComment)}
                id="complianceComment"
                name="complianceComment"
                errorMessage={
                  amlAuthorizationDetailsForm.formState.errors.complianceComment
                    ?.message
                }
                control={control}
                isRequired
              />
            </Stack>

            <Stack gap="32">
              <Stack
                d="h"
                gap={"20"}
                customStyle={{
                  alignItems: "flex-end",
                }}
              >
                <Checkbox
                  text={tr(amlAuthorizationDetailsi18n.approveWithConditions)}
                  control={control}
                  name={"isApproveWithConditions"}
                />
                <Input
                  type="date"
                  id="conditionDate"
                  max="9999-12-31"
                  min={format(new Date(), "yyyy-MM-dd")}
                  label={tr(amlAuthorizationDetailsi18n.conditionDate)}
                  register={register("conditionDate")}
                  disabled={!watchIsApproveWithConditions}
                  isRequired
                  errorMessage={
                    amlAuthorizationDetailsForm.formState.errors.conditionDate
                      ?.message
                  }
                />
              </Stack>
              <Stack
                d="h"
                customStyle={{
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  text={"Reject"}
                  colorScheme="red"
                  variant="outline"
                  onClick={rejectModal.toggle}
                  disabled={watchIsApproveWithConditions}
                />
                <Button
                  text={"Approve"}
                  colorScheme="yellow"
                  onClick={authorizeModal.toggle}
                  disabled={watchIsApproveWithConditions}
                />
                <Button
                  text={"Approve with Conditions"}
                  colorScheme="yellow"
                  onClick={authorizeModal.toggle}
                  disabled={!watchIsApproveWithConditions}
                />
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

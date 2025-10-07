import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { Stack, StepperContext } from "@rbal-modern-luka/ui-library";
import { styles } from "./AuthorizedPersonSwitch.styles";
import { AuthorizedPersonSteps } from "../types";
import { EditAttachments } from "~/components/EditAttachments/EditAttachments";
import { CustomerAttachmentsContext } from "~/context/AttachmentsContext";
import { SearchOrAddAuthorizedPerson } from "../SearchOrAddAuthorizedPerson/SearchOrAddAuthorizedPerson";
import { AccountRights } from "../AccountRights/AccountRights";
import { ReviewAuthorizationData } from "../ReviewAuthorization/ReviewAuthorization";
import { useNavigate, useParams } from "react-router";
import {
  useAllAccountRights,
  useAuthorizedRightsQuery,
  useReadCustomerQuery,
} from "~/features/customer/customerQueries";
import { editAttachmentsI18n } from "~/components/EditAttachments/EditAttachments.i18n";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { DocumentTypes } from "~/features/hooks/useCustomerAttachments/useCustomerAttachments";
import {
  AccountRightsDto,
  CustomerType,
} from "~/api/customer/customerApi.types";
import {
  ComparisonResult,
  getRightsDifference,
} from "../ReviewAuthorization/utils/getRigthsDifference";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";

interface AuthorizationContext {
  selectedRights: AccountRightsDto;
  setSelectedRights: Dispatch<SetStateAction<AccountRightsDto>>;
  isNewAuthorizedPerson: boolean;
  rightsDifference: ComparisonResult[];
}

export const AuthorizationResponseContext = createContext<AuthorizationContext>(
  {} as unknown as AuthorizationContext
);

const isPrintAction = true;
export const AuthorizedPersonSwitch = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { customerId = "", authorizedPersonId } = useParams();
  const { handleDocumentAction } = useDocumentHandler({
    customerId,
    authorizedPersonId,
  });

  const { activeStepIdx } = useContext(StepperContext);

  const [selectedRights, setSelectedRights] = useState<AccountRightsDto>([]);
  const [defaultSelectedRights, setdefaultSelectedRights] =
    useState<AccountRightsDto>([]);

  const { query: allRightsQuery } = useAllAccountRights(CustomerType.Private);

  const {
    query: { data: customerData, isFetching: isCustomerReady },
  } = useReadCustomerQuery(customerId);

  const {
    query: {
      data: selectedAuthorizedPerson,
      isFetching: isCustomerDataFetching,
    },
  } = useReadCustomerQuery(authorizedPersonId as string | undefined);

  const {
    query: { isFetching: isAuthorizedRightsFetching },
  } = useAuthorizedRightsQuery(
    (data) => {
      setSelectedRights(data ?? []);
      setdefaultSelectedRights(data ?? []);
    },
    Number(customerId),
    selectedAuthorizedPerson?.idParty
  );

  const rightsDifference = getRightsDifference(
    selectedRights,
    defaultSelectedRights
  );

  const isNewAuthorizedPerson = defaultSelectedRights.length == 0;

  const selectedAuthorizedRightsContextValue = useMemo(
    () => ({
      selectedRights: selectedRights ?? {},
      setSelectedRights,
      isNewAuthorizedPerson,
      rightsDifference,
    }),
    [isNewAuthorizedPerson, rightsDifference, selectedRights]
  );

  const onDocumentAction = (setLoading: (isLoading: boolean) => void) => {
    handleDocumentAction(
      DocumentTypes.AccountRights,
      isPrintAction,
      setLoading
    );
  };

  return (
    <Stack gap="24" customStyle={styles.container}>
      <AuthorizationResponseContext.Provider
        value={selectedAuthorizedRightsContextValue}
      >
        {(() => {
          switch (activeStepIdx) {
            case AuthorizedPersonSteps.SearchOrAdd:
              return <SearchOrAddAuthorizedPerson customerId={customerId} />;
            case AuthorizedPersonSteps.AccountRights:
              return (
                <AccountRights
                  customer={customerData}
                  isCustomerReady={isCustomerReady}
                  selectedAuthorizedPerson={selectedAuthorizedPerson}
                  isAuthorizedRightsFetching={isAuthorizedRightsFetching}
                  isCustomerDataFetching={isCustomerDataFetching}
                  allRightsQuery={allRightsQuery}
                />
              );
            case AuthorizedPersonSteps.ReviewData:
              return (
                <ReviewAuthorizationData
                  customer={customerData}
                  selectedAuthorizedPerson={selectedAuthorizedPerson}
                  allRightsQuery={allRightsQuery}
                />
              );
            case AuthorizedPersonSteps.Attachments:
              return (
                <EditAttachments
                  customerId={customerId}
                  customerContext={CustomerAttachmentsContext}
                  stepIdx={AuthorizedPersonSteps.Attachments}
                  handleDocumentAction={onDocumentAction}
                  fileName={tr(editAttachmentsI18n.authorizationForm)}
                  onSubmit={() => navigate(`/customers/${customerId}`)}
                />
              );
            default:
              return null;
          }
        })()}
      </AuthorizationResponseContext.Provider>
    </Stack>
  );
};

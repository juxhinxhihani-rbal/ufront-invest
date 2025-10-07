import {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { StepperContext } from "@rbal-modern-luka/ui-library";
import { CreateRetailAccountSteps } from "../CreateRetailAccountView";
import { AccountDetails } from "../AccountDetails/AccountDetails";
import { Attachments } from "../Attachments/Attachments";
import { CreateRetailAccountResponse } from "~/api/retailAccount/retailAccount.types";
import { Summary } from "../Summary/Summary";
import { CustomerAttachmentsContextValues } from "../types";
import { UseQueryResult } from "react-query";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { ChargedAccounts } from "../ChargedAccount/ChargedAccount";

interface CreateRetailAccountSwitchProps {
  customerId: string;
  customerQuery: UseQueryResult<CustomerDto, HttpClientError>;
}

export const RetailAccountContext =
  createContext<CustomerAttachmentsContextValues>(
    {} as unknown as CustomerAttachmentsContextValues
  );

export const CreateRetailAccountSwitch: React.FC<
  CreateRetailAccountSwitchProps
> = (props) => {
  const { customerId, customerQuery } = props;

  const [response, setResponse] = useState<CreateRetailAccountResponse>();
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);

  const { activeStepIdx, gotoNextStep, setActiveStep } =
    useContext(StepperContext);

  const retailAccountContextValue = useMemo(
    () => ({ response, setResponse, attachmentNames, setAttachmentNames }),
    [attachmentNames, response]
  );

  const onSubmitAttachments = useCallback(() => {
    if (customerQuery.data?.customerInformation?.isChargeAccountNeeded) {
      gotoNextStep();
    } else {
      setActiveStep(CreateRetailAccountSteps.Summary);
    }
  }, [customerQuery.data, gotoNextStep, setActiveStep]);

  return (
    <RetailAccountContext.Provider value={retailAccountContextValue}>
      {(() => {
        switch (activeStepIdx) {
          case CreateRetailAccountSteps.AccountDetails:
            return (
              <AccountDetails
                customerQuery={customerQuery}
                customerId={customerId}
              />
            );
          case CreateRetailAccountSteps.Attachments:
            return (
              <Attachments
                customerId={customerId}
                customerContext={RetailAccountContext}
                onSubmit={onSubmitAttachments}
              />
            );
          case CreateRetailAccountSteps.ChargedAccount:
            return (
              <ChargedAccounts
                customerId={customerId}
                segmentId={
                  customerQuery.data?.customerInformation.customerSegmentId
                }
              />
            );
          case CreateRetailAccountSteps.Summary:
            return (
              <Summary
                customerId={customerId}
                customerContext={RetailAccountContext}
              />
            );
          default:
            return (
              <AccountDetails
                customerQuery={customerQuery}
                customerId={customerId}
              />
            );
        }
      })()}
    </RetailAccountContext.Provider>
  );
};

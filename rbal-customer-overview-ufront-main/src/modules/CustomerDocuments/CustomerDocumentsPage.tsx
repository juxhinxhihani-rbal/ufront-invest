import { Card, Stack } from "@rbal-modern-luka/ui-library";
import { createContext, useMemo, useState } from "react";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { CreateRetailAccountResponse } from "~/api/retailAccount/retailAccount.types";
import { RESOURCES } from "~/common/resources";
import { usePermission } from "~/features/hooks/useHasPermission";

import { CustomerAttachmentsContextValues } from "../CreateRetailAccount/types";
import { CustomerDocuments } from "./CustomerDocuments/CustomerDocuments";
import { CustomerDocumentsDetails } from "./CustomerDocumentsDetails/CustomerDocumentsDetails";
import { CustomerDocumentsUpload } from "./CustomerDocumentsUpload/CustomerDocumentsUpload";
import { PrintCustomerDocuments } from "./PrintCustomerDocuments/PrintCustomerDocuments";

export const CustomerDocumentsContext =
  createContext<CustomerAttachmentsContextValues>(
    {} as unknown as CustomerAttachmentsContextValues
  );

interface CustomerDocumentsPageProps {
  customer?: CustomerDto;
}

export const CustomerDocumentsPage: React.FC<CustomerDocumentsPageProps> = (
  props
) => {
  const { customer } = props;

  const [response, setResponse] = useState<CreateRetailAccountResponse>();
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const [shouldRefetchDocuments, setShouldRefetchDocuments] = useState(false);
  const { isViewOnlyUser } = usePermission();

  const retailAccountContextValue = useMemo(
    () => ({
      response,
      setResponse,
      attachmentNames,
      setAttachmentNames,
      shouldRefetchDocuments,
      setShouldRefetchDocuments,
    }),
    [attachmentNames, response, shouldRefetchDocuments]
  );

  const isViewOnly = isViewOnlyUser(RESOURCES.DOCUMENT);
  return (
    <Card>
      <Stack gap="40">
        <CustomerDocumentsContext.Provider value={retailAccountContextValue}>
          <CustomerDocumentsDetails customer={customer} />
          <PrintCustomerDocuments />

          {!isViewOnly && (
            <CustomerDocumentsUpload
              customer={customer}
              customerContext={CustomerDocumentsContext}
            />
          )}
          <CustomerDocuments customer={customer} />
        </CustomerDocumentsContext.Provider>
      </Stack>
    </Card>
  );
};

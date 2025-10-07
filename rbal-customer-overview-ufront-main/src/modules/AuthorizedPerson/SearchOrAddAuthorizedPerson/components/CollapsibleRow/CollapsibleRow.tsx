import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { CollapseButton, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useState } from "react";
import { CustomerListingItem } from "~/api/customer/customerApi.types";
import { searchOrAddAuthorizedPersonPageI18n } from "../../SearchOrAddAuthorizedPerson.i18n";
import { styles } from "./CollapsibleRow.styles";

interface CollapsibleRowProps {
  customer: CustomerListingItem;
  selectedCustomer: CustomerListingItem | null;
  setSelectedCustomer: (customer: CustomerListingItem | null) => void;
}

export const CollapsibleRow = ({
  customer,
  selectedCustomer,
  setSelectedCustomer,
}: CollapsibleRowProps) => {
  const { tr } = useI18n();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Stack gap="8">
      <Stack d="h" customStyle={styles.rowContentWrapper}>
        <Stack d="h">
          <input
            css={styles.radio}
            name="isChargedAccount"
            type="radio"
            checked={selectedCustomer?.id === customer.id}
            onChange={() => setSelectedCustomer(customer)}
          />

          <Text weight="regular" text={customer.name} />
        </Stack>

        <Stack d="h" customStyle={styles.centeredContent}>
          <Stack gap="4" d="h">
            <Text
              text={tr(searchOrAddAuthorizedPersonPageI18n.headTitle)}
              customStyle={styles.customerNoText}
            />

            <Text weight="medium" text={customer.documentNumber} />
          </Stack>

          <div css={styles.flexContainer}>
            <CollapseButton
              isOpen={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </div>
        </Stack>
      </Stack>

      <Stack
        d="h"
        customStyle={[styles.collapsibleRow, !isOpen && styles.closedRow]}
      >
        <Stack gap="4">
          <Text
            customStyle={styles.subRows}
            text={tr(
              searchOrAddAuthorizedPersonPageI18n.listing.subRows.personalNumber
            )}
          />
          <Text text={customer.personalNumber} />
        </Stack>

        <Stack gap="4">
          <Text
            customStyle={styles.subRows}
            text={tr(
              searchOrAddAuthorizedPersonPageI18n.listing.subRows.dateOfBirth
            )}
          />

          <Text text={formatIntlLocalDate(customer.birthDate)} />
        </Stack>

        <Stack gap="4">
          <Text
            customStyle={styles.subRows}
            text={tr(
              searchOrAddAuthorizedPersonPageI18n.listing.subRows.status
            )}
          />
          <Text text={customer.status} />
        </Stack>

        <Stack gap="4">
          <Text
            customStyle={styles.subRows}
            text={tr(
              searchOrAddAuthorizedPersonPageI18n.listing.subRows.idNumber
            )}
          />
          <Text text={customer.id} />
        </Stack>
      </Stack>
    </Stack>
  );
};

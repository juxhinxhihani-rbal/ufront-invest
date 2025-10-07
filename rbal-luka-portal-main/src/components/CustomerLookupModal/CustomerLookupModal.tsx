import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Input,
  Modal,
  Stack,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { CustomerLookupListItem } from "../CustomerLookupListItem/CustomerLookupListItem";
import { ListFinishMark } from "../ListFinishMark/ListFinishMark";
import { css, Theme } from "@emotion/react";
import { useListCustomersQuery } from "../../features/customers/customerListingQueries";
import { ListCustomersParams } from "~/api/customerApi.types";
import { useI18n } from "~rbal-luka-portal-shell/index";
import { customerLookupModalI18n } from "./CustomerLookupModal.i18n";

interface CustomerLookupModalProps {
  isOpen: boolean;
  onClose(): void;
}

const styles = {
  kbd: (t: Theme) =>
    css({
      padding: tokens.scale(t, "4"),
      backgroundColor: tokens.color(t, "gray100"),
      border: `1px solid ${tokens.color(t, "gray150")}`,
      borderRadius: tokens.borderRadius(t, "radius2"),
      fontWeight: tokens.fontWeight(t, "medium"),
    }),
  bigInput: (t: Theme) =>
    css({
      fontSize: tokens.scale(t, "20", true),
    }),
  listMark: css({
    alignSelf: "end",
  }),
};

export const CustomerLookupModal: React.FC<CustomerLookupModalProps> = (
  props
) => {
  const { isOpen, onClose } = props;
  const { tr } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>();

  const listCustomerParams = useMemo<ListCustomersParams>(
    () => ({
      identifierContains: searchTerm,
      limit: 10,
    }),
    [searchTerm]
  );

  const listCustomersQuery = useListCustomersQuery(listCustomerParams, {
    enabled: isOpen && Boolean(searchTerm),
  });

  const handleSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      const searchTerm = inputRef.current?.value;

      if (searchTerm) {
        setSearchTerm(searchTerm);
      }
    },
    [inputRef]
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(undefined);
      listCustomersQuery.query.remove();
    }
  }, [isOpen, listCustomersQuery.query, setSearchTerm]);

  const customersListing = listCustomersQuery.query.data;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Stack onSubmit={handleSubmit} gap="24" as="form">
        <Input
          css={styles.bigInput}
          ref={inputRef}
          label={tr(customerLookupModalI18n.input.label)}
          variant="underline"
          required
          append={
            <Button
              isLoading={listCustomersQuery.query.isFetching}
              type="submit"
              variant="solid"
              colorScheme="yellow"
              text={tr(customerLookupModalI18n.input.button)}
            />
          }
        />

        <Text
          as="span"
          size="12"
          fgColor="gray600"
          text={tr(customerLookupModalI18n.caption)}
        />

        {customersListing && customersListing.total === 0 && (
          <Text size="16" text={tr(customerLookupModalI18n.missingResults)} />
        )}

        {customersListing && customersListing.total > 0 && (
          <Stack gap="16">
            {customersListing.customers.map((customer) => (
              <CustomerLookupListItem
                key={customer.id}
                id={customer.id}
                nipt={customer.nipt}
                fullName={customer.name}
              />
            ))}
            <ListFinishMark css={styles.listMark} />
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};

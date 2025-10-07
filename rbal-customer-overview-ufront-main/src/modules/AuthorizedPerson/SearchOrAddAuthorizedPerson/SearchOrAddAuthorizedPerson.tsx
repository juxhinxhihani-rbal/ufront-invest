import { Fragment, useContext, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Stack,
  StepperContext,
  Text,
  Icon,
  Loader,
  FeedbackView,
  Input,
} from "@rbal-modern-luka/ui-library";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { searchOrAddAuthorizedPersonPageI18n } from "./SearchOrAddAuthorizedPerson.i18n";
import { useListCustomersQuery } from "~/features/customer/customerQueries";
import { CustomerListingItem } from "~/api/customer/customerApi.types";
import { styles } from "./SearchOrAddAuthorizedPerson.styles";
import { CollapsibleRow } from "./components/CollapsibleRow/CollapsibleRow";

interface SearchOrAddAuthorizedPersonProps {
  customerId: string;
}

export const SearchOrAddAuthorizedPerson = ({
  customerId,
}: SearchOrAddAuthorizedPersonProps) => {
  const { tr } = useI18n();
  const navigate = useNavigate();

  const { gotoNextStep } = useContext(StepperContext);

  const [fullName, setFullName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [retailAccount, setRetailAccount] = useState("");
  const [searchParam, setSearchParam] = useState({});
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerListingItem | null>(null);

  const {
    query: {
      data: customerListing,
      error: customerListingError,
      refetch,
      isFetching,
    },
  } = useListCustomersQuery(searchParam);

  const handleListRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchParam({
      fullNameContains: fullName,
      retailAccountNo: retailAccount,
      customerNo: customerNumber,
    });
  };

  const handleGoToNextStep = () => {
    if (!selectedCustomer) return;

    navigate(
      `/customers/${customerId}/authorized-person/${selectedCustomer.id}?addNewAccount=true`
    );

    gotoNextStep();
  };

  return (
    <>
      <Stack gap="24">
        <Stack gap="32">
          <Stack gap="4">
            <Text customStyle={styles.title}>
              {tr(searchOrAddAuthorizedPersonPageI18n.title)}
            </Text>

            <Text size="14" lineHeight="24" customStyle={styles.subtitle}>
              {tr(searchOrAddAuthorizedPersonPageI18n.subtitle)}
            </Text>
          </Stack>

          <form onSubmit={handleSubmit} css={styles.form}>
            <Stack gap="8" d="h">
              <Input
                css={styles.searchInput}
                prepend={<Icon type="search" css={styles.icon} size="20" />}
                placeholder={tr(searchOrAddAuthorizedPersonPageI18n.fullName)}
                onChange={(event) => setFullName(event.target.value)}
                maxLength={80}
              />
              <Input
                css={styles.searchInput}
                prepend={<Icon type="search" css={styles.icon} size="20" />}
                placeholder={tr(
                  searchOrAddAuthorizedPersonPageI18n.customerNumber
                )}
                onChange={(event) => setCustomerNumber(event.target.value)}
                maxLength={80}
              />
              <Input
                css={styles.searchInput}
                prepend={<Icon type="search" css={styles.icon} size="20" />}
                placeholder={tr(
                  searchOrAddAuthorizedPersonPageI18n.accountNumber
                )}
                onChange={(event) => setRetailAccount(event.target.value)}
                maxLength={80}
              />
              <Button
                text={tr(searchOrAddAuthorizedPersonPageI18n.search)}
                variant="outline"
                type="submit"
                css={styles.buttonSearch}
              />
            </Stack>
          </form>
        </Stack>

        <Stack d="h" customStyle={styles.createProspectWrapper}>
          <Text size="16" text={tr(searchOrAddAuthorizedPersonPageI18n.or)} />

          <Button
            as={Link}
            to={`/customers/create?idPartyHolder=${customerId}`}
            text={tr(searchOrAddAuthorizedPersonPageI18n.create)}
            variant="outline"
            css={styles.createProspectButton}
            colorScheme="green"
          />
        </Stack>

        {isFetching && (
          <div css={styles.loaderWrapper}>
            <Loader withContainer={false} linesNo={3} />
          </div>
        )}

        {!isFetching && customerListing?.length === 0 && (
          <FeedbackView
            title={tr(
              searchOrAddAuthorizedPersonPageI18n.resultsNotFound.title
            )}
            description={tr(
              searchOrAddAuthorizedPersonPageI18n.resultsNotFound.description
            )}
          />
        )}

        {customerListingError && (
          <FeedbackView
            button1={
              customerListingError?.code === "aborted" && (
                <Button
                  type="submit"
                  disabled={!fullName && !customerNumber && !retailAccount}
                  variant="solid"
                  colorScheme="yellow"
                  onClick={handleListRefresh}
                  text="Refresh"
                />
              )
            }
            title={tr(searchOrAddAuthorizedPersonPageI18n.error.title)}
            description={tr(
              searchOrAddAuthorizedPersonPageI18n.error.description
            )}
            icon={<Icon type="warning-tr" backdropColor="green100" size="56" />}
          />
        )}

        {!isFetching && customerListing && customerListing.length > 0 && (
          <Stack>
            <Text
              size="14"
              lineHeight="24"
              text={tr(
                searchOrAddAuthorizedPersonPageI18n.caption,
                customerListing.length
              )}
              customStyle={styles.resultsCount}
            />

            <Stack>
              {customerListing.map((customer) => (
                <CollapsibleRow
                  key={customer.id}
                  customer={customer}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                />
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(searchOrAddAuthorizedPersonPageI18n.cancel)}
          as={Link}
          to={`/customers/${customerId}`}
          colorScheme="red"
          variant="outline"
          css={styles.cancelButton}
        />

        <Button
          text={tr(searchOrAddAuthorizedPersonPageI18n.next)}
          colorScheme="yellow"
          disabled={!selectedCustomer}
          onClick={handleGoToNextStep}
        />
      </Stack>
    </>
  );
};

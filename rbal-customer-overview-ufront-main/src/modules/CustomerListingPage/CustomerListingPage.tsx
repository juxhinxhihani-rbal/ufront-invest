import { useCallback, useMemo } from "react";
import {
  BackdropButton,
  Button,
  Card,
  Container,
  FeedbackView,
  Icon,
  Loader,
  Stack,
  Text,
} from "@rbal-modern-luka/ui-library";
import { useLocation, useNavigate } from "react-router-dom";
import { ListCustomersParams } from "./types";
import { useListCustomersQuery } from "~/features/customer/customerQueries";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { customerListingPageI18n } from "./CustomerListingPage.i18n";
import { CustomerListingForm } from "./components/CustomerListingForm/CustomerListingForm";
import { CustomerTable } from "./components/CustomerTable/CustomerTable";
import { CustomerListingItem } from "~/api/customer/customerApi.types";
import { toQueryParams } from "~/api/customer/customerApi";
import { saveListCustomersParams } from "~/features/customer/customerListingUrls";
import { styles } from "./CustomerListingPage.styles";

export const CustomerListingPage = () => {
  const currentLocation = useLocation();
  const navigate = useNavigate();
  const { tr } = useI18n();

  const listCustomersParams: ListCustomersParams = useMemo(() => {
    return toListCustomersParams(currentLocation.search);
  }, [currentLocation.search]);

  const listCustomersQuery = useListCustomersQuery(
    listCustomersParams,
    !listCustomersParams.manageAccountsTab
  );

  const handleListRefresh = useCallback(() => {
    void listCustomersQuery.refresh();
  }, [listCustomersQuery]);

  const customerListing = listCustomersQuery.query.data;
  const customerListingError = listCustomersQuery.query.error;

  const handleSubmit = useCallback(
    (listingParams: ListCustomersParams) => {
      const searchParams = toQueryParams(listingParams);

      navigate({ search: searchParams.toString() });
      saveListCustomersParams(listingParams);
      listCustomersQuery.refresh();
    },
    [navigate, listCustomersQuery]
  );

  const groupedItems = toGroupedCustomers(listCustomersQuery.query.data ?? []);

  const handleGoBack = useCallback(() => {
    if (listCustomersParams.manageAccountsTab) {
      navigate(
        `/customers/manage-accounts?tab=${listCustomersParams.manageAccountsTab}`
      );
    } else {
      navigate("/customers");
    }
  }, [navigate, listCustomersParams.manageAccountsTab]);

  return (
    <Container as="main">
      <Stack gap="0">
        <Stack d="h" customStyle={styles.buttonsContainer}>
          <BackdropButton
            onClick={handleGoBack}
            text={tr(customerListingPageI18n.goBack)}
          />
        </Stack>
        <CustomerListingForm
          initialValues={listCustomersParams}
          onValidSubmit={handleSubmit}
        />
        <Card customStyle={styles.resultsCard}>
          {!listCustomersQuery.query.isFetching &&
            customerListing?.length === 0 && (
              <FeedbackView
                title={tr(customerListingPageI18n.resultsNotFound.title)}
                description={tr(
                  customerListingPageI18n.resultsNotFound.description
                )}
                icon={
                  <Icon type="face-sad" backdropColor="green100" size="56" />
                }
              />
            )}

          {listCustomersQuery.query.isIdle && (
            <FeedbackView
              title={tr(customerListingPageI18n.idle.title)}
              description={tr(customerListingPageI18n.idle.description)}
              icon={<Icon type="search" backdropColor="green100" size="56" />}
            />
          )}

          {customerListingError && (
            <FeedbackView
              button1={
                customerListingError?.code === "aborted" && (
                  <Button
                    type="submit"
                    variant="solid"
                    colorScheme="yellow"
                    onClick={handleListRefresh}
                    text="Refresh"
                  />
                )
              }
              title={tr(customerListingPageI18n.error.title)}
              description={tr(customerListingPageI18n.error.description)}
              icon={
                <Icon type="warning-tr" backdropColor="green100" size="56" />
              }
            />
          )}

          {listCustomersQuery.query.isFetching && (
            <div css={styles.loaderWrapper}>
              <Loader withContainer={false} linesNo={6} />
            </div>
          )}
          {/* /customer search list */}
          {!listCustomersQuery.query.isFetching &&
            customerListing &&
            customerListing.length > 0 && (
              <Stack gap="24">
                <Text
                  size="12"
                  text={tr(
                    customerListingPageI18n.listing.caption,
                    customerListing.length
                  )}
                />

                {groupedItems.map(({ segmentTitle, items }) => (
                  <Stack gap="8" key={segmentTitle ?? "walk-in"}>
                    <Stack gap="0" d="h" customStyle={styles.tableHeader}>
                      <Text
                        size="16"
                        text={
                          segmentTitle ??
                          tr(
                            customerListingPageI18n.listing.walkinCustomerHeader
                          )
                        }
                      />

                      <Icon
                        fgColor="green600"
                        size="20"
                        type="select-open-down"
                      />
                    </Stack>

                    <CustomerTable
                      customerListing={items}
                      isWalkingCustomer={!segmentTitle}
                      manageAccountTab={
                        listCustomersParams.manageAccountsTab ?? ""
                      }
                    />
                  </Stack>
                ))}

                <Text
                  size="12"
                  text={tr(
                    customerListingPageI18n.listing.caption,
                    customerListing.length
                  )}
                />
              </Stack>
            )}
        </Card>
      </Stack>
    </Container>
  );
};

function toGroupedCustomers(customers: CustomerListingItem[]) {
  const segmentsSet = new Set(customers.map((item) => item.customerSegment));

  const groupedItems = [...segmentsSet].map((segmentTitle) => ({
    segmentTitle,
    items: customers.filter((item) => item.customerSegment === segmentTitle),
  }));
  return groupedItems;
}

function toListCustomersParams(searchString: string): ListCustomersParams {
  const searchParams = new URLSearchParams(searchString);

  return {
    fullNameContains: searchParams.get("fullNameContains") ?? undefined,
    customerNo: searchParams.get("customerNo") ?? undefined,
    retailAccountNo: searchParams.get("retailAccountNo") ?? undefined,
    manageAccountsTab: searchParams.get("manageAccountsTab") ?? undefined,
  };
}

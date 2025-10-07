import React, { useMemo } from "react";
import { Button, Icon, Loader } from "@rbal-modern-luka/ui-library";
import { Link, useParams } from "react-router-dom";
import { useReadCustomerQuery } from "~/features/customer/customerQueries";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { customerOverviewPageI18n } from "./CustomerOverviewPage.i18n";
import { css } from "@emotion/react";
import { CustomerOverviewView } from "./CustomerOverviewView";
import {
  findSavedListCustomersParams,
  toCustomerListingUrl,
} from "~/features/customer/customerListingUrls";
import { FullPageFeedback } from "~/components/FullPageFeedback/FullPageFeedback";
import { ErrorCode } from "~/api/enums/ErrorCode";
import { CustomerContext } from "~/context/CustomerContext";
import { showError } from "~/components/Toast/ToastContainer";
import {
  CustomerDto,
  CustomerStatusCode,
  RefetchIntervalQuery,
} from "~/api/customer/customerApi.types";

const styles = {
  buttonLink: css({
    textDecoration: "none",
  }),
  loaderContainer: css({
    margin: "10% 25%",
  }),
};

const isPendingCustomerStatus = (statusId?: number) => {
  switch (statusId) {
    case CustomerStatusCode.PendingInsert:
    case CustomerStatusCode.PendingUpdate:
      return true;
    default:
      return false;
  }
};

const CUSTOMER_STATUS_REFETCH_INTERVAL = 5000;
const CUSTOMER_STATUS_MAX_REFETCH_COUNT = 5;
export const CustomerOverviewPage: React.FC = () => {
  const { customerId } = useParams();
  const { tr } = useI18n();

  const refetchCustomerStatus = (
    data?: CustomerDto,
    query?: RefetchIntervalQuery<CustomerDto>
  ) => {
    const { customerStatus } = data?.customerInformation ?? {};

    if (
      (isPendingCustomerStatus(customerStatus?.customerStatusId) &&
        query &&
        query.state.dataUpdateCount < CUSTOMER_STATUS_MAX_REFETCH_COUNT) ||
      !data
    ) {
      return CUSTOMER_STATUS_REFETCH_INTERVAL;
    }

    return false;
  };

  const { query: readCustomerQuery } = useReadCustomerQuery(
    customerId,
    refetchCustomerStatus
  );

  const isPendingStatus = isPendingCustomerStatus(
    readCustomerQuery.data?.customerInformation.customerStatus?.customerStatusId
  );

  const customerListingUrl = useMemo(() => {
    const search = findSavedListCustomersParams();
    return toCustomerListingUrl(search);
  }, []);

  if (
    isPendingStatus ? readCustomerQuery.isLoading : readCustomerQuery.isFetching
  ) {
    return (
      <div css={styles.loaderContainer}>
        <Loader withContainer={false} />
      </div>
    );
  }

  if (readCustomerQuery.error?.code === ErrorCode.NotFound) {
    return (
      <FullPageFeedback
        title={tr(customerOverviewPageI18n.error.serverError.title)}
        text={tr(
          customerOverviewPageI18n.error.missingResource.description,
          customerId ?? "none"
        )}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={styles.buttonLink}
            as={Link}
            to={customerListingUrl}
            colorScheme="yellow"
            text={tr(customerOverviewPageI18n.error.missingResource.button)}
          />
        }
      />
    );
  }

  if (readCustomerQuery.error?.code === ErrorCode.UnsupportedCustomer) {
    return (
      <FullPageFeedback
        title={tr(customerOverviewPageI18n.error.unsupportedClientType.title)}
        text={tr(
          customerOverviewPageI18n.error.unsupportedClientType.description,
          customerId ?? "none"
        )}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={styles.buttonLink}
            as={Link}
            to={customerListingUrl}
            colorScheme="yellow"
            text={tr(
              customerOverviewPageI18n.error.unsupportedClientType.button
            )}
          />
        }
      />
    );
  }

  if (readCustomerQuery.error?.code === ErrorCode.CustomerNotFound) {
    return (
      <FullPageFeedback
        title={tr(customerOverviewPageI18n.error.customerNotFound.title)}
        text={tr(
          customerOverviewPageI18n.error.customerNotFound.description,
          customerId ?? "none"
        )}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={styles.buttonLink}
            as={Link}
            to={customerListingUrl}
            colorScheme="yellow"
            text={tr(customerOverviewPageI18n.error.customerNotFound.button)}
          />
        }
      />
    );
  }

  if (!readCustomerQuery.data) {
    return (
      <FullPageFeedback
        title={tr(customerOverviewPageI18n.error.serverError.title)}
        text={tr(customerOverviewPageI18n.error.serverError.description)}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={styles.buttonLink}
            as={Link}
            to={customerListingUrl}
            colorScheme="yellow"
            text={tr(
              customerOverviewPageI18n.error.unsupportedClientType.button
            )}
          />
        }
      />
    );
  }

  if (readCustomerQuery.data?.customerInformation?.isNrpClosedLongTerm) {
    showError(tr(customerOverviewPageI18n.error.nrpClosedLongTerm));
  }

  return (
    <CustomerContext.Provider value={readCustomerQuery.data}>
      <CustomerOverviewView
        backUrl={customerListingUrl}
        customer={readCustomerQuery.data}
      />
    </CustomerContext.Provider>
  );
};

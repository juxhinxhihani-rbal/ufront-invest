import React, { useMemo } from "react";
import { Button, Icon, Loader } from "@rbal-modern-luka/ui-library";
import { Link, useParams } from "react-router-dom";
import { useReadWalkInCustomerQuery } from "~/features/walkInCustomer/walkInCustomerQueries";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { walkInCustomerOverviewPageI18n } from "./WalkInCustomerOverviewPage.i18n";
import { css } from "@emotion/react";
import { WalkInCustomerOverviewView } from "./WalkInCustomerOverviewView";
import {
  findSavedListCustomersParams,
  toCustomerListingUrl,
} from "~/features/customer/customerListingUrls";
import { FullPageFeedback } from "~/components/FullPageFeedback/FullPageFeedback";
import { WalkInCustomerContext } from "~/context/WalkInCustomerContext";

const styles = {
  buttonLink: css({
    textDecoration: "none",
  }),
  loaderContainer: css({
    margin: "10% 25%",
  }),
};

export const WalkInCustomerOverviewPage: React.FC = () => {
  const { customerId } = useParams();
  const { tr } = useI18n();

  const { query: readWalkInCustomerQuery } =
    useReadWalkInCustomerQuery(customerId);

  const customerListingUrl = useMemo(() => {
    const search = findSavedListCustomersParams();
    return toCustomerListingUrl(search);
  }, []);

  if (readWalkInCustomerQuery.isFetching) {
    return (
      <div css={styles.loaderContainer}>
        <Loader withContainer={false} />
      </div>
    );
  }

  if (!readWalkInCustomerQuery.data) {
    return (
      <FullPageFeedback
        title={tr(walkInCustomerOverviewPageI18n.error.customerNotFound.title)}
        text={tr(
          walkInCustomerOverviewPageI18n.error.customerNotFound.description,
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
              walkInCustomerOverviewPageI18n.error.customerNotFound.button
            )}
          />
        }
      />
    );
  }

  return (
    <WalkInCustomerContext.Provider value={readWalkInCustomerQuery.data}>
      <WalkInCustomerOverviewView
        backUrl={customerListingUrl}
        customer={readWalkInCustomerQuery.data}
      />
    </WalkInCustomerContext.Provider>
  );
};

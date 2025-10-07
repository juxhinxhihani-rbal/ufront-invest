import {
  Card,
  Container,
  Stack,
  Button,
  Icon,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { styles } from "./ModifyDigitalView.styles";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { DigitalBankingDto } from "~/api/customer/customerApi.types";
import { useReadDigitalBankingQuery } from "~/features/customer/customerQueries";
import { useForm } from "react-hook-form";
import { DigitalFormContext } from "~/components/CustomerModificationForm/context/DigitalFormContext";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";
import { FullPageFeedback } from "~/components/FullPageFeedback/FullPageFeedback";
import { editAccountViewDetailsI18n } from "../EditAccount/EditAccountViewDetails/EditAccountViewDetails.i18n";
import { editAccountViewDetailsStyles } from "../EditAccount/EditAccountViewDetails/EditAccountViewDetails.styles";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { EditDigitalBanking } from "~/components/CustomerModificationForm/components/DigitalBanking/EditDigitalBanking";
import { format } from "date-fns";

export const ModifyDigitalView: React.FC = () => {
  const { tr } = useI18n();

  const { customerId = "" } = useParams();

  const [initialDigitalBankingValues, setDigitalBankingValues] =
    useState<DigitalBankingDto>({} as DigitalBankingDto);

  const { query: digitalBankingQuery, refresh } =
    useReadDigitalBankingQuery(customerId);

  const digitalBankingForm = useForm<DigitalBankingDto>({
    context: { initialDigitalBankingValues },
  });

  useEffect(() => {
    if (digitalBankingQuery.data && digitalBankingQuery.isFetched) {
      digitalBankingQuery.data.customerInformation.birthday = format(
        new Date(digitalBankingQuery.data.customerInformation.birthday),
        "yyyy-MM-dd"
      );

      digitalBankingForm.reset(digitalBankingQuery.data);

      setDigitalBankingValues(digitalBankingQuery.data);
    }
  }, [
    digitalBankingForm,
    digitalBankingQuery.data,
    digitalBankingQuery.isFetched,
  ]);

  if (digitalBankingQuery.isLoading) {
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

  if (digitalBankingQuery.isError) {
    return (
      <FullPageFeedback
        title={tr(editAccountViewDetailsI18n.serverErrorTitle)}
        text={digitalBankingQuery.error.title}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={editAccountViewDetailsStyles.errorButtonLink}
            as={Link}
            to={`/customers/${customerId}`}
            colorScheme="yellow"
            text={tr(editAccountViewDetailsI18n.goBack)}
          />
        }
      />
    );
  }

  return (
    <Container as="main">
      <Stack customStyle={styles.contentContainer}>
        <BackCustomerView
          to={`/customers/${customerId}`}
          customerName={
            digitalBankingQuery.data?.customerInformation.name +
              " " +
              digitalBankingQuery.data?.customerInformation.surname ?? ""
          }
          customerNumber={
            digitalBankingQuery.data?.customerInformation.customerNumber ?? ""
          }
          status={digitalBankingQuery.data?.applicationStatus ?? ""}
        />
        <Card>
          <DigitalFormContext.Provider
            value={{
              form: digitalBankingForm,
              initialCustomerFormValues: initialDigitalBankingValues,
            }}
          >
            <Stack gap="24">
              <EditDigitalBanking refreshDigitalBanking={refresh} />
            </Stack>
          </DigitalFormContext.Provider>
        </Card>
      </Stack>
    </Container>
  );
};

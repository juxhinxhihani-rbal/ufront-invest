import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Stack,
  Text,
  FeedbackView,
  Button,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { useCustomerAuthorizedPersonsQuery } from "~/features/customer/customerQueries";
import { authorizedPersonsI18n } from "./AuthorizedPersons.i18n";
import { AuthorizedPersonsTable } from "../AuthorizedPersonsTable/AuthorizedPersonsTable";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";

interface AuthorizedPersonsProps {
  customerId: string;
}

export const AuthorizedPersons: React.FC<AuthorizedPersonsProps> = (props) => {
  const { customerId } = props;

  const { tr } = useI18n();

  const authorizedPersonsQuery = useCustomerAuthorizedPersonsQuery(
    Number(customerId)
  );

  return (
    <Stack gap={authorizedPersonsQuery.isDataEmpty ? "0" : "12"}>
      <RowHeader
        withBorder={false}
        pb="12"
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(authorizedPersonsI18n.title)}
          />
        }
      />
      {authorizedPersonsQuery.query.isLoading && (
        <Loader linesNo={2} withContainer={false} />
      )}

      {authorizedPersonsQuery.query.error && (
        <FeedbackView
          title={tr(authorizedPersonsI18n.errorTitle)}
          description={tr(authorizedPersonsI18n.errorDescription)}
          button1={
            <Button
              type="submit"
              variant="solid"
              colorScheme="yellow"
              onClick={authorizedPersonsQuery.refresh}
              text={tr(authorizedPersonsI18n.errorRefresh)}
            />
          }
        />
      )}

      {authorizedPersonsQuery.query.isSuccess &&
        authorizedPersonsQuery.isDataEmpty && (
          <InfoBar
            text={tr(authorizedPersonsI18n.warningText)}
            icon="warning-ring"
          />
        )}

      {authorizedPersonsQuery.query.isSuccess &&
        !authorizedPersonsQuery.isDataEmpty && (
          <AuthorizedPersonsTable
            authorizedPersons={authorizedPersonsQuery.query.data}
            customerId={customerId}
          />
        )}
    </Stack>
  );
};

import { useCallback, useEffect, useState } from "react";
import { css, Theme } from "@emotion/react";
import { useNavigate } from "react-router";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Card,
  Container,
  Icon,
  Stack,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { searchI18n } from "./Home.i18n";
import { ListCustomersParams } from "../CustomerListingPage/types";
import { toQueryParams } from "~/api/customer/customerApi";
import { saveListCustomersParams } from "~/features/customer/customerListingUrls";
import { RESOURCES } from "~/common/resources";
import { PERMISSIONS } from "~/common/permissions";
import { usePermission } from "~/features/hooks/useHasPermission";
import { useMidasDateQuery } from "~/features/midas/midasQueries";

const styles = {
  contentWrapper: (t: Theme) =>
    css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: tokens.scale(t, "56"),
    }),
  title: (t: Theme) =>
    css({
      fontSize: tokens.scale(t, "40"),
      fontWeight: tokens.fontWeight(t, "bold"),
    }),
  button: css({
    width: "fit-content",
  }),
  createCustomer: (t: Theme) =>
    css({
      fontSize: tokens.scale(t, "20"),
      fontWeight: tokens.fontWeight(t, "bold"),
      cursor: "pointer",
      color: "#00758F",
    }),
  input: css({
    border: "none",
    outline: "none",
    width: "100%",
    minWidth: "200px",
  }),
  createWalkingCustomer: (t: Theme) =>
    css({
      fontSize: tokens.scale(t, "18"),
      fontWeight: tokens.fontWeight(t, "bold"),
      cursor: "pointer",
      color: "#00A5BC",
      paddingLeft: tokens.scale(t, "4"),
      paddingRight: tokens.scale(t, "4"),
    }),
  inputsWrapper: (t: Theme) =>
    css({
      display: "flex",
      justifyContent: "space-between",
      padding: `${tokens.scale(t, "12")} ${tokens.scale(t, "16")}`,
      margin: `${tokens.scale(t, "40")} 0`,
      border: "1px solid #EAEAEB",
      borderRadius: tokens.scale(t, "4"),
    }),
  inputContainer: (t: Theme) =>
    css({
      position: "relative",
      width: "100%",
      alignItems: "center",
      paddingRight: tokens.scale(t, "20"),

      "& *": {
        fill: "#AFB1B6",
      },
    }),
  clearInputIcon: css({
    position: "absolute",
    right: 0,
    cursor: "pointer",
    "& *": {
      fill: "#131416",
    },
  }),
  separator: (t: Theme) =>
    css({
      height: tokens.scale(t, "32"),
      width: "1px",
      background: "#AFB1B6",
    }),
  horizontalSeparator: css({
    width: "100%",
    height: "0.5px",
    background: "#AFB1B6",
  }),
  createUserStack: css({
    alignItems: "center",
  }),
};

export const Home = () => {
  const navigate = useNavigate();
  const { tr } = useI18n();

  const { isUserAllowed } = usePermission();

  const [fullName, setFullName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [retailAccountNumber, setretailAccountNumber] = useState("");

  const handleSubmit = useCallback(
    (listingParams: ListCustomersParams) => {
      const searchParams = toQueryParams(listingParams);

      navigate(`/customers/search?${searchParams.toString()}`);
      saveListCustomersParams(listingParams);
    },
    [navigate]
  );

  const midasDateQuery = useMidasDateQuery();

  useEffect(() => {
    if (midasDateQuery.data) {
      sessionStorage.setItem("midasDate", midasDateQuery.data);
    }
  }, [midasDateQuery]);

  return (
    <Container as="main" isFullHeight hasWhiteBackground>
      <Card isFullPage css={styles.contentWrapper}>
        <form
          onSubmit={() =>
            handleSubmit({
              fullNameContains: fullName,
              customerNo: customerNumber,
              retailAccountNo: retailAccountNumber,
            })
          }
        >
          <Stack id="searchForm" d="v" customStyle={styles.contentWrapper}>
            <Text
              id="searchTitle"
              text={tr(searchI18n.searchCustomer)}
              customStyle={styles.title}
            />
            <Stack id="searchInputs" d="h" customStyle={styles.inputsWrapper}>
              <Stack gap="8" d="h" customStyle={styles.inputContainer}>
                <Icon type="search" size="20" />

                <input
                  id="fullNameInput"
                  name="fullNameInput"
                  css={styles.input}
                  placeholder={tr(searchI18n.fields.fullName)}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  maxLength={80}
                  autoFocus
                  autoComplete={"new-fullNameInput"}
                />

                {fullName && (
                  <Icon
                    type="close"
                    size="16"
                    css={styles.clearInputIcon}
                    onClick={() => setFullName("")}
                  />
                )}
              </Stack>

              <Stack css={styles.separator} />

              <Stack gap="8" d="h" customStyle={styles.inputContainer}>
                <Icon type="man-butterfly" size="20" />

                <input
                  id="customerNumberInput"
                  name="customerNumberInput"
                  css={styles.input}
                  placeholder={tr(searchI18n.fields.customerNo)}
                  value={customerNumber}
                  onChange={(event) => setCustomerNumber(event.target.value)}
                  maxLength={6}
                  autoComplete={"new-customerNumberInput"}
                />

                {customerNumber && (
                  <Icon
                    type="close"
                    size="16"
                    css={styles.clearInputIcon}
                    onClick={() => setCustomerNumber("")}
                  />
                )}
              </Stack>

              <Stack css={styles.separator} />

              <Stack gap="8" d="h" customStyle={styles.inputContainer}>
                <Icon type="safe" size="20" />

                <input
                  id="retailAccountNumberInput"
                  css={styles.input}
                  placeholder={tr(searchI18n.fields.retailAccountNo)}
                  value={retailAccountNumber}
                  onChange={(event) =>
                    setretailAccountNumber(event.target.value)
                  }
                  maxLength={10}
                  autoComplete={"new-customerNumberInput"}
                />

                {retailAccountNumber && (
                  <Icon
                    type="close"
                    size="16"
                    css={styles.clearInputIcon}
                    onClick={() => setretailAccountNumber("")}
                  />
                )}
              </Stack>
            </Stack>

            <Button
              id="submitButton"
              css={styles.button}
              disabled={!fullName && !customerNumber && !retailAccountNumber}
              type="submit"
              variant="solid"
              colorScheme="yellow"
              text={tr(searchI18n.search)}
            />
            {isUserAllowed(RESOURCES.CUSTOMER, PERMISSIONS.CREATE) && (
              <>
                <Text text={tr(searchI18n.or)} />
                <Stack gap="6" customStyle={styles.createUserStack}>
                  <Text
                    id="createNewCustomerButton"
                    text={tr(searchI18n.createNewCustomer)}
                    customStyle={styles.createCustomer}
                    onClick={() => {
                      navigate("/customers/create");
                    }}
                  />
                  <Stack css={styles.horizontalSeparator} />
                  <Text
                    id="createNewWalkInCustomerButton"
                    text={tr(searchI18n.createNewWalkingCustomer)}
                    customStyle={styles.createWalkingCustomer}
                    onClick={() => {
                      navigate("/customers/walkIn/create");
                    }}
                  />
                </Stack>
              </>
            )}
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

import { Stack, BackdropButton, Text } from "@rbal-modern-luka/ui-library";
import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { backCustomerPageI18n } from "./BackCustomer.i18n";
import { useNavigate } from "react-router-dom";
import { getHexColor } from "~/common/utils";

const styles = {
  container: css({
    gap: "80px!important",
  }),
  contentContainer: css({
    flexGrow: 1,
  }),
  menu: css({
    justifyContent: "space-between",
    alignItems: "center",
  }),
};

interface BackCustomerProps {
  customerNumber?: string;
  customerName?: string;
  to: string;
  state?: Record<string, unknown>;
  status?: string;
  statusColor?: string;
}

export const BackCustomerView: React.FC<BackCustomerProps> = ({
  customerNumber,
  customerName,
  to,
  state,
  status,
  statusColor,
}) => {
  const { tr } = useI18n();
  const navigate = useNavigate();

  const handleBackClick = (destination: string) => {
    navigate(destination, state);
  };

  return (
    <>
      <Stack>
        <Stack d="h" customStyle={styles.menu}>
          <BackdropButton
            onClick={() => handleBackClick(to)}
            text={tr(backCustomerPageI18n.back)}
          />

          {Boolean(customerName) && Boolean(customerNumber) && (
            <Stack d="h">
              <Stack d="h" gap="8">
                <Text
                  fgColor="gray550"
                  text={tr(backCustomerPageI18n.customer)}
                />
                <Text text={`${customerName}`} />
              </Stack>
              <Stack d="h" gap="8">
                <Text
                  fgColor="gray550"
                  text={tr(backCustomerPageI18n.customerNumber)}
                />
                <Text text={`${customerNumber}`} />
              </Stack>

              {status && (
                <Stack d="h" gap="8">
                  <Text
                    fgColor="gray550"
                    text={tr(backCustomerPageI18n.status)}
                  />
                  <Text
                    text={status}
                    customStyle={{
                      color: getHexColor(statusColor),
                      fontWeight: "bold",
                    }}
                  />
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
};

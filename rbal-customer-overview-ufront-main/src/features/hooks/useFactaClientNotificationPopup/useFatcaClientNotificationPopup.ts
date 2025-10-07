import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useEffect } from "react";
import { useLocation } from "react-router";

import { CustomerDto } from "~/api/customer/customerApi.types";
import { showInfo } from "~/components/Toast/ToastContainer";
import { hasUsaIndica } from "~/modules/EditCustomer/utils";
import { useFactaClientNotificationPopupI18n } from "./useFactaClientNotificationPop.i18n";

type UseFatcaClientNotificationPopupProps = {
  isRemovingAuthorizedPerson?: boolean;
};

export const useFatcaClientNotificationPopup = ({
  isRemovingAuthorizedPerson = false,
}: UseFatcaClientNotificationPopupProps = {}) => {
  const { tr } = useI18n();
  const location = useLocation();
  const { shouldShowFactaPopup, customer, authorizedPersons } =
    location.state || {};

  const displayNotification = (
    person: CustomerDto,
    isAuthorizedPerson = false
  ) => {
    let translationKey = null;
    if (hasUsaIndica(person)) {
      translationKey = isAuthorizedPerson
        ? useFactaClientNotificationPopupI18n.usPaTitle
        : useFactaClientNotificationPopupI18n.usCutomerTitle;
    } else {
      translationKey = isAuthorizedPerson
        ? useFactaClientNotificationPopupI18n.nonUsPaTitle
        : useFactaClientNotificationPopupI18n.nonUSCustomerTitle;
    }

    showInfo(tr(translationKey, person.customerNumber) as string);
  };

  const showFactaPopup = (
    customer: CustomerDto,
    authorizedPersons: CustomerDto[] = []
  ) => {
    if (!isRemovingAuthorizedPerson) {
      displayNotification(customer);
    }

    authorizedPersons.map((person) => displayNotification(person, true));
  };

  useEffect(() => {
    if (shouldShowFactaPopup) {
      showFactaPopup(
        customer as CustomerDto,
        authorizedPersons as CustomerDto[]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowFactaPopup]);

  return { showFactaPopup };
};

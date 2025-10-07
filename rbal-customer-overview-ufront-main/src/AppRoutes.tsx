import {
  MicroFunction,
  PortalContext,
} from "@rbal-modern-luka/luka-portal-shell";
import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AccountAuthorizationDetails } from "./modules/Authorization/Account/AccountAuthorizationDetails";
import { AuthorizationPage } from "./modules/Authorization/AuthorizationPage";
import { CustomerAuthorizationDetails } from "./modules/Authorization/Customer/CustomerAuthorizationDetails";
import { SpecimenAuthorizationDetails } from "./modules/Authorization/Specimen/SpecimenAuthorizationDetails";
import { AuthorizedPersonView } from "./modules/AuthorizedPerson/AuthorizedPersonView";
import { CreateRetailAccountPage } from "./modules/CreateRetailAccount/CreateRetailAccountPage";
import { CustomerListingPage } from "./modules/CustomerListingPage/CustomerListingPage";
import { CustomerOverviewPage } from "./modules/CustomerOverview/CustomerOverviewPage";
import { EditAccountView } from "./modules/EditAccount/EditAccountView";
import { EditAccountViewDetails } from "./modules/EditAccount/EditAccountViewDetails/EditAccountViewDetails";
import { EditCustomerView } from "./modules/EditCustomer/EditCustomerView";
import { ModifyDigitalView } from "./modules/ModifyDigitalBanking/ModifyDigitalView";
import { RemoveAuthorizedPersonView } from "./modules/RemoveAuthorizedPerson/RemoveAuthorizedPersonView";
import { ResegmentCustomerView } from "./modules/ResegmentCustomer/ResegmentCustomerView";
import { Home } from "./modules/Home/Home";
import { AccountRightsDetails } from "./modules/Authorization/AuthorizedPerson/AccountRightsDetails";
import { DigitalAuthorizationDetails } from "./modules/Authorization/Digital/DigitalAuthorizationDetails";
import { AmlAuthorizationDetails } from "./modules/Authorization/Aml/AmlAuthorizationDetails";
import { useFeatureFlags } from "./features/hooks/useFlags";
import { CrsAuthorizationDetails } from "./modules/Authorization/Crs/CrsAuthorizationDetails";
import { RESOURCES } from "./common/resources";
import { PERMISSIONS } from "./common/permissions";
import { usePermission } from "./features/hooks/useHasPermission";
import { StatementPage } from "./modules/Statement/StatementPage";
import { BankCertificatePage } from "./modules/BankCertificate/BankCertificatePage";
import { WalkInCustomerOverviewPage } from "./modules/WalkInCustomerOverview/WalkInCustomerOverviewPage";
import { EditWalkInCustomerView } from "./modules/EditWalkInCustomer/EditWalkInCustomerView";
import { ConvertCustomerView } from "./modules/ConvertCustomer/ConvertCustomerView";
import { ManageAccountsView } from "./modules/ManageAccounts/ManageAccountsView";
import { BlockInputRequest } from "./modules/ManageAccounts/BlockAccount/BlockInputRequest/BlockInputRequest";
import { BlockRequestStatus } from "./modules/ManageAccounts/BlockAccount/BlockRequestStatus/BlockRequestStatus";
import { BlockSendRequestProcess } from "./modules/ManageAccounts/BlockAccount/BlockSendRequestProcess/BlockSendRequestProcess";
import { TemporaryUnblockRequests } from "./modules/ManageAccounts/UnblockAccount/TemporaryUnblockRequests/TemporaryUnblockRequests";
import { UnblockInputRequest } from "./modules/ManageAccounts/UnblockAccount/UnblockInputRequest/UnblockInputRequest";
import { UnblockRequestStatus } from "./modules/ManageAccounts/UnblockAccount/UnblockRequestStatus/UnblockRequestStatus";
import { UnblockSendRequestProcess } from "./modules/ManageAccounts/UnblockAccount/UnblockSendRequestProcess/UnblockSendRequestProcess";
import { ReverseHeldItem } from "./modules/ManageAccounts/HeldItem/ReverseHeldItem/ReverseHeldItem";
import { HeldRequestStatus } from "./modules/ManageAccounts/HeldItem/HeldRequestStatus/HeldRequestStatus";
import { FinancialAutomationView } from "./modules/FinancialAutomation/FinancialAutomationView";
import { EditFinancialRuleView } from "./modules/EditFinancialRule/EditFinancialRuleView";

interface ProtectedRouteProps {
  requiredPermission: string;
  requiredResource: string;
  shouldSkipGuard?: boolean;
  component: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  requiredResource,
  shouldSkipGuard = false,
  component,
}) => {
  const { isUserAllowed } = usePermission();

  if (shouldSkipGuard) {
    return component;
  }

  return isUserAllowed(requiredResource, requiredPermission) ? (
    component
  ) : (
    <Navigate to="/forbidden" replace />
  );
};

// TODO: Left here for simplicity, a general solution needs to be implemented
// so we can update the submodules from everywhere, and shouldn't import from AppRoutes.tsx
export const subModulesi18n = {
  searchCustomer: {
    en: "Search",
    sq: "Kërko",
  },
  authorization: {
    en: "Authorization",
    sq: "Autorizim",
  },
  manageAccounts: {
    en: "Manage Accounts",
    sq: "Menaxho Llogaritë",
  },
  customer: {
    en: "Customer",
    sq: "Klienti",
  },
};

const AppRoutes: React.FC = () => {
  const { addMicroData } = useContext(PortalContext);
  const { isFeatureEnabled } = useFeatureFlags();
  const { isViewOnlyUser } = usePermission();

  useEffect(() => {
    const searchFunction: MicroFunction = {
      parent: "customer-overview-ufront",
      key: "retail-customer-search",
      name: subModulesi18n.searchCustomer,
      icon: "search",
      isEnabled: true,
      routeTo: "/customers/search",
    };
    const authorizationFunction: MicroFunction = {
      parent: "customer-overview-ufront",
      key: "retail-customer-authorization",
      name: subModulesi18n.authorization,
      icon: "shield_check",
      isEnabled: true,
      routeTo: "/customers/authorization",
    };
    const manageAccounts: MicroFunction = {
      parent: "customer-overview-ufront",
      key: "retail-customer-manage-accounts",
      name: subModulesi18n.manageAccounts,
      icon: "acc-operations",
      isEnabled: true,
      routeTo: "/customers/manage-accounts",
    };
    const customerFunction: MicroFunction = {
      parent: "customer-overview-ufront",
      key: "retail-customer-customer",
      name: subModulesi18n.customer,
      icon: "man-2",
      isEnabled: true,
      routeTo: "/customers",
    };
    addMicroData(searchFunction);
    addMicroData(authorizationFunction);
    addMicroData(manageAccounts);
    addMicroData(customerFunction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route
        path="/customers"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.NO_PERMISSION}
            requiredResource={RESOURCES.CUSTOMER}
            component={<Home />}
          />
        }
      />
      <Route
        path="/customers/search"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.NO_PERMISSION}
            requiredResource={RESOURCES.CUSTOMER}
            component={<CustomerListingPage />}
          />
        }
      />
      {(isFeatureEnabled("statement") || isFeatureEnabled("old_statement")) && (
        <Route
          path="/customers/:customerId/statement/:accountId"
          element={<StatementPage />}
        />
      )}
      {isFeatureEnabled("bank_certificate") && (
        <Route
          path="/customers/:customerId/bankCertificate"
          element={<BankCertificatePage />}
        />
      )}
      <Route
        path="/customers/create"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.CREATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<EditCustomerView />}
          />
        }
      />

      <Route
        path="/customers/walkIn/create"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.CREATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<EditWalkInCustomerView />}
          />
        }
      />

      <Route
        path="/customers/authorization"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.VIEW}
            requiredResource={RESOURCES.AUTHORIZATION}
            component={<AuthorizationPage />}
          />
        }
      />
      <Route
        path="/customers/authorization/:customerId"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.VIEW}
            requiredResource={RESOURCES.AUTHORIZATION}
            component={<CustomerAuthorizationDetails />}
          />
        }
      />
      <Route
        path="/customers/authorization/specimen/:customerId"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.VIEW}
            requiredResource={RESOURCES.AUTHORIZATION}
            component={<SpecimenAuthorizationDetails />}
          />
        }
      />
      <Route
        path="/customers/authorization/accounts/:accountId"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.VIEW}
            requiredResource={RESOURCES.AUTHORIZATION}
            component={<AccountAuthorizationDetails />}
          />
        }
      />
      {isFeatureEnabled("authorization_account_rights") && (
        <Route
          path="/customers/authorization/account-rights/:authorizationRightListId"
          element={
            <ProtectedRoute
              requiredPermission={PERMISSIONS.VIEW}
              requiredResource={RESOURCES.AUTHORIZATION}
              component={<AccountRightsDetails />}
            />
          }
        />
      )}
      {isFeatureEnabled("authorization_digital_banking") && (
        <Route
          path="/customers/authorization/digital-banking/:customerId/:applicationId"
          element={
            <ProtectedRoute
              requiredPermission={PERMISSIONS.VIEW}
              requiredResource={RESOURCES.AUTHORIZATION}
              component={<DigitalAuthorizationDetails />}
            />
          }
        />
      )}
      {isFeatureEnabled("authorization_aml") && (
        <Route
          path="/customers/authorization/aml/:customerId"
          element={
            <ProtectedRoute
              requiredPermission={PERMISSIONS.VIEW}
              requiredResource={RESOURCES.AUTHORIZATION}
              component={<AmlAuthorizationDetails />}
            />
          }
        />
      )}
      {isFeatureEnabled("authorization_crs") && (
        <Route
          path="/customers/authorization/crs/:customerId"
          element={
            <ProtectedRoute
              requiredPermission={PERMISSIONS.VIEW}
              requiredResource={RESOURCES.AUTHORIZATION}
              component={<CrsAuthorizationDetails />}
            />
          }
        />
      )}
      <Route
        path="/customers/:customerId"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.VIEW}
            requiredResource={RESOURCES.CUSTOMER}
            component={<CustomerOverviewPage />}
          />
        }
      />
      <Route
        path="/customers/walkIn/:customerId"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.VIEW}
            requiredResource={RESOURCES.CUSTOMER}
            component={<WalkInCustomerOverviewPage />}
          />
        }
      />
      <Route
        path="/customers/:customerId/create-retail-account"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<CreateRetailAccountPage />}
          />
        }
      />
      <Route
        path="/customers/:customerId/financial-automation"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<FinancialAutomationView />}
          />
        }
      />
      <Route
        path="/customers/:customerId/edit-financial-rule"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<EditFinancialRuleView />}
          />
        }
      />
      <Route
        path="/customers/:customerId/edit-customer"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<EditCustomerView />}
          />
        }
      />
      <Route
        path="/customers/walkIn/:customerId/edit-customer"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<EditWalkInCustomerView />}
          />
        }
      />
      <Route
        path="/customers/:customerId/resegment-customer"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<ResegmentCustomerView />}
          />
        }
      />
      <Route
        path="/customers/:customerId/convert-customer"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<ConvertCustomerView />}
          />
        }
      />
      <Route
        path="/customers/:customerNumber/account-details/:accountId"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<EditAccountViewDetails />}
          />
        }
      />
      <Route
        path="/customers/:customerNumber/edit-account/:accountId"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<EditAccountView isAccountClosing={false} />}
          />
        }
      />
      <Route
        path="/customers/:customerNumber/close-account/:accountId"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<EditAccountView isAccountClosing={true} />}
          />
        }
      />
      <Route
        path={"/customers/:customerId/authorized-person/:authorizedPersonId"}
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            shouldSkipGuard={isViewOnlyUser(RESOURCES.AUTHORISED_PERSONS)}
            component={<AuthorizedPersonView />}
          />
        }
      />
      <Route
        path="/customers/:customerId/authorized-person"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<AuthorizedPersonView />}
          />
        }
      />
      <Route
        path="/customers/:customerId/remove-authorized-person/:authorizedPersonId"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<RemoveAuthorizedPersonView />}
          />
        }
      />
      <Route
        path="/customers/:customerId/modify-digital"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UPDATE}
            requiredResource={RESOURCES.CUSTOMER}
            component={<ModifyDigitalView />}
          />
        }
      />

      <Route
        path="/customers/manage-accounts"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.VIEW}
            requiredResource={RESOURCES.MANAGE_ACCOUNT}
            component={<ManageAccountsView />}
          />
        }
      />

      <Route
        path="/customers/manage-accounts/:customerId/input-request/block-account"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.BLOCK}
            requiredResource={RESOURCES.ACCOUNT}
            component={<BlockInputRequest />}
          />
        }
      />
      <Route
        path="/customers/manage-accounts/request-status/block-account"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.VIEW_REQUESTS_STATUS}
            requiredResource={RESOURCES.ACCOUNT}
            component={<BlockRequestStatus />}
          />
        }
      />

      <Route
        path="/customers/manage-accounts/send-request-for-process/block-account"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.PROCESS}
            requiredResource={RESOURCES.ACCOUNT}
            component={<BlockSendRequestProcess />}
          />
        }
      />

      <Route
        path="/customers/manage-accounts/:customerId/input-request/unblock-account"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UNBLOCK}
            requiredResource={RESOURCES.ACCOUNT}
            component={<UnblockInputRequest />}
          />
        }
      />

      <Route
        path="/customers/manage-accounts/approve-temporary-unblock-request/unblock-account"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.UNBLOCK}
            requiredResource={RESOURCES.ACCOUNT}
            component={<TemporaryUnblockRequests />}
          />
        }
      />

      <Route
        path="/customers/manage-accounts/request-status/unblock-account"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.VIEW_REQUESTS_STATUS}
            requiredResource={RESOURCES.ACCOUNT}
            component={<UnblockRequestStatus />}
          />
        }
      />

      <Route
        path="/customers/manage-accounts/send-request-for-process/unblock-account"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.PROCESS}
            requiredResource={RESOURCES.ACCOUNT}
            component={<UnblockSendRequestProcess />}
          />
        }
      />

      <Route
        path="/customers/manage-accounts/reverse-held-item"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.REVERSE}
            requiredResource={RESOURCES.HELD}
            component={<ReverseHeldItem />}
          />
        }
      />
      <Route
        path="/customers/manage-accounts/request-status/held-item"
        element={
          <ProtectedRoute
            requiredPermission={PERMISSIONS.VIEW_REQUESTS_STATUS}
            requiredResource={RESOURCES.HELD}
            component={<HeldRequestStatus />}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;

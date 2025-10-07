import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useEffect, useState } from "react";
import {
  StatementComissionResponseDto,
  StatementFormFilterParams,
} from "~/api/statement/statementApi.types";
import { useGetStatementComission } from "~/api/statement/statementMutations";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import { commissionModalI18n } from "./CommissionModal.i18n";
import { OverlayLoader } from "../../CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";

interface CommissionModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  currentFilters: StatementFormFilterParams;
  isOldStatement: boolean;
}

export const CommissionModal: React.FC<CommissionModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  currentFilters,
  isOldStatement,
}) => {
  const { tr } = useI18n();

  const [commissionResponse, setCommissionResponse] =
    useState<StatementComissionResponseDto>({
      numberOfStatement: 0,
      commission: 0,
      currency: "",
    });

  const {
    mutate: getStatementCommission,
    isLoading: isGettingStatementCommission,
  } = useGetStatementComission();

  useEffect(() => {
    if (isOpen) {
      getStatementCommission(
        { filters: currentFilters, isOldStatement: isOldStatement },
        {
          onSuccess: (response) => {
            setCommissionResponse(response);
            if (!isOldStatement && response.numberOfStatement <= 1) {
              onConfirm();
              return;
            }
          },
        }
      );
    }
  }, [
    isOpen,
    currentFilters,
    isOldStatement,
    getStatementCommission,
    onConfirm,
  ]);

  return (
    <>
      {isGettingStatementCommission && (
        <OverlayLoader
          label={tr(commissionModalI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      {commissionResponse &&
        (isOldStatement || commissionResponse.numberOfStatement > 1) && (
          <ConfirmModal
            isOpen={isOpen}
            preventClose={true}
            title={tr(commissionModalI18n.commissionResponseModalTitle)}
            description={`
            ${
              isOldStatement
                ? tr(commissionModalI18n.commissionForOldResponse)
                : tr(
                    commissionModalI18n.commissionResponseNumberOfStatement,
                    commissionResponse.numberOfStatement
                  )
            }
            ${tr(
              commissionModalI18n.commissionResponseCommission,
              commissionResponse.commission
            )}
            ${tr(
              commissionModalI18n.commissionResponseCurrency,
              commissionResponse.currency
            )}
          `}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
    </>
  );
};

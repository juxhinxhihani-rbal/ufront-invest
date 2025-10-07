import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import { lowerFirst } from "lodash";
import { editRetailInfoI18n } from "~/components/CustomerModificationForm/components/DigitalBanking/components/EditRetailInfo/EditRetailInfo.i18n";

export const buildDigitalErrorMessages = (
  messages: string[],
  tr: TrFunction
): string[] =>
  messages
    ?.map((messageKey) =>
      tr(
        editRetailInfoI18n[
          lowerFirst(messageKey) as keyof typeof editRetailInfoI18n
        ]
      )
    )
    .filter(Boolean) || [];

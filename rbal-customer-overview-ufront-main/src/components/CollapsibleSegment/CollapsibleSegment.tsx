import { useCallback, useState, useEffect } from "react";
import {
  CollapseButton,
  Icon,
  IconType,
  Stack,
  Text,
} from "@rbal-modern-luka/ui-library";
import { styles } from "./CollapsibleSegment.styles";
import { FormKeys } from "~/features/types/commonTypes";
import { FieldErrors } from "react-hook-form";

interface CollapsibleSegmentProps<T> {
  title: string;
  icon?: IconType;
  children: React.ReactNode;
  isOpenByDefaul?: boolean;
  formKey?: FormKeys<T>;
  errors?: FieldErrors;
  onOpenChange?: (isOpen: boolean) => void;
}

interface Errors extends FieldErrors {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const CollapsibleSegment = <T,>({
  title,
  icon,
  children,
  isOpenByDefaul = false,
  formKey,
  errors,
}: CollapsibleSegmentProps<T>) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefaul);

  const getErrorKeys = useCallback((): string[] => {
    if (!errors) return [];

    const errorObj: Errors = errors;
    const tabs: string[] = Object.keys(errorObj);
    const errorKeys: string[] = []; //tab.segment
    tabs.forEach((tab: string) => {
      const segments = Object.keys(errorObj[tab]);
      segments.map((segment) => errorKeys.push(`${tab}.${segment}`));
    });
    return errorKeys;
  }, [errors]);

  const errorKeys: string[] = getErrorKeys();
  const hasError = formKey && errorKeys.includes(formKey);

  const toggleOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (hasError) {
        return;
      }

      e.preventDefault();

      setIsOpen((current) => !current);
    },
    [hasError]
  );

  useEffect(() => {
    if (hasError) {
      setIsOpen(true);
    }
  }, [hasError]);

  return (
    <Stack customStyle={[styles.container, isOpen && styles.opened]}>
      <Stack
        d="h"
        customStyle={[
          styles.collapseHeader,
          hasError && styles.headerBorderError,
        ]}
        onClick={toggleOpen}
      >
        <Stack d="h" css={styles.centerContent} gap="8">
          {icon && (
            <Icon type={icon} size="20" css={hasError && styles.iconError} />
          )}
          <Text text={title} customStyle={styles.collapseText} weight="bold" />
        </Stack>

        <CollapseButton
          isOpen={isOpen}
          css={hasError && styles.disabledArrow}
        />
      </Stack>

      <Stack
        d="h"
        customStyle={[styles.childrenContainer]}
        style={!isOpen ? styles.hidden : {}}
      >
        {children}
      </Stack>
    </Stack>
  );
};

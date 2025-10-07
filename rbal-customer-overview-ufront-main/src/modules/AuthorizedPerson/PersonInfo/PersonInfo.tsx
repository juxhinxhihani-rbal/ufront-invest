import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { styles } from "./PersonInfo.styles";

export interface PersonInfoContent {
  reportName: string | undefined;
  customerNumber: string | undefined;
  documentNumber: string | undefined;
  birthdate: string | undefined;
  isActive: boolean | undefined;
  idParty: number | undefined;
}

interface PersonInfoProps {
  title: string;
  item?: PersonInfoContent;
  isErrorTheme?: boolean;
}

export const PersonInfo: React.FC<PersonInfoProps> = ({
  title,
  item,
  isErrorTheme,
}: PersonInfoProps) => {
  return (
    <Stack d="v" customStyle={styles.infoWrapper}>
      <Stack
        d="h"
        css={isErrorTheme ? styles.errorTitleLabel : styles.titleLabel}
      >
        <Icon
          type={isErrorTheme ? "remove-person" : "man-2"}
          size="20"
          css={isErrorTheme ? styles.errorIcon : styles.icon}
        />
        <Text text={title} customStyle={styles.titleName}></Text>
      </Stack>
      <Stack d="v" customStyle={styles.rowLabel}>
        <Stack d="h" customStyle={styles.row}>
          <Text customStyle={styles.keyRow} text={"Full Name"} />
          <Text customStyle={styles.valueRow} text={item?.reportName} />
        </Stack>

        <Stack d="h" customStyle={styles.row}>
          <Text customStyle={styles.keyRow} text={"Customer No"} />
          <Text customStyle={styles.valueRow} text={item?.customerNumber} />
        </Stack>

        <Stack d="h" customStyle={styles.row}>
          <Text customStyle={styles.keyRow} text={"Personal Number"} />
          <Text customStyle={styles.valueRow} text={item?.documentNumber} />
        </Stack>
        <Stack d="h" customStyle={styles.row}>
          <Text customStyle={styles.keyRow} text={"Date of Birth"} />
          <Text customStyle={styles.valueRow} text={item?.birthdate} />
        </Stack>
        <Stack d="h" customStyle={styles.row}>
          <Text customStyle={styles.keyRow} text={"Status"} />
          <Text
            customStyle={styles.valueRow}
            text={item?.isActive ? "Active" : "Inactive"}
          />
        </Stack>
        <Stack d="h" customStyle={styles.row}>
          <Text customStyle={styles.keyRow} text={"ID Number"} />
          <Text customStyle={styles.valueRow} text={item?.idParty} />
        </Stack>
      </Stack>
    </Stack>
  );
};

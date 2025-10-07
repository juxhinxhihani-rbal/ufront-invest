import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { styles } from "./AccountRightsInfo.styles";

export interface AuthorizedPersonInfoContent {
  name: string | undefined;
  customerNumber: string | undefined;
  relationType?: string | undefined;
}

interface AuthorizedPersonInfoProps {
  title: string;
  item?: AuthorizedPersonInfoContent;
}

export const AuthorizedPersonInfo: React.FC<AuthorizedPersonInfoProps> = ({
  title,
  item,
}: AuthorizedPersonInfoProps) => {
  return (
    <Stack d="v" customStyle={styles.infoWrapper}>
      <Stack d="h" css={styles.titleLabel}>
        <Icon type={"man-2"} size="20" css={styles.icon} />
        <Text text={title} customStyle={styles.titleName}></Text>
      </Stack>
      <Stack d="v" customStyle={styles.rowLabel}>
        <Stack d="h" customStyle={styles.row}>
          <Text customStyle={styles.keyRow} text={"Full Name"} />
          <Text customStyle={styles.valueRow} text={item?.name} />
        </Stack>

        <Stack d="h" customStyle={styles.row}>
          <Text customStyle={styles.keyRow} text={"Customer No"} />
          <Text customStyle={styles.valueRow} text={item?.customerNumber} />
        </Stack>
        {item?.relationType && (
          <Stack d="h" customStyle={styles.row}>
            <Text customStyle={styles.keyRow} text={"Relation Type"} />
            <Text customStyle={styles.valueRow} text={item?.relationType} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Icon,
  Loader,
  Modal,
  Stack,
  Text,
} from "@rbal-modern-luka/ui-library";
import { useEffect } from "react";
import { useCustomerSpecimenQuery } from "~/features/customer/customerQueries";
import { specimenI18n } from "../../Specimen.i18n";
import { styles } from "./ViewSpecimen.styles";

interface ViewSpecimenModalProps {
  isOpen: boolean;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preventClose?: boolean;
  customerId?: string;
}

export const ViewSpecimenModal = ({
  isOpen,
  onCancel,
  preventClose,
  customerId,
}: ViewSpecimenModalProps) => {
  const { refetch, isFetching, data } = useCustomerSpecimenQuery(customerId);
  const { tr } = useI18n();
  useEffect(() => {
    if (customerId) {
      void refetch();
    }
  }, [customerId, refetch]);

  return (
    <Modal isOpen={isOpen} preventClose={preventClose}>
      <Stack d="h" isSpaceBetween customStyle={styles.modalHeader}>
        <Text size="32" weight="bold" text={tr(specimenI18n.viewSpecimen)} />

        <Button variant="link" onClick={onCancel} size="32">
          <Icon type="close" size="24" />
        </Button>
      </Stack>
      {isFetching && customerId ? (
        <Loader linesNo={3} withContainer={false} />
      ) : isOpen && data?.encodedSpecimen ? (
        <img
          src={`data:image/jpeg;base64,${data.encodedSpecimen}`}
          style={{ maxWidth: 704 }}
        />
      ) : (
        <Text text={tr(specimenI18n.problemDisplayingSpecimen)} />
      )}
    </Modal>
  );
};

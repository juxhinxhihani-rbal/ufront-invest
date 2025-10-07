import { useCallback, useState } from "react";

export const useCollapseRow = () => {
  const [openedRows, setOpenRows] = useState<Record<string, boolean>>({});

  const handleToggleRow = useCallback(
    (rowId: number) => {
      const isRowOpen = Boolean(openedRows[rowId]);
      return setOpenRows({
        ...openedRows,
        [rowId]: !isRowOpen,
      });
    },
    [openedRows]
  );

  return {
    openedRows,
    setOpenRows,
    handleToggleRow,
  };
};

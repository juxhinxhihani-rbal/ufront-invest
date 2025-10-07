import { Stack, Button, Text } from "@rbal-modern-luka/ui-library";
import React, { useCallback } from "react";

interface PaginationProps {
  limit: number;
  offset: number;
  total: number;
  onChange(limitOffset: [number, number]): void;
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { limit, offset, total, onChange } = props;

  const currentPage = Math.trunc(offset / limit);

  const doesPageExist = useCallback(
    (pageNo: number) => {
      const targetOffset = limit * pageNo;
      return targetOffset < total && targetOffset >= 0;
    },
    [limit, total]
  );

  const lastPage = Math.trunc(total / limit);
  const lastPageOffset = (lastPage - 1) * limit;

  return (
    <Stack d="h" gap="4">
      {doesPageExist(currentPage - 4) && (
        <>
          <Button
            variant="ghost"
            colorScheme="green"
            size="32"
            onClick={() => onChange([limit, 0])}
            text="1"
          />
          <Text size="16" weight="regular" text="..." />
        </>
      )}

      {[currentPage - 3, currentPage - 2, currentPage - 1]
        .filter((pageNo) => doesPageExist(pageNo))
        .map((pageNo) => (
          <Button
            key={pageNo}
            variant="ghost"
            colorScheme="green"
            size="32"
            onClick={() => onChange([limit, pageNo * limit])}
            text={String(pageNo + 1)}
          />
        ))}

      <Button
        variant="ghost"
        colorScheme="green"
        size="32"
        disabled
        text={String(currentPage + 1)}
      />

      {[currentPage + 1, currentPage + 2, currentPage + 3]
        .filter((pageNo) => doesPageExist(pageNo))
        .map((pageNo) => (
          <Button
            key={pageNo}
            variant="ghost"
            colorScheme="green"
            size="32"
            onClick={() => onChange([limit, pageNo * limit])}
            text={String(pageNo + 1)}
          />
        ))}

      {doesPageExist(currentPage + 4) && (
        <>
          <Text size="16" weight="regular" text="..." />
          <Button
            variant="ghost"
            colorScheme="green"
            size="32"
            onClick={() => onChange([limit, lastPageOffset])}
            text={String(lastPage)}
          />
        </>
      )}
    </Stack>
  );
};

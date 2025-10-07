import {
  DocumentCategoryTypeResponse,
  DocumentTypeResponse,
} from "~/features/dictionaries/dictionariesQueries";

export const formatDocumentCategory = (
  data: DocumentCategoryTypeResponse[] = []
): { id: number; name: string }[] => {
  return data?.map(({ categoryId, categories }) => ({
    id: categoryId,
    name: categories,
  }));
};

export const formatDocumentType = (
  data: DocumentTypeResponse[] = []
): { id: number; name: string }[] => {
  return data?.map(({ documentTypeId, documentType }) => ({
    id: documentTypeId,
    name: documentType,
  }));
};

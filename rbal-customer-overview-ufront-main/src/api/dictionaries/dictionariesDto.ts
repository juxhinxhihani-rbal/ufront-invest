import { TaxSourceResponse } from "~/features/dictionaries/dictionariesQueries";
import { TaxSourceItem } from "./dictionariesApi.types";

export const toTaxSourceItem = (data: TaxSourceResponse[]): TaxSourceItem[] =>
  data.map((item) => ({
    id: item.crsTaxResidenceId,
    name: `${item.crsTaxResideceCode} - ${item.crsTaxResideceDescription}`,
  }));

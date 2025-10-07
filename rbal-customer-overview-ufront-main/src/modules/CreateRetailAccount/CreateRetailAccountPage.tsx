import { useParams } from "react-router-dom";
import { CreateRetailAccountView } from "./CreateRetailAccountView";

export const CreateRetailAccountPage: React.FC = () => {
  const { customerId } = useParams();

  return customerId ? (
    <CreateRetailAccountView customerId={customerId} />
  ) : null;
};

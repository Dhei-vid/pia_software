import { FC, ReactNode } from "react";
import ModalComponents from "@/components/general/alert-modal";

interface IAddNotesModal {
  trigger: ReactNode;
  content: ReactNode;
  onAction?: () => void;
}

const AddNotesModal: FC<IAddNotesModal> = ({
  trigger,
  content,
  onAction = () => {},
}) => {
  return (
    <ModalComponents.GeneralAlertDialog onAction={onAction} btn={trigger}>
      {content}
    </ModalComponents.GeneralAlertDialog>
  );
};

export default AddNotesModal;

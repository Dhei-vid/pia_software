import { FC, ReactNode } from "react";
import ModalComponents from "@/components/general/alert-modal";

interface ICreateModal {
  trigger: ReactNode;
  content: ReactNode;
  onAction?: () => void;
  modalStyle?: string;
}

const CreateModal: FC<ICreateModal> = ({
  trigger,
  content,
  onAction = () => {},
  modalStyle,
}) => {
  return (
    <ModalComponents.GeneralAlertDialog
      onAction={onAction}
      btn={trigger}
      dialogContentStyle={modalStyle}
    >
      {content}
    </ModalComponents.GeneralAlertDialog>
  );
};

export default CreateModal;

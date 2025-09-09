import { FC, ReactNode } from "react";
import ModalComponents from "@/components/general/alert-modal";

interface IAddNotesModal {
  trigger: ReactNode;
  content: ReactNode;
}

const AddNotesModal: FC<IAddNotesModal> = ({ trigger, content }) => {
  return (
    <ModalComponents.GeneralAlertDialog onAction={() => {}} btn={trigger}>
      {content}
    </ModalComponents.GeneralAlertDialog>
  );
};

export default AddNotesModal;

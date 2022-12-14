import { ReactNode } from "react";
import { CreateClientDialog } from "./CreateClientDialog";
import { DialogProps, OpenDialog, useDialog } from "./useDialog";

export type FormParams = void;

export type FormReturn = void;

function Component({ closeDialog }: DialogProps<FormParams, FormReturn>) {
    return <CreateClientDialog closeDialog={closeDialog} />;
}

export function useCreateClientDialog(): [OpenDialog<FormParams, FormReturn>, ReactNode] {
    return useDialog<FormParams, FormReturn>(Component);
}
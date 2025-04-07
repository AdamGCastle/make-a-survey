import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DialogueBoxState {
    show: boolean;
    title: string;
    message: string;
    isQuestion?: boolean;
    onOkNavigationRoute: string;
    onConfirm?: () => void;
}

interface DialogueContextType {
    dialogueBox: DialogueBoxState;
    showDialogue: (options: Omit<DialogueBoxState, 'show'>) => void;
    closeDialogue: () => void;
}

const DialogueContext = createContext<DialogueContextType | undefined>(undefined);

export const useDialogue = (): DialogueContextType => {
    const context = useContext(DialogueContext);

    if (!context) {
        throw new Error("useDialogue must be used within a DialogueProvider");
    }
    
    return context;
};

export const DialogueProvider = ({ children }: { children: ReactNode }) => {
    const [dialogueBox, setDialogueBox] = useState<DialogueBoxState>({
        show: false,
        title: '',
        message: '',
        onOkNavigationRoute: ''
    });

    const showDialogue = (options: Omit<DialogueBoxState, 'show'>) => {
        setDialogueBox({ ...options, show: true });
    };

    const closeDialogue = () => {
        setDialogueBox(prev => ({ ...prev, show: false }));
    };

    return (
        <DialogueContext.Provider value={{ dialogueBox, showDialogue, closeDialogue }}>
            {children}
        </DialogueContext.Provider>
    );
};
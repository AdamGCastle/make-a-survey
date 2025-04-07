export interface ISurvey{
    key: number;
    name: string;
    questions: IQuestion[];
    id: number;
    changesMade: boolean;
    createdByAccountId: number;
}

export interface IQuestion{
    key: number;
    id: number;
    text: string;
    multipleChoiceOptions: IMultipleChoiceOption[]
    isMultipleChoice: boolean;
    multipleAnswersPermitted: boolean;
    removed: boolean;
}

export interface IMultipleChoiceOption{
    key: number;
    text: string;
    id: number;
    removed: boolean;
}

export interface IDialogueBox{
    title: string;
    message: string;
    isQuestion: boolean;
    show: boolean;
    close: any;
    confirm: any;    
    onOkNavigationRoute: string;
}

export interface IAccountDto{
    id: number; 
    username: string;
    newPassword: string;
    verifyPassword: string;
    token: string;
}
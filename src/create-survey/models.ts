export interface ISurvey{
    key: number;
    name: string;
    questions: IQuestion[];
    id: number;
    changesMade: boolean;
}

export interface IQuestion{
    key: number;
    id: number;
    text: string;
    multipleChoiceOptions: IMultipleChoiceOption[]
    isMultipleChoice: boolean;
    multipleAnswersPermitted: boolean;
}

export interface IMultipleChoiceOption{
    key: number;
    text: string;
    id: number;
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
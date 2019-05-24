export interface IMyShortcutsStates {
    linkItems: ILinkItem[];
    linkJSX: any;
}
export interface ILinkItem {
    Id: number;
    Title: string;
    Url:string;
    DisplayOrder:string;
    Icon:string;
}
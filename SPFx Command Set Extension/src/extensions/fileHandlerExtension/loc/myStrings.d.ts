declare interface IFileHandlerExtensionCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'FileHandlerExtensionCommandSetStrings' {
  const strings: IFileHandlerExtensionCommandSetStrings;
  export = strings;
}

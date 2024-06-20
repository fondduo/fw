export type ConfigChoice = 1 | 2;
export type ConfigChoices = ConfigChoice[];

export interface Question {
  configList: ConfigChoices
}

export interface GenOptions {
  default?:boolean
  options?:string[]
}

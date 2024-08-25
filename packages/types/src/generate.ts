export interface GenerateParams {

}

export interface GenQuestions {
  watchers: (1 | 2)[]
}

export interface BaseGenParams {
  pattern: String
}

export interface GenDateParams extends BaseGenParams {
  format: string
}

export interface GenEditorParams extends BaseGenParams {
  editor: String
}

export interface GenOptions {
  all?:boolean
  date?: boolean | [string, string]
  editor?: boolean | [string, string]
}

export type PromptType = 'input' | 'confirm' | 'list'
export type DefaultValueType = string | number | boolean

export interface Question {
  type: PromptType
  name: string
  message: string
  choices?: string[] | QuestionObject[]
  default?: DefaultValueType
}

const createInquirerQuestion = (
  type: PromptType,
  name: string,
  question: string,
  defaultValue: string | number | boolean | undefined
): Question => {
  const questionObject: Question = {
    type,
    name,
    message: question,
  }

  if (defaultValue !== undefined) {
    questionObject.default = defaultValue
  }

  return questionObject
}

export const createQuestion = (
  name: string,
  question: string,
  defaultValue?: string | number
): Question => createInquirerQuestion('input', name, question, defaultValue)

export const createBooleanChoice = (
  name: string,
  question: string,
  defaultValue?: boolean
): Question => createInquirerQuestion('confirm', name, question, defaultValue)

export interface QuestionObject {
  name: string
  value: string | number
}

export const createList = (
  name: string,
  question: string,
  choices: string[] | QuestionObject[],
  defaultValue: string | number
): Question => ({
  ...createInquirerQuestion('list', name, question, defaultValue),
  choices,
})

export const renderText = (text: string) => {
  console.log(text)
}

export type PromptType = 'input' | 'confirm'
export type DefaultValueType = string | number | boolean

export interface Question {
  type: PromptType
  name: string
  message: string
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

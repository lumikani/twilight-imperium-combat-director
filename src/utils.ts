export const log = (data: any) => {
  console.log(JSON.stringify(data, null, 2))
}

export const createQuestion = (name: string, question: string): Question => ({
  type: 'input',
  name,
  message: question,
})

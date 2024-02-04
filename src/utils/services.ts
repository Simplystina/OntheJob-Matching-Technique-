export const convertToSmallLetter = (input:string[]) => {
   const newInput:string[] = []
    input.forEach(element => {
        newInput.push(element.trim().toLowerCase())
    });
    return newInput
}



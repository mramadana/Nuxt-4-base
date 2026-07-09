
// when i need to use a global function in a component
export const useUtils = () => {
    const sayHello = () => {
        console.log('Hello')
    }

    return {sayHello}
}
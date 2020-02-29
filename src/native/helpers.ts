/**
 * Get current date in DD-MM-YYY-HH-MM format
 */
export const getCurrentDate = (): string => {
    const today = new Date()

    const pad = (input: number): string => input.toString().padStart(2, '0')

    return `${pad(today.getDate())}-${pad(today.getMonth() + 1)}-${today.getFullYear()}-${pad(today.getHours())}${pad(
        today.getMinutes()
    )}`
}

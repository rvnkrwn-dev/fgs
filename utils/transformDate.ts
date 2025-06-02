const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
}

export const transformDate = (date: string) => {
    return new Date(date).toLocaleString('id-ID', options).replace(',', '')
}
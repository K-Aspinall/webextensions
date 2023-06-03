export type DOMMessage = {
    type: 'GET_DOM'
}

export type DOMMessageResponse = {
    title: string;
    date: string;
    url: string;
    site: string;
}
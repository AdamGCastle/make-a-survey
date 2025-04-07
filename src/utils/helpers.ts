export function isNullOrWhiteSpace(s: string){
    return s === null || s.match(/^ *$/) !== null;
}
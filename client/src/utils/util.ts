

export const hostUrl =() =>{
    let url =window.location.origin
    if(url === 'http://localhost:3000'){
        return 'http://localhost:9001'
    }
    return url
}

export const CodeContributorStats = (data:any) => {
    const newData:any = {}
    let totalCode = 0
    for (let i=0 ; i<data.length ; i++) {
        let adds=0
        let deletes=0
        for(let j=0;j<data[i].weeks.length;j++){
            adds += data[i].weeks[j].a
            deletes += data[i].weeks[j].d
        }
        newData[data[i].author.login] = adds+deletes
        totalCode += adds+deletes
    }
    for (let i=0 ; i<data.length ; i++) {
        newData[data[i].author.login] = Math.floor((newData[data[i].author.login]/totalCode)*100)+'%'
    }
    return newData;
}

export const OptionRepoOwner = (data:any,contributors:any) => {
    const newData:any = {}
    const owner = data.repoFullName.split('/')[0]
    for (let i=0 ; i<contributors.length ; i++) {
        if(contributors[i].author.login === owner){
            newData[contributors[i].author.login] = '100%'
        }else{
            newData[contributors[i].author.login] = '0%'
        }
    }
    return newData;
}
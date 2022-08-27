export const CodeContributorStats = (data:any,distributionPercentage:any) => {
    const newData:any = {}
    const percentage = parseInt(distributionPercentage)

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
        newData[data[i].author.login] = Math.floor((newData[data[i].author.login]/totalCode)*percentage)+'%'
    }
    return newData;
}

export const OptionRepoOwner = (data:any,contributors:any,distributionPercentage:any) => {
    const newData:any = {}
    const percentage = parseInt(distributionPercentage)
    const owner = data.repoFullName.split('/')[0]
    for (let i=0 ; i<contributors.length ; i++) {
        if(contributors[i].author.login === owner){
            newData[contributors[i].author.login] = `${percentage}%`
        }else{
            newData[contributors[i].author.login] = '0%'
        }
    }
    return newData;
}
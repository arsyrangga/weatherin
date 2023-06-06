export const convertMonth = (data) =>{
    if(data.toLowerCase() === 'mon'){
        return "Senin"
    }
    if(data.toLowerCase() === 'tue'){
        return "Selasa"
    }
    if(data.toLowerCase() === 'wed'){
        return "Rabu"
    }
    if(data.toLowerCase() === 'thu'){
        return "Kamis"
    }
    if(data.toLowerCase() === 'fri'){
        return "Jum'at"
    }
    if(data.toLowerCase() === 'sat'){
        return "Sabtu"
    }
    if(data.toLowerCase() === 'sun'){
        return "Minggu"
    }
}
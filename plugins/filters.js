import Vue from 'vue';
import moment from 'moment';
import byteSize from 'byte-size';

Vue.filter('calculateSize', function(number, precision){
    if(number == undefined) return "0 B"
    var returnNumber = number.toString()
    precision = precision != null ? precision : 2

    var numberInIec = byteSize(number, {
        units: 'iec',
        precision: precision,
    })
   
    var iecParts = numberInIec.toString().split(" ");
    switch(iecParts[1]){
        case "KiB":
            returnNumber = iecParts[0] + " KB"
            break  
        case "MiB":
            returnNumber = iecParts[0] + " MB"
            break   
        case "GiB":
            returnNumber = iecParts[0] + " GB"  
            break 
        case "TiB":
            returnNumber = iecParts[0] + " TB" 
            break  
        case "PiB":
            returnNumber = iecParts[0] + " PB" 
            break  
        case "EiB":
            returnNumber = iecParts[0] + " EB"  
            break 
        case "ZiB":
            returnNumber = iecParts[0] + " ZB"  
            break 
        case "YiB":
            returnNumber = iecParts[0] + " YB"  
            break 
        default:
            returnNumber = iecParts[0] + " B" 
    } 
    return returnNumber
})

Vue.filter('formatDate', function(date, dateFormat = 'L'){
    if(!date) return ''
    moment.locale('de')
    return moment(date).format(dateFormat)
})

Vue.filter('shortenText', function(text, maxLength = 300){
    if(text && typeof text === 'string'){
        const finalChar = text.length > maxLength ? '...' : ''
        return text.substr(0, maxLength) + finalChar
    }
    return ''
})
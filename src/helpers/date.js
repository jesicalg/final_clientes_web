/**
 * transforma un objeto date a un formato de fecha dd-mm-aaaa
 *  @param {Date} date
 *  @returns {string} 
 */
export function dateToString(date){

    if(date == null) return 'xxxx-xx-xx xx:xx:xx';
    
    const formattedDate= new Intl.DateTimeFormat('es-AR',{
        day:'2-digit', month:'2-digit', year:'numeric'
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat('es-AR',{
        hour:'2-digit', minute:'2-digit', second:'2-digit',
    }).format(date);
    
    return `${formattedDate} ${formattedTime}`;
}
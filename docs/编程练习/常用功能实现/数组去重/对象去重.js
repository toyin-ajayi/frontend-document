
function unique(array){
    var temp = [];
    var json = {};
    for(var i = 0; i<array.length; i++){
        if(!json[array[i]]){
            temp.push(array[i]);
            json[array[i]] = 1;
        }
    }
    return temp;
}

get_header_row = function (sheet) {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */

        var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        headers.push(hdr);
    }
    return headers;
}

is_empty_field = function(data){
    if (data.startsWith('__EMPTY')){
        return true;
    }
}

should_show_column = function(col) {
   var shouldShow = true;
   
   if ( config.ignoreProps.includes(col) || utils.is_empty_field(col) ){
        shouldShow = false;
   }

   return shouldShow;
}

remove = function(ary, item){
    var newAry =  ary.filter( a=> a != item );
    return newAry;
}

object_keys_to_lower = function(obj){
    var objLower = {};
    for(var item of Object.keys(obj)) {
        objLower[item.toLowerCase()] = obj[item];
    }
    return objLower;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


object_keys_strip_space = function(obj){
    var objSpaceless = {};
    for(var item of Object.keys(obj)) {
        objSpaceless[item.replaceAll(" ", "")] = obj[item];
    }
    return objSpaceless;
}

extend = function (obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

// dynamically replaces a string with tokens stored in an array dynamically
// for example it replaces this @id
//    "https://dow.com/en-us/industries/${Application}/${Market segment}"
// with this
//    "https://dow.com/en-us/industries/Health & Hygiene/Active Comfort"
function replaceTokens(str, obj){ 
    var tokens = [];
    var tokenizedString = null;
    str = str.toLowerCase().replaceAll(" ", "");;
    obj = utils.object_keys_to_lower(obj);
    obj = utils.object_keys_strip_space(obj);
    var tokensArry = str.split('${');
    for (var item of tokensArry){
        var tokenRightBoundIndex = item.indexOf('}');
        if (tokenRightBoundIndex >= 0){
            // get text in front of } and its your token!
            item = item.split('}')[0];
            tokens.push(item);
        }
    }
    tokenizedString = str;
    for(var token of tokens){
        token = token.replaceAll(" ", "");
        var replaceToken = "${" + token + "}";
        tokenizedString = tokenizedString.replace(replaceToken, obj[token]);
        var a = 1;
    }
    return tokenizedString;
}




module.exports = {
    get_header_row: get_header_row,
    is_empty_field: is_empty_field,
    should_show_column: should_show_column,
    remove: remove,
    object_keys_to_lower: object_keys_to_lower,
    object_keys_strip_space: object_keys_strip_space,
    replaceTokens: replaceTokens,
    extend: extend
}

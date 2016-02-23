function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function isArray(object){
	return Object.prototype.toString.call( object ) === '[object Array]';
}
const MessageType = {
    TEXT: 'text',
    IMAGE: 'image',
    CALL: 'call'
}
function Message(senderID, type, sendAt,object) {  
	this.sendAt = sendAt;
	this.senderID = senderID;
	this.type = type || MessageType.TEXT;
	this.object = object;
}

Message.prototype.getDate = function(){
	return new Date(Number(this.sendAt)); 
}

Message.prototype.getDateValue = function(){
	return this.sendAt; 
}

Message.prototype.getSenderID= function(){
	return new Date(Number(this.senderID));
}

Message.prototype.getObject= function(){
	return this.object; 
}

Message.prototype.setSenderID = function(senderID){
	this.senderID = senderID
}

Message.prototype.setType = function(type){
	this.type = type
}

Message.prototype.setObject = function(object){
	this.object = object
}

module.exports = Message; 
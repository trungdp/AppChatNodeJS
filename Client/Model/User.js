const UserStatus = {
    ONLINE: 'onl',
    OFFLINE: 'off'
}

function User(name, pass, status) {     
    this.name = name || "";
    this.pass = pass  || "";
    this.status = status || UserStatus.OFFLINE;
}

User.prototype.getName = function(){
    return this.name;
}

User.prototype.getPass = function(){
    return this.pass;
}

User.prototype.getStatus = function(){
    return this.status;
}

User.prototype.setName = function(name){
    this.name = name;
}

User.prototype.setStatus = function(status){
    this.status = status;
}

// module.exports = User; 
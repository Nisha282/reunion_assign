// ======================Import mongoose==============//
const mongoose = require("mongoose");

// ===============Validate Email================//
const isValidEmail = function (mail) {
    if (/^[a-z0-9_]{1,}@[a-z]{3,}[.]{1}[a-z]{3,6}$/.test(mail)) {
        return true;
    }
};

// ===============Validate Password================//
const isValidPassword = function (password) {
    if (
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(
            password
        )
    )
        return true;
    return false;
};

// ===============Validate Name===================//
const isValidName = function (name) {
    if (/^[A-Z][a-z]{2,}\s[A-Z][a-zA-Z]{2,}$/.test(name)) return true;
    return false;
};

// ===============Validate Id================//
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

// ==========================Validate Field is Empty or not=======================//
const isValidRequestBody = function(requestBody){
    if(Object.keys(requestBody).length>0)return true
    return false
}





module.exports = {
    isValid,isValidEmail,isValidPassword,isValidName,isValidObjectId,isValidRequestBody};
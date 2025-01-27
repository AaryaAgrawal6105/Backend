class ApiError extends Error{
    constructor(
        statuscode,
        message = "something went wrong",
        errors = [],
        stack = ""

    ){
        super(message)
        this.message= message;
        this.errors=errors;
        this.data = null;
        this.statuscode = statuscode;
        this.success = false;
        if(stack){
            this.stack =stack;
        }
        else{
            Error.captureStackTrace(this , this.constructor);

        }

    }   
}
export {ApiError}
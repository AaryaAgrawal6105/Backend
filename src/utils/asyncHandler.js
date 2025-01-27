const asyncHandler = (requestHandler) => {
<<<<<<< HEAD
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    }
}

export { asyncHandler }

/*
const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
        
    }
}
*/
=======
    return (req ,res,next ) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
export { asyncHandler }

    // const asyncHandler  = (fn)=> async(req ,res, next)=>{
    //     try {
    //         await fn(req,   res,    next)
    //     } catch (error) {
    //         res.status(err.code ||  500).json({
    //             success : false,
    //             message : err.message
    //         })
    //     }
    // }
>>>>>>> 8d51745029c545cbcd2a75d87e50a162d9e435fd

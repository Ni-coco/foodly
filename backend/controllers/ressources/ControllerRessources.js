function SuccessResponse(res,data,codeHTTP = 200){
    res.status(codeHTTP).json({
        data : data,
        success : true
      });
}

function ErrorResponse(res,message,codeHTTP = 400){
    res.status(codeHTTP).json({
        success : false,
        error: message
    })
}

function getColumns(attrs){
    cols = []
    for(var key in attrs){
      cols.push({label : key,type:attrs[key].type.key})
    }
    return cols
}

module.exports = {SuccessResponse,ErrorResponse,getColumns}
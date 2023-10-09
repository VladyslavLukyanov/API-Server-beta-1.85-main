import MathsController from "./controllers/MathsController.js";
let estUneOperation = false;

export const API_EndPoint = async function (HttpContext) {
    if (!HttpContext.path.isAPI) {
        return false;
    } else {
        let controllerName = HttpContext.path.controllerName;
        if (controllerName != undefined) {
            try {
                // dynamically import the targeted controller
                // if the controllerName does not exist the catch section will be called
                const { default: Controller } = (await import('./controllers/' + controllerName + '.js'));
                // instanciate the controller       
                let controller = new Controller(HttpContext);
                
                if(controller instanceof MathsController) {
                    estUneOperation = true;
                }

                switch (HttpContext.req.method) {
                    case 'GET':
                        if(HttpContext.req.url === "/api/maths?" || HttpContext.req.url === "/api/maths") {
                            HttpContext.res.end(
                                `<!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Document</title>
                                </head>
                                <body>
                                    <style>
                                        .operations {
                                            font-weight: bold;
                                        }
                                    </style>
                                
                                    <h1>GET : Maths endpoint</h1>
                                    <h2>List of possible query strings:</h2>
                                    <hr>
                                    <div class="operations">
                                        <p>
                                            ? op = + & x = number & y = number <br>
                                            return {"op":"+", "x":number, "y":number, "value": x+y}
                                        </p>
                                        <p>
                                            ? op = - & x = number & y = number <br>
                                            return {"op":"-", "x":number, "y":number, "value": x-y}
                                        </p>
                                        <p>
                                            ? op = * & x = number & y = number <br>
                                            return {"op":"*", "x":number, "y":number, "value": x*y}
                                        </p>
                                        <p>
                                            ? op = / & x = number & y = number <br>
                                            return {"op":"/", "x":number, "y":number, "value": x/y}
                                        </p>
                                        <p>
                                            ? op = % & x = number & y = number <br>
                                            return {"op":"%", "x":number, "y":number, "value": x%y}
                                        </p>
                                        <p>
                                            ? op = ! & n = integer <br>
                                            return {"op":"!", "n":integer, "value": n!}
                                        </p>
                                        <p>
                                            ? op = p & n = integer <br>
                                            return {"op":"p", "n":integer, "value": true if n is a prime number}
                                        </p>
                                        <p>
                                            ? op = ! & n = integer <br>
                                            return {"op":"!", "n":integer, "value: n!}
                                        </p>
                                        <p>
                                            ? op = np & n = integer <br>
                                            return {"op":"np", "n":integer, "value: nth prime number}
                                        </p>
                                    </div>
                                </body>
                                </html>
                            `);
                        }

                        else if(estUneOperation) {
                            const params = HttpContext.path.params;
                            const nbParams = Object.keys(params);
                            let result;
                            let operateur = {};
                            if(nbParams.length>0 && nbParams.includes("op")) {

                                if(nbParams.length === 3) {
                                    if(nbParams.includes("x") && nbParams.includes("y")) {
                                        let {op, x, y} = params;
                                        console.log(y)
                                        if(x&&y) {
                                            operateur['valeur'] = op;
                                            result = controller.faireOperation(operateur, x, y); // 3 params
                                        } else if(x === null || x === "") {
                                            result = "Veuillez attribuer une valeur à (x). Pour plus d'informations, consultez : http://localhost:5000/api/maths? "
                                        } else if(y === null || y === ""){
                                            result = "Veuillez attribuer une valeur à (y). Pour plus d'informations, consultez : http://localhost:5000/api/maths? "
                                        }
                                        
                                    } else {
                                        result = "Veuillez attribuer les noms : (x) et (y) aux données";
                                    }
                                } else if(nbParams.length === 2) {
                                    if(nbParams.includes("n")) {
                                        let {op, n} = params;
                                        operateur['valeur'] = op;
                                        result = controller.faireOperationUnNombre(operateur, n);
                                    } else {
                                        result = " Si vous souhaitez effectuer une opération avec un seul nombre, veuillez le nommer (n). Pour plus d'informations, consultez : http://localhost:5000/api/maths? ";
                                    }
                                     
                                } else {
                                    result = " Nombre de parametres invalide. Pour plus d'informations, consultez : http://localhost:5000/api/maths? ";
                                }
                            } else if (!nbParams.includes("op")) {
                                result = " Veuillez nommer votre operateur (op). Pour plus d'informations, consultez : http://localhost:5000/api/maths? "
                            }
                            HttpContext.response.JSON(result);

                        } else {
                            controller.get(HttpContext.path.id);
                        }
                        return true;
                    case 'POST':
                        if (HttpContext.payload)
                            controller.post(HttpContext.payload);
                        else
                            HttpContext.response.unsupported();
                        return true;
                    case 'PUT':
                        if (HttpContext.payload)
                            controller.put(HttpContext.payload);
                        else
                            HttpContext.response.unsupported();
                            return true;
                    case 'DELETE':
                        controller.remove(HttpContext.path.id);
                        return true;
                    default:
                        HttpContext.response.notImplemented();
                        return true;
                }
            } catch (error) {
                console.log("API_EndPoint Error message: \n", error.message);
                console.log("Stack: \n", error.stack);
                HttpContext.response.notFound();
                return true;
            }
        } else {
            // not an API endpoint
            // must be handled by another middleware
            return false;
        }
    }
}
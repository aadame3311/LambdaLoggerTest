/** Helping function used to get all methods of an object */
const getMethods = (obj) => { 
    const methods = [];

    const objProps = Object.keys(obj)
        .filter((key) => typeof obj[key] === 'function')
        .map((key) => obj[key]);

    
    objProps.forEach(prop => {
        if (typeof prop === 'function');
        methods.push(prop.name);
    });

    return methods;
}

/** Replace the original method with a custom function that will call our aspect when the advice dictates */
function replaceMethod(target, methodName, aspect, advice) {
    const originalCode = target[methodName]
    target[methodName] = async (...args) => {
        const startTime = process.hrtime.bigint();
        
        if(["before", "around"].includes(advice)) {
            aspect.apply(target, [`${methodName} Start`, 
            { 
                    start_time: Number(startTime), 
                    parameters: { ...args } 
                }]);
        }

        const returnedValue = await originalCode.apply(target, args)

        const endTime = process.hrtime.bigint();
        const duration = (endTime-startTime)/BigInt(1000000);

        if(["after", "around"].includes(advice)) {
            aspect.apply(target, [`${methodName} End`, 
                { 
                    end_time: Number(endTime), 
                    duration: Number(duration), 
                    parameters: { ...args } 
            }])
        }
        if("afterReturning" == advice) {
            return aspect.apply(target, [returnedValue])
        } else {
            return returnedValue
        }
    }
}

module.exports = {
    //Main method exported: inject the aspect on our target when and where we need to
    inject: (target, aspect, advice, pointcut, method = null) => {
        if(pointcut == "method") {
            if(method != null) {
                replaceMethod(target, method, aspect, advice)    
            } else {
                throw new Error("Tryin to add an aspect to a method, but no method specified")
            }
        }
        if(pointcut == "methods") {
            const methods = getMethods(target)
            methods.forEach( m => {
                replaceMethod(target, m, aspect, advice)
            })
        }
    }

    
}
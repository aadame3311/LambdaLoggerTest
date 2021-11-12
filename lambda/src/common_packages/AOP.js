const methodSnapshot = [];
/** Helping function used to get all methods of an object */
const getMethods = (obj) => { 
    const methods = [];

    const objProps = Object.keys(obj)
        .filter((key) => typeof obj[key] === 'function')
        .map((key) => obj[key]);

    objProps.forEach(prop => {
        if (typeof prop === 'function') {
            methods.push(prop.name);
        }
    });

    return methods;
}

/** Replace the original method with a custom function that will call our aspect when the advice dictates */
function replaceMethod(target, methodName, aspect, advice) {
    const originalCode = target[methodName];

    methodSnapshot.push({ target, methodName, originalCode });

    const methodReplacement = async (...args) => {
        const startTime = process.hrtime.bigint();
        
        if(["before", "around"].includes(advice)) {
            aspect.apply(target, [
                {
                    message: `${methodName} Start`, 
                    labels: { 
                        start_time: Number(startTime), 
                        parameters: { ...args } 
                    }
                }
            ]);
        }

        try {
            const returnedValue = await originalCode.apply(target, args)

            const endTime = process.hrtime.bigint();
            const duration = (endTime-startTime)/BigInt(1000000);
    
            if(["after", "around"].includes(advice)) {
                aspect.apply(target, [
                    {
                        message: `${methodName} End`, 
                        labels: { 
                            end_time: Number(endTime), 
                            duration: Number(duration), 
                            parameters: { ...args } 
                        }
                    }
                ]);
            }
    
            if("afterReturning" == advice) {
                return aspect.apply(target, [{
                    message: `${methodName} Returned`,
                    labels: { returnedValue }
                }]);
            } else {
                return returnedValue
            }
        } catch(error) {
            aspect.apply(target, [
                {
                    level: 'error',
                    message: `${methodName} Exception`, 
                    labels: { error: error.toString() }
                }
            ]);

            throw error;
        }
    }

    target[methodName] = async (...args) => await methodReplacement(...args);
}

module.exports = {
    flushAll: () => {
        methodSnapshot.forEach(m => {
            m.target[m.methodName] = m.originalCode;
        });
    },
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
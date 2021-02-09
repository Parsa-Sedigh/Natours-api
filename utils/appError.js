/* We want all of our AppError objects to inherit from built-in Error class. So let's extend the built-in Error class by
* our new class(AppError).
* Important: When we extend a parent class(in this case, the parent class is Error), we call super() in constructor of our new
*  class, in order to call parent constructor.
* We called super() by passing it an arg, because the message is actually the only parameter that the Error class accepts.
* In class1 extends class2 , class1 inherits from the class2.
*
* The status can be either 'fail' or 'error' in our app and status depends on the status code. So when the statusCode is 400,
* then the status would be fail and if statusCode is 500, status would be 'error'.
* So we can test the first number of statusCode for the value of status. In JS, we have startsWith() method that we can call
* on strings. But the statusCode might be a number(maybe when we call this class in our code, we pass it statusCode in number),
* so we must consider this situation and convert statusCode to string whether we pass statusCode in staring or number.Because the
* startsWith() method is only for strings. For convert statusCode to string, we use it in template string.
* We wrote status property by using a ternary operator BASED ON THE VALUE OF statusCode, so with this we won't need to pass in
* status as a separate argument to this class. So we can find out the value of status based on statusCode and therefore we
* don't need to pass in another arg o this class when we want to create an object from this class by calculating status value
* based on passed in statusCode.
*
* All the errors that we will create using this class, will all be operational errors (errors that we can predict will happen at
* some point at the future, like a user creating a tour without the required fields.).
* So again: From now on, instead of using built-in Error class, in order to create all of the operational errors in our app. So
* let's create a isOperational prop and set it to true. So all of error objects that created from this class will have this prop
* and it's set to true. We create this property, so later, we can test for this property in the err objects and ONLY send error
* messages which are operational errors and which means they were created from this class, back to the client and this process is
* useful because some other crazy and unexpected errors that might happen in our app, for example a programming error or some bug
* in one of the packages that we require in our app and these errors will of course not have isOperational prop.Because they didn't
* created by our custom error class. So isOperation property shows that the err object is a custom err object and didn't produced
* by the system.
* Now we need to capture the stack trace. Actually each err object has the stack property on it, so err.stack is basically
* shows us where the error created and it also shows us the entire call stack which in the end, originated by the error.
* So we kind of want to preserve that call stack and also at the same time, not add this custom class to that stack track.
* So we say: Error.captureStackTrace() and in parentheses of the prior code, we specify the CURRENT OBJECT WHICH IS this keyword and
* also AppError CLASS ITSELF, WHICH IS this.constructor . So with these code, when a new object is created from this class and therefore
* when the constructor function is called, then that function call is not gonna appear in the stack trace and won't pollute the
* stack trace.
*
* Why we didn't say: this.message = message; ? Because by calling the parent class(Error class) constructor by saying super(message)
* and whatever we pass into the Error class, is gonna be the message property. So basically by doing super(message) ,
* we already set the message property to our incoming message. So the Error class has the message property and we are extending
* that class so we have that message property too! without defining it in our class definition and by calling super(message) ,
* we are setting the value of incoming message to the message property. */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;




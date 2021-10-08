/* 111-1. Section Intro:


112-2. Debugging Node.js with ndb:
There are different ways of debugging nodejs code, for example we could use vscode for that, but google released an amazing tool called NDB.

NDB (node debugger): Is a npm package. So npm i ndb --global (you should install it as a global package and on mac, you need global permissions).
But if you want to install it locally, you can install it as a dev dependency.
After installation add a new script in package.json and call it debug and that script would be sth like: "ndb <entry point file>" and this is gonna work
no matter if you installed ndb locally or globally. Now you can run this script instead of nodemon, because ndb will start the server
as well and it would then try to do this in the same port of nodemon command so it's not gonna work. So we need to finish the command that
is currently running and then run debug script.

Then a new chrome window should open, which is called a headless chrome, but it's not a real chrome.

There, on left side, we have our complete file system, down there, we also have access to our npm scripts which we can actually run from there.
We also have a console tab up there and there, you can see your server's console.

We can click on files on left side and edit them, right in the debugger. So for example let's say that we find a bug and we then want to fix it
right away and we can do that right in the debugger and it will then update the original code in your IDE.

In ndb we can set a breakpoint on one of our route handler functions and then send the request to the route that this function is
responsible for it and see the variables in it.
So we find out that when we set a breakpoint on a line of code, our code will stop running at that line where we defined a breakpoint.
In other words our code will froze or stuck at that point. We can define breakpoints in debugger, where our code will then then stop running
and it will basically freeze in time and we can then take a look at all our variables.

When you set a breakpoint, you can see it on right side on the breakpoints tab as well.
Now our app is already running at this point and it's waiting for reqs to come in and now we can right click on the ndb window and then
click on 'Run this script' and it will then run the script again and then on the right side, that it says 'Paused on breakpoint' and so
all the code that is above that breakpoint, has already executed at this point and so we can now take a look at the variables by:
1) hovering on them.
2) at the end of each line, the values of variables are also shown
3) on the right side and in Scope panel

In Scope panel, you can also see the five variables that we have access to in all modules. Like: __dirname, __filename, require(), module,
exports, so these are the five variables that are available in eaach and every module and actually, when we execute the code like this(in the
debugger), we can see that our entire code is in fact wrapped into a function which is:
function (exports, require, module, __filename, __dirname) {<our code>}
So this wrapper function that gives us access to those five variables.

You notice that in app variable(which is basically the express application that we export from app.js) which is the express application variable,
we have a function(method) called _router and it has a property called stack which is the middleware stack that we have in our application.
There, we have some <anonymous> middlewares which are probably the middlewares that we created ourselves, like a middleware that has only
a log in it that says: "Hello from the middleware" and another one is the middleware that sets a requestTime property on req object.
Also you can see our routers there and inside each of them, you can see a property called regexp that specifies the route for which it applies.
So with this, we can see how an express application works behind the scenes.

In Global variables,(on right side), we have the process variable which is available everywhere and there we have process.env which is where
all our environmemt variables are stored.

So if a user just sends a request to api, if that line must be executed in order to send a response to the user, it won't and simply
the user won't get any response and request-response cycle will stuck at that line.
Now if you want to resume the execution of code after that breakpoint, you can use F8 (run script execution) button.
Which will continue the execution of code until next breakpoint(if there isn't any breakpoint after this breakpoint, it will run
the code till end.) and if there is no more breakpoint, our app would be really running.

You can set a breakpoint at the res.status(200)... line of the handler function that you will send a req to it, to see the variable values there.

So with debugger and breakpoint and seeing the value of variables, we can freeze our code in time, instead of using a lot of console.log()s.

if you pause the execution with a breakpoint and after some time, you resume the execution, in postman, the Time, would show all of the time that
it was hanging around and was waiting to get the response!

Learn: Remember that when you set a breakpoint earlier in the code , if you for example send a request to where the code that has a
 breakpoint must run, the response won't back until you remove that breakpoint. Because we basically stop the execution of further code in
 breakpoints. Right?

For checking if a function works correctly or not, you can set a breakpoint on where that function would be called and then step into it to
see the values, so if you want to see the values in limitFields function, set a breakpoint on the line that the limitFields gets called, so
on the line that we have limitFields() and after triggering that breakpoint, we know that all the lines before that breakpoint are already
executed and now we can use the step tool, so you can use step(F9) button to go to next line that gets executed, by each click on that button.
In ndb, the step tool will execute the next line of code after breakpoint. For example if our breakpoint was on this line:
...
.limitFields()
...
After finding the bug, you can correct the bug right in the debugger and then save and then it will come back to some lines before, so you
can hit step button to get to the line that the error happened previously to see the new value of that variable that had error.

You can also step our of the current function too, with it's specific button in step tools.

If we use step, the next line is the code that is inside the limitFields() method. So with using step tool on this breakpoint, we will
go to the first line of that method (the lines that this method has defined)*/
/* 113-3. Handling Unhandled Routes:
 */

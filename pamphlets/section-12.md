/* 177-1. Section Intro:
178-2. Recap Server-Side vs Client-Side Rendering:

170-3. Setting up Pug in Express:
Our pug templates are actually called views in express and that's because these templates are in fact the views in the model view controller architecture.
We already have the controllers and the model folders and so it's time to create the views folder.

The path we set in second arg of app.set('views' , <path>), is always relative to the directory from where we launchthe node application and that usually
is the root project folder, but it might not be, so we shouldn't use './...' there, but we should instead use the directory name variable.

171-4. First Steps with Pug:
Comments in pug:
// will still show the comment in html output
//- won't show the comment in html

unbuffered code is the code that is not going to add anything to the html output of pug adn we write that by placing dash and then the things that
we want to write! Like:
- const x = 0;
h2= 2* x

The third way is interpolation

172-5. Creating Our Base Template:

172-6. Including Files into Pug Templates:
I like to prefix the files that only serve for being included into other templates, with an underscore. Like a sass file that is being included into
another sass file.
You can use pug beautify to automatically beautify a pug file. For using it, you need to create a vscode command by hitting: cmd+shift+p and then
write pug and it will beautify the selected content.

173-7. Extending Our Base Template with Blocks:
With `extend`s we will be able to use the same base layout for every single page that we want to render.

Implement the routes for other pages. Do this like:
app.get('/overview', () => {...});

Now for each of the templates like overview and tour, we ONLY want to put the content for that SPECIFIC page. So we want no footer and no header and none of
the stuff that we have in base.pug , in overview page. So again, really the content for overview page.
The base.pug template is parent template of overview.pug . This process is called extending.
Whenever the overview template(child template) is rendered, we then take the base template(parent) and fill it up with the content of child template and
so we extend it.
For doing this, put a block in parent template and in where you want to inject the child template. Then in child template, first extend the base template and
then write the block content and then, as children of that block content, put your content of that page.
So in child template and when you say:
block content
  <... content of child template>
you're re-defining the content block of that base file template.
Learn: So by putting the same `block content`, in the overview.pug , we're re-defining that block
Note: Each file can only extend one other file.

So the base.pug is the skeleton that has all the html stuff, but not the specific content for that page.
So this is the opposite of including.

Learn: When a template extends the base template, the base template still has access to the locals(the variables that we passed into the templates that extend that
 base template!).*/
/* 174-8. Setting up the Project Structure:
Just like we did with our resources, I'm also gonna create a router and a controller for the views. So basically a file where I can put all the
routes that we need in order to build our dynamic WEBSITE(UI).
So create viewRoutes.js .

After adding some routes to router in viewRoutes, we need to mount that router to our app.

175-9. Building the Tour Overview - Part 1:

176-10. Building the Tour Overview - Part 2:
empty piped line: Whenever we need a real space between two inline-block elements, then we need to manually create that space using | , between the elements that
we want some space between them. Now after that pipe, you need to hit some tabs or spaces, to actually create that empty space.
So that pipe line basically creates a space for us where we can then create content outside of an element.
So: |<some tabs or spaces> will create some space.

177-11. Building the Tour Page - Part 1:
In pug, mixins are reusable pieces of code that we can pass arguments into. So a bit like a function and also it's exactly like mixins in sass.

178-12. Building the Tour Page - Part 2:

179-13. Including a Map with Mapbox - Part 1:
The mapbox library runs in the frontend.
The js folder in public folder is the js files that are specific to frontend and we're gonna integrate the files in that js folder in html files to run in the
client side.

In pug, when we extend a block, then the content inside that, disappears. But don't worry. There's another way of extending blocks
which will simply add the new content at the end or at the beginning of the block and we can say:
block append <name of block> . Now whatever we write in that block will then be appended to the content that's already in that block.
`append`  would add content at the end, `prepend` at the beginning.

Now one of the files in our client side needs some data about location of data of the tour that we're trying to display. How are we gonna do that?
You might say we can do an AJAX req(a call to our api) and get the data from there, but that's not necessary. Instead, in our tour.pug , we know that
we ALREADY have all the data about the tour itself and so we can simply put that data in the html file, so that the JS can then read it from there without sending
a client side request to api. So basically we're gonna expose the location data as a string in the html and our JS will then pick it up from there without
having to do any API call separately.
Important: So the trick to eliminate an AJAX req, is to use data attributes on html tags. We named it data-locations .
 So there's a nice trick in JS where we can specify a data attribute in html and then read that attribute using JS.
In html data attributes, we cannot have arrays or objects or anything like that and so what we have to do is to convert all of those data types into string
and that is easy, by using JSON.stringify() .

Learn: Whatever we put into a data attribute like data-locations, will then get stored into the dataset property and in this case, dataset.locations .

Eslint is configured for nodejs and not client side js, so we disabled eslint for mapbox.js .

We shouldn't put the mapbox.js script tag into the <head /> and it should be at the bottom of page.

180-14. Including a Map with Mapbox - Part 2:
We're using mapbox instead of google maps because google maps requires a credit card.

Use mapbox cdn.

It's good to have one token in mapbox for each project.

In mapbox studio, click on share and then 'use' and then look for the style url(it has to be a url starting with mapbox://).

Mapbox is exactly like mongodb in aspects to first requiring the longitude and then the latitude.

Now we need to put all the locations for a certain tour on the map and then allow the map to figure out automatically which portion of the map it
should display in order to fit all of these points correctly. So the first thing we need to do is to create a bound variable.*/
/* 181-15. Building the Login Screen:
When using catchAsync, we should always specify the next argument(third argument of middleware).

182-16. Logging in Users with Our API - Part 1:
Learn: By sending a request to login endpoint, our api will send back a cookie, which automatically gets stored in the browser and also automatically gets send back
 with each subsequence request.

Create login.js .

We're gonna bundle the js frontend files into one big js file. That's better for performance and a better developer experience.

In order to get access to the cookies that are in the request that was made to backend, in express, we need to install a certain middleware which is called
cookie-parser. Then use it in app.use() near where you use the body parser middleware.
The body parser middleware parses the data from the body and the other parses the data from cookies and now you can use req.cookies.

We can use the sent cookie from request, in order to protect our routes, so in protect middleware.
Right now, in protect middleware, we're only reading the json web token from the authorization header and only if it starts with 'Bearer' string. But now,
we also want to read the json web token from a cookie. So add an else if() block there. So if there was no token in the authorization header,
then let's take a look at the cookies of request.

So now with this, we're also able to authenticate users based on tokens sent via cookies and not only the authorization header.

For making a route only accessible to users who have a cookie, you can use protect middleware in viewsRoutes.js .

183-17. Logging in Users with Our API - Part 2:
In order to know if the user is logged in or not, we're gonna create a new middleware function.
Now you might think that our protect middleware also does sth similar and actually it is similar. But the difference is that one only works for
protected routes. But our new middleware function is going to be running for each and every single request on our rendered website.
The new middleware is only for rendered pages. So the goal there is not to protect any route and so there will never be an error in this middleware.
In this new middleware, the token should come from the cookies and not from an authorization header. Because for rendered pages, we will not have the
token in the header.

So again, for our entire rendered website, the token will always only be sent using the cookie and never the authorization header. That one is only for the api.

In the end of isLoggedIn middleware(in the end means, if the token is verified, if the user still exists and if they didn't change their password), in that case,
it means that there is a logged in user and then we make that user accessible to our templates and how we're gonna do this?
We can do res.locals() and put some stuff in there and then our templates will get access to them.

Learn: In a template file, we have access to res.locals , so whatever we put in res.locals, will then be a variable inside of those templates.
 So it's a little bit like passing data into a template using the render function.
 So this also provide data to templates:
 res.locals.<data> = <value>;

We don't need to write: req.user = currentUser; because we will put that currentUser on res.locals .

The conditionals in put are not powerful and so many times we use JS, but in this case, they are enough.

Learn: There are two ways to send data to backend:
 1) sending data using an http request(ajax), with fetch or axios or ...
 2) directly use an html <form>

184-18. Logging in Users with Our API - Part 3:
Placing multiple <script> for our frontend js files in the html files is not a good practice. We should only have one big js file which includes
all the code and for this, we use a module bundler like webpack. But webpack is a pain to set it up. So we can use parcel.

So run: npm i parcel-bundler --save-dev , because it's a development tool, we use --save-dev .

Then add some npm script like watch:js and in the npm script value, we specify what folder it should watch.

Many times, you will have different folders for the development and for the output, but in this case since it's a very simple architecture,
we're gonna put the bundle file right in the same place at the development files.

Now parcel will watch ./public/js/index.js file and if sth changes in there OR IN ONE OF THE DEPENDENCIES of that file, it will then bundle all of the files
together again into bundle.js .

Now only include the <script> for bundle.js in base.pug .

The index.js file is for get data from the user interface(website) and then delegate the actions into other modules.

We need to also install a polyfill which will make some of the newer JS features work in older browsers as well. So: npm i @babel/polyfill
and then import it in index.js .

Now for importing mapbox, we need to first create a function. So create and export displayMap function.

There's a problem with using the mapbox library together with parcel(which means we have installed the mapbox with npm and not a cdn link).
So we can not use mapbox npm library together with parcel.*/
/* 185-19. Logging out Users:
Let's look at a secure way of logging out users.
Til now, when we wanted to delete a user(logout?), we would simply delete the cookie from our browser by clicking the button on left side of
url and going to cookie and remove it. However, we created that cookie as an http-only cookie and that means that we cannot manipulate this
cookie in any way in our browser. So we cannot change it and we can also not delete it.

So if we want to keep using this super secure way of storing cookies, then how are he gonna be able to log out users on our website? Because usually with JWT
authentication, we just delete the cookie or the token from local storage. But well, that's not possible when using it this way.
For this, we're gonna create a very simple logout route that will simply send back a new cookie with the exact same name but without the token and so that
will then override the current cookie that we have in the browser with the one that has the same name but no token and so when that cookie is then sent along with
the next request, then we will not be able to identify the user as being logged in and so this will effectively log out the user and also we're gonna
give this cookie a very short expiration time and so this will effectively be a little bit like deleting the cookie but with a very clever workaround like this.

So again when we're doing token based authentication, we usually never need an endpoint like this, but when we want to send a super secure cookie like we do,
well, then we need to do it like this.
So create a function named logout.

So the secret is to give this new cookie the exact same name of the old cookie. When we're logging in the user, we send the token, but when we're logging him out,
we will send some dummy text and then we can set a very short expiration date like 10 seconds from now.

Also we're gonna set this new cookie to http only, but we do not need to set it as secure, because in this case, there is no sensitive data that anyone can get a hold of,
so no secure: true in this case.

By reloading the page after getting the successful logout response, will then send the cookie(the one that we received which has no token in it) that we just
got from /logout to the server and then we're no longer logged in and therefore our user menu will disappear.

By passing true to window.location.reload(); it will force a reload from the server and not from browser cache.

The jwt.verify() function would fail in isLoggedIn middleware, when we logout, because that json web token that the user receives after logging out,
would be a dummy text and not a valid jwt, so it's considered malformed(the jwt was not in a format that the algorithm of verify() expected) when we use jwt.verify()
after we send a request after the logout. So we didn't use the catchAsync() function in isLoggedIn, but instead, it then went straight to the local catch block which
will send the req to the next middleware in middleware stack.

That was all we have to do in order to logout a user from our website.

186-20. Rendering Error Pages:
Operation error: An error that we know, that we created ourselves.

By writing:
block content
  <content>
we're injecting the <content> into the content block in base template.

You could have one completely separate error handling middleware just for the API and one for the rendered website.

187-21. Building the User Account Page:
Let's put isLoggedIn middleware only for not protected routes in viewRoutes, because we get current user query, in BOTH of them. So that would be
duplicate if we put isLoggedIn and protect middlewares both for a route.

188-22. Updating User Data:
We want to allow the user to update both the name and the email address.
There are two ways in which we can do this:
1) submit a POST request to our API just like we did with the login form.
2) another way which is more traditional and normal way and in this way, we specify the POST method right on the form, along with the url where the
POST request should be sent to. So basically using this method, we don't need JS for doing the request, it automatically happens with the html form which will
then post the data to the url endpoint in our backend that we specified. I don't really like this solution, because it forces a page reload and
it also requires us to create yet another route and route handler in our backend and finally it also makes it a bit difficult to handle errors.

But it might makes more sense in the application that you're building. For example, your app might not even need an API and so in that case,
when you're only building a rendered website, then of course id doesn't make sense to submit forms using an api call.

There are different ways in which the data is actually sent, but the default one is called `url encoded` and it's gonna encode all the data that we're submitting
in the url a bit like a query string.

The first thing to do for doing the request by using approach 2, is to set action and method attributes on <form>
Then we need to specify the name properties on the fields that we want to send.

With the second way of sending requests, we need to implement yet another route for our api to handle it.

We need to add another middleware in order to parse data coming from a form. Let's do that in app.js and add this new middleware close to where you're using the
bodyParser(actually express.json()).

Important: Security tip: Only update data that you actually care. For example in updateUserData(), we only care about name and email, so we only use them and we're not passing
 the WHOLE req.body to the findByIdAndUpdate() update object, because some hacker could add some additional fields to the html and then submit
 data like passwords and ... and we don't want to store that malicious data into our DB.
 Also, passwords are once more handled separately, because remember that we can never never update passwords using findByIdAndUpdate() , because that's not
 going to run the safe middleware which will take care of encrypting our passwords and so that's why we have a separate route for that in our API and also we have
 separate form for that, in our user interface. So in most web apps, when you want to update your password, you usually have a separate form ONLY for that.

After submitting the data on our website, we want to come back to the same page that we were before bu of course with the updated data. So we need to
render the /account page again. But now, we actually also need to pass in the UPDATED user, because otherwise, the user that the template is going to use,
is the one that's coming from the protect middleware and that one is OLD, so we need to pass in the UPDATED user ourselves.

With the second approach, if we submit some invalid data that is invalid in the view of our backend logic, the backend will send some error and then
we're gonna go to a completely new page which is the ur; that we specified in action attr of <form> and this is a terrible UX.
So in our case, if we submit an email like: asdasd@qweqweqwe , this is a valid email in the eyes of google chrome but not the mongoose, so we will go to the
/submit-user-data on our site. This is not a good UX and this is why this approach is not good for handling errors. So we can use the api approach.

189-23. Updating User Data with Our API:

190-24. Updating User Password with Our API:
*/

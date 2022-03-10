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
*/

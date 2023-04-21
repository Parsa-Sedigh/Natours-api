/* 211-1. Section Intro:

212-2. Setting Up Git and GitHub:
git config --global user.name "<name>"
git config --global user.email "<email>"

213-3. Git Fundamentals:
Why we first have to add the files to the staging area and only then, they can be committed?
The quick reason for that is that you might want to add different files for different commits. Imagine you changed 10 files but only want to
commit five of them to a certain commit and so by staging, you can do that.


214-4. Pushing to GitHub:
Checking the "initialize this repo with a README" option on github is not a good idea because by doing it, that would then create conflict a bit later on.
So we really want the new repo that we're creating on github to be brand new and completely empty.

215-5. Preparing Our App for Deployment:
A package that's gonna compress all our responses. So whenever we send a text response to a client, no matter if that's a JSON or html code,
with the compression package, that text will then be dramatically compressed. So run: npm i compression.

Calling compression() , will RETURN a middleware function which is gonna compress all the text that is sent to clients. So this is not gonna working for
images, because these are usually already compressed. For example a JPEG format is already compressed and once our website is deployed, we will then test if this
compression is actually active.

Now remove the most of console.log()s and that's because those logs will end up in our hosting platform logs.

Since the api and the website are hosted on the same server, sth like this '/api/v1/users/login' for url in client side, we'll work fine. So doing it like this,
is a bit like specifying the path to images in the HTML. For example in the overview.pug , we use this kind of url for <img /> tags.

This only works because the API and the website are using the same URL. So we're hosting them on the same place. But if you were hosting your website
or your frontend on one URL and your API on another URL, it wouldn't work like this.

Now for client side JS, we need to create our final bundle which will created by using build:js which is different by using watch:js which don't have any
compression or any performance optimization.
So run: npm run build:js and then you see it's compressed.

216-6. Deploying Our App to Heroku:
First, we need to install heroku on our computer, for mac, you can do it with brew.

Now let's start by logging into heroku on our command line and that is gonna work, because of the installation that we just did.
Run: heroku login
Sometimes logging in doesn't work on the first try. So just run ctrl + c and try that again.
Now create a new project on heroku, but before that change start npm script, because heroku uses start npm script to startup application.
In prod, we don't want to start app with nodemon.
Then commit package.json.

To create a new heroku project in our project folder, make sure you're in the root directory of project and then run:
heroku create
This will create a new remove branch in our git repo and this branch is called heroku.
So now the process of deploying our app is pushing our code to that remote branch. So: git push heroku master. Note: The master branch is the only
branch that with it, deployment works.

Now in order to open app, run: heroku open . Now this doesn't work yet because all our env variables are not defined. Because we excluded config.env from
our git repo.

heroku logs --tail to see error logs of your app in production.

Now let's define env variables by specifying each env variable using a special heroku command. So heroku and other hosting platforms,
they don't use a .env file like we did here in development for all our config variables. So again, in dev, we use config.env , but in heroku,
we will define them in a different way but then in our code everything that we have works exactly the same.
Run: heroku config:set <name of variable>='<value>' like: heroku config:set NODE_ENV=production and actually this NODE_ENV variable is actually set
by default to production by heroku. But still let's make 100% sure.
Note: Don't set PORT env variable with this command because heroku will behind the scenes, assign a random port to our app.
Now set other env variables that we have in config.env with this heroku command. Also don't set the EMAIL_... env variables because all of those
env variables are for mailtrap and we don't need that in production, because that when we're in prod, our emails are sent using sendgrid and not
mailtrap. But we do need EMAIL_FROM to be set.

Let's change the name(sub domain) of our app. Instead of doing this in heroku dashboard, we do it directly local computer, because changing it in
dashboard would mess up our app in terminal on our local computer.
Run: heroku apps:rename <sub-domain like x> so now in prod, we would have: x-herokuapp.com

Also let's update the postman env variable for conduction. So set values of URL env variable of postman in prod to the url of your app(set both
initial value and current value). They need to end with / .
Now do some requests in prod natours mode.

For testing compression, search for: test gzip compression and go to giftofspeec and enter your site url.

217-7. Testing for Secure HTTPS Connections(with heroku):
The fact that we're in production, does not mean that connection is actually secure. Because of course, not all deployed apps
are automatically set to https. So we need to change if (process.env.NODE_ENV === 'production') in createdAndSendToken.

We can use the express's req.secure , but on heroku this doesn't work and that's because heroku proxys, so redirects or modifies all
incoming requests into our application, before they actually reach the app. So in order to make this also wrok on heroku, we need to ALSO test
if the x-forwarded-proto is set to https. So we also need to set that in if statement. This is sth very heroku specific.

Now we also need to make our application trust proxys. Again, req.secure doesn't work in the first place. Because heroku acts as a proxy which kind of
redirects and modifies incoming requests. So in app.js , trust proxys by saying app.enable('trust proxy'); which is built-into express.*/
/* 218-8. Responding to a SIGTERM Signal:
Let's do another heroku-specific configuration which is to respond to sigterm signal that heroku emits. A heroku dyno(a name that heroku uses for a
container in which our app is running), restart every 24 hours in order to keep our app in a healthy state and the way heroku does this is by sending
a so called sig term signal to our node app and the app will then shut down immediately. This shutdown can leave reqs that are currently being processed,
hanging in the air. So that's why happens also when there is an unhandled rejection. We gracefly shut down the server whenever there was
an unhandled rejection and we do this in server.js .

server.close() closes the server but before that, still handle all of the pending requests, so that's what we want instead of an abrupt finishing of the
app.

In this case, we do not use process.exit() because the SIGTERM itself will cause the app to shut down. So we don't need to do it manually.
SIGTERM is a signal that is used to cause a program to really stop running. So a polite way to ask a program to terminate.
To test this on prod, first commit and push files. By using git push heroku master (we don't need to use git push command).

To look at the dynos ru: heroku ps .

Now in order to restart, run: heroku ps:restart .



219-9. Implementing CORS(Cross origin resource sharing):
Let's say we have our api at natours-jonas.herokuapp.com/api/v1 and then some other website, for example at example.com , is trying to access
our api. So basically trying to call natours-jonas.herokuapp.com/api/v1 url and this is called a cross-origin request. Because herokuapp.com is a
different domain than example.com and therefore if example.com is trying to access herokuapp.com , it will be a cross-origin req.
Now usually cross-origin requests are not allowed and will be default fail, unless we implement CORS and since we want to make our API available
to everyone, we definitely need to implement that.

Now if you try to do a http req from the CONSOLE of browser to the api which is on natours-jonas.herokuapp.com , it will also
be a cross-origin req.
So in console of browser say:
const x = await fetch('natours-jonas.herokuapp.com/api/v1/tours'); and now we will get the cross origina request.
So by default, a cross-origin req will always be blocked.
This only applies to reqs made from the browser for example by using fetch or axios. That means from the server we will always be able to make
cross-origin reqs without any problems.
So there are no restrictions on the server, but really on the browser, for security reasons.
In order to be considered cross-origin, a request might come from a different domain, but also a from different subdomain, a different protocol or
even a different port.
For example api.natours.com is our api and we do a req from natours.com , that would be also a cross-origin request.
Since we want to allow other websites to access our api, let's implement cross-origin resource sharing.
Install cors package.

Calling cors() will return a middleware function, which gonna add a couple of headers to our response.

In order to ONLY enable CORS for a specific route, for example say:
app.use('/api/v1/tours', cors(), tourRouter);
But in this case, we want to allow it everywhere.

If we don't want to allow everyone(any origin) to consume our api, but we want to be able to have the API on one domain or even one subdomain and then
have our frontend app on a different domain, for example api at api.natours.com and frontend app at natours.com , so in this case, we need to
allow from that natours.com origin. In this case we say:
app.use(cors({
  origin: 'https://www.natours.com'
}));
With this we would only allow https://www.natours.com origin to send requests to our api.

Now our cors() only works for simple requests and simple reqs are GET and POST reqs, non simple reqs are PUT PATCH and DELETE or also requests
that send cookies or use non-standard headers and these non-simple reqs require a so-called preflight phase.
So whenever there is a non-simple req, the browser will then automatically issue the preflight phase and this is how that works:
Before the real req actually happens, let's say a DELETE req, the browser first does an options req in order to figure out if the actual req
is safe to send and so what that means for us devs, is that on our server we need to respond to that options req and options is just another
HTTP method like GET POST and ... .
When we get one of these options reqs on our server, we then need to send back the same Access-Control-Allow-Origin header and this way the browser
will then know that the actual req and in this case the DELETE req, is safe to perform and then executes the DELETE req itself.

Again, we need to respond to options req, because the browser sends an option req, when there is a preflight phase.
To handle or respond to options req, we use: app.options() in app.js and the handler is cors() .
We could allow options req on '/api/v1/tours/:id'.
So let's say that someone does a DELETE or a PATCH req for one of the tours and only there we allow a preflight phase(which is related
to a cross-origin req). So only on '/api/v1/tours/:id' route , these complex reqs can be done. So only the tours could be deleted or patched from a
cross-origin request and none of our other resources.

By specifying node engine in package.json to be sth like: "node" : ">=10.0.0" , it would cause some problems when we specify the version like this.
So allowing versions to install that are greater than the version that we're currently running. So say only version 10 and not version after that.
So: ^10 which means npm is allowed to install any of the subversion or patch versions(semantic versioning), but not bump up to the next major version.

Now let's redeploy app. For example if you're on version 16, use: "^16" as node engine version.

Now you can send a req to our ap from console of browser.
So we're now able to perform cross-origin reqs(do these reqs on prod environment of postman or prod url of site).

220-10. Finishing Payments with Stripe Webhooks:
*/

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

217-7. Testing for Secure HTTPS Connections:
*/
/* 218-8. Responding to a SIGTERM Signal:

219-9. Implementing CORS:

220-10. Finishing Payments with Stripe Webhooks:
*/

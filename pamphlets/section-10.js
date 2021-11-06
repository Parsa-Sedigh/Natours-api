/* SECTION-10:10. Authentication, Authorization and Security:
125-1. Section Intro:
Authentication and authorization is all about users signing up and logging into our app and then allowing them to access certain protected
parts of the app that are not accessible to non-logged in users.
To implement authentication, we use a technique called json web tokens or JWT, which are perfect for the api that we're building.

126-2. Modelling Users:
Authentication and authorization are all about users signing up, logging in and accessing pages our routes that we grant them
permission to do so. So it's really all about the users. So we need to start by implementing the user model, so that we can create
new users in our DB. So create userModel file. Then we need to create a schema and then create a model out of it.

When we set a field with required: true the request must contain that field with it's value.
We didn't use a username property for user to login, because he will use it's email instead of username for login. So we didn't create a username
property in user schema.

The email field is a unique identifier of each user so it must be unique for each user.
Learn: By default emails should be unique. But let's be 100% sure with this. by using unique: true in email field so there will be no accounts
 with the same email.

Remember: lowercase: true is not a validator. All it's do is to transform the value of that field to lowercase.
Photo field is usually optional in most web applications.
We used validate property for email field, and there we're gonna basically testing if the provided email corresponds to the common email format.
So for example jonas@gmail.com.de and jonas@gmail won't be valid email addresses by using validator.isEmail (the validator package).
Also test@jonas.i is not a valid email, because there are no domain names with only one letter.

Note: We create docs out of MODELS.

Learn: If a user wants to upload a photo, that photo will be stored in our filesystem and the path to that photo will then be stored
 in the photo field in database. Like imageCover in tourModel file which is the path of the place in our file system where the image is actually uploaded and
 stored.

Many apps have all these crazy rules for choosing password like at least one number and one character and one symbol, we're not gonna implement them
here, because actually it has been found that that's not really effective.
Usually the most secure passwords are the longest ones and not the ones with some symbols or crazy characters. So longer password
would be more effective than some symbols.

For now that's enough for password field, but we're gonna create some more specific fields for password field in userModel, when we start to like manage
passwords in the DB.

When you create a new account on some web app, you always need to put in your password and then confirm it just to be sure that they are the same and so
that's what the passwordConfirm field is for.
Later we must also use a validator to see if the passwordConfirm field is the same as password.

Now we need to create the model out of the userSchema. We pass the name of model to first arg of mongoose.model() .
Model variables are usually start with capital letter.*/
/* 127-3. Creating New Users:
We will do most of the user-related stuff like creating new users, logging users in or updating passwords in the authentication
controller. So all of the stuff that are related to authentication are not gonna be in userController file that we created before, but
instead we will create an authentication controller file. So all the functions that are related to authentication will go there.

In authController.js , for creating a user, we didn't name the function that do the creating user, createUser like what we kinda did in
tourController file but instead we named it `signup`. Because that's the name that has a bit more meaning in the context of authentication
and that would be an async function because we're gonna do some db operations in that function.

How we create a new doc based on the model? We use: const <a variable> = await <model name>.create(<an object of data which the user
should be created from that data>);
<model>.create() would return a promise so we must use await on that.

In the JSON that we send back to the client, the data property which it's value is an object is called envelope, so the property that is gonna
contain the data itself.

When we have an async function, we REALLY need to think about it's error handling. So we use try catch blocks or we use catchAsync
function that we created before. So all of the functions that are async, are wrapped into that catchAsync() function, so that we don't have to
write the try catch block in each and every function there.

The user resource is a bit difference from all of the other resources. Because it really has to do with all things authentication and
so we have a different controller for authentication itself and also the function names in that authController, also have some different names,
so we will also have a special route for authentication.

Recap: We know that authentication would be used for users resource but it has a separate route from users resource and also separate
functions for handling authentication for users resource and therefore we won't write authentication code in users route handler functions
and we will separate the code for authentication into it's different route handler functions.

So we have to use router.get(). ... inside the userRoutes file, but that router is for authentication although it's in
userRoutes file.
Also as you can see, currently we didn't use router.route(). ...  for authentication routes. Because we don't have other routes, so
with route() we could briefing the route path for all routes. Currently we don't use that.

So as you can see, this '/signup' endpoint is really kind of special endpoint. Because it doesn't fit the REST architecture. Because in this case,
it doesn't make much sense.
We said, in special cases, we can create other endpoints which do not fit 100% with the REST philosophy. Because as you can
see the name of the url('/signup') is related to the action that would be performed. So it's not based on REST philosophy.
But in the tours routes or other user routes, the name of the url has nothing to do with the action that is actually performed(the action that
user wants to do). So for example '/' has nothing to do with getAllTours or createTour. But in routes for users, '/signup' is
related to the action that user wants to do which is signing up in our application.

ALSO for tour routes we use different HTTP methods(verbs) for a common route like '/' (which makes it more REST architecture like)
but in users routes we only need POST for the '/signup' route and we can't and shouldn't use other HTTP methods for this route.
Because it doesn't make sense to have GET(get data for signup), PATCH (so patch a signup) request for a url called '/signup'.
Because the meaning of sign up is register and for register we use post(SEND data)
http method and not get or patch because the user must create a document and also send some data so we must use only post.

In addition to '/signup' and other future routes for non restful routes in users routes, we will keep the routes that were
implemented based on REST philosophy.Like .route('/').get(userController.getAllUsers) and other old rest based routes and their
handlers. Because there's also some possibility that the system administrator would want to update or delete or create a users
based on their id. So because he is admin and doesn't need authentication, we keep these routes which haven't authorization.
So it's not the admin who would signup the user or login the user. It's the user itself who would signup and ... .

The functions that are about authentication are basically the functions that are only relevant for the user itself. So it's not an admin that is
gonna signup a user or it's not an admin that's gonna login a user, but instead, it's the own user that's gonna signup himself, or login himself.

In database we shouldn't see the plain passwords of our users. Even if we're the admin.
Learn: In web applications, passwords should never ever be stored as plain in the db.
So there's a lot of password management that needs to go on behind the scenes, so let's do it in the next video.*/
/* 128-4. Managing Passwords:
We're gonna manage our user's password in the db and by that I mean:
First we need to validate if the inputted password is equal to the confirmed password and we do it in confirmPassword field in
the users schema and then also we need to encrypt the password in db, in order to secure it against attacks.

The first thing that we're gonna do, is to validate if the two inputted passwords are the same and the best place to do that, is in the
passwordConfirm field and so let's write our custom validator for that.

The callback function that we specify in validate object in confirmPassword field would be called when the new document is gonna
be created.
For value of validate property, since we want to create a function and also an error message, let's open a new object for the value and then in there,
we write the validator property which is gonna be the function and also a message property.
For value of validator property, we need to specify a callback function which is then gonna be called when the new document is created.

Important: In validate object and in our validator CUSTOM function which is inside validator property we cant's use an arrow function.
 Because we need `this` keyword.
 In validator function, we return either true or false and if the return value if false, it means we would get a validation error and if it's true,
 then not(validation will pass). and in this case we want to say if current passwordConfirm is equal to the current document's password(this.password) ,
 then return true.

Learn: For accessing current document which we are currently validating it in the validator custom function, you can use this keyword.
 Also for accessing the field value that the validator is inside that validator, you can pass an arg to the custom validator function and
 receive it. For example, in this case we are passing el to the custom validator which this custom validator is in passwordConfirm
 field. So el would be the value of passwordConfirm in the current document.
 Also instead of el, you could use this.passwordConfirm . All of this would work ONLY IN SAVE(when we use a custom validator,)!!!
 So because of this reason, whenever we want to update a user(or any other resource), we have to use save as well and not for example findOne() and
 update() like we did with our tours. So keep in mind when you want to update, because:
 for example, let's say that we updated the user's password with just a regular update method. Then in that case, that custom validator in
 passwordConfirm property would no longer work.
 So again, the validators work when we create a new doc like <model>.create() method, or on <model>.save. So for example:
 const newUser = User.create(req.body); for this one, the validators gonna work and in fact, we can also use User.save() in order to update the user.

Now let's try this validation.

Validator package also checks for domain names, so a domain with just one word like: i, o or ... are not acceptable.

In authentication we never store plain passwords in a db. Because imagine that for some reason, a hacker gets access to the database, if then,
the passwords are stored in plain text in there, then he can simply login as any user and then do whatever he really wants and cause a lot of damage.

For implementing encryption, we do it in model files and not controller files. Because in encryption we are really working with
data itself and so it should be in the model and not in the controller. So again, keep the fat models and thin controllers.

For doing encryption for passwords, we can use mongoose middleware . For encryption we would use pre-save (pre-hook save) middleware.
So basically document middleware. We define the middleware on the schema.
Learn: Why we used .pre() middleware? Because in .pre() , the action(in this case, the encryption action) would be happened between the moment
 that we receive the data and and the moment that the data is persisted to the database. That moment is when the pre save middleware would run.
 So between getting the data and saving it to the database. So that moment is the perfect moment to manipulate the data, like encrypt the password and ...

With the next arg in function of .pre() we can call the next mongoose middleware.

We only want to encrypt(hash) the password, if the password field has been updated. So basically only when really the password
is changed or also when it's created for the first time. Because imagine the user is only updating the email. Then in that
case, we don't want to encrypt the password AGAIN! So we must use isModified() mongoose method.
isModified() is a method in mongoose which is available on all of the documents that checks if a certain field has been modified and
in the () of this method, we pass the name of the field that we want to check if it was modified.

Hashing means encryption.

In mongoose middlewares, if you were defined the callback function with function keyword and not with arrow functions, the
this keyword points to the current document.

Remember: return next(); would exit the function and go to the next middleware mongoose. But:
return;
next();
would only just exit the function and won't execute next() . Because when we use return , further code in that function won't
executed. Therefore we used return and next() together in this case.

It doesn't matter we use else in this case, because if the first if statement runs, the further code won't run so there is no need
of else in this case.

In the end we need to delete the confirmedPassword. Because at this point, we only have the real password in hashed version.
How we can delete a field from a doc in db? We set it to undefined.
Important: So we only need the passwordConfirm for the validation and after the validation was successful, we actually no longer need that
 field. So we don't want passwordConfirm to be persisted in db. So before the saving it to db, we set it to undefined.

Important: We set the passwordConfirm field to be required in schema, so how we can set it to undefined? Set a field to be required
 in schema, means it's a required INPUT and not is required to be persisted to the database. So the passwordConfirm field would never
 persisted to the db. Because before saving the data to db, we set passwordConfirm to undefined.

Also passwordConfirm field is not in the result of sending the data of newly created user to the client. Because it didn't get to
the database.

bcrypt algorithm will first salt and then hash our password in order to make it really strong to protect it from bruteforce attacks and so that's the
whole reason why encryption needs to be really strong. Because bruteforce attacks could try to GUESS a certain password,
if that password isn't very strong encrypted and remember how I said that Bvrypt will salt our passwords and that means that bcrypt
will add a random string to the password, so that two equal passwords do not generate the same hash.

bcryptjs is a bcrypt implementation for javascript. But when you want to require this package you must use bcryptjs and not bcrypt.
So: npm i bcryptjs .

The second parameter of .hash() is cost parameter and we could do this in two ways. The first way is to manually generating the salt,
(salt is a random string that is gonna be added to our password or any field) and then use that salt in the hash() function.
But instead to make it easier, we can also pass a cost parameter to hash() function. The cost parameter is basically a measure of how
CPU intensive this operation will be. The default value for it is 10. More cost para, the more cpu intensive the process will be and
the better the password will be encrypted.

hash() function is an asyncrounos function, but there also a sync version.
Important: But we don't want to use sync version because that would block the event loop and then prevent other users from using the
 application.
So because it's async function, it would return a promise.

Recap: In this.password = await bcrypt.hash(this.password, 12); , we want to set our current password, to the encrypted version of the original password with
a cost of 12, so not to make it too easy to break the password, but also not to make the application take too long for encrypting the password.
With this, we encrypted the password.
Now in the end, we need to delete the confirm password, because at this point of time, we only have the real password hashed. So we say:
this.passwordConfirm = undefined;
Why?
Ask yourself, how we delete the field, so not to be persisted in the database?
We set that field to undefined.
So we really ONLY need that passwordConfirm, for the validation that we implemented before in the validator function in the schema object. So just to make
sure that the user actually inputted two equal passwords, so that he doesn't make any mistakes with his passowrd, and so after this validation was
successful, we actually no longer need this field, so we really do not want to persist it to the datbase and so that's why we set it to undefined in
that pre save hook.
Now you might wonder, why this works? Because we actually set passwordConfirm to required? right?
But that means that it's a required INPUT, not that it's required to actually be persisted to the database. Okay?

Even if two users use exact same passwords, their encrypted passwords which are in db are very different and that's the power of
salting the values (in this case passwords) before hashing them.

Now if you signup, you see the encrypted version of the user's password and also you don't see the passwordConfirm field in the response.

So now we stored user in a secured way in our db.

Remember to delete the use's that you created for test who has a plain string as password.

We implemented a secure password management.*/
/* 129-5. How Authentication with JWT Works:
Now we wanna implement user authentication and authorization. In simple terms, the whole workflow of logging users in and allowing them
to interact with certain protected resources that not logged in users cannot access

-- How Json web token(JWT) authentication works:
There are many authentication methods. But the one we're gonna use is a modern and secure approach called json web tokens.
Json web tokens are a stateless solution for authentication. So there is no need to store any session state on the server, which of
course is perfect for restful APIs. Because remember, restful APIs should always be stateless.
The most widely used alternative to authentication with JWTs is to just store the user's login state on the server using sessions.
But that not follows the principle that says: restful APIs should be stateless an d that's why we're opting for a solution like JWTs.

Let's take a look at how authentication works with json web tokens.
Let's assume that we already have a registered user in the db.
This is how user logs into app: the user(client) starts by making a post request with the username or
email and the password in body of request. Then the application checks if the user EXISTS and if the password is correct and if so,
a unique json web token for ONLY that user is created using a secret string that is stored on the server and the JWT itself, is really just
a string. Then the server sends that JWT back to the client which then will store it either in a cookie or in local storage
and just like this, the user is authenticated and basically logged into our app WITHOUT LEAVING ANY STATE ON THE SERVER.

So in fact the server doesn't know which users are actually logged in. But of course the USER knows that HE'S logged in because
he has a valid json web token which a JWT is a bit like a passport to access protected parts of the application.

Recap: A user is logged in as soon as he get back his unique valid json web token which is not saved anywhere on the server.
Therefore that process is completely stateless. Then, each time the user wants to access a protected route, like his user profile data,
he sends his json web token along with the request. So it's like showing his passport to get access to that route.
Now, once the request hits the server, our app will then verify if the json web token is actually valid(so if the user is really who he says
he is and more about how this step works a bit later in this vid). Now if the token is valid, then the requested data will be sent to
the client and if not, then there will be an error that tells the user that he's not allowed to access that resource or route and as
long as the user is logged in, this process is how it's gonna work EACH time that he requests data from any protected route.

All of this communication must happen over https(so secure encrypted http, in order to prevent that anyone can get access to passwords
or JWTs. Only then we have a really secure system.)

This is all you need to know in order to be able to implement authentication using JWT.
let's now dive into how the JWT itself actually works.

-- What a JWT look like
A JWT looks like the left part of screenshot which is taken from JWT debugger at jwt.io .

A JWT string is an encoded string made up of 3 parts. The header, the payload and the signature.

The header is just some meta data about the token itself and the payload is the data that we can encode into the token (really any data
that we want, we can encode it ). So the more data we want to encode here, the bigger JWT would be.

These 2 parts are just plain text that will get encoded, but not encrypted! Therefore anyone will be able to decode them and read them.
So we can't store any sensitive data in there. But that's not a problem at all. Because in the third part or signature we can solve that.

The signature is created using the header, the payload and the secret which is saved on the server and this whole process of creating the
signature with those mentioned things is called signing the json web token.

So again the signing algorithm takes the header, the payload and the secret to create a unique signature. So only this data, plus the secret, can
create this signature. Then, together with the header and the payload, the signature forms the JWT, which then get sent to the client.
Now once the server receives a JWT to grant access to a protected route,
it needs to verify it, in order to determine if the user really is who he claims to be. In other words, it will verify if no one changed
the header and the payload data of the token. So again this verification step will check if no third party actually altered either the
header or the payload of the JWT. So how this verification actually works? Once the JWT is received by the server, in verification process,
the verification, will take it's header and payload and together with the secret which is still saved on the server and basically we will create a
test signature. But the original signature that was generated when the JWT was first created is still in the token, right? and that's the key
for this verification. Because now all we have to do is to compare the test signature with the original signature and if the test signature
is the same as original signature, then it means that the payload and the header have not been modified. Because if they HAD been modified,
then the test signature would have to be different, therefore in this case where there has been no alteration of the data, we can then authenticate the
user and of course, if the two signatures are actually different, well, then it means that someone tempered with the data, usually by trying to
change the payload.
If they aren't same, that means someone tampered with the data. Temperation of data is usually done by changing the payload.
But that third party which manipulated the data, of course doesn't have access to the secret. So they can't sign the JWT. So
the original signature will never correspond to the manipulated signature(data?) and therefore the verification would always fail in this case.

So without the secret no one will be able to manipulate the JWT data, because they can't create a valid signature for the new data.
I mean they could manipulate the data, but it's signature will always fail in the verification step.*/
/* 130-6. Signing up Users:
Previously we already implemented a simple signup functionality, but now, we will also log the user in, making it more real signup process(so after
signup we need to also login the user by default).
So from this lecture, we will really start to implment our authentication.

Authentication is very hard to get right and many tutorials about authentication with nodejs and express, make many mistakes and oversimplify things that
shouldn't be simplified.
We need to be extra careful when writing this part of the application, because remember, our user's data is at stake here and the trust in the
company who runs the application is at stake as well and so implementing authentication is a real responsibility, where you should not make any mistales
at all.

Now there are some libraries that can help us implement authentication and autherization, and the most well known one is called passport. But even a
libabry like that doesn't take all the work and all the responsibility away from you.
Now in this case here, we're gonna implement the whole login, protecting and authorization logic all by ourselves, except of course for the json web
token implementation that we talked about. So all the signing and verification, all that stuff, we'regonna leave to the jwt library, but then the rest,
we're gonna implement ourselves.

We already have our signup function in authController, but right now all it does is to create a new user and then send it back to the client.
There is a very serious security flaw in this way of signing up users.
Basically the problem is that right now we create a new user using all the data that is coming in with the body and the problem here is that like this,
anyone can specify the role as an admin. So basically everyone can now simply register as an adimn into our app. This is a serious security flow.
To fix that, I commented out the initial code, so I commented out:   const newUser = await User.create(req.body);
What is the difference?
With that new code, we only allow the data that we actually need, to be put into the new user, so just a name, the email and then the passwords(and then
in that pre save hook in userModel, we will make the passwordConfirm field to undefined, so we don't save that field to db, we just need it initially).
So now even if a user tries to manually input a role, we will not store that into the new user. and the same for other stuff, like for example a photo.
Now what this will do, is that we can actually no longer register as an admin and so if we need to add a new administrator to our system,
we can then just create a new user normally and then go into the mongodb compass and edit that role in there. So edit it from user, to admin manually.
Of course, we could also define a special route for just creating admins but that would be a bit too much.

Usually when we signup for any web application, then you also get automatically logged-in , so let's implement it in signup() function of authController .
So log the new user in, as soon as he signed up. All we need to do is to sign a json web token and then send it back to the user.
But first of all we need to install the npm package that we're gonna use for everything related to json web tokens.
So: npm i jsonwebtoken

The first function we're gonna use with jwt is sign() . So in order to create a new token and for that of course we need the payload, we need the key, so
that private secret that's only stored on our server and that we need to sign the token and then we can pass on some options.

We also have verify() . We talked about the verification process and that's basically implemented in this function and this is the one we're gonna use
when logging in a user.

So this package really only includes the two functionailites that we discussed in the previous video, so signing and then verifying.

Now use jwt.sign() in signup and we need to pass it the payload which is an object for all the data that we want to store inside of the token, and
in this case, we really only want the id of the user and we get the id from the new user that was just created.
In mongodb the id is actually called _id .

For second arg, we need the secret. Let's put a placeholder for secret and use 'secret' string as our secret. That is kind of a placeholder.
Because actually our configuration file is a perfect place to store this kind of secret data, so just like password for example and therefore
in config.env create a variable called JWT_SECRET.
Now using the standard HSA256 encryption for the signature, the secret should at least be 32 characters long. But the longer, the better actually and
this is where many tutorials out there fail, because they put a very short string there as the value of that JWT_SECRET env variable. So for the best
encryption of the signature, you should at least use 32 characters. Don't use the tutors secret because that could become a security issue for your app.
Always use a unique secret for your apps and never the same and especially not the oen from someone else!😃

At this point, we have the payload and we have the secret passed to sign() , the token header will actually be created automatically, but now we can
pass some options. The option we use is when the JWT should expire and it means that after the time that we're gonna pass in as option,
the jwt is no longer gonna be valid, even if it otherwise would be correctly verified. So this is basically for logging out the user after a certain
period of time, simply as a security meassure. Let's define that expiration time also as a configuration variable in config.env and I named it
JWT_EXPIRES_IN and for it's value, we can use a special string like for example 90d and the signing algorithm will then automatically figure out
that that means ninety days, the other examples are: 10h 5m 3s ... and these numbers will then be treated as milliseconds. It is good to use <value>d,
so some DAYS. So after 90 days, the jwt will no longer be valid, even if the signature is correct and everything is valid. So again, just like an
additionaly security meassure. and this option will then add some additional data to the payload, but that's no problem.

So we just created the token, now all we need to do is to send it to the client, so include it in the res.status().json() .

That's all we need to do to login a new user, because right now we're not checking if any password is correct or if the user actually EXISTS in the
databasae, because there in that case, the user was really just created!😃 and so right away, we log the user into the appby sending a token to the client
and the user's client, should then in some way store that token, just as we talked about in the previous lecture.

Now test the signup endpoint by creating a new user which should also log the user in by sending a token to client.

Because your secret is also not the same as tutor, your jwt would be different than him.

Now you can copy that token and in jwt.io and in debugger, put the token in encoded input and maybe right away you see that our signarurte is invalid(the
Encoded input is red or down there, it says: Invalid Signature), but that's because the sign() function edits those iat(issued at) and exp(expiration time)
properties, because we specified an expiration date basically. So if you remove those two properties there, you will see that now the signature is
verified. There, the header is visible, so it's easily decodable and you see it has two properties that we didn't specify any of them ourselves and
it was the jsonwebtoken package that did it for us(created those properties in header of token).
you can not see the signature there, because of course our secret is really a SECRET 😃(only us should know it).

So now we're able to log users in BUT only if the user just signed up(new user), because in that case, we do not need to verify the email in the database
and also not the password.

Next, we will log in users based on their email address and their password.*/
/* 131-7. Logging in Users;
We're gonna implement the functionality of logging users in, based on a given password and email address.
Important: The concept of logging a user in basically means to sign a json web token and send it back to the client.
But in this case(login the user in and not signing him up), we only issue the token, in case that the user actually exists and that the password is
correct.

Create a function(which in this case is also a route handler) named login in authController.

By writing: const email = req.body.email; ; eslint gives us an error that says: Use object destructuring. Why it does this?
Since the name of the property(email property of body object) is the same as the variable name that we choose to store it, we can simply
do it like this and get rid of the property name: const {email} = req.body;

This is how user is gonna send in the login credentials for us to check. This check process is:

By creating a new AppError() , our global error handling middleware will then pick it up and send that error back to the client.

Sending the user info in response of login is not necessary, so I didn't include it in res.status(200).json({...}) there.*
All we want as a response for logging in is the token(that's all that matters when the user logs in).

When there is an error there, remember to use return keyword with calling next(new AppError(...)) . Because after calling the next middleawre,
we want to make sure that that function that has an error, finishes right away and any other code in there, won't get executed.
If you don't use return there, we would see this error: Cannot set headers after they are sent to the client. Because we sent two responses,
first the error response and then also the res.status.json() in login , which shouldn't have done. So we use `return` to fix that.

Next(second step), let's check if there actually is a user for the email that was posted. We used findOne() there, because this time we're not
selecting a ussr by _id , but instead by it's email and therefore we need to pass in that filter object to findOne() .

For security, where we signup a new user, in the user object that we send back to the client, we send the password too, in it's encrypted version of
course, but still, it's not a good practice to leak the password data out to the client. For example if we had our get all users there,
then all of them would have the password visible and we don't want that.
To fix this, we need to set `select: false` for password field in userSchema and like this, it will automatically never show up
in any output. BUUUT!😅 Still, when we create a new user(signup), it would also be included in the response. Why?
Because we just created that new document(user) and therefore, it's NOT REALLY SELECTING it, because we're not actually reading it from the DB.
So let's quickly implement get all users route to see if we see the password field in that route or not(so to prove my note that I said when we create
a doc, we would see a field with select: false and when we GET docs, those fields with select: false, won't show up).

So create getAllUsers() route handler. We place getAllUsers() in userController, because getting all the users has nothing to do with authentication
and so in this case, the userController is the perfect place for placing getAllUsers().

Hit command + d to select all of the occurances of a word in vscode.

Since getAllUsers() is an async function, we need to wrap it in catchAsync() (also don't forget to pass next() to getAllUsers()).

Now we see the password field of users, when we GET them, is not included because of select: false and this is crucial, because now in
authController and in it's login and then in User.findOne({email}) , it's result will now also not contain the password field. So the output
of this will also not contain the password field. BUT! we do need the password in order to check if it is correct and so, we need to EXPLICITLY
select it as well, remember that we used select() to select a couple of fields from the database, only the ones that we need?
Now in this case, when we want the field that is by default not selected(because of select: false in the schema), we need to use plus and then the
name of the field. So in this case: .select('+password')
So like this, the password field will be back in the output.

Now in order to avoid the try catch bloc, wrap the entire async function in catchAsync() .

Now it's time to compare the password that we have in the database, with the one that user just POSTed. But how are we gonna do that?
Because for example, the password that user POSTed in request body might be 'pass1234' but the one that we have stored in the db document, is encrypted,
like: '$2a....' . So how are we gonna compare this?
We need to again use the bcrypt package. So we used bcrypt to generate this hashed password and we can also use the same package to compare an
original password like 'pass1234' with a hashed password.
Note: The hashed password, since it's encrypted, there's no way of getting back the old or original password from it. Because that's the entire point
of actually encrypting a password and so the only way of doing it, is to actually encrypt the POSTed password as well and then compare it with the
encrypted one that we have stored in the db. So let's implement a function that's gonna do that and we will do that in the user model and you might ask:
why we're doing it in a model and not just in the controller file?
Because this is really related to the data itself and also we already have that package imported in that model file.
So this function will check if the given password is the same as the one stored in the document.

For the first time, we're gonna create an instance method. An instance method is basically a method that is gonna be available on all documents of a
certain collection. We need to define it on a schema variable, so we say: <schema variable>methods.<name of method> = function () {};

candidatePassword arg is the password that the user passes in the body.

Now inside of these instance methods, since they are available on the document, the this keyword actually points to the current document, but in this
case, since we have the password field set to select: false , because of that, this.password will not be available . So ideally we would use this.password
and so this way we would only need to pass in the candidatePassword(the password that user POSTed) and not also the userPassword(so only we needed 1 arg),
because we actually have the password of current document by using this.password , but again as I said, right now, that's not possible because the
password is not available in the output(yes it's available in the authController, because of .select(), but in that instance method, it's not available) and
so that's why we have to pass in userPassword as well.

The goal of that function is to only return true or false. It returns true if the passwords are the same and false if not.

The compare() function of bcrypt, returns true if the passed args are the same and false if not and again, we can't compare them manually, for example
with === operator , because the candidatePassword is not hashed(it's the original password coming from the user), but userPassword is hashed and so
without compare() , we would have no way of comparing them. Note: We can't make a hashed string to original and then use ===, because hashed strings are
one way!

Now because the function that we just defined is an instance method, therefore, it is available on all the user documents and so that user constant in
login function in authController is a user document(because it's a result of querying the User model), so it has that instance method already.

Learn: 401 status code means unauthorized. It means that the data was sent in the request is correct, but they are not enough basically to get the user
 access to the resource he is requesting.

We COULD have first check for the user is falsy and then check for the correct password, but in that case, we would then give a potential attacker,
information whether the email OR the password is incorrect(in other words, the email was incorrect and the password was correct, or the email was correct and
the password was incorrect) but the way we implemented it, it's a bit more vage, because we're not really specifying what is incorrect here, so if it's
email or if it's the password and so if there's some attacker trying to put in some random data, then they will not know if the email actually exits
or if it's just he password that's wrong.
So it's not good to say:
if (!email) {return next(new AppError('Incorrect email', 401))}
if (!password) {return next(new AppError('Incorrect password', 401))}
This has security issue.

Currently, we have:
const user = await User.findOne({email}).select('+password');
const correct = await user.correctPassword(password, user.password);

We have a problem, because if the user variable doesn't exit, then the next line of code cannot really run, because, user.password which is
used in that next line is not gonna be available and therefore, we need to move the right side code (await user.correctPassword(password, user.password))
into the if statement itself and so this way, if the user doesn't exits(or in other words, !user is true), well then it will not even run
await user.correctPassword(password, user.password) code which is after || in that if statement and then threr's not gonna be any problem. But if
user exits, then it will also run that await user.correctPassword(password, user.password) and check if the password is right or not and so if the
password is correct, only in that case , we ever react to const token = ... and then res.status(200).json() .
So the whole idea of login function is that we check for the NEGATIVES and not positives, so if after a couple of checks, there was no error at all,
well in that case, we reach:
const token = ... ;
res.status(200).json()
where we generate the token and send it back to the user.

For creating a token we created a function named signToken() because we need it's code in a couple of places.

Now we get a token after loging in, which means by saving the token on frontend, user can access protected parts of website or send that token
back to server to access other protected api routes.

So if user gets a token back, it means he is logged into the application and this is how it works on stateless authentication.
Later on when we really build the dynamic website, then it will be more visible if the user is either logged in or logged out, but it will
still work behind the scenes using that same token we get back from api after logging in. So if there's no token, then the website will look
one way and if there is a token then the website's gonna look another way, like with the user image and with the username right there in the website.*/
/* 132-8. Protecting Tour Routes - Part 1:
So far we have logged users in with a correct email and password. So basically we completed the first step of authentication workflow slide,
where a JSON web token is created and sent back to the client if the user provides a correct email and password. So we completed the upper row or
the LOGIN row. Now we need to work on ACCESS row in that slide.
Next, we will implement protected routes. So using the created json web token in order to give logged in users, access to protected routes
and this is the second step of authentication.

In order to protect routes, we're gonna create a middleware function which is gonna run before each of those handlers and that middleware will
either return an error if the user is not authenticated(so if he's not logged in), or it will call the next middleware.

So in authController create a new middleware called protect . So now if user is not authenticated, then there will be an error and then the next
middleware for example getAllTours which gets and sends to client all of the tours, will then not be executed.
So this will protect the access to that resource from users that are not logged in.

We need cathcAsync() IF the function that we are passing to cathcAsync() is an async function.

The second step in protect middleware is the super crucial step where the jwt algorithm verifies if the signature is valid or if it's not and so
therefore if the token is valid or not? So it's the verification step.

In third step(so if the verification was successful), we need to check f the user who's trying to access the route still exists.

ONLY if there was no problems in any of those 4 steps there, only then, next() will be called which will then get access to the route that we protected.
So in our current example, that getAllTours() handler.

A common practice is to send the token using an http header with the request. So let's look at how we can set headers in postman, to send it along with
the request and then also how we can get access to these headers in express.
In express, we can use req.headers to get access to http headers(request headers - so the ones that a client can send along with his req).
In postman, we can set header in headers tab. If you do this, the req.headers will contain an object which has all of the headers that are part of the
request, like the header itself that we set in postman OURSELVES and other headers that get sent automatically are:
cache-control: 'no-cache'
postman-token: '...',
user-agent: 'PostmanRuntime/7.11.0',
accept: '* /*',
host: '127.0.0.1:3000',
accept-encoding: 'gzip, deflate',
connection: 'keep-alive'
So you see that there are a bunch of headers that postman actually sends AUTOMATICALLY along with the request.

Now to send a json web token as a header, there's actually a standard for doing that and that standard for sending a token is that we should
always use a header called `Authorization` and then the value of that header should always start with Bearer , because basically we bear, we have
we possess this token and then the value of the token.

Express automatically turns all the header names to lowercase. So Authorization would become authorization in our express app. So if you log
req.headers you will get authorization not Authorization. So the piece after Bearer is our token. So that's how we should read that token from the header.

So in that function(protect function), we're specifying the conditions under which we want to save a token.

const and let are block scoped, so whatever we define in a block like an if block, will then not be available outside of it.

So right now the getAllTours() controller is protected.

This is not enough. Because it's not enough to just send the token with a request, it also needs to be a valid token. So basically a token
where no one tried to change the payload and the payload in our case is always the user._id of the user fow which the token was issued.

So next, we need to implement the verification step.*/
/* 133-9. Protecting Tour Routes - Part 2:
Now we need the verification step for token. In this step, we verify if someone manipulated the data or also if the token has already expired or not?
So use verify() of bcrypt and pass the token, so the algorithm can read the payload and then remember that this step also needs the secret. So in order to
create the test signature. For third arg, this function requires a callback and that callback is then gonna run as soon as the verification has been
completed. So you see that the verify() is actually an async function. So it will verify a token and then after that, when it's done,
it will then call the callback function that we can specify. Now we've been working with promises all the time and I don't want to break that pattern
here and so we're gonna promisifying that verify function. So basically to make it return a promise and so that way, we can then use async await just like
any other async function that we've been using. In order to do that, node has a built-in promisify function and we can require the built-in util module and
by requiring util module, that will return an object called util(we named the result of requiring, util) and util stands for utility and we only want
one method of that util object. So instead of writing:
const util = require('util'); ,
but since we're ONLY gonna use that one method, we can do it easier, we can destructure the object returned by calling require('util') and take
promisify, directly from there, so we say:
const {promisify} = require('util');

Now pass jwt.verify and not jwt.verify(...) to promisify() . So now, all the promisify(jwt.verify) is a function that we need to call, which will
then return a promise, so add parentheses after that promisify(), to actually call the promisified function and that will then returner a promise.
Now the result of awaiting this function will be the decoded payload from that jwt which the result would be sth like:
{
  id: '5cc...',
  iat: '1566...', // timestamp of the creation date of token
  exp: '...' // tomestamp of expiration date of the token
}
which the id property is user _id. So we got the correct user _id if you find it in the related collection.

You can test the sent token which is in Authorization header, in the jwt debugger.

Important: Now if you try to manipulate the payload of this token in the Authorization header, like going to jwt debugger and then change the PAYLOAD of decoded
 token, for example change the value of id property(or other properties) in the payload to sth else, you see the Encoded string or token, changes.
 Now if you copy the new encoded token(which one or more of it's pauload properties changed) and try to access to a protected route by sending the
 manipulated jwt, we will get an error that says: invalid signature and error.name is "JsonWebTokenError".

This is one of the two errors that can occur(the JsonWebTokenError error). The other one is that the token has already expired.
So we need to handle these errors and for doing that, we can add a try catch block in the second step of protect middleware and in that catch block,
we would then create errors that would be sent to the client.
Now instead of doing it that way(by adding try catch blocks), I want to use our global error-handling middleware in order to do that for us.
So we don't like to do error handling right there in the body of protect middleware function, instead, we usually delegate it to the error controller.
So in errorContoller, we will do the same thing with other type of errors that we have in that global error handling middleware in errorController,
where we put some if checks to check if the error was that type of error that we expect in if statement. For example the 'ValidationError' is coming
from another libarry (mongoose). Now the error we want to check currently(JsonWebTokenError), is also coming from another library and it also has
it's own name which is JsonWebTokenError name. So add another if statement there.

Now the error that we specified only works in production. So run the app in production by using npm run start:prod

So now if a user in production tries to access our app with an invalid token, then he just get: Invalid token. Please log in again!
That's the first error that we can get. But the another one, is that the user tries to access the application with an already expired token.
In order to try to get that error, we can change the time for the token to expire and we do this in config.env and change it to 5s.
Now try to login again to get a new token that has it's expirtes at property set to 5s only and then use that token for getting access to a protected
route.

if you put only 5 and not 5s in JWT_EXPIRES , it means 5 milliseconds.

Now because we're in prod, we get an error that says: something went wrong which is the standard error that we get, in case we do not correctly
handle that error in our error handling.
The name of this error is 'TokenExpiredError' . So let's handle this one as well, by creating another if check in errorController.

This process of first getting a token by sending a login request and then copying the token and then pasting it in the header of a request that
is protected and therefore needs a token, is a bit weird and we're gonna fix that later, so that this process happens automatically.

We could stop right now in the step 2 and most tutorials would just stop in step 2. But this is n ot really secure enough just yet. Why?
For example what if the user has been deleted in the meantime? So the token will still exist, but if the user is no longer existent, well then we
actually don't want to log him in. Or even worse, what if the user has actually changed his password after the token has been issued? Well that
should also not work. For example, imagine that someone stole the JSON web token from a user, but then, in order to protect against that,
the user changes his password and so of course, that old token that was issued BEFORE the password change, should no longer be valid.
So it should not be accepted to access protected routes.
So that's the kind of stuff that we're gonna implement in step 3 and 4.

We called that variable in step 3, freshUser(currentUser) because it's not really a new user, that's only when we create one. But this is not really a new one,
it's really just the user based on the decoded.id and we can do this, so we can be 100% sure that the id is actually correct, because if we made it
until that point of code(step 3), then that means that the verification process that we have previously in step2, was succesful. Otherwise,
that step2 would have caused an error which would then have prevented the function(protect function) from continuing and so again, that verification
process(step 2), is in charge of verification if no one altered the id that's in the payload of that token and so because of that, we can
be 100% sure that the user for which we have issued the jwt, is exactly the one whose id, is now inside of the decoded payload, so decoded. id .
So the verification process is really key, is really what makes all of that work.

Now for testing, you can create a new user with signup api and then before sending the getAllTours() request in postman, delete that created user and
then use the token from signing up the user(which is now deleted) to send a request to getAllTours() .
So let's pretend someone created a user which make him logged in and let's say, then, after some time, the user was deleted. But in the meantime,
someone could've gotten access to that JWT and could now try to log in as that user that was in fact, already deleted and so again, we should not
let that happen. So the user belonging to the id which that id is in the payload of the token of that deleted user, no longer exists.
So we must get an error in this case.

Step4 checks if user recently changed his password. So basically after the token was issued, he changed his password.
To implmenet this test, we will create another static instance method. A method that is gonna be available on all the docs of that model.
Docs are instances of a model and we do this, because it's quite a lot of code that we need for this verification and so actually, this code belongs
to the User model and not really to the controller.
Into that function, we will pass the jwt timestamp, so basically that timestamp which says when the token was issued and by default, we will return
false from that method and that will then mean that the user has not changed his password after the token was issued. So write: return false; in there.
Then put some if statement at the beginning.
this keywrod in an instance method, always points to  the current document and so therefore, there, we have access to the properties.
Now we actually need to create a field in our schema for the date where the password has been changed. So create the passwordChangedAt field.
Now this new field, will always be changed when someone change the password, so right now, we don't have that logic anywhere and so nowhere we are
actually defining that property(passwordChangedAt) and so most of the docs(in this case users), they will simply not have that new field in their
data, so in their object and so of course, we need to test for that in the changedPasswordAfter instance method. So in there, we say if
this.passwordChangedAt property exists, only then, we want to actually do the comparison and if it doesn't exist, then that means that the
user has NEVER changed the password and therefore we can simply return false, so our default.
Returning false from that instance method means that the user has not changed the password after the timestamp(JWTTimestamp) that we passed to
that instance method.

We want to compare this.passwordChangedAt and JWTTimestamp.

Now we need to create a user which has passwordChangedAt property on it and again, later in the section, when we will implement the logic for
changing the password, is when we will then SET passwordChangedAt property. But now we will artificially basically, set this field, when we create a new
user. Because we don't have the logic for changing the password yet. So create a new user and put a date as his passwordChangedAt property. So go to
singup api and let's say: 30-04-2019 which means 30 April 2019 and that should then be parsed into mongodb just fine. But it returns an error that
says: Cast to Date failed for value 30-04-2019 at path passwordChangedAt. So it means it couldn't really parse the date that we passed to it.
Because we need to start with the year and then the month and then the day. So: 2019-04-30

Currently, if you send a req for a protected route and log the this.passwordChangedAt and JWTTimestamp in changePasswordAfter instance method,
you will see the this.passwordChangedAt is in Date format and JWTTimestamp is in timestamps in seconds. So we need to convert this.passwordChangedAt also to
a timestamp and for that let's create a constant named changedTimestamp.
Now by using getTime() you see that changedTimestamp is in timestamp and in milliseconds, but JWTTimestamp is in seconds. So divide the
thing you're passing to changedTimestamp by 1000 and parse it as integer.

Keep in mind that returning false in changePasswordAfter means that the password was not changed and not changed means that the day or the time
at which the token was issued is less than the changedTimestamp. For example the token was issued at time 100, but then, we changed the password
at time 200 and so we changed the password AFTER the token was issued and therefore, that comparison is now true and that's exactly what we want to
return there, because false means `not changed` and true means `changed`.
But now let's say that the password was last changed at 200, but then only after that, we issued the token, so let's say at time 300 and so 300 is less
than 200? No and so we return false which means not changed and so that's why we used the less sign in that comparison.

Again: currentUser.changedPasswordAfter(decoded.iat) will return true, if the user actually changed his password after requested to us to issue a token.

By calling next(); at the end of protect middleware, it means the user grants access to that protected route.
The route handler is the one that sends back the data that was protected(in case of a protected route).

Before next() we need to put the entire user data on the request by saying: req.user = currentUser;
We do this because that might be useful later.

So if a token was issued AFTER the password changed, that token should work correctly.

For testing, you can get a token with login api and then copy it to getAllTours and get the data, now because we have not yet implemeneted the
change password api, in order to change the time that the password of user was changed, we need to go to compass and edit the related user doc's
passwordChangedAt field to a date in the future like one month later. So now this means that if you login again and get a new token, by using this
token to get access to a protected route, you should get an error. Because the date that the password is changed is AFTER the issued token, so we need
to get a new token AFTER we changed our password. But we didn't do this and therefore we should get an error.
Note: Currently, we artificially changed the date the date that we changed the password, one month later from now and then we get a new token by logging
in and use that token which is one month before we changed the password, to get access to a protected route, so we should get an error.
For example the password has changed in May30. but the token was issued at May the 2nd, so before the password was changed. So basically
it's now as if the user had changed their password AFTER the token was issued and so that's the situation where we don't want to give access to the
protected route.

So now our protect middleware is now completely implemented.

Recap: In step 2 verification happens, so basically seeing if the token payload has not been manipulated by some malicious third party.
if we make it to step3, it means that no one changed the JWT and therefore we can get the current user. So we get the current user from that id,
that was just decoded from the payload. Then if the current user doesn't exist(!currentUser), in that case, we do not want to give access to the
route to the client and instead create an error with AppError(), but if the user does exist, then we make it to step4 where we check if a password
change has happened AFTER the token was issued and if it did, then again, we create a new error and if it did not, we make it to  the end of
protect middleware function, where we then assign the currentUser to req.user, so that we can then use it in a next middleware function, because
remember, that `req` object, is the one that TRAVELS from middleware to middleware and so:
Learn: If we want to pass data from one middleware to the NEXT one, then we can put some stuff on the request(req) object and then, that data will be
 available at a later point(next middleware).

This was a complete route-protecting algorithm.*/
/* 134-10. Advanced Postman Setup:
First we want to see the concept of environment. In top right corenr of postman, it says" no environment and that's because we haven't created
any environment.
An environment is like a context where our app is running and we can then specify a couple of variables for each of those environments and the two
ones that make the most sense, is just as we have in our express application, the devlopment and the production environment.
So click on that cog icon or settings icon on top right corner to add a new env and call it: Dev Natours . Then create a variable called URL. Because
that's the most crucial thing that we want to change from one envrionemtn to the other. In development, we will have on URL and then in production,
we will have ANOTHER one.
Now set the initial value to: http://127.0.0.1 which stands for localhost then port 3000 and that's the initial value of our URL variable, then click on
"Add".
Now we have our Dev environment.

Again click on "Add" to add one environment for production. In that environment, we don't really have a URL just yet. So let's for now set the
initial value for URL variable to natours.io which does not exist. But it's simply a placeholder.

Now we wanna use the environment variable that we just created.
For that, in url of request, we can replace the part of url which is 127.0.0.1:3000 or localhost:3000 with the variable that we just created and
we do that, by using: {{<name of variable>}} and so this will be replaced with the variable coming from our environment.
But if you hover the variable in url string, it's says it's unresolved and it's also red, because we didn't CHOOSE our environment yet.
For that, choose your environment from that menu in top right. Now if you hover over {{URL}}}, you will see that it shows the variable that
you defined.

This feature would be useful, later, when we're in production. Because if we didn't have those environment variables, then later on, when we want to
switch to testing this API in production, then we would have to go ahead and MANUALLY change all of those URLs in all of the requests, to fit the
url of app in production.

Now if you change it to production, then if you hover over variable, you will se it's value in that SPECIFIC production.

You can hit command + w to close the tab of a request, just like google chrome.

With that, we have future-proofed our API development with postman.

Next, remember in last video I said that I was gonna automate the process of copying the received token from a response and then pasting it
into the Authorization header after the 'bearer' word?
For that, we have to write a little bit of code. We're gonna do this in signup and login requests, because those are the two places(two endpoonts) from which
we will receive a jwt as response.
Now go to Tests tab and there we will programmatically set an environment variable. We created environment variables before using that top right corenr
icon and then in the opened modal, but now, in Tests tab, with code, we will programmatically create an environment variable as well and we will
create one for the jwt that we receive in the request.
There, use the snippets in the right, when you're in Tests tab and from there, choose "Set an environment variable", then you get a pre-written code which
is some js that we can access in postman.
pm stands for postman.
.environment which is the current environment .
Now say: pm.environment.set('jwt', pm.response.json().token);
In above, .token is the name of our property in the reponse object. So basically pm.response.json() code gets the response for us and then on there,
we can write the .token property and then assign it to the jwt environment variable.
So now we have an ACTIVE test which is why we get that green dot next to the Tests tab.

Now if you send a request for signup which is the one that we wrote a test for it(in Dev Natours environment), then go to your environment from the icon
in top right corner to check if you have a env variable called jwt. So postman got it from the response and then posted it(put it) as a new env variable.
Because that's what we're doing in the code that we wrote in Tests tab, we're setting a new env variable and it's name is jwt and it's value is coming
from response and it's token property.

Note: For tutor, the value of jwt env variable is both full in initial value cell and current value cell, but for me it's only in current value cell.

That's the first step and the second step is to now go to one of our protected routes and remove the Authorization header from Headers tab by clicking on
the cross icon on the far right side of a row and then go to Authorization TAB. There, we can specify the type of authorization by clicking on that select
input. We need to choose the Bearer Token item and for it's value: {{<jwt variable name>}}
Also you can see this token in Headers tab by clicking on the button to show the hidden headers, so it automatically pre-filled that Authorization header.
Other automatically headers are temporarily generated, so just we get a preview.

Now each time we want to add a new protected route, all we need to do is to come to Authorization tab and then that {{<name of jwt variable>}} .

Also we need to copy the code from Tests tab of signup and paste it in login request too. Because the login request is also the request from which
we can get a new fresh token.
Important: You need to paste the code for setting a jwt token env variable to the Tests tab of each request that might get a new token as it's response.
 Because as we get a new token, we want to set it as env variable, unless a specific request that you don't want to do this.*/
/* 135-11. Authorization User Roles and Permissions:
We have implemented authentication in our project. However, sometimes, simply authenticating, so logging a user in, is really not enough.
So now, we're gonna implement authorization as well.

Imagine the act of deleting a tour from our DB. Not every user should of course be allowed to do that, even if the user is logged in.
So we basically need to authorize only certain TYPES of users, to perform certain actions and that's exactly what authorization is.
Authorization is verifying if a certain user has the rights to interact with a certain resource. So again, with authorization, we basically check
if a certain user is allowed to access a certain resource, even if he is logged in. So not all logged in users will be able to perform
the same actions in our API and this is a very common scenario that should be implmented in each and every web application usually.

So we're gonna build another middleware function in authController, this time to restrict certain routes. For example, for deleting tours(we're gonna
restrict the route for deleting a tour, to certain types of users or certain user roles).

First, for deleteTour in tourRoutes, we need to check if a user that is sending that request for that route, is actually logged in. So if an administrator is
trying to delete a tour, then we still need to check if he's actually logged in. So the first middleware in the delete tour stack will always be
the protect middleware. But then after that, we will add a new middleware called restrictTo() and into this function, we will then pass some
user roles, which will be authorized to interact with that resource, in this case, with deleting a tour. So let's pass admin, so ONLY to administrators.

So now we're dealing with user roles, but currently we don't have user roles in our user model, so add it, before the password field.

Currently, because we're not yet implemented the restrictTo() function, but we're using it, so it is an error, you can see we get an UNCAUGHT EXCEPTION
error which is originated from the event listener for uncaughtException that we wrote. So nodemon is now waiting for us to restart the server.

In models, enum is a validator in order to only allow certain types of roles to be specified.
The 'user' role is a general or normal user. Role 'guide' is the tour guide, 'lead-guide' is the lead tour guide.
These user roles that we have in our model, will of course be specific to the application's domain. For example, when you're running a community site,
it's not gonna make much sense to have a guide and a lead guide role. Instead, you will probably have like moderators, or contributers, or memebers.
So you will always have different names depending on the type of application that you're writing. In our case, the roles I specified, is the ones that
make sense.

We set a default value for a field in model, so we don;t have to ALWAYS specify which type of user we're creating.

Now delete the user's that you already have in your database, because they don't have any roles, so we don't need them like that anymore.
Then create new ones with signup api.

Now we need to make it so, that we can pass multiple arguments into that restrictTo() function.
We want the admin to be able to delete tours, and also the lead-guide can do this, so let's add lead-guide to restrictTo() that is before deleteTour in
routes.
So the admin and the lead-guide can now delete tours, but not the normal guides(guide) and also not the normal users.

Now let's implement restrictTo function in authController.

Now how are we gonna implement this? Because usually we cannot pass arguments into a middleware function, but in this case, we really want to!
We want to pass in the roles which in this case, specifies who are allowed to access the resource, in this case, the admin and lead guide.
Important: So we need a way of passing in arguments into the middleware function in a way that usually does not work. How are we gonna do that?
 In here, we will create like a wrapper function, which will then return the middleware function that we actually want to create.

To restricTo(), we want to pass an ARBITRARY number of arguments which in this case, those arguments would be roles and for that, we can use the
rest parameter syntax when defining the restrictTo() function and by doing that, it will create an array of all the arguments that were specified.
Now in restrictTo(), we will right away return a new function and that retunring function is the middlewawre function itself, so pass it req, res and
next and that retuning function will then get access to tht ...roles parameter that is defined in the parent function. Why?
Because there is a closure.

When we will give a user access to a certain route?
When it's user role is inside of that roles array that we passed to restrictTo() .
For example let's say we have the normal user now which has a role of 'user' that requested for deleting a tour, so it's not contained in that roles
array that we passed to restrictTo() and therefore, that user does not have permission.

includes() is an array method in JS, that is available on all arrays.
In that if statement in restrictTo(), we're saying: if that roles array does not include the role of the current user, then, we do not give permision
to that user and where is the role of the current user(the user that requested that route) stored?
Remember the line of code that we put in the end of protect function where we grant access to the protected route, we store the currentUser
in req.user and that says: req.user = currentUser;
and remember how that protect middleware always runs BEFORE restrictTo and so by the time the restrictTo() function runs, the protect middleware
has already complteted and has put the current user on the request object and therefore we can use it in the restrictTo() and also in it's returning
function.

Learn: 403 http status code means forbidden(so as you can see, there really is a specific http status code just for authorization).

Recap: In delete tour request, before running delete tour handler itself, we first run the protect middleware, then restrictTo middleware and only
if those two middlewares pass to the next one, we go to the deleteTour handler and so basically that route handler or route controller, is protected and
is also restricted by restrictTo middleware.
In restrictTo() , we pass all of the roles that are allowed to interact with that resource(in this case, tour resource and are allowed to actually DELETE
a tour), so basically which are allowed to run that deleteTour handler function.
Note: The restrictTo function(which is a parent function to a middleware function) will run and return the middleware function ITSELF.
So restrictTo itself is not a middleware, but instead, it RETURNS a middleware function and that returning middleware function, because of closure,
have access to roles.
Let's say the role of current user which is stored in req.user.role , is user and since that role is not in the roles array that we passed to
restrictTo() , we then get an error that we specified in that returning middleware. But if it is included, then we pass to the next middleware,
which in the case of deleteTour stack of middlewares, is the route handler itself(deleteTour).

Now because we have set a dev environemnt in postman that saves a jwt after getting it in the response, in Authorization tab of postman, when you signup
or login(or any other req that returns a jwt to client), that jwt would be automatically put in the Authorization tab of request that you want
to send to server. So it already knows that that is the one that we want to use, because we used it before.

Now test that if a regular user can delete a tour or not? He shouldn't right!
For that, you can login as a regular user, to ensure that the current jwt in environment, is a jwt that corresponds to a regular user and not an admin or ... .

So after logging in or signing up or any other req that sends back a token, that token is gonna get stored into the env varaible in postman AUTOMATICALLY.
So you can send requests for protected routes immediately! without doing any other thing.
You can see the automatically jwt that was placed by postman, if you click to see the hidden headers of request in Headers tab of each req that needs to have
a token.

For testing as an admin, first login as an admin and then send a request to delete tour.

Learn: 204 status code is for when we delete a record.

An administrator or a lead-guide has a permission to effectively delete tours.

Storing the user onto the req object as we did in the end of protect middleware, is crucial for authorization to work.
Important: The id that is encoded into the jwt, is what makes our code then know whether the user that's trying to perform the action
 is a user, or if he's an admin or a lead-guide or ... . Because that data is coming from the protect middleware and that id which is encoded in jwt of
 the use that requested, is decoded and used in the step 3 of protect and in line: const currentUser = await User.findById(decoded.id);
 which we then put the info of found user which requested that endpoint, in the req object and in it's user property, to be used in next middlewares.

This was another piece of the puzzle in implementing our authentication workflow.

We want to restrict a lot of other routes, like updating a tour route.*/
/* 136-12. Password Reset Functionality Reset Token:
We're gonna implement a user-friendly password reset functinality, which is kind of standard in most web applications.

The password reset ussually works like this:
You just have to provide your email address and you will then get an email with a link where you can click and then that's gonna take you to a page where
you can put in a new password.
So basically thrre are two steps:
1) the user sends a post request to a forgot password route, only with this(his?) email address and this will then create a reset token and sent that
to the email address that was provided. So just a simple random token, not a JSON web token. That's a difference here.
2) In the second part, which is gonna be the next video, the user then sends that token from his email, along with a new password, in order to
update his password.

So create forgotPassword function in authController, which is the first step and as the second step, we have resetPassword function.
Now implement these two routes in the userRoutes file.
The /forgotPassword route we will receive only the email address and the /reset-password will receive the token as well as the new password.

The steps for forgotPassword is:
1) Get the user based on the POSTed email
2) Generate the random reset token
3) Send it back as an email to user's email

We use findOne() and not findById() in first step for finding the user, because we don't know the user's _id in request(user only sends
his email and not _id) and also user of course, also doesn't know his own _id! So we specify the email address for finding the user, because that's
what the user would send to us. It's the only piece of data that is known.

After finding the user, we need to verify if the user does exist. So:
if (!user) {
  // go to the next middleware, along with the new error.
  return next(new AppError(...));
}

In second step, for generating the random token, once more, we're gonna create an instance method on the User. Because once more, this really has to do
with the user data itself and we're gonna write a bit of code really and so if it was only one line of code, then of course, we could just put it right
in the controller and route handler itself. But we need a couple of lines of code and so again, it's a bit cleaner to separate it into it's own function
and that usually with mongoose, is best, as an instance method.

The password reset token should be a random string, but at the same time, it doesn't need to be as cryptographically strong as the password hash that we
created before. So we can just use the very simple, random bytes function from the built-in crypto module.

To randomBytes() we need to specify the number of characters and then we also in the end, convert it to a hexadecimal string, so call .toString('hex') .

Now if you're wondering why we're creating that token, it's because basically that token is what we're gonna send to the user. So it's like a reset password
really, that the user can then use to create a new real password, and of course, only the user will have access to this token and so in fact, it really
behaves kind of like a password and so since essentially it is just a password, it means that if a hacker can get access to our database,
well, then that's gonna allow the hacker to gain access to the account, by setting a new password.
So again, if we would just simply store this reset token in our database now, then, if some attacker gains access to the DB, they could then use
that token and create a new password using that token, instead of YOU doing it. So they would then effectively control your account, instead of YOU doing it!
So just like a password, we should NEVER store a PLAIN reset token in the database. So let's encrypt it, BUT such as before with the password,
it doesn't need such a cryptographically strong encryption method. Because these reset tokens are a way less dangrous attack vector and so again, we're
just gonna use the built-in crypto module and it works in kind of weird-looking way, by using sha256 algorithm
crypto.createHash('sha256').update(<the string to encrypt>).digest()

we pass the variable where the token is stored, to update() . So whatever string we want to encrypt, we pass to update() and then call digest() and then
store it as a hexadecimal by passing 'hex' to digest() .
Now, where are we gonna save that reset token?
We're gonna create a new field in our database schema. Because of course, we want to save it in the database, so that we can then compare it
with the token that the user provides. So create a field named: passwordResetToken and then also passwordResetExpires field, because this reset will
actually expire after a certain amount of time, again, as a security measure. So you will only have 10 minutes in order to actually reset your password.

We want to return the plain text token from createPasswordResetToken instance method, because that's actually the one that we're gonna send through
the email, so:
return resetToken;
So of course we need to send via email, the unencrypted reset token, because otherwise, it wouldn't make much sense to encrypt it at all. So if the
that was in the database, was the exact same that we could use to actually change the password, well, then that wouldn't be any encryption at all and
so we send one token via email and then we have the encrypted version in our database and that encryped one is then basically useless to change the password.
So it's just like when we're saving only the encrypted password itself to the database(so just like what we did in pre save hook in userModel). so where we
encrypted the password using bcrypt. So again, keep in mind that we only ever save sensitive data in an encrypted form and then of course, compare it with the
encrypted version that's in the database.
We're logging in the createPasswordResetToken, with the object format, because this way, it will then tell us the variable name along with it's value.

Currently, what we did in createPasswordResetToken, was just to modify the data in there, for example when we set this.passwordResetExpires = Date.now()...;
we did in fact not really update the document, we did not save it. So we really just modify it, but now, we then need to save it. So write:
await user.save();
But watch what happens as we now use this.
So go to postman and create a reqeust for forgotPassword route, you get an error saying: "Please provide email and password."

That happens because we're trying to save a document, but we do not specify all of the mandatory data, so the fields that we marked as required.
All we need to do, is to pass a special option into save() which is {validateBeforeSave: false} and this will deactivate all the validators
that we specified in our schema.

Now if you try to send a request to /forgotPassword , we still get the same error! But now I see it's coming from the login function(in before it was
also coming from there). Because we specified the login as route handler for /forgotPassword!!!!
So the error that we got before, was actually not because of the validation!
Now if you send the request to /forgotPassword, if you don't provide email, you will get: There is no user with that email address and so that's because
of course, we didn't specify any email address in the body.

The console.log() we wrote in createPasswordResetToken, would log the original reset token which would be a random hexadecimal string and then as second one,
we get the encrypted one and the second one is the one that should now be in the database. So take a look at the related user doc to see if that second
logged string is now stored in passwordResetToken field. Also look at the passwordResetExpires, it should be 10 minutes from the moment you got the response.

This was the first part of creating the password reset functionality. In the next vid, we will send the resetToken that we stored in resetToken variable,
via email, to the user.
So we need to send email with nodejs.*/
/* 137-13. Sending Emails with Nodemailer:
We need to send passwordResetToken via email to the user. We're gonna send email with nodemailer.

If we don't put {validateBeforeSave: false} , in user.save() , we get: please confirm your password and ... and if you resolve this in your data
that you send, you will get other errors again. Because we don't have any value on the passwordConfirmField and that's because of the validation,
so we can easily turn it off with that option I mentioned.

Now let's create an email handler function that we can then use throughout our application.
So we're gonna create a file in utilities folder called: email.js .
Run: npm i nodemailer

The options(arg of sendEmail()) that I specified in email.js is for example the email address where we want to send an email to, the subject line,
the email content and maybe some other stuff.

Now we need to follow three steps in order to send emails with nodemailer.
1) First we need to create a transporter.
2) Then we need to define the email options.
3) Actually SEND the email with nodemailer.

The transporter, is a service that will actually send the email. Because it's not nodejs that will actually send the email itself. It's just
a service that we define in there. Something like gmail for example. Now gmail is not actually the service that we're gonna use, but let's see
how it works with gmail, because many people will be interested in this.

We need to always create a transporter and that's always the same no matter what service we're gonna use.
There are a couple of well known services that nodemailer knows how to deal with and so we don't have to configure those manually and Gmail is one of
them. But also there is yahoo or(and?) hotmail.
Now for the object we pass to auth property of createTransport() , we would write some config, so just like before, we save that kind of stuff in our
config.env file.

So create: EMAIL_USERNAME for gmail username and EMAIL_PASSWORD.

So that was the configuration for transport in nodemailer.
Then in your gmail account, you will have to activate something called the less secure app option.

The reason why we're not using gmail in this app, is because gmail is not at all a good idea for a production app and that's what we're building here.
So using gmail for this kind of stuff, you can only send 500 emails per day and also, you will probably very quickly be marked as a spammer and from there,
it will only go downhill. So unless it's like a private app and you just send emails to yourself or like 10 friends, well, then you should use another service
and some well-known ones are sendgrid and mailgun and we will use sendgrid a bit later. Now, what we're gonna do right now, is to use a special
development service which basically fakes to send emails to real addresses. But in reality, these emails end up trapped in a development inbox, so that
we can then take a look at how they will look later in production. That service is called mailtrap, so let's signup for that.
So basically with this service, you can fake to send emails to clients, but these emails will then never reach these clients and instead be trapped in
your mailtrap and so that way, you cannot accidentally send some development emails to all of your clients or users.

After creating account, you won't have any inboxes, so create a new one with the name of 'natours'. Then look at the credentials in SMTP section and you see the
host, port, username and password and that's what we're gonna specify in our transport in nodemailer. So copy them from mailtrap site and paste in
config.env file.
Don't forget to specify the host for email too, because mailtrap is not one of the predefined services that comes with nodemailer.

In step 2, we need to define some options for our email.
We COULD do step2 and 3 all at the same time, but I like to simply prefer those options there first.
In step2, the `to` property is the recipient's address and that would come as an argument to that function.
The text property of options is basically the text version of the email, but we can also specify the html property in options and we could
convert that message(I think options.html) to html, we will do this later. But for now, we don't specify html at all. So simply leaving it as text.

Since we don't want to directly work with promises, let's use async/await.

We COULD store the result of: await transporter.sendMail(mailOptions); .

We can export sth as default from a module by using: module.exports = <the default export value>;

Ideally, the user will click on that email and will then be able to do the request from there and that's gonna work later when we implement our dynamic website, but still,
we now want to create the resetUrl in forgotPassword's second step, so that the user can simply copy it to make it easier to do this request.

When defining resetURL, we need to recreate the url structure that we have, like most of our requests.

The /resetPassword req, will take the token as a parameter and it's a PATCH req. Because the result of it, will be the modification of the password property in the
user document and so PATCH is the best one.

We're preparing the resetUrl constant to work both in development and in production.
It's not ideal to define that url hardcoded in forgotPassword like that, but we're gonna fix later.

We're gonna send the PLAIN or ORIGINAL reset token and not the encrypted one, in the url, so in resetUrl. We will then, in the next step, compare the original token
with the encrypted one.

By defining the message constant in forgotPassword, we're basically giving the user, some instructions.

After sending the email in forgotPassword(), we also need to send a response, otherwise, the request/response cycle will never finish.

Important: Of course, we can not send the reset token right in the response(in res.status.json()) via json(jsend?), because then everyone could
 just reset anyone's password and take over any account that they wanted and so that's the whole reason why we send it to an email address, because
 we assume that the email is a safe place that only the user has access to.

There might happen an error using that await sendEmail() and so in that case, we of course want to send an error message to the clinet. But in this case,
we actually need to do more than simply send an error message. We need to set back the passwordResetToken and the passwordResetExpired that we defined and so
right now, it's not enough to simply catch the error and then send it down to our global error handling middleawre. But instead, we need to simply add
a try catch block in await sendEmail() . So again, because we actually want to do MORE than simply send an error down to the client.

Important: So if you want to do more than simply sending the error to the client by global error handling middleware(which happens because of catchAsync()),
 you can use try catch block(which is what we tried to avoid in the first place, by using catchAsync()), inside that async function, to do more in the
 catch block.

What we want to do in OUR catch block?
We want to reset both the token and the expires properties.

By saying:
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;
it will only modifies the data, but doesn't really save it to db. So we need to use: await user.save(...);

In this case, the error code that we OURSELVES send to the client, can be 500. So this is really an error that happened on the server and so it has to be a 5xx code and
500 is standard one.

Now if you test the /forgotPassword route, it might take a longer time because of sending the email, for example it might take 5 seconds.

Now if it was successful, meaning the response said: "Token sent to email!", as we know, since we used Mailtrap, it ACTUALLY didnr't send that email to the provided
email in the body of request, but instead, the email should be now trapped inside of Mailtrap.
After seeing the token in mailtrap, check the token param with the token that is in the db for that user or the token that was logged because of console.log() that we have
in createPasswordResetToken() instance method. The stored token in db, should be the encrypted version of the email's token(the token that is in url param in email) and
the passwordResetExpires should be expired in 10 minutes form the moment that code was executed.
So the resetToken constant should be sent to the email that user provided and this.passwordResetToken in userModel, should be stored in the database.

In the next vid, we will actually reset the password based on the new password that the user sends with the /resetPassword request.

Important: Related to configuration of nodemailer's createTransporter:
 1) password property is actually `pass` not password Pay attention to this!
 2) Also the 25 for port didn't work, so I specified the other proposed ports, for example 2525.*/
/* 138-14. Password Reset Functionality Setting New Password:
Let's create the last part of the password reset funcionailty, where we actually set the new password for the user.
Some steps for resetPassword() function:
1) First we get user based on the token
2) Set the new password but only if token has not expired and there is a user
3) Update the changePasswordAt property for the current user
4) As usual in this functionality, log the user in, so basically send the JSON web token to the client

The reset token that is actually sent in the url, is that non encrypted token, but the one that we have in the database is the encrypted one.
So what we need to do, is to basically encrypt the original token again, so we can then compare it with the one that is stored, so the encrypted one in the database.
We did sth similar before with the password, but with the password, we couldn't compare it as easily as we can with this one, again because for the
password we used the quite complex bcrypt algorithm which in this case we didn't.
So here it's very straightforward, all we need to do again, is to encrypt the token and compare it with the encrypted one in the database.
We need the crypto package in step 1.

With .digest('hex') on crypto.createHash('sha256').update(req.params.token) , we convert the hash to hexadecimal.
This is the same as we had before, where we encrypted the original one and so we could refactor this into it's own function, but let's keep it simple there.

Then(after creating the hashedToken) we need to get the user based on the token. Because that is the only thing that we know about the user right now. We have no
email, we have nothing, so that token is the only thing that can identify the user and so we can now, query the DB for that token and it will then find the user which
has that token.
So this will find the user who has the token that will send via url, but right now, we're not taking the token expiration date into consideration.
So what we want is to check if the passwordResetExpires property is greater than `right now`. Because if the expires date is greater than now,
it means, it's in the future, which in turn means, that it hasn't yet expired and there's a very easy way in which we can actually do this right with this
query(query is: User.findOne({passwordResetToken: hashedToken})) and that way is to include the property that we want to check a condition for it and in this
case that property is passwordResetExpires and the condition is that the passwordResetExpires should be greater than `right now` and we do this with monogdb opeartors.
So the way that I mentioned is:
EX) User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()} }))

Date.now() will be a timestamp of current time, but behind the scenes, mongodb will then convert everything to the same and therefore be able to compare them
accurately.
So with the last snippet, we can at the same time, find the user for the token and also check if the token has not yet expired.

In second step, we want to send an error if there is no user or if the token has expired. But that's, in this case, the same. Because if the token has expired,
well, then it will simply not return any user, so we just need to check for !user for sending an error.

But if there is no error and if next() is not called, well, then let's actually set the password. So we already got the user and now it's simple, so we just
need to set user.password .

Then we need to delete the passwordResetToken and the passwordResetExpires(set them to undefined) and then we need to save them, because without it, we only modify
the document, it doesn't really update or save it to db.
In this case, we actually don't have to turn off the validators, because indeed we want to validate. For example, we want the validator to confirm
if the password is equal to passwordConfirm and so that validator automatically does all that work for us.

We're gonna write the code for third step after fourth step, so let's code fourth step now.

Log the user in, in other words, means send the JSON web token. We're already doing this in three different places, so in login, in signup and now in resetPassword.
So sometime in the future, we will refactor that into it's own function.
For logging in the user, we say:
const token = signToken(<_id of user>);
res.status().json({
  ...,
  token
});

Now let's test this(yeah, without coding the third step).
Currently, the passwordResetExpires is already expired for the user that we want to test(because it took more than 10minutes for me do test this),
so we need to ask for a new one, so hit the /forgotPassword route.
Don't forget to paste the code for Tests tab that we already have for example for /signup , to /forgotPassword(update: not for this!!) route in postman.
Because remember, that the /resetPassword gets back a JWT and so we want to save that into the environment variable, just like we did with all the others.
So now, hit /forgotPassword, which again, takes some time, because of sending the email, then go to email, for now, it would be the trapmail inbox and then
copy the received token in the email, then in postman, in /resetPassword, we use that copied token and paste it in url.
Then in body, specify the new password and passwordConfirm for new password.
Now let's intentionally, make a mistake for repeating the new password and put two different strings for password, to test the this too. For example:
{
  password: 'newpass123',
  passwordConfirm: 'newpass1234',
}
if you send this request with the mentioned body, you get an error that says: Passwords are not the same!
That's a validation error and remember, actually, that this is the whole reason why we need to use save() and not update() .
So before, for updating tours, we used to use findOneAndUpdate() , but now, for everything related to passwords and to the user,
Important: we ALWAYS(when want to run validators) use save(), becayse we always want to run all the validators, and above all, the save middleware functions.
 So for example, the ones where the passwords are encrypted.

So now if you send two same passwords, you get the token and also the password is resetted. Now let's see if that received token is actually valid, how?
By going to a request that requires a token, for example getting all the tours. Remember: When we get a new token, because our workflow is automated in a way that
when we get a response from a request that sends back a token, the old token gets replaced by the new received token AUTOMATICALLY, so we don't need to
do anything at all, just do the request you want and it would have the new token.
So our new token that we got from /resetPassword, actually works, because we tested it and now for the user that we reset his password,
the passwordResetExpires and passwordResetToken should now be GONE(not empty, GONE), because we set them to undefined.

Now let's code the third step and we want to update the passwordChangedAt property for that current user and we're gonna do this using middleware in userModel.js .
So create a pre save middleware for userSchema and the function that we pass to a pre save middleware is gonna run right before a new document is saved and so it's the
perfect place for specifying passwordChangedAt property and we could of course have done it in authController right after we set those two properties to undefined, but
we really want this to happen, kind of, AUTOMATICALLY, so kind of behind the scenes, because later on, we will have another place where we update the
password and then we would make sure that we're including the same code there TOO but instead with the way we do this, again, it happens
kind of behind the scenes without us having to worry about it at all.

Now when exactly do we want to set the passwordChangedAt property to `right now`?
We only want it when we modified the password property and there's a trick:
!this.isModified('<name of property>') means if we have not modified that property that we passed to isModified() .

There, we say if we didn't modify the password property, then do not manipulate the passwordChangedAt.
But what about creating NEW document?
Well, when we create a new document, then we did modify the password and then we would set the passwordChangedAt property, right?
Well, in the current implementation, we actually would. BUT there is sth else that we can use here. So basically we want to exit that pre save middleware function
in userModel right away, if the password has not been modified OR if the document is new, and so we can use the isNew property with `this` keyword.
So if the code passes that if statement in pre save middleware, then we set the passwordChangedAt property.

Now in theory, the current code for that pre save middleware should work just fine. But actually in practice, sometimes a small problem happens and that problem is
that sometimes saving to the database is a bit slower than issuing the json web token, making it so that the changed password timestamp is sometimes set a bit AFTER
the json web token has been created and so that will then make it so that the user will not be able to login using the new token. Because remember, the whole
reason this timestamp(passwordChangedAt) actually exists, is so that we can compare it with the timestamp on the json web token. Where is that check?
In step 4 of protect, where we check if the user has changed the password after the token was issued and so where we then create that new token in resetPassowrd() ,
by using signToken() , sometimes it happens that the token that we create there, is created a bit BEFORE the passwordChangedAt timestamp has actually been created which
happens in pre save middleware in userModel and so we just need to fix that by subtracting one second or 1000 milliseconds in that pre save hook and so that then
will put the passwordChangedAt, one second in the PAST(because we used Date.now to set the CURRENT timestamp, but we subtract it by 1 second which means the past!), which
will then of course not be 100% accurate!!, but that's not a problem at all. Because one second there doesn't make any differences at all.
It's a small hack, but again, it's no problem.

So putting that passwordChangedAt one second in the past, will then ensure that the token is always created AFTEr the password has been changed or the passwordChangedAt
is saved to db in that pre save middleware.

Important: For testing, do a new forgotPassword request and then it will send an email to the specified email in that request ot forgotPassword, go to that email and grab the
 sent token and paste it as a param in /resetPassword and then it will reset your password and also give you a new token and also in compass, for the user that
 changed his password, it will set a property named passwordChangedAt. Now if you try to use that new token(for example to access a protected route), it would be good to
 go!

We finished our password reset functionality.

The authentication and authorization part of this section is kinda finished.

Next, we will implement the functionality for updating the user and also deleting it and after that, we will talk about security.*/
/* 139-15. Updating the Current User Password:
 */


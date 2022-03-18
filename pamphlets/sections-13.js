/* 191-1. Section Intro:

192-2. Image Uploads Using Multer Users:
Multer is a middleware to handle multi-part form data which is a form encoding that's used to upload files from a form.
We could call multer() without passing any options there and then the uploaded image would be stored in memory and not saved anywhere to the disk.
Important: Images are not DIRECTLY uploaded into the database, we just upload them into our file system and then in the database, we put a link to that image.

We pass the name of the field(the field in the <form>) that is gonna hold the image to upload.

Also the upload.single() middleware will put the file or at least some information about the file on the req object in a field called file .

For sending multi-part form data you should use the form-data tab of postman.

Body-parser is not able to handle files. So the file won't show up in the req.body at all and that is the reason why we need multer.

193-3. Configuring Multer:
We're gonna create one multer storage and one multer filter.
We could also choose to store the file in memory as a buffer. So that we could use it later by other processes.
The third arg of the callback we pass to destination property in diskStorage, is a bit like the next() function in express. But we're calling it cb there,
so that it's a different name than `next`, because actually it doesn't come from express. But it's similar in that we can pass errors in there and ... .
The filename would be: filename would be: user-userId-currentTimestamp and with this we can guarantee that there won't be two images with the same filename. If we used
only the user id, then of course multiple uploads by the same user would override the previous image and only with timestamp, if two users were uploading an image
at the same time, they would then get the exact same filename.

Important: We only store the image name into the db docs and not the entire path to the image.

194-4. Saving Image Name to Database:

195-5. Resizing Images:
Image processing and manipulation with nodejs and in this case, we're gonna resize and convert our images.
Everywhere in our user interface, we assume that the uploaded images are square and then we can display them as circles and so this only works
when they are squares, but of course in the real world, users are rarely gonna uploading images that are squares. So we need to resize the images to
make the squares. So we're gonna add another middleware before updateMe and then that middleware will take care of the actual image processing.

When doing image processing like our case(right after uploading a file), then it's always best to not even save the file to the disk, but instead
save it to memory.
So we don't need to configure multerStorage anymore because we want to save the uploaded file in memory and after resizing, we would save it to disk.
So we don't use diskStorage() of multer and instead we use memoryStorage() and this way, the image will be stored as a buffer and that buffer will be available at
req.file.buffer and this is way more efficient like this, so instead of having to write the file to the disk and then read it again in resizeUserPhoto,
we keep the image in memory and then read it in resize middleware.

If you don't need image processing, you can keep using the multer's diskStorage() . So there are two ways.

196-6. Adding Image Uploads to Form:
For sending data to the server without api, first we define the action attr of <form> , then method and for forms that also can upload files, we need to
add the enctype attr too and set it to 'multipart/form-data' . If we don't specify the enctype, the form would simply ignore the file and not send it.
multipart is for sending files to the server.

When sending a file using api, we need to programmatically re-create a multi-part form data and we do it by using  new FormData() .

197-7. Uploading Multiple Images Tours:
Three different uses of multer:
multer().single(<name>); when there's only one file to upload and will be available on req.file
multer().array(<name>, maxCount); when there are multiple with the same name and available on req.files
multer().fields([{}, {}, ...]); and available on req.files

The buffer property in req.file or req.files, is a representation of the image in memory.

198-8. Processing Multiple Images:
By saying:
array.forEach(async () => {
   ...
   await ...
   ...
});
next lines...
we're not using async await correctly in this case. Because this async await here is only inside of that callback function of the loop and so that will NOT
stop the code from moving right to the next lines where we do other stuff that must wait to do the async stuff.
So again, because the async await happens INSIDE OF THE CALLBACK FUNCTION. Instead we can use map() to save an array of all of those promises that are being created
inside of the loop and then if we have an array, we can use Promise.all() to await all of them and with that, we await until all of those promises are done.
So use this instead:
await Promise.all(array.map(async () => {
  ... await ...
}))
next lines*/
/* 199-9. Building a Complex Email Handler:
We already sent email before for the password reset, but we're gonna take that to a whole new level and we're gonna build email templates
with pug and sending emails using the sendGrid service.
Let's create a class for the email handler.

The constructor function of a class is gonna be running when a new object is created through that class.

We want to have different transports whether we're in production or not. When in production, we want to send real emails using sendGrid but if we're not in
production, we want to use our mailtrap app. So instead of the emails going to a real email address, it will get caught into our mailtrap inbox so that we can
take a look at it in our development process.

By specifying the text property of mailOptions, we want to include a text version of our email into the email and that's crucial because it's better
for email delivery rates and also for spam folders and also, some people just prefer plain simple text emails instead of having the more formatted html emails.
So we need a way of converting all the html to simple text. So stripping out all of the html, leaving only the content and for doing this, we need to install
html-to-text package.

200-10. Email Templates with Pug Welcome Emails:
When we're building an html email, we always need to inline all the styles. But we can also export it to another file and then include that css
file which has the .pug extension, into the pug template. Now because we include that file into another file, it should have a starting underscore.

We used a lot of table html elements in the email pug template and that's because many email clients only understand tables for formatting.

In our Email class, we create one different method for each type of email that we want to send, so we're not gonna use the send() method in our code, instead,
we use the sendWelcome() and ... methods.

We put everything that's reusable for all the templates, inside the base.pug and there we have a `block content` and all the other templates can extend that
block.

201-11. Sending Password Reset Emails:
Important: You can test the things we've done in this video, by using the forgotPassword route of api, to test if we get an email for this or not.
 After getting the forgotPassword email, copy the token in that email and use it in resetPassword route to reset your password.

At this point, all our emails that are sent from the code are getting caught in mailtrap and that's because in development mode, we don't want to
leak these emails to real users. ALSO, we would have no way of taking a look at those emails if they would really end up in our real users email inboxes.
So that's why we use a service like mailtrap.

202-12. Using Sendgrid for Real Emails:
After creating an account, at the top left corner click on your user name and then click on setup guide. Then use the 'integrate using our web api or SMTP relay'.
Then click on 'SMTP relay', because that's the one that we need, if we want to use node mailer and create a transport with that. On the other hand, we could
also use the simple to use send grid api and for that, we would use the web api of send grid, but again with nodemailer, we need to choose SMTP relay.
Then create an api key with some name like natours and then to configure our transport in nodemailer, we use the username and the password in the page that we arrived in
send grid website. Add those username and password to config.env file and I named them with SENDGRID_<...> .
That is enough to create our transport.

Sendgrid service is predefined in nodemailer, so we can specify `service` property in createTransport() options object and we don't need to specify the
server and port properties. Because nodemailer already knows this data, because we have specified the SendGrid as service.

Now to test this, let's create a new user with a real email address with our natours api's signup route. You can use the mailsec service for this to have a
temporarily real email address and the welcome email should then end up in that inbox.

Don't forget to run the application in production in order to test it with real email addresses.
Check to see if you received the email in both sendgrid dashboard and the fake temp email that you provided when signing up into natours.*/
/* 203-13. Credit Card Payments with Stripe:
We want to allow users to buy tours! Create your account in stripe.

You can go to settings>branding to make the stripe checkout pages match our brand, by adding the image or logo of your startup and ... .

You can use the public key that stripe provides on the frontend and the secret key is the one that is needed on backend.

We're gonna use the payment features of stripe and they have a couple of different options. We're gonna use the Checkout and not the stripe elements.
With checkout, we can use it only on client or together with the server and when we only use it on the client side, then we don't even need a server at all.
But this way of using stripe is only really for really small stores where they only have a handful of products that their price never change and where you have to
add all those products manually to your stripe dashboard. But we want sth a bit more complex and for that we use the server integration.

Stripe workflow:
It all starts on the backend where we're gonna implement a route to create a stripe checkout session and this session is gonna contain a bunch of data
about the object that can be purchased and in our case, that's the tour. So the session will contain the tour price, the tour name, a product image and also
some other details like the client email. Then on the frontend, we're gonna create a function to request the checkout session from the server once the user clicks
the buy button. So once we hit the endpoint that we created on the backend, that will then create a session and send it back to the client.
Then, based on that session, stripe will automatically create a checkout page for us where user can input all the details like credit card number, expiration date and ... .
Then, again using the session, we will finally charge the credit card and for that, we're gonna need the public key. So the secret key, we will need on the server and
the public key is gonna be used on the frontend.
It is the Stripe which together with the session, charge the credit card and so therefore, the credit card details never even reach our server which makes our
lives as developers a lot easier. Because then, we don't have to deal with all the security stuff that's related with managing and storing credit cards. So we just
use the stripe api
Now, once the credit card has successfully been charged, we can then use sth called stripe webhooks on our backend in order to create new bookings. This part of
workflow will only work for deployed websites. So websites that are already running on a server. But for now, we will find a temporary work-around to this, which is not
really secure, but it's gonna work just fine for now.
So we use the session to charge a credit card and we don't really do that directly.

204-14. Integrating Stripe into the Back-End:
Let's integrate stripe into our backend by creating that api endpoint which will create and send back a stripe checkout session.
Let's create our next resource which is the bookings.

The first route we're gonna create for booking doesn't follow the REST principle because that one is not gonna be about creating or getting or updating any
booking. Instead, that route will only be for the client to get a checkout session.
Install the stripe package.

Important: In protected routes, after the protect middleware in that route is called and executed, we have access to the user data on req.user .

The client_reference_id is gonna allow us to pass in some data about the session that we are currently creating and that's crucial because later
once the purchase was successful, we will then get access to the session object again and by then, we want to create a new booking in our database.

In our case, we can recreate or GET the user's id by using his email, because the email is a unique field in our DB.

The images that we pass to each item in line_items, need to be live images. Meaning that they have to be hosted on the internet. Because stripe will
upload those images to their own server. So this is another of the things that we can only do once the website is deployed.

The amount is expected to be in cents, so we multiplied it by 100.

Later, we need to prevent anyone from sending a request to /checkout-session/:tourId through postman . Because that doesn't make sense. But for now, since
we're only testing, it's ok to do it in postman.

Now by sending a request to /checkout-session/:tourId , it will appear on the stripe dashboard and in it's payments section and it says 'incomplete' and
that's because we only created the checkout session on the server and we're missing the second step where we then charge the credit card on the client side.

When the html attribute has a dash in it, it will automatically be converted to camelCase when selecting it with JS.

205-15. Processing Payments on the Front-End:
With stripe when we're testing(in test mode), the credit card number is: 4242 4242 4242 4242

Your users will also automatically get an email when they successfully bought the product. This means we don't have to manually send out
emails whenever a user successfully purchases a product.

206-16. Modelling the Bookings:
We're gonna use parent referencing on the booking which means keeping a reference to the tour and also to the user who booked the tour.

We created a field named paid which will be automatically set to true, but this is just in case that for example an admin wants to create a booking
outside of stripe. For example if a customer doesn't have a credit card and wants to pay directly, like in a store with cash or ... and in this case an admin
might then use our bookings api in order to manually create a booking and so that might then be paid or not yet paid. This field by default is true, so that
we don't have to do anything.

We want to populate the tour and user fields automatically whenever there is a query and we do that by using query middleware.

Let's do a populate for both the user and the tours. In this case there's no problem for performance, because there won't be
many calls to the bookings, because only guides and admins will be allowed to do that api call. For example for a guide to check
who was booked their tours. So that's one of the use cases for this api.

207-17. Creating New Bookings on Checkout Success:
Whenever a checkout is successful, the browser will automatically go to success_url string of stripe.
We want to create a new booking whenever that success_url is accessed. We could create a new route for this success, but then we would have to create a whole
new page and that's not really worth it in this case and that's because what we're gonna do in this lecture is a temporary solution, because it's not really secure.
Later when the website is deployed on a server, we will get access to the session object once the purchase is completed using stripe webhooks and these webhooks
will then be perfect for us to create a new booking. But for now, since we can't do that yet, let's use a workaround which is simply to put the data that we need to
create a new booking, right into the success_url as a query string and we NEED to create a query string because stripe will make a GET req to that success_url .
So we can't send a body object.

Adding the query strings to that success_url is not secure at all, because anyone who knows that url structure, could simply call it without going through the
checkout process! and so anyone really could just book a tour without having to pay. All they'd have to do is to open that success_url with that structure(query strings)
and then they would automatically create a new booking without even paying.

The '/' is the route hat will be hit, when a credit card is successfully charged and so this is also the point of time where we want
to create a new booking and so there is the place where we need to add that middleware function for creating a booking checkout.

When we say: res.redirect(req.originalUrl.split('?')[0]); in createBookingCheckout, we're gonna hit the / route AGAIN. So once more we're gonna hit the
same middleware(createBookingCheckout) for the second time, but now, the tour, user and price are no longer defined. Because we used res.redirect() in the first time
that we hit that middleware without any query string. So then we will go the next middleware which is getOverview handler function which will render the home page.

So after creating a new booking, we remove the query string from url in order to make the whole process a bit less transparent for the user. Basically so that whole
query string doesn't show up in our browser's url bar when we reach the homepage and we redirect the user to the new url without the query strings and this way the
createBookingCheckout won't get called again and then our normal homepage will get rendered.

208-18. Rendering a User's Booked Tours:

209-19. Finishing the Bookings API:

210-20. Final Considerations:
*/


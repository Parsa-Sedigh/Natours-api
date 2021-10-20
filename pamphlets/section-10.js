/* SECTION-10:10. Authentication, Authorization and Security:
125-1. Section Intro:
Authentication and authorization is all about users signing up and logging into our app and then allowing them to access certain
parts of app that are not accessible to non-logged in users.
For authentication we use JWT.

126-2. Modelling Users:
Authentication and authorization are all about users signing up, logging in and accessing pages our routes that we grant them
permission to do so. So it's really all about the users.
When we set a field with required: true the request must contain that field with it's value.
We didn't use a username property for user to login, because he will use it's email instead of username for login.
The email field is a unique identifier of each user so it must be unique for each user.
Learn: By default emails should be unique. But we 10% sure with this. by using unique: true in email field so there will be no accounts
 with the same email.

 Remember: lowercase is not a validator. All it's do is to transform the value of that field to lowercase.
 Photo field is usually optional in most web applications.
 Learn: If a user wants to upload a photo, that photo will be stored in our filesystem and the path to that photo will then be stored
  in the photo field in database. Like imageCover in tourModel file.

Usually the most secure passwords are the longest ones and not the ones with some symbols or crazy characters. So longer password
would be more effective than some symbols.

Later we must also use a validator to see if the confirmPassword field is the same as password.

Model variables are usually start with capital letter.*/

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

/* Important: In validate object and in our validator CUSTOM function which is inside validator property we cant's use an arrow function.
    Because we need this keyword.
    In validator function, we return true or false and if the return value if false, it means we would get a validation error and in this case
    we want to say if current passwordConfirm is equal to the current document's password(this.password) , then return true.

Learn: For accessing current document which we are currently validating it in the validator custom function, you can use this keyword.
 Also for accessing the field value that the validator is inside that validator, you can pass an arg to the custom validator function and
 receive it. For example, in this case we are passing el to the custom validator which this custom validator is in passwordConfirm
 field. So el would be the value of passwordConfirm in the current document.
 Also instead of el, you could use this.passwordConfirm . All of this would work ONLY IN SAVE!!!
 So because of this reason, whenever we want to update a user(or any other resource), we have to use save as well.
 For example, let's say users updated the his password with just a regular update method. Then in that case, that custom validator in
 passwordConfirm property  would no longer work.
 So again, the validators work when we create a new doc like .create() method, or on save. So for example:
 const newUser = User.create(req.body); for this one, the validators gonna work. Also we can use User.save() in order to update
 a user doc.*/

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  }
});

userSchema.pre('save', async function (next) {
  /* We only want to encrypt the password, if the password field has been updated. So basically only when really the password
  * has changed or also when it's created for the first time. Because imagine the user is only updating the email. Then in that
  * case, we don't want to encrypt the password AGAIN! So we must use isModified() method.
  * isModified() is a method in mongoose which is available on all of the documents that checks if a certain field has been modified and
  * in the () of this method, we pass the name of the field that we want to check if it was modified.
  *
  * In mongoose middlewares, if you were defined the callback function with function keyword and not with arrow functions, the
  * this keyword points to the current document.
  *
  * Remember: return next(); would exit the function and go to the next middleware mongoose. But:
  * return;
  * next();
  * would only just exit the function and won't execute next() . Because when we use return , further code in that function won't
  * executed. Therefore we used return and next() together in this case.
  *
  * It doesn't matter we use else in this case, because if the first if statement runs, the further code won't run so there is no need
  * of else in this case.
  *
  * In the end we need to delete the confirmedPassword. Because at this point, we only have the real password in hashed version.
  * How we can delete a field from a doc in db? We set it to undefined.
  * Important: So we only need the passwordConfirm for the validation and after the validation was successful, we actually no longer need that
  *  field. So we don't want passwordConfirm to be persisted in db. So before the saving it to db, we set it to undefined.
  *
  * Important: We set the passwordConfirm field to be required in schema, so how we can set it to undefined? Set a field to be required
  *  in schema, means it's a required INPUT and not is required to be persisted to the database. So the passwordConfirm field would never
  *  persisted to the db. Because before saving the data to db, we set passwordConfirm to undefined.
  *
  * Also passwordConfirm field is not in the result of sending the data of newly created user to the client. Because it didn't get to
  * the database.
  *  */
  if (!this.isModified('password')) {
    return next();
  } else {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;





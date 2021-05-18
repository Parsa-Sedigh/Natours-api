/* If you have multiple resources for API, it would be very easy to use the same functionality that other resources have.
* Because we have a reusable class, that we can use for each resource. */

class APIFeatures {

  /* query is the mongoose query and queryString is req.query and we're passing the query in this constructor, because we don't want
  to query data, INSIDE this class. Because that would bound this class to the tour resource, but we want this class to be as reusable
  as possible.
  Also we don't have access to req.query in this class, because it's not a middleware and it's not in () of .route() in tourRoutes() .
  So we need to pass in the query string or req.query to this class.

  The goal of this class is when we create an object of this class, we chain the methods of this class on the object and this means all
  of the methods of this class is gonna run one after another. But don't worry, we have if statements in the beginning of most of this
  methods that check if some parameters in query string are exist, then if exist the method will run. But for filter() we don't need to
  wrap it in if statement. Because it doesn't need.
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;

  }

  filter() {

    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach(el => delete queryObject[el]);
    let queryStr = JSON.stringify(queryObject);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
      return `$${match}`;
    });

    /* I commented out the next line of code(where we actually query data with mongoose), because this class is not only for tour
     resource. Instead we need to use query property that we defined in this class.
     Why we ADD .find() method to query property? Because in each method of this class, we query data with mongoose
     methods and these mongoose methods return a query, so we can chain them to query prop and when we create an object from this
     class, we call the class methods on it so that variable which is the object of class is containing queries. Because
     we call the class methods(which add mongoose methods) on the query prop of object.
     Recap: At the end of filter(), this.query prop will have find() method on it.In other words, after applying filter() on object,
     the query prop of object will have .find() method on it and later on we will have other mongoose methods which manipulate the
     query prop of object.So in the end, the query prop of object, is the query that we want to await for it and execute it.
     Remember: We always keep manipulating the query property, in other words, we keep adding more and more methods to query prop, until
     we execute it at the end. */
    // let query = Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    /*
    I commented out these lines, because if user requests a page that does not really exist, is not really an error and
    the fact that there are no results, is enough for user to realize that the page that he was requested doesn't contain
    any data. So we don't need to throw an error to user. But I kept this anyway.
    Also another reason for commenting out this piece of code is that in this code we are awaiting for our query, but
    the main goal is to add mongoose methods to query property and after creating an object and chaining the methods on
    objects, await the query property of object. So we can't await the query in the middle of our code.

    if (this.queryString) {
        const numDocs = this.query.countDocuments();
        if (skip >= numDocs) {

            throw new Error('This page does not exist.');
        }
    }
    */

    
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

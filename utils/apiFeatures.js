class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;

  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];

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
      const fields = this.queryString.fields.split(',').join(' ');
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

    /* We don't want to throw an error in case of requesting a page that doesn't exist.
      if (this.queryString) {
        const numDocs = this.query.countDocuments();
        if (skip >= numDocs) {

            throw new Error('This page does not exist.');
        }
    } */


    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

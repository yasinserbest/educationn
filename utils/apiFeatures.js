class APIFeatures {
  constructor(query, queryString) {
    //ilki mongoose query ikincisi expressten alınan (anlamadım)
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; //page tanımlı değilse queryde falan default olarak 1 alıcak.
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;

    //const numOfDocs = await model.find().countDocuments();
    //const numOfPages = Math.ceil(numOfDocs / limit);
    //console.log(numOfDocs, numOfPages);
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  sort() {
    //2) SORTING
    if (this.queryString.sort) {
      //req.query url'den gelenleri yazıyor hala aklında olsun unutmadın dimi?. ben urle ?sort=price dediğim için o sort'u query olarak aldı. orda sort yerine xx yazsaydım burda da xx yazıcaktım
      const sortBy = this.queryString.sort.split(",").join(" "); //birden fazla sorgu gelirse url kısmında virgülle, onları vs de aralarında virgül değil space ile almam lazım o yüzden böyle yaptım.
      //sort('price rating');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
}
module.exports = APIFeatures;

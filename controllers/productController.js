const data = require ('../data.json')

exports.getData = (req, res) =>{

  let query;
  if (req.query.search) {
    query = req.query.search
    query = query.toUpperCase()
  }

  const products = []
  Object.keys(data.products).forEach(productKey => {
    if (query) {
      let product = data.products[productKey]
      product.price = parseInt(product.price)
      product.upperTitle = product.title.toUpperCase()
      let titleArray = product.upperTitle.split(/ /g)

      let queries = query.split(/ /g)
      let perfectMatch = true
      let match = 0
      let belowMatch = false, aboveMatch = false
      let belowPrice = 0, abovePrice = 0
      let andOperator = false
      let orOperator = false
      let belowOperator = false, aboveOperator = false

      if (queries.indexOf('OR') > -1){
        let index = queries.indexOf('OR')
        queries.splice(index, 1);
        orOperator = true
      } else if (queries.indexOf('AND') > -1) {
        let index = queries.indexOf('AND')
        queries.splice(index, 1);
        andOperator = true
      }else {
        andOperator = true
      }

      if (queries.indexOf('BELOW') > -1) {
        let index = queries.indexOf('BELOW')
        belowPrice = queries[index+1]
        queries.splice(index, 2);
        belowOperator = true
      }

      if (queries.indexOf('ABOVE') > -1) {
        let index = queries.indexOf('ABOVE')
        abovePrice = queries[index + 1]
        queries.splice(index, 2);
        aboveOperator = true
      }

      queries.forEach( subQ => {
        let str = subQ.toUpperCase()
        if ((titleArray.indexOf(str)) > -1) {
          match++
        }else{
          perfectMatch = false
        }
      })

      if (belowOperator && belowPrice > product.price){
        belowMatch = true
      }

      if (aboveOperator && abovePrice < product.price){
        aboveMatch = true
      }


      if ((belowOperator === belowMatch) && (aboveOperator === aboveMatch)){
        if (orOperator && match > 0) {
          products.push(data.products[productKey])
        }else if(andOperator && perfectMatch){
          products.push(data.products[productKey])
        }
      }
    }else{
      products.push(data.products[productKey])
    }
  })


  products.sort((a, b) => {
    let popA = parseInt(a.popularity)
    let popB = parseInt(b.popularity)
    if (popA < popB)
      return 1;
    if (popA > popB)
      return -1;
    return 0;
  });


  res.render('products', {products})
}
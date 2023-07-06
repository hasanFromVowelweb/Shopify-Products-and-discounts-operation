// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import connect_mongo from "./frontend/models/mongo_connection.js";
import discountSchema from "./frontend/models/discount_schema.js";
import productSchema from "./frontend/models/product_schema.js";



const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();


connect_mongo();



app.post('/api/cart', (req, res) => {

  express.json()(req, res, async () => {
    try {

      const newData = req.body

      // console.log('newData', newData)
      const item = newData.items
      // console.log('item..............', item)


      const matchedData = item.map(async (data) => {

        console.log('data.total_discount...............', data.total_discount)

        if (data.total_discount == 0) {

          const variant_ID = `gid://shopify/ProductVariant/${data.variant_id}`
          // console.log('variant_ID............', variant_ID)
          const mathchedField = await discountSchema.find({ productVariantIDBuy: variant_ID })
          // console.log('mathchedField', mathchedField)
          // res.status(200).send(mathchedField)
          if (mathchedField.length > 0) {
            // console.log('mathchedField > 0', mathchedField)

            const data = mathchedField;
            // console.log('data..........', data)

            let maxPercentage = 0;
            let objectWithMaxPercentage = null;

            for (const obj of data) {
              if (obj.productPercentageGet > maxPercentage) {
                maxPercentage = obj.productPercentageGet;
                objectWithMaxPercentage = obj;
              }
            }

            if (objectWithMaxPercentage) {
              console.log('Object with the highest percentage:', objectWithMaxPercentage);
            } else {
              console.log('No object found with a percentage greater than 0');
            }
            res.status(200).send(objectWithMaxPercentage)

          }

        } else {
          return null
        }

      })
    } catch (error) {
      console.log('error saving', error)
    }

  })

})


app.get('/api/extesionDiscountData', async(req, res)=>{
    const data = await discountSchema.find()
    const lastData = data[data.length -1]
    console.log('data', data)
    console.log('lastData........................', lastData)
    res.status(200).send(lastData)
})


// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js


app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());


// app.post('/api/discountcreate', async (req, res) => {


//   try {
//     const newData = req.body
//     console.log('newData....', newData)
//     const datadb = new Discount(newData)
//     // console.log(await Discount.find())

//     /////////////////////////////////////////
//     const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });
//     const data = await client.query({
//       data: {
//         "query": `mutation discountAutomaticBxgyCreate($automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
//       discountAutomaticBxgyCreate(automaticBxgyDiscount: $automaticBxgyDiscount) {
//         automaticDiscountNode {
//           id
//           automaticDiscount {
//             ... on DiscountAutomaticBxgy { 
//               createdAt
//               startsAt
//               endsAt
//               status
//               summary
//               title
//               usesPerOrderLimit
//               customerGets {
//                 items {
//                   ... on DiscountProducts {
//                     products(first: 2) {
//                       nodes {
//                         id
//                       }
//                     }
//                   }
//                 }
//                 value {
//                   ... on DiscountOnQuantity {
//                     quantity {
//                       quantity
//                     }
//                   }
//                 }
//               }
//               customerBuys {
//                 items {
//                   ... on DiscountProducts {
//                     products(first: 2) {
//                       nodes {app.post('/api/discountcreate', (req, res) => {

//                         //   express.json()(req, res, async () => {
//                         //     try {
//                         //       const newData = req.body
//                         //       console.log('newData....', newData)
//                         //       const data = await new Discount(newData)

//                         //       /////////////////////////////////////////

//                         //       ////////////////////////////////////////

//                         //       await data.save()

//                         //     } catch (error) {
//                         //       console.log('error saving', error)
//                         //     }
//                         //   })

//                         // })
//                         id
//                       }
//                     }
//                   }
//                 }
//                 value {
//                   ... on DiscountQuantity {
//                     quantity
//                   }
//                 }
//               }
//             }
//           }
//         }
//         userErrors {
//           field
//           code
//           message
//         }
//       }
//     }`,
//         "variables": {
//           "automaticBxgyDiscount": {
//             "usesPerOrderLimit": newData.perOrderLimit,
//             "startsAt": `${newData.startingDate}T19:25:50.814Z`,
//             "title": newData.title,
//             "customerGets": {
//               "value": {
//                 "discountOnQuantity": {
//                   "quantity": String(newData.productQuantityGet),
//                   "effect": {
//                     "percentage": Number(newData.productPercentageGet)
//                   }
//                 }
//               },
//               "items": {
//                 "products": {
//                   "productsToAdd": [
//                     String(newData.selectedResource)
//                   ]
//                 }
//               }
//             },
//             "customerBuys": {
//               "value": {
//                 "quantity": String(newData.productQuantitybuy)
//               },
//               "items": {
//                 "products": {
//                   "productsToAdd": [
//                     String(newData.selectedResource)
//                   ]
//                 }
//               }
//             }
//           }
//         },
//       },
//     });

//     ////////////////////////////////////////

//     console.log('data...........................', data)
//     console.log('askjdfhasdflk')

//     // await datadb.save()
//     res.status(200).json(data)

//   } catch (error) {
//     console.log('error saving', error)
//   }


// })


app.get('/api/discountTableData', async (req, res) => {
  try {

    const discountData = await discountSchema.find()

    console.log("discountData....", discountData)

    res.status(200).send(discountData)
  }
  catch (error) {
    console.log(error)
  }
})



app.post('/api/discountcreate', async (req, res) => {
  try {
    const newData = req.body;
    console.log('newData....', newData);

    const percentageData = Number(newData.productPercentageGet / 100)
    console.log('percentage....', percentageData)

    const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });
    const data = await client.query({
      data: {
        "query": `mutation discountAutomaticBxgyCreate($automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
          discountAutomaticBxgyCreate(automaticBxgyDiscount: $automaticBxgyDiscount) {
            automaticDiscountNode {
              id
              automaticDiscount {
                ... on DiscountAutomaticBxgy { 
                  createdAt
                  startsAt
                  endsAt
                  status
                  summary
                  title
                  usesPerOrderLimit
                  customerGets {
                    items {
                      ... on DiscountProducts {
                        products(first: 2) {
                          nodes {
                            id
                          }
                        }
                      }
                    }
                    value {
                      ... on DiscountOnQuantity {
                        quantity {
                          quantity
                        }
                      }
                    }
                  }
                  customerBuys {
                    items {
                      ... on DiscountProducts {
                        products(first: 2) {
                          nodes {
                            id
                          }
                        }
                      }
                    }
                    value {
                      ... on DiscountQuantity {
                        quantity
                      }
                    }
                  }
                }
              }
            }
            userErrors {
              field
              code
              message
            }
          }
        }`,
        "variables": {
          "automaticBxgyDiscount": {
            "usesPerOrderLimit": newData.perOrderLimit,
            "startsAt": new Date(),
            "title": newData.title,
            "customerGets": {
              "value": {
                "discountOnQuantity": {
                  "quantity": newData.productQuantityGet,
                  "effect": {
                    "percentage": Number(percentageData)
                  }
                }
              },
              "items": {
                "products": {
                  "productsToAdd": [
                    newData.selectedResourceGet
                  ]
                }
              }
            },
            "customerBuys": {
              "value": {
                "quantity": newData.productQuantitybuy
              },
              "items": {
                "products": {
                  "productsToAdd": [
                    newData.selectedResourceBuy
                  ]
                }
              }
            }
          }
        },
      },
    });

    // console.log('data ID...........................', data.body.data.discountAutomaticBxgyCreate.automaticDiscountNode.id);
    // console.log('data Summary...........................', data.body.data.discountAutomaticBxgyCreate.automaticDiscountNode.automaticDiscount.summary);

    const datadb = new discountSchema({
      discountID: data.body.data.discountAutomaticBxgyCreate.automaticDiscountNode.id,
      summary: data.body.data.discountAutomaticBxgyCreate.automaticDiscountNode.automaticDiscount.summary,
      perOrderLimit: newData.perOrderLimit,
      productPercentageGet: newData.productPercentageGet,
      productQuantityGet: newData.productQuantityGet,
      productQuantitybuy: newData.productQuantitybuy,
      selectedResourceBuy: newData.selectedResourceBuy,
      selectedResourceGet: newData.selectedResourceGet,
      productVariantIDBuy: newData.productVariantIDBuy,
      productVariantIDGet: newData.productVariantIDGet,
      title: newData.title
    });

    await datadb.save()

    console.log('askjdfhasdflk');

    res.status(200).send(data);
  } catch (error) {
    console.log('error saving', error);
  }
});


app.post('/api/discountupdate', async (req, res) => {
  try {
    const updateData = req.body;
    console.log('updateData......', updateData)
    // console.log('updateData....', updateData.title);
    const DiscountTitle = await discountSchema.findOne({ title: updateData.title })
    console.log('DiscountTitleeeeeeeeeeeeeeeee', DiscountTitle)

    const discountid = DiscountTitle.discountID
    const id = discountid.slice(36)

    console.log('id split......', id)

    console.log('discountid', typeof (discountid))
    console.log(' updateData.productVariantIDBuy', typeof (updateData.productVariantIDBuy))
    console.log('updateData.productQuantitybuy', typeof (String(updateData.productQuantitybuy)))
    console.log('updateData.selectedResourceGet', typeof (updateData.selectedResourceGet))
    console.log('updateData.productPercentageGet', typeof (updateData.productPercentageGet))
    console.log('id in used', `gid://shopify/DiscountAutomaticBxgy/${id}`)



    console.log('discountid', discountid)
    console.log(' updateData.productVariantIDBuy', updateData.productVariantIDBuy)
    console.log('updateData.productQuantitybuy', updateData.productQuantitybuy)
    console.log('updateData.selectedResourceGet', updateData.selectedResourceGet)
    console.log('updateData.productPercentageGet', updateData.productPercentageGet)
    const percentage = updateData.productPercentageGet / 100

    console.log('percentage', percentage)

    const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });

    const data = await client.query({
      data: {
        "query": `mutation discountAutomaticBxgyUpdate($automaticBxgyDiscount: DiscountAutomaticBxgyInput!, $id: ID!) {
      discountAutomaticBxgyUpdate(automaticBxgyDiscount: $automaticBxgyDiscount, id: $id) {
        automaticDiscountNode {
          id
          automaticDiscount {
            ... on DiscountAutomaticBxgy {
              customerGets {
                items {
                  ... on DiscountProducts {
                    products(first: 2) {
                      nodes {
                        id
                      }
                    }
                  }
                }
                value {
                  ... on DiscountOnQuantity {
                    quantity {
                      quantity
                    }
                  }
                }
              }
              customerBuys {
                items {
                  ... on DiscountProducts {
                    products(first: 2) {
                      nodes {
                        id
                      }
                    }
                  }
                }
                value {
                  ... on DiscountQuantity {
                    quantity
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          code
          message
        }
      }
    }`,
        "variables": {
          "automaticBxgyDiscount": {
            "customerGets": {
              "value": {
                "discountOnQuantity": {
                  "quantity": String(updateData.productQuantityGet),
                  "effect": {
                    "percentage": Number(percentage)
                  }
                }
              },
              "items": {
                "products": {
                  "productsToRemove": [
                    DiscountTitle.selectedResourceGet
                  ],
                  "productsToAdd": [
                    updateData.selectedResourceGet
                  ]
                }
              }
            },
            "customerBuys": {
              "value": {
                "quantity": String(updateData.productQuantitybuy)
              },
              "items": {
                "products": {
                  "productsToRemove": [
                    DiscountTitle.selectedResourceBuy
                  ],
                  "productsToAdd": [
                    updateData.selectedResourceBuy
                  ]
                }
              }
            }
          },
          "id": discountid
        },
      },
    });

    const updatedDiscount = await discountSchema.findOneAndUpdate(
      { _id: DiscountTitle._id },
      updateData,
      { new: true }
    );


    res.status(200).send(data);
    console.log('data....', data)

  } catch (error) {
    console.log('error saving', error);
  }
});


app.post('/api/discountdelete', async (req, res) => {
  try {
    const deleteData = req.body;
    console.log('discount data for delete....', deleteData);
    const DiscountTitle = await discountSchema.findOne({ title: deleteData.title })

    const discountid = DiscountTitle.discountID
    console.log('discountid for delete: ', discountid)


    const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });
    const data = await client.query({
      data: {
        "query": `mutation discountAutomaticDelete($id: ID!) {
      discountAutomaticDelete(id: $id) {
        deletedAutomaticDiscountId
        userErrors {
          field
          code
          message
        }
      }
    }`,
        "variables": {
          "id": discountid
        },
      },
    });

    const deleteDiscount = await discountSchema.findOneAndDelete(
      { _id: DiscountTitle._id },
      { new: true }
    );

    console.log(data);

    res.status(200).send(data);
  } catch (error) {
    console.log('error saving', error);
  }
});


//////////////////////////////////////////////////////////////////////////////////////


app.get('/api/productData', async (req, res) => {

  const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });
  try {
    const data = await client.query({
      data: {
        query: `
          query  {
            products(first: 5, reverse: true) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                cursor
                node {
                  id
                  title
                  handle
                  createdAt
                  priceRange {
                    maxVariantPrice {
                      amount
                      currencyCode
                    }
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        originalSrc
                      }
                    }
                  }
                }
              }
            }
          }
        `
      },
    });
    // console.log('product....', data);
    res.status(200).json(data?.body.data);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/productDataNext/:cursorData', async (req, res) => {

  const cursorData = String(req.params.cursorData)
  console.log('cursorData.......for next: ', cursorData)

  const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });
  try {
    const data = await client.query({
      data: {
        query: `
          query ($cursor: String) {
            products(first: 5, after: $cursor, reverse: true) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                cursor
                node {
                  id
                  title
                  handle
                  createdAt
                  priceRange {
                    maxVariantPrice {
                      amount
                      currencyCode
                    }
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        originalSrc
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          cursor: cursorData
        },
      },
    });
    // console.log('product....', data);
    res.status(200).json(data?.body.data);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/productDataPrev/:cursorData', async (req, res) => {

  const cursorData = String(req.params.cursorData)
  console.log('cursorData.......for next: ', cursorData)

  const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });
  try {
    const data = await client.query({
      data: {
        query: `
          query ($cursor: String) {
            products(last: 5, before: $cursor, reverse: true) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                cursor
                node {
                  id
                  title
                  handle
                  createdAt
                  priceRange {
                    maxVariantPrice {
                      amount
                      currencyCode
                    }
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        originalSrc
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          cursor: cursorData
        },
      },
    });
    // console.log('product....', data);
    res.status(200).json(data?.body.data);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/api/productPriceUpdate', async (req, res) => {
  try {
    const productPriceData = req.body;
    console.log('productPriceData...........................:.......', productPriceData);

    const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });

    const data = await client.query({
      data: `mutation {
    productUpdate(input: {id: "${productPriceData.data.productID}", variants:{price: "${productPriceData.data.price}"}}) {
      product {
        id
      }
    }
  }`,
    });

    console.log('data from update..............................:.....', data);

    res.status(200).json(data);

  } catch (error) {
    console.log(error);
  }
});


app.post('/api/productDelete', async (req, res) => {

  try {
    const productDeleteData = req.body
    console.log('productDeleteData....', productDeleteData)
    console.log('id........', productDeleteData.node.id)

    const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });

    const data = await client.query({
      data: `mutation {
      productDelete(input: {id: "${productDeleteData.node.id}" }) {
      deletedProductId
      }
    }`,
    });

    console.log('data of delete...', data)
    res.status(200).json(data)
  }
  catch (error) {
    console.log('error while deleting', error)
  }

})



app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);

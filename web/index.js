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

      console.log('newData', newData)
      const item = newData.items
      console.log('item..............', item)

      const matchedData = item.map(async (data) => {
        const Product_ID = `gid://shopify/Product/${data.product_id}`
        console.log('Product_ID............', Product_ID)

        const mathchedField = await discountSchema.find({ selectedResourceBuy: Product_ID })

        if (mathchedField.length > 0) {
          console.log('mathchedField................', mathchedField)

          res.status(200).json(mathchedField)
        }
      })

    } catch (error) {
      console.log('error saving', error)
    }
  })

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
            "startsAt": `${newData.startingDate}T19:25:50.814Z`,
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
      startingDate: newData.startingDate,
      title: newData.title
    });

    await datadb.save()


    console.log('askjdfhasdflk');

    res.status(200).send(data);
  } catch (error) {
    console.log('error saving', error);
  }
});


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

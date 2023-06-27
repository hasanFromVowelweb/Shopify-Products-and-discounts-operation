
setInterval(async () => {
    try {

        const response = await fetch('https://my-store-development-14.myshopify.com/cart.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log('"result" from extension...........', result);
            // var quantityOfItem = result.items[0].quantity

            // console.log('quantityOfItem', quantityOfItem)

            const responseGet = await fetch('https://my-store-development-14.myshopify.com/apps/hype/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(result)
            });

            if (responseGet.ok) {
                const resultGet = await responseGet.json();
                console.log('"response" from frontend to extension...........', resultGet);
                const productVariant = resultGet[0].productVariantIDGet;

                const productVariantID = productVariant.slice(29)  // gid://shopify/ProductVariant/45363417841954
                
                console.log('productVariantID......', productVariantID)

                const shopName = window.location.host
                const makeChanges = await fetch(`https://${shopName}/cart/add.js`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'id': productVariantID,
                        'quantity': 2
                    })
                }).then(() => {
                    // window.location.replace(https://${shopName}/cart)
                    window.location.reload()
                }).catch((error) => {
                    console.log("error", error)
                })

            }

        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}, 2000)



































// document.addEventListener('DOMContentLoaded', function () {
//     var form = document.getElementById('extension-form');
//     var emailInput = document.getElementById('email');
//     var feedbackInput = document.getElementById('feedback');

//     form.addEventListener('submit', async (event) => {
//         event.preventDefault();


//         const email = emailInput.value;
//         const feedback = feedbackInput.value;

//         console.log('email', email)
//         console.log('feedback', feedback)

//         const data = {
//             email: email,
//             feedback: feedback
//         };



//         try {
//             const response = await fetch('https://my-store-development-14.myshopify.com/apps/praoz/api/feedback', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(data)
//             });

//             if (response.ok) {
//                 const result = await response.json();
//                 console.log(result);
//                 var coupon = result.body.data.discountCodeBasicCreate.codeDiscountNode.codeDiscount.codes.nodes[0].code
//                 ///////////////////////here add/////////////////////////////////////
//                 const popupDiv = document.getElementById('popup');
//                 popupDiv.style.display = (popupDiv.style.display === 'none') ? 'block' : 'none';
//                 popupDiv.addEventListener('click', function () {

//                     navigator.clipboard.writeText(coupon)
//                         .then(function () {
//                             console.log('Text copied to clipboard:', coupon);
//                             popupDiv.style.display = 'none';
//                         })
//                         .catch(function (error) {
//                             console.error('Unable to copy text to clipboard:', error);
//                         });

//                 });

//                 /////////////////////////////////////////////////////////////
//             } else {
//                 console.error('Error:', response.status);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }

//     });
// });


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
            var lastItem = result.items.length - 1

            var quantityOfItem = result?.items[lastItem]?.quantity

            console.log('quantityOfItem', quantityOfItem)

            
                const responseGet = await fetch('https://my-store-development-14.myshopify.com/apps/hype-1/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(result)
                });
                const resultGet = await responseGet.json();

                if (responseGet.ok) {

                    if (quantityOfItem == 1) {
                    console.log('"response" from frontend to extension...........', resultGet);

                    const productVariant = resultGet.productVariantIDGet;
                    console.log('productVariant///////////////////', productVariant)

                    const productVariantID = productVariant.slice(29)  // gid://shopify/ProductVariant/45363417841954

                    const shopName = window.location.host
                    const makeChanges = await fetch(`https://${shopName}/cart/add.js`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'id': productVariantID,
                            'quantity': 1
                        })
                    }).then(() => {
                        // window.location.replace(https://${shopName}/cart)
                        window.location.reload()
                    }).catch((error) => {
                        console.log("error", error)
                    })
                } else {

                    return null
                }

            }
            


        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}, 2000)

console.log("enterr")

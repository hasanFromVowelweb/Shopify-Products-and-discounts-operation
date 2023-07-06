//////////////////////////// popup banner ///////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(async function () {
        //////////////prodct data fetch and display in extension////////////////////////////////

        // const res = await fetch('https://my-store-development-14.myshopify.com/apps/hype-1/api/extesionDiscountData',{
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        // })

        // if (res.ok){
        //     const result = await res.json()
        //     console.log('discountID......', result.discountID)

        //     document.getElementById('discountID').innerHTML = `discountID: ${result.discountID.slice(36)}`
        //     document.getElementById('summary').innerHTML = `summary: ${result.summary}`
        //     document.getElementById('perOrderLimit').innerHTML = `perOrderLimit: ${result.perOrderLimit}`
        //     document.getElementById('productPercentageGet').innerHTML = `productPercentageGet: ${result.productPercentageGet}`
        //     document.getElementById('productQuantityGet').innerHTML = `productQuantityGet: ${result.productQuantityGet}`
        //     document.getElementById('productQuantitybuy').innerHTML = `productQuantitybuy: ${result.productQuantitybuy}`
        //     document.getElementById('selectedResourceBuy').innerHTML = `selectedResourceBuy: ${result.selectedResourceBuy.slice(22)}`
        //     document.getElementById('selectedResourceGet').innerHTML = `selectedResourceGet: ${result.selectedResourceGet.slice(22)}`
        //     document.getElementById('title').innerHTML = `title: ${result.title}`

        //     console.log('result from extension for a products data', result)
        // } else{
        //     console.log('error fetching data:', res.status)
        // }

        const url = 'https://my-store-development-14.myshopify.com/apps/hype-1/api/extesionDiscountData';

        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (res.ok) {
                const result = await res.json();
                console.log('result from extension of products data', result);

                const mappings = {
                    discountID: 'discountID',
                    summary: 'summary',
                    perOrderLimit: 'perOrderLimit',
                    productPercentageGet: 'productPercentageGet',
                    productQuantityGet: 'productQuantityGet',
                    productQuantitybuy: 'productQuantitybuy',
                    selectedResourceBuy: 'selectedResourceBuy',
                    selectedResourceGet: 'selectedResourceGet',
                    title: 'title'
                };

                for (const [key, id] of Object.entries(mappings)) {
                    document.getElementById(id).innerHTML = `${key}: ${result[key]}`;
                }
            } else {
                console.log('error fetching data:', res.status);
            }
        } catch (error) {
            console.log('error:', error);
        }


        /////////////////////pop up code///////////////////////////
        var toPopup = document.getElementById("toPopup");

        toPopup.style.display = "block";

    }, 1000);

    var closeButton = document.getElementById("close");
    var toPopup = document.getElementById("toPopup");

    function fadeOutPopups() {
        toPopup.style.display = "none";
    }

    closeButton.addEventListener("click", fadeOutPopups);

    document.addEventListener("keyup", function (e) {
        if (e.key === "Escape") {
            fadeOutPopups();
        }
    });
});


//////////////////////////////// cart discoun add /////////////////////////////////////////////////
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

////////////////////////////////////extension running check////////////////////////////////////

console.log("Theme app extension is running!")

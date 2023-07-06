import { useState, useCallback, useEffect } from 'react';
import { useIndexResourceState, Form, Frame, Toast, Spinner, DatePicker, FormLayout, Divider, RangeSlider, TextField, Checkbox, Button, LegacyCard, Text, IndexTable, Layout, } from '@shopify/polaris';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch';

import { Provider, ResourcePicker } from '@shopify/app-bridge-react';




export default function FormTable({ receivedData, resetEditData }) {

    const doSomething = useAuthenticatedFetch();

    const [input, setInput] = useState({
        perOrderLimit: '',
        title: '',
        selectedResourceBuy: '',
        selectedResourceGet: '',
        productVariantIDBuy: '',
        productVariantIDGet: '',
        productQuantityGet: '',
        productPercentageGet: '',
        productQuantitybuy: ''
    });

    ///////////////////////resource picker/////////////////
    const [openResource, setOpenResource] = useState(false);
    const [openResource2, setOpenResource2] = useState(false);
    const [toastActive, setToastActive] = useState(false);

    const [selectedResourceBuy, setSelectedResourceBuy] = useState(null);
    const [selectedResourceGet, setSelectedResourceGet] = useState(null);
    const [submitState, setSubmitState] = useState(false)

    const [spinnerState, setSpinnerState] = useState(false)




    ////////////////////////////////


    useEffect(() => {
        console.log('receivedData.........', receivedData)
        console.log(typeof (receivedData))
        if (receivedData.perOrderLimit) {
            setInput({
                perOrderLimit: receivedData.perOrderLimit,
                title: receivedData.title,
                selectedResourceBuy: '',
                selectedResourceGet: '',
                productVariantIDBuy: receivedData.productVariantIDBuy,
                productVariantIDGet: receivedData.productVariantIDGet,
                productQuantityGet: receivedData.productQuantityGet,
                productPercentageGet: receivedData.productPercentageGet,
                productQuantitybuy: receivedData.productQuantitybuy,
            })
            setSubmitState(true)
            resetEditData('')
        }
    }, [receivedData])


    ///////////////////////////////



    const handleReset = useCallback(() => {
        setInput({
            perOrderLimit: '',
            title: '',
            selectedResourceBuy: '',
            selectedResourceGet: '',
            productVariantIDBuy: '',
            productVariantIDGet: '',
            productQuantityGet: '',
            productPercentageGet: '',
            productQuantitybuy: ''
        })
        setSubmitState(false)
        setSpinnerState(false)
    }, []);


    const handleSubmit = useCallback(async () => {

        if (input.perOrderLimit.length < 1) {
            alert("Per Order Limit shouldn't be empty!")
        }
        else if (input.title.length < 1) {
            alert("Title shouldn't be empty!")
        }
        else if (input.selectedResourceBuy.length < 1) {
            alert("Product shouldn't be empty!")
        }
        else if (input.selectedResourceGet.length < 1) {
            alert("Product shouldn't be empty!")
        }
        else if (input.productQuantityGet.length < 1) {
            alert("Product Quantity shouldn't be empty!")
        }
        else if (input.productPercentageGet.length < 1) {
            alert("Product Percentage shouldn't be empty!")
        }
        else if (input.productQuantitybuy.length < 1) {
            alert("Product Quantity shouldn't be empty!")
        } else {

            console.log('data to submit.......', input)

            try {
                setSpinnerState(true)
                const response = await doSomething('/api/discountcreate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(input)
                });

                const data = await response.json();
                console.log('data from frontend created', data)

                if (response.ok) {
                    console.log('Data sent successfully');
                    setSpinnerState(false)
                    setToastActive((active) => !active)
                } else {
                    console.error('Failed to send data :', data.error);
                }
            } catch (error) {
                console.error('Error sending data:', error);
            }

            setInput({
                perOrderLimit: '',
                title: '',
                selectedResourceBuy: '',
                selectedResourceGet: '',
                productVariantIDBuy: '',
                productVariantIDGet: '',
                productQuantityGet: '',
                productPercentageGet: '',
                productQuantitybuy: ''
            })
        }

    }, [input]);


    const handleSubmitUpdate = useCallback(async () => {

        if (input.perOrderLimit.length < 1) {
            alert("Per Order Limit shouldn't be empty!")
        }
        else if (input.title.length < 1) {
            alert("Title shouldn't be empty!")
        }
        else if (input.selectedResourceBuy.length < 1) {
            alert("Product shouldn't be empty!")
        }
        else if (input.selectedResourceGet.length < 1) {
            alert("Product shouldn't be empty!")
        }
        else if (input.productQuantityGet.length < 1) {
            alert("Product Quantity shouldn't be empty!")
        }
        else if (input.productPercentageGet.length < 1) {
            alert("Product Percentage shouldn't be empty!")
        }
        else if (input.productQuantitybuy.length < 1) {
            alert("Product Quantity shouldn't be empty!")
        } else {
            console.log('data to update.......', input)
            setSpinnerState(true)
            try {
                const response = await doSomething('/api/discountupdate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(input)
                });

                const data = await response.json();
                console.log('data from frontend updated', data)

                if (response.ok) {
                    console.log('Data sent for update successfully');
                    setToastActive((active) => !active)
                    setSpinnerState(false)
                } else {
                    console.error('Failed to send data for update :', data.error);
                }
            } catch (error) {
                console.error('Error sending data:', error);
            }

            setSubmitState(false)
            setInput({
                perOrderLimit: '',
                title: '',
                selectedResourceBuy: '',
                selectedResourceGet: '',
                productVariantIDBuy: '',
                productVariantIDGet: '',
                productQuantityGet: '',
                productPercentageGet: '',
                productQuantitybuy: ''
            })

        }


    }, [input]);


    ///////////////////////////////resourcePicker/////////////////////////////

    const config = {
        apiKey: `${process.env.SHOPIFY_API_KEY}`,
        host: new URLSearchParams(location.search).get("host"),
        forceRedirect: true
    };

    const handleSelectPicker = (resources) => {
        setOpenResource(false);
        setSelectedResourceBuy(resources.selection[0]);
        setInput((prevState) => ({
            ...prevState,
            selectedResourceBuy: resources.selection[0].id,
            productVariantIDBuy: resources.selection[0].variants[0].id
        }));
    };

    const handleCancelPicker = () => {
        setOpenResource(false);

    };

    ///////////

    const handleSelectPicker2 = (resources) => {
        setOpenResource2(false);
        setSelectedResourceGet(resources.selection[0]);
        setInput((prevState) => ({
            ...prevState,
            selectedResourceGet: resources.selection[0].id,
            productVariantIDGet: resources.selection[0].variants[0].id
        }));
    };

    const handleCancelPicker2 = () => {
        setOpenResource2(false);

    };


    /////////////////////////////////////////////////////////////////////////

    //////////////////////Toast//////////////////////////////////////////////

    const dismissToast = useCallback(() => setToastActive((active) => !active), []);

    const toastMarkup = toastActive ? (
        <Toast content="Successfully submitted!" onDismiss={dismissToast} />
    ) : null;

    ////////////////////////////////////////////////////////////////////////



    const handleInputChange = useCallback((value, label) => {
        setInput(prevState => ({
            ...prevState,
            [label]: value
        }));
        console.log('input', input);
    }, [input]);


    return (
        <Layout>
            <Frame>
                <LegacyCard sectioned>

                    <Form onSubmit={submitState ? handleSubmitUpdate : handleSubmit}>
                        <FormLayout>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                <div style={{ flexBasis: '100%', marginBottom: '16px' }}>
                                    <code>Common Fields:-</code>
                                </div>
                                <div style={{ flexBasis: '30%', marginBottom: '16px' }}>
                                    <TextField
                                        value={input.perOrderLimit}
                                        onChange={(value) => handleInputChange(value, 'perOrderLimit')}
                                        label="Per Order Limit:"
                                        type="number"

                                    />

                                </div>
                                <div style={{ flexBasis: '30%', marginBottom: '16px' }}>
                                    <TextField
                                        value={input.title}
                                        onChange={(value) => handleInputChange(value, 'title')}
                                        label="Title"
                                        type="text"
                                    />
                                </div>
                                <div style={{ flexBasis: '30%', marginBottom: '16px' }}>

                                </div>
                                <div style={{ flexBasis: '100%', marginBottom: '16px' }}>
                                    <code>Customer Gets:-</code>
                                </div>
                                <div style={{ flexBasis: '30%', marginBottom: '16px' }}>
                                    <TextField
                                        label="Product:"
                                        value={input.selectedResourceGet ? selectedResourceGet.title : ''}
                                        readOnly
                                    />

                                    {toastMarkup}


                                    <Button onClick={() => setOpenResource2(true)}>Select Product </Button>
                                    {openResource2 && (
                                        <Provider config={config}>
                                            <ResourcePicker
                                                resourceType="Product"
                                                selectMultiple={false}
                                                open={openResource2}
                                                onSelection={handleSelectPicker2}
                                                onCancel={handleCancelPicker2}
                                            />
                                        </Provider>

                                    )}
                                </div>

                                <div style={{ flexBasis: '30%', marginBottom: '16px' }}>
                                    <TextField
                                        value={input.productQuantityGet}
                                        onChange={(value) => handleInputChange(value, 'productQuantityGet')}
                                        label="Product Quantity:"
                                        type="number"
                                    />
                                </div>

                                <div style={{ flexBasis: '30%', marginBottom: '16px' }}>
                                    <TextField
                                        value={input.productPercentageGet}
                                        onChange={(value) => handleInputChange(value, 'productPercentageGet')}
                                        label="Product Percentage:"
                                        type="number"

                                    />
                                </div>
                                <div style={{ flexBasis: '100%', marginBottom: '16px' }}>
                                    <code>Customer Buy:-</code>
                                </div>
                                <div style={{ flexBasis: '30%', marginBottom: '16px' }}>
                                    <TextField
                                        label="Product:"
                                        value={input.selectedResourceBuy ? selectedResourceBuy.title : ''}
                                        readOnly
                                    />
                                    <Button onClick={() => setOpenResource(true)}>Select Product</Button>
                                    {openResource && (
                                        <Provider config={config}>
                                            <ResourcePicker
                                                resourceType="Product"
                                                selectMultiple={false}
                                                open={openResource}
                                                onSelection={handleSelectPicker}
                                                onCancel={handleCancelPicker}
                                            />
                                        </Provider>
                                    )}
                                </div>
                                <div style={{ flexBasis: '30%', marginBottom: '16px' }}>
                                    <TextField
                                        value={input.productQuantitybuy}
                                        onChange={(value) => handleInputChange(value, 'productQuantitybuy')}
                                        label="Product Quantity:"
                                        type="number"
                                    />
                                </div>

                                <div style={{ flexBasis: '30%', marginBottom: '16px' }}>
                                </div>

                                <div style={{ flexBasis: '30%', marginBottom: '16px' }}>

                                </div>

                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button destructive onClick={handleReset}>Reset </Button>
                                <Button submit>Submit {spinnerState ? <Spinner accessibilityLabel="Spinner example" size="small" /> : null}</Button>
                            </div>
                        </FormLayout>
                    </Form>

                </LegacyCard>
            </Frame>

            <Divider />
        </Layout>

    );
}


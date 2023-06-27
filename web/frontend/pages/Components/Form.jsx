import { useState, useCallback, useEffect } from 'react';
import { useIndexResourceState, Form, DatePicker, FormLayout, Divider, RangeSlider, TextField, Checkbox, Button, LegacyCard, Text, IndexTable, Layout, } from '@shopify/polaris';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch';

import { Provider, ResourcePicker } from '@shopify/app-bridge-react';




export default function FormTable() {

    const doSomething = useAuthenticatedFetch();

    const [input, setInput] = useState({
        perOrderLimit: '',
        startingDate: '',
        title: '',
        selectedResourceBuy: '',
        selectedResourceGet: '',
        productVariantIDBuy: '',
        productVariantIDGet: '',
        productQuantityGet: '',
        productPercentageGet: '',
        productQuantitybuy: ''
    });
    const [tableData, setTableData] = useState([])

    ///////////////////////resource picker/////////////////
    const [openResource, setOpenResource] = useState(false);
    const [openResource2, setOpenResource2] = useState(false);


    const [selectedResourceBuy, setSelectedResourceBuy] = useState(null);
    const [selectedResourceGet, setSelectedResourceGet] = useState(null);



    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (newStartDate) => {
        setStartDate(newStartDate);
    };

    const handleEndDateChange = (newEndDate) => {
        setEndDate(newEndDate);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await doSomething('https://my-store-development-14.myshopify.com/cart.json');
                const data = await response.json();
                console.log('fetched cart data: ', data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        
    }, [])


    const handleSubmit = useCallback(async () => {
        console.log('data to post.......', input)

        try {
            const response = await doSomething('/api/discountcreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(input)
            });

            const data = await response.json();
            console.log('data from frontend', data)

            if (response.ok) {
                console.log('Data sent successfully');
            } else {
                console.error('Failed to send data :', data.error);
            }
        } catch (error) {
            console.error('Error sending data:', error);
        }

        console.log('fetch', fetch)

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
            productVariantIDBuy :resources.selection[0].variants[0].id
        }));
    };

    



    const handleCancelPicker = () => {
        setOpenResource(false);

    };

    ///////

    const handleSelectPicker2 = (resources) => {
        setOpenResource2(false);
        setSelectedResourceGet(resources.selection[0]);
        setInput((prevState) => ({
            ...prevState,
            selectedResourceGet: resources.selection[0].id,
            productVariantIDGet :resources.selection[0].variants[0].id
        }));
    };

    const handleCancelPicker2 = () => {
        setOpenResource2(false);

    };


    /////////////////////////////////////////////////////////////////////////



    const handleInputChange = useCallback((value, label) => {
        setInput(prevState => ({
            ...prevState,
            [label]: value
        }));
        console.log('input', input);
    }, [input]);


    return (
        <Layout>
            <LegacyCard sectioned>
                <Form onSubmit={handleSubmit}>
                    <FormLayout>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <div style={{ flexBasis: '100%', marginBottom: '16px' }}>
                                <h1>Common Fields:-</h1>
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
                                    value={input.startingDate}
                                    onChange={(value) => handleInputChange(value, 'startingDate')}
                                    label="Starting Date:"
                                    type="text"
                                    helpText="Format: year-month-date"
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
                            <div style={{ flexBasis: '100%', marginBottom: '16px' }}>
                                <h1>Customer Gets:-</h1>
                            </div>
                            <div style={{ flexBasis: '30%', marginBottom: '16px' }}>
                                <TextField
                                    label="Product:"
                                    value={input.selectedResourceGet ? selectedResourceGet.title : ''}
                                    readOnly
                                />
                                <Button onClick={() => setOpenResource2(true)}>Select Product</Button>
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
                                <h1>Customer Buy:-</h1>
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
                            <Button submit>Submit</Button>
                        </div>
                    </FormLayout>
                </Form>
            </LegacyCard>

            <Divider />
        </Layout>

    );
}


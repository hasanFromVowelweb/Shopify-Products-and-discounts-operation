import React, { useEffect, useState, useCallback, useRef } from 'react'
import DeleteDiscount from './DeleteDiscount'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import {
    LegacyCard,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText, Frame, Toast, Pagination, Button,
    Loading, IndexTable, useIndexResourceState, Text, Modal, LegacyStack, DropZone, Checkbox
} from '@shopify/polaris';
import EditProductPrice from './EditProductPrice';
import EditBulkProduct from './EditBulkProduct';


export default function ProductsTable() {

    const [productData, setProductData] = useState('')
    const doSomething = useAuthenticatedFetch()
    const [isLoading, setLoading] = useState(true)
    const [toastActive, setToastActive] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const [editData, setEditData] = useState()
    const [ProductDeleteData, setProductDeleteData] = useState()
    const [hasNextPage, setHasNextPage] = useState()
    const [hasPreviousPage, setHasPreviousPage] = useState()
    const [startCursor, setStartCursor] = useState()
    const [endCursor, setEndCursor] = useState()
    const [initialCount, setInitialCount] = useState(1)
    const [modalOpen, setModalOpen] = useState(false);
    const [bulkProductData, setBulkProductData] = useState({
        productId: '',
        price: ''
    })
    const [bulkUpdateId, setBulkUpdateId] = useState()
    const [LoadingState, setLoadingState] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await doSomething('/api/productData');

                if (response.ok) {
                    const data = await response.json();
                    data && setLoading(false);
                    console.log('fetched all data: ', data);
                    setInitialCount(1)
                    setHasNextPage(data?.products?.pageInfo?.hasNextPage);
                    setHasPreviousPage(data?.products?.pageInfo?.hasPreviousPage);
                    setEndCursor(data?.products?.pageInfo?.endCursor);
                    setStartCursor(data?.products?.pageInfo?.startCursor);
                    setProductData(data?.products?.edges);
                    setLoadingState(false)
                } else {
                    console.log('did not get response');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refresh]);

    useEffect(() => {
        // console.log('startCursor.....', startCursor);
        // console.log('endCursor......', endCursor);
        // console.log('hasNextPage', hasNextPage)
        // console.log('hasPreviousPage', hasPreviousPage)
        // console.log(initialCount, 'initialCount')
        console.log('productData...........', productData && productData)
        console.log('bulkProductData.......', bulkProductData)
    }, [startCursor, endCursor, hasNextPage, hasPreviousPage, initialCount]);


    //////////////////////Toast//////////////////////////////////////////////

    const dismissToast = useCallback(() => setToastActive((active) => !active), []);

    const toastMarkup = toastActive ? (
        <Toast content="Successfully action executed!" onDismiss={dismissToast} />
    ) : null;




    ////////////////////////////////////////////////////////////////////////



    const handleNext = useCallback(async () => {

        try {
            const response = await doSomething(`/api/productDataNext/${endCursor}`);

            if (response.ok) {
                const data = await response.json();
                data && setLoading(false);
                console.log('fetched all next data: ', data);
                setInitialCount(initialCount + 5)
                setHasNextPage(data?.products?.pageInfo?.hasNextPage);
                setHasPreviousPage(data?.products?.pageInfo?.hasPreviousPage);
                setEndCursor(data?.products?.pageInfo?.endCursor);
                setStartCursor(data?.products?.pageInfo?.startCursor);
                setProductData(data?.products?.edges);

            } else {
                console.log('did not get response');
            }
        } catch (error) {
            console.error('Error fetching Next data:', error);
        }

    }, [endCursor])


    const handlePrev = useCallback(async () => {
        try {
            const response = await doSomething(`/api/productDataPrev/${startCursor}`);

            if (response.ok) {
                const data = await response.json();
                console.log('fetched all prev data: ', data);
                setInitialCount(initialCount - 5)
                setHasNextPage(data?.products?.pageInfo?.hasNextPage);
                setHasPreviousPage(data?.products?.pageInfo?.hasPreviousPage);
                setEndCursor(data?.products?.pageInfo?.endCursor);
                setStartCursor(data?.products?.pageInfo?.startCursor);
                setProductData(data?.products?.edges);
            } else {
                console.log('did not get response');
            }
        } catch (error) {
            console.error('Error fetching Prev data:', error);
        }
    }, [startCursor])




    console.log('productData..........', productData)



    function editHandle(data) {
        console.log('this is an id to update:', data)
        setEditData(data)
    }


    function deleteHandle(data) {
        console.log('this is an id to delete:', data)
        setProductDeleteData(data)
    }


    const handleResponseUpdate = useCallback(async (data) => {
        console.log('data from productsTable.....', data)
        const url = '/api/productPriceUpdate'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': 'YOUR_ACCESS_TOKEN',
            },
            body: JSON.stringify({ data }),
        };

        try {
            const response = await doSomething(url, options);

            if (response.ok) {
                setToastActive((active) => !active)
                setRefresh((before) => {
                    return !before
                })
                const data = await response.json();
                console.log(data);
            }
            else {
                console.log('error fetching response!', response.status)
            }

        } catch (error) {
            console.error(error);
        }
    }, [])




    const handleBulkUpdate = useCallback(async (data) => {

        setLoadingState(true)

        for (let i = 0; i < selectedResources?.length; i++) {
            console.log('i from edit data', selectedResources[i]);
            console.log('data from handleBulkUpdate.....', data);

            const url = '/api/productPriceUpdate'
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': 'YOUR_ACCESS_TOKEN',
                },
                body: JSON.stringify({ data: { productID: selectedResources[i], price: data } }),
            };

            try {
                const response = await doSomething(url, options);

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                }
                else {
                    console.log('error fetching response!', response.status)
                }

            } catch (error) {
                console.error(error);
            }

        }

        setRefresh((before) => {
            return !before
        })

        setToastActive((active) => !active)

    },[]);





    useEffect(() => {
        console.log('bulkProductData after loop....', bulkProductData);
    }, [bulkProductData]);

    /////////////////////////////////Modal///////////////////////////////////////////////

    const [isPolarisModalOpen, setPolarisModalOpen] = useState(false);

    

    const handleBulkDelete = async () => {
        console.log('selectedResources to delete', selectedResources)
        closeModal()
        setLoadingState(true)
        for (let i = 0; i < selectedResources.length; i++) {

            console.log('ids to delete: ', selectedResources[i])
            try {

                const deleteData = {
                    node: {
                        id: selectedResources[i]
                    }
                }
                const response = await doSomething('/api/productDelete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(deleteData)
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Data sent for delete successfully');

                } else {
                    console.error('Failed to send data for delete :', data.error);
                }
            } catch (error) {
                console.error('Error sending data:', error);
            }

        }
        setLoadingState(false)
        setToastActive((active) => !active)
        setRefresh(!refresh)

    };


    const closeModal = () => {
        setPolarisModalOpen(false);
    };


    ////////////////////////////////////Table index/////////////////////////////////////////////
    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const resourceIDResolver = (data, index) => data?.node?.id;
    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(productData, { resourceIDResolver });

    console.log('allResourcesSelected', allResourcesSelected)




    const bulkActions = [
        {
            content: 'Delete product',
            onAction: () => setPolarisModalOpen(true),
        },

    ];

    const promotedBulkActions = [
        {
            content: 'Edit product price',
            onAction: () => {
                setBulkUpdateId(selectedResources);
                setModalOpen(true);

            },

        },
    ];


    const rowMarkup = productData && productData?.map(
        (
            data,
            index
        ) => (
            <IndexTable.Row
                id={data?.node?.id}
                key={data?.node?.id}
                selected={selectedResources.includes(data?.node?.id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {index + initialCount}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{'...' + data?.node?.id?.slice(26)}</IndexTable.Cell>
                <IndexTable.Cell><img style={{ width: '50px' }} src={data?.node?.images?.edges[0]?.node?.originalSrc} alt='image' /></IndexTable.Cell>
                <IndexTable.Cell>{data?.node?.title}</IndexTable.Cell>
                <IndexTable.Cell>{(data?.node?.priceRange?.maxVariantPrice?.amount / 100).toFixed(2) + ' INR'}</IndexTable.Cell>
                <IndexTable.Cell>
                    <div className="action">
                        <i onClick={() => { editHandle(data) }} style={{ cursor: 'pointer' }} className="fa-solid text-info-emphasis me-2 fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editProduct" ></i>
                        <EditProductPrice
                            editData={editData}
                            response={handleResponseUpdate}
                            modalOpen={modalOpen}
                        />

                        <i onClick={() => { deleteHandle(data) }} style={{ cursor: 'pointer' }} className="fa-solid text-danger-emphasis fa-trash" data-bs-toggle="modal" data-bs-target="#deleteDisount" ></i>
                        <DeleteDiscount
                            ProductDeleteData={ProductDeleteData}
                            setToastActive={setToastActive}
                            setRefresh={setRefresh}
                            refresh={refresh}
                        />
                    </div>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    ///////////////////////////////////////////////////////////////////////////////////////////


    return (
        <LegacyCard>
            <Frame>
                {isLoading ? <LegacyCard.Section>
                    <TextContainer>
                        <SkeletonDisplayText size="large" />
                        <SkeletonBodyText lines={5} />
                    </TextContainer>
                </LegacyCard.Section> :

                    <LegacyCard.Section>
                        <div className="card ms-2 me-2 my-5">

                            <IndexTable
                                resourceName={resourceName}
                                itemCount={productData?.length}
                                selectedItemsCount={
                                    allResourcesSelected ? 'All' : selectedResources?.length
                                }
                                onSelectionChange={handleSelectionChange}
                                headings={[
                                    { title: '#' },
                                    { title: 'Product ID' },
                                    { title: 'Image' },
                                    { title: 'Title' },
                                    { title: 'Price' },
                                    { title: 'Action' },
                                ]}
                                bulkActions={bulkActions}
                                promotedBulkActions={promotedBulkActions}

                            >
                                {rowMarkup}
                            </IndexTable>
                        </div>

                        {LoadingState ? <Loading /> : null}

                        {
                            modalOpen && <EditBulkProduct
                                modalOpen={modalOpen}
                                setModalOpen={setModalOpen}
                                setBulkProductData={handleBulkUpdate}
                            />
                        }


                        <div style={{ marginLeft: '45%', marginTop: '2rem' }}>

                            <Pagination
                                hasPrevious={hasPreviousPage}
                                onPrevious={() => {
                                    handlePrev()
                                }}
                                hasNext={hasNextPage}
                                onNext={() => {
                                    handleNext()
                                    if (initialCount == 20) {
                                        setHasNextPage(false)
                                    }
                                }}
                            />
                            <div style={{ marginTop: '1rem' }}>
                                <Button plain monochrome onClick={() => setRefresh((before) => {
                                    return !before
                                })}>
                                    {"<-- Go to start"}
                                </Button>
                            </div>
                        </div>
                    </LegacyCard.Section >
                }

                <div style={{ height: '500px' }}>
                    <Modal
                        small
                        open={isPolarisModalOpen}
                        onClose={closeModal}
                        title="Delete Product"
                        primaryAction={{
                            content: 'Delete',
                            onAction: handleBulkDelete,
                        }}
                        secondaryActions={[
                            {
                                content: 'Cancel',
                                onAction: closeModal,
                            },
                        ]}
                    >
                        <Modal.Section>
                            <TextContainer>
                                <p>Are you sure you want to delete this product?</p>
                            </TextContainer>
                        </Modal.Section>
                    </Modal>
                </div>
            </Frame>
        </LegacyCard>
    )
}
























































































































































// <LegacyCard.Section>
                    //     <div className="col-lg-8">

                    //         <div className="card ms-2 me-2 my-5">
                    //             <div className="card-body table-wrapper text-nowrap table-responsive">
                    //                 <h5 className="card-title">Products Table</h5>

                    //                 {toastMarkup}

                    //                 <table className="table  mx-auto">
                    //                     <thead>
                    //                         <tr>
                    //                             <th scope="col">#</th>
                    //                             <th scope="col">Product ID</th>
                    //                             <th scope="col">Image</th>
                    //                             <th scope="col">Title</th>
                    //                             <th scope="col">Price</th>
                    //                             <th scope="col">Action</th>

                    //                         </tr>
                    //                     </thead>
                    //                     <tbody>
                    //                         {productData && productData?.map((data, index) => {
                    //                             // console.log('image URL', data?.node?.images.edges[0].node.originalSrc)
                    //                             // console.log('title: ', data?.node?.title)
                    //                             // console.log('title: ', data?.node?.title)
                    //                             return (
                    //                                 <tr key={index + 1}>
                    //                                     <td>{index + initialCount}</td>
                    //                                     <td>{'...' + data?.node?.id?.slice(26)}</td>
                    //                                     <td><img style={{ width: '50px' }} src={data?.node?.images?.edges[0]?.node?.originalSrc} alt='image' /></td>
                    //                                     <td>{data?.node?.title}</td>
                    //                                     <td>{(data?.node?.priceRange?.maxVariantPrice?.amount / 100).toFixed(2) + ' INR'}</td>
                    //                                     <td>
                    //                                         <div className="action">
                    //                                             <i onClick={() => { editHandle(data) }} style={{ cursor: 'pointer' }} className="fa-solid text-info-emphasis me-2 fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editProduct" ></i>
                    //                                             <EditProductPrice
                    //                                                 editData={editData}
                    //                                                 response={handleResponseUpdate}
                    //                                             />

                    //                                             <i onClick={() => { deleteHandle(data) }} style={{ cursor: 'pointer' }} className="fa-solid text-danger-emphasis fa-trash" data-bs-toggle="modal" data-bs-target="#deleteDisount" ></i>
                    //                                             <DeleteDiscount
                    //                                                 ProductDeleteData={ProductDeleteData}
                    //                                                 setToastActive={setToastActive}
                    //                                                 setRefresh={setRefresh}
                    //                                                 refresh={refresh}
                    //                                             />
                    //                                         </div>
                    //                                     </td>
                    //                                 </tr>
                    //                             )
                    //                         })}
                    //                     </tbody>
                    //                 </table>
                    //             </div>
                    //         </div>
                    //         <div style={{ marginLeft: '45%' }}>

                    //             <Pagination
                    //                 hasPrevious={hasPreviousPage}
                    //                 onPrevious={() => {
                    //                     handlePrev()

                    //                 }}
                    //                 hasNext={hasNextPage}
                    //                 onNext={() => {
                    //                     handleNext()
                    //                     if (initialCount == 20) {
                    //                         setHasNextPage(false)

                    //                     }
                    //                 }}
                    //             />
                    //             <div style={{ marginTop: '1rem'}}>
                    //                 <Button plain monochrome onClick={() => setRefresh((before) => {
                    //                     return !before
                    //                 })}>
                    //                     {"<-- Go to start"}
                    //                 </Button>
                    //             </div>

                    //         </div>
                    //     </div>
                    // </LegacyCard.Section>

import React, { useEffect, useState, useCallback } from 'react'
import DeleteDiscount from './DeleteDiscount'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import {
    LegacyCard,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText, Frame, Toast, Pagination, Button,
} from '@shopify/polaris';
import EditProductPrice from './EditProductPrice';


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
                } else {
                    console.log('did not get response');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refresh]);

    // useEffect(() => {
    //     console.log('startCursor.....', startCursor);
    //     console.log('endCursor......', endCursor);
    //     console.log('hasNextPage', hasNextPage)
    //     console.log('hasPreviousPage', hasPreviousPage)
    //     console.log(initialCount, 'initialCount')
    // }, [startCursor, endCursor, hasNextPage, hasPreviousPage, initialCount]);


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
                        <div className="col-lg-8">

                            <div className="card ms-2 me-2 my-5">
                                <div className="card-body table-wrapper text-nowrap table-responsive">
                                    <h5 className="card-title">Products Table</h5>

                                    {toastMarkup}

                                    <table className="table  mx-auto">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Product ID</th>
                                                <th scope="col">Image</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Action</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productData && productData?.map((data, index) => {
                                                // console.log('image URL', data?.node?.images.edges[0].node.originalSrc)
                                                // console.log('title: ', data?.node?.title)
                                                // console.log('title: ', data?.node?.title)
                                                return (
                                                    <tr key={index + 1}>
                                                        <td>{index + initialCount}</td>
                                                        <td>{'...' + data?.node?.id?.slice(26)}</td>
                                                        <td><img style={{ width: '50px' }} src={data?.node?.images?.edges[0]?.node?.originalSrc} alt='image' /></td>
                                                        <td>{data?.node?.title}</td>
                                                        <td>{(data?.node?.priceRange?.maxVariantPrice?.amount / 100).toFixed(2) + ' INR'}</td>
                                                        <td>
                                                            <div className="action">
                                                                <i onClick={() => { editHandle(data) }} style={{ cursor: 'pointer' }} className="fa-solid text-info-emphasis me-2 fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editProduct" ></i>
                                                                <EditProductPrice
                                                                    editData={editData}
                                                                    response={handleResponseUpdate}
                                                                />

                                                                <i onClick={() => { deleteHandle(data) }} style={{ cursor: 'pointer' }} className="fa-solid text-danger-emphasis fa-trash" data-bs-toggle="modal" data-bs-target="#deleteDisount" ></i>
                                                                <DeleteDiscount
                                                                    ProductDeleteData={ProductDeleteData}
                                                                    setToastActive={setToastActive}
                                                                    setRefresh={setRefresh}
                                                                    refresh={refresh}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div style={{ marginLeft: '45%' }}>
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
                                <div style={{ marginTop: '1rem'}}>
                                    <Button plain monochrome onClick={() => setRefresh((before) => {
                                        return !before
                                    })}>
                                        {"<-- Go to start"}
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </LegacyCard.Section>
                }
            </Frame>

        </LegacyCard>
    )
}

import React, { useEffect, useState, useCallback } from 'react'
import DeleteDiscount from './DeleteDiscount'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import {
    SkeletonPage,
    Layout,
    LegacyCard,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText, Frame, Toast, Pagination,
} from '@shopify/polaris';


export default function ProductsTable() {

    const [productData, setProductData] = useState('')
    const [deleteValue, setDeleteValue] = useState('')
    const doSomething = useAuthenticatedFetch()
    const [isLoading, setLoading] = useState(true)
    const [toastActive, setToastActive] = useState(false);
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await doSomething('/api/productData/123');

                const data = await response.json();
                data && setLoading(false)
                console.log('fetched product data: ', data);
                setProductData(data.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();

    }, [])


    console.log('productData..........', productData)



    function editHandle(index) {
        console.log('this is an id to update:', ID)
    }

    function deleteHandle(index) {
        console.log('this is an id to delete:', ID)
    }


    //////////////////////Toast//////////////////////////////////////////////

    const dismissToast = useCallback(() => setToastActive((active) => !active), []);

    const toastMarkup = toastActive ? (
        <Toast content="Successfully deleted!" onDismiss={dismissToast} />
    ) : null;

    ////////////////////////////////////////////////////////////////////////
    return (
        <LegacyCard>
            <Frame>
                {isLoading ? <LegacyCard.Section>
                    <TextContainer>
                        <SkeletonDisplayText size="large" />
                        <SkeletonBodyText lines={4} />
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
                                                <th scope="col">Image</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Product</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Price</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productData && productData?.map((data, index) => {
                                                console.log('data.image.src', data?.image?.src)
                                                return (
                                                    <tr key={index + 1}>
                                                        <td><img style={{ width: '50px' }} src={data?.image?.src} alt='image' /></td>
                                                        <td>{data?.title}</td>
                                                        <td>{data?.handle}</td>
                                                        <td>{data?.status}</td>
                                                        <td>{data?.variants[0]?.price}</td>
                                                        <td>
                                                            <div className="action">
                                                                <i onClick={() => { editHandle(index) }} style={{ cursor: 'pointer' }} className="fa-solid text-info-emphasis me-2 fa-pen-to-square" data-bs-toggle="modal"></i>


                                                                <i onClick={() => { deleteHandle(index) }} style={{ cursor: 'pointer' }} className="fa-solid text-danger-emphasis fa-trash" data-bs-toggle="modal" data-bs-target="#deleteDisount" ></i>
                                                                <DeleteDiscount
                                                                    deleteData={deleteValue}
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
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'  }}>
                                <Pagination
                                    hasPrevious
                                    onPrevious={() => {
                                        console.log('Previous');
                                    }}
                                    hasNext
                                    onNext={() => {
                                        console.log('Next');
                                    }}
                                />
                            </div>
                        </div>
                    </LegacyCard.Section>
                }

            </Frame>

        </LegacyCard>
    )
}

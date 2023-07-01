import React, { useEffect, useState, useCallback } from 'react'
import DeleteDiscount from './DeleteDiscount'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import {
    SkeletonPage,
    Layout,
    LegacyCard,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText, Frame, Toast,
} from '@shopify/polaris';

export default function Table({ sendData, updateTabs }) {
    const [discountData, setDiscountData] = useState('')
    const [state, setState] = useState(false)
    const [editValue, setEditValue] = useState('')
    const [deleteValue, setDeleteValue] = useState('')
    const doSomething = useAuthenticatedFetch()
    const [isLoading, setLoading] = useState(true)
    const [toastActive, setToastActive] = useState(false);
    const [refresh, setRefresh] = useState(false)



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await doSomething('/api/discountTableData');
                const data = await response.json();
                data && setLoading(false)
                console.log('fetched cart data: ', data);
                setDiscountData(data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();

    }, [refresh])

    function editHandle(index) {
        setState(true)
        const ID = discountData[index]
        setEditValue(ID)
        console.log('this is an id to update:', ID)
        sendData(ID);
        updateTabs(0)
    }

    function deleteHandle(index) {
        setState(true)
        const ID = discountData[index]
        setDeleteValue(ID)
        console.log('this is an id to delete:', ID)
        sendData(ID);
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
                                    <h5 className="card-title">Discount Table</h5>

                                    {toastMarkup}

                                    <table className="table  mx-auto">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Discount ID</th>
                                                <th scope="col">Product Variant Buy</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Product Get</th>
                                                <th scope="col">Product Percentage</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {discountData && discountData.map((data, index) => {
                                                return (
                                                    <tr key={index + 1}>
                                                        <th scope="row" className='mx-auto'>{index + 1}</th>
                                                        <td>{data?.discountID.slice(36)}</td>
                                                        <td>{data?.productVariantIDBuy.slice(29)}</td>
                                                        <td>{data?.productQuantitybuy}</td>
                                                        <td>{data?.selectedResourceGet.slice(22)}</td>
                                                        <td>{data?.productPercentageGet}</td>
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
                        </div>
                    </LegacyCard.Section>
                }

            </Frame>

        </LegacyCard>




    )
}
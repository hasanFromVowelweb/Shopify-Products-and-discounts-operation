import React, { useCallback, useEffect, useState } from 'react'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'

export default function EditProductPrice(props) {

    const doSomething = useAuthenticatedFetch()

    const [ProductUpdate, setProductUpdate] = useState({
        price: '',
        productID: ''
    })

    const handleChange = useCallback((e) => {
        const { value, name } = e.target
        setProductUpdate((prevValue) => {
            return { ...prevValue, [name]: value }
        })
        console.log('ProductUpdate', ProductUpdate)
    })

    const productID = props?.editData?.node.id
    // console.log('productID', productID)

    const price = (props?.editData?.node.priceRange.maxVariantPrice.amount/ 100).toFixed(2)
    // console.log('price', price)

    useEffect(() => {
        if (props?.editData) {
            setProductUpdate({
                price,
                productID
            })
        }
    }, [props?.editData])


    return (
        <div class="modal fade" id="editProduct" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="exampleInput1">Product Price</label>
                                <input type="number" value={ProductUpdate.price} name='price' onChange={handleChange} class="form-control" id="exampleInput1" placeholder="Price" />
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={ () => props.response(ProductUpdate)}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

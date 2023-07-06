import React, { useCallback, useEffect, useState } from 'react'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import { set } from 'mongoose'

export default function EditBulkProduct(props) {

    const doSomething = useAuthenticatedFetch()

    const [price, setPrice] = useState('')



    const handleChange = useCallback((e) => {
        setPrice(e.target.value)
        console.log('price',price)
    
    })

    const handleChangesSubmit = useCallback(()=>{
        props.setBulkProductData(price)
        props.setModalOpen(false)
    })



    return (
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="exampleInput1">Product Price</label>
                                <input type="number" value={price} name='price' onChange={handleChange} class="form-control" id="exampleInput1" placeholder="Price" />
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer mt-3">
                        <button type="button" class="btn btn-secondary me-1" data-bs-dismiss="modal" onClick={()=> props.setModalOpen(false)}>Cancel</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={ handleChangesSubmit}>Save changes</button>
                    </div>
                </div>
            </div>
    )
}
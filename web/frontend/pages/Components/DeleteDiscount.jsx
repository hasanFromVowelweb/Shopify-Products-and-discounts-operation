import React from 'react'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch';


export default function DeleteDiscount(props) {

    const doSomething = useAuthenticatedFetch()

    async function handleDelete() {
        console.log('data from modal for delete: ', props.deleteData)
        try {
            const response = await doSomething('/api/discountdelete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(props.deleteData)
            });

            const data = await response.json();
            console.log('data from frontend updated', data)

            if (response.ok) {
                console.log('Data sent for delete successfully');
                props.setToastActive((active) => !active)
                props.setRefresh(!props.refresh)
            } else {
                console.error('Failed to send data for update :', data.error);
            }
        } catch (error) {
            console.error('Error sending data:', error);
        }
    }

    return (
        <>
            <div class="modal fade" id="deleteDisount" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header pb-5">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Are you sure you want to delete ?</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
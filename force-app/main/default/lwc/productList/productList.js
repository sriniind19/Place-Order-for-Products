import { LightningElement, track, wire, api } from 'lwc';
import getProducts from '@salesforce/apex/PlaceOrderDemoCtrl.getProducts';
import submitOrder from '@salesforce/apex/PlaceOrderDemoCtrl.submitOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProductList extends LightningElement {

    @track allProducts = [];
    @track products = [];

    @api recordId;
    showSpinner = false;

    @wire(getProducts)
    products({data, error}){
        if(data){
            this.allProducts = this.products = data.map(prodRec => {
                return {
                    id: prodRec.Id,
                    name: prodRec.Name,
                    price: prodRec.Price__c,
                    quantity: 0,
                    picture: prodRec.Picture_URL__c
                };
            });
        }
        else if (error) {
            console.error(error);
        }
    }

    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();
        this.products = this.allProducts.filter(product => product.name.toLowerCase().includes(searchKey));
    }

    // Handling the custom event
    handleQtyUpdate(event) {
        console.log('handleQtyUpdate');
        console.log(JSON.stringify(event.detail));
        console.log(event.detail.productId);
        const productId = event.detail.productId;
        const qty = event.detail.quantity;
        if(qty) {
            this.allProducts.filter(product => product.id === productId).map(product => product.quantity = qty);
        } 
    }

    handleSubmit() {
        this.showSpinner = true;
        const selectedProducts = this.allProducts.filter(product => product.quantity);
        console.log('selectedProducts',JSON.stringify(selectedProducts));
        if(selectedProducts.length > 0) {
            submitOrder({
                contactId: this.recordId,
                products: JSON.stringify(selectedProducts)
            })
            .then(res => {
                console.log(res);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Successfully submitted',
                    message: res,
                    variant: 'success'
                }));
            })
            .catch(error => {
                console.error(error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Failed Submitting',
                    message: res,
                    variant: 'error'
                }));
            })
            .finally(() => {
                this.showSpinner = false;
            });
        }
        else {
            this.showSpinner = false;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error! Quantity 0',
                message: 'Add Quantity for at least one product',
                variant: 'error'
            }));
        }
    }
}
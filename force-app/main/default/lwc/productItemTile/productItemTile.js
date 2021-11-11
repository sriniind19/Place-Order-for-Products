import { LightningElement, api } from 'lwc';

export default class ProductItemTile extends LightningElement {

    @api product = {
        picture: 'https://bit.ly/3wrVFKI',
        name: 'Salesforce Admin',
        price: 5000,
        id: 101
    };

    handleQuantityChange(event) {
        console.log('handleQuantityChange');
        console.log(event.target.value);
        if(event.target.value) {
            this.dispatchEvent(
                new CustomEvent('qtyupdate', {
                    detail: {  
                        productId: this.product.id,
                        quantity: event.target.value
                    }
                })
            );
        }
    }
    
}
public with sharing class PlaceOrderDemoCtrl {

    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts(){
        try {
            return [SELECT Id, Name, Price__c, Picture_URL__c FROM Product__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string submitOrder(String contactId, String products) {
        String msg;
        try {
            List<Object> prodObjects = (List<Object>)JSON.deserializeUntyped(products);
            List<Order_Item__c> orderItems = new List<Order_Item__c>();

            Order__c order = new Order__c(
                Contact__c = contactId
            );
            insert order;

            for(Object prodObj : prodObjects) {

                Map<String,Object> prodObjMap = (Map<String,Object>)prodObj;
                orderItems.add(
                    new Order_Item__c(
                        Product__c = (Id)prodObjMap.get('id'),
                        Order__c = order.Id,
                        Quantity__c =  Integer.valueOf(prodObjMap.get('quantity'))
                    )
                );

            }

            try {
                insert orderItems;
                msg = 'Order is submitted successfully.';
            }
            catch(Exception e) {
                msg = 'Order is failed: ' + e.getMessage();
            }

            return msg;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
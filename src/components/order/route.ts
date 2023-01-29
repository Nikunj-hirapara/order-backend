import OrderController from "./orderController";
import V from "./validation";

// path: "", method: "post", controller: "",
// validation: ""(can be array of validation), 
// isEncrypt: boolean (default true), isPublic: boolean (default false)

export default [    
    {
        path: "/",
        method: "get",
        controller: OrderController.getOrders,
    },
    {
        path: "/",
        method: "post",
        controller: OrderController.addOrder,
        validation:V.orderFieldValidation
    },
    {
        path: "/:id",
        method: "put",
        controller: OrderController.editOrder,
    },
    {
        path: "/:id",
        method: "delete",
        controller: OrderController.deleteOrder,
    }
];
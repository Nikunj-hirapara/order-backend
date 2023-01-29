import productController from "./productController";
import V from "./validation";

// path: "", method: "post", controller: "",
// validation: ""(can be array of validation), 
// isEncrypt: boolean (default true), isPublic: boolean (default false)

export default [    
    {
        path: "/",
        method: "get",
        controller: productController.getProducts,
        isPublic:true
    }
];
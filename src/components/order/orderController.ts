import { AppStrings } from "../../utils/appStrings";

import { NextFunction, Request, Response } from "express";
import commonUtils from "../../utils/commonUtils";
import moment from "moment";
import mongoose from "mongoose";
const Order = require("./orderModel");
import { AppConstants } from "../../utils/appConstants";

/**
 * 
 * @param req 
 * @param res 
 * @description ignore user authenticated part and return every order of table
 * @returns 
 */
async function getOrders(req: Request, res: Response) {
    try {
        // const user_id = req.headers.userid as string;
       
        const category = req.query.category as string;
        const search = parseInt(req.query.search as string);
        const orderStatus = parseInt(req.query.orderStatus as string);
    
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip_ = (page - 1) * limit;
        let filter:{}
        if (search) {
          filter = {
            ...filter,
            $or:[
              {"product.name": { $regex: search, $options: 'i' }},
              {"product.sku": { $regex: search, $options: 'i' }},
              {"product.description": { $regex: search, $options: 'i' }},
              {"product.category": { $regex: search, $options: 'i' }},
              {"product.quantity": { $regex: search, $options: 'i' }},
              
              {"shipping.type": { $regex: search, $options: 'i' }},
              
              {"customer.name": { $regex: search, $options: 'i' }},
              {"customer.phone": { $regex: search, $options: 'i' }},        
          ]}
        }
    
        if (orderStatus) {
          filter = {
            ...filter,
            'orderStatus': orderStatus
          }
        }
        if (category ) {
          filter = {
            ...filter,
            'product.category': category 
          }
        }
    
    
        const pipeline = [
          { $match: filter },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              metadata: [{ $count: "total" }, { $addFields: { page: page } }],
              data: [{ $skip: skip_ }, { $limit: limit },
              {
                $project: {
                  _id: 0,
                  products: 1,
                  shipping:1,
                  totalAmount:1,
                  orderStatus:1,
                  onDelivery:1,
                  customer:1,    
                }
              }]
            }
          },
        ]
    
        const orders = await Order.aggregate(pipeline);
      
        return commonUtils.sendSuccess(req, res, orders);
    } catch (error:any) {
        console.log(error);
        return commonUtils.sendError(req, res, { error:error.message }, 500);
    }
}

type OrderType = {
  productPrice:number,
  discount:number,
  qty:number,
  tax:number,
  shippingCharge:number
}
const orderTotalCal = ({productPrice,discount,qty,tax,shippingCharge}:OrderType) => {
  const discountedPrice = productPrice - (productPrice * discount / 100)
  
  //tax on main price
  const addTax = discountedPrice + (productPrice * tax / 100) 
  const addQty = addTax * qty 
  return addQty + shippingCharge 
}
/**
 *
 * @param req
 * @param res
 * @description: ignore user authentication part
 * @returns
 */
async function addOrder(req: Request, res: Response) {
    try {
        const { product, customer, shipping, signatureRequired,termsAgree,receiveStausUpdate } = req.body;

        const productsDetails = {
            name: product.name,
            id: product.id,
            sku: product.sku,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            price: product.price,
            discount: product.discount,
            tax: product.tax,
            netPrice: product.netPrice,
        };
        const shippingDetails = {
            type: shipping.type,
            charge: shipping.charge,
            estimatedDate: shipping.date,
        };
        const OrderPlacer = {
            name: customer.name,
            DOB: customer.DOB,
            phone: customer.Phone,
        };
        const totalAmountCalc = orderTotalCal({
          productPrice: product.price,
          discount: product.discount,
          qty: product.quantity,
          tax: product.tax,
          shippingCharge: shipping.charge
        });

        const newOrder = new Order({
            products: productsDetails,
            shipping: shippingDetails,
            totalAmount: totalAmountCalc,
            orderStatus: "CREATED",
            onDelivery: {
                signatureRequired,
            },
            notify: {
                receiveStausUpdate,
            },
            customer: OrderPlacer,
            termsAgree,
        });
        await newOrder.save()
        return commonUtils.sendSuccess(req, res, newOrder,201);
    } catch (error:any) {
        console.log(error);
        return commonUtils.sendError(req, res, { error: error.message }, 500);
    }
}
/**
 * 
 * @param req 
 * @param res 
 * @description customer details not should be edited
 * if user authenticated we must fetch it with userId too
 * @returns 
 */
async function editOrder(req: Request, res: Response) {
    try {
      
      const orderId = req.params.id as string;
      const { product, shipping, signatureRequired,termsAgree,receiveStausUpdate } = req.body;
      const editOrder = await Order.findById(orderId);
      if(!editOrder)throw new Error("order not found with this id");
      
      const productsDetails = {
          name: product.name,
          id: product.id,
          sku: product.sku,
          description: product.description,
          category: product.category,
          quantity: product.quantity,
          price: product.price,
          discount: product.discount,
          tax: product.tax,
          netPrice: product.netPrice,
      };
      const shippingDetails = {
          type: shipping.type,
          charge: shipping.charge,
          estimatedDate: shipping.date,
      };
      const totalAmountCalc = orderTotalCal({
        productPrice: product.price,
        discount: product.discount,
        qty: product.quantity,
        tax: product.tax,
        shippingCharge: shipping.charge
      });


      editOrder.products = productsDetails
      editOrder.shipping = shippingDetails
      editOrder.totalAmount = totalAmountCalc
      editOrder.onDelivery = {
          signatureRequired
      }
      editOrder.notify = {
          receiveStausUpdate
      }
      await editOrder.save()
      return commonUtils.sendSuccess(req, res, editOrder);
    } catch (error:any) {
        console.log(error);
        return commonUtils.sendError(req, res, { error: error.message }, 500);
    }
}
/**
 * 
 * @param req 
 * @param res 
 * @description delete order by id
 * @returns 
 */
async function deleteOrder(req: Request, res: Response) {
    try {
        const orderId = req.params.id as string;
        await Order.deleteOne({_id:orderId});

        return commonUtils.sendSuccess(req, res, commonUtils.productData());
    } catch (error) {
        console.log(error);
        return commonUtils.sendError(req, res, { error }, 500);
    }
}
export default {
    getOrders,
    addOrder,
    editOrder,
    deleteOrder,
};

import orderModel from "./order_models.js"


export const createOrder = async (req, res) => {
    const { serviceType, location,
        serviceSite, noOfGuards,
        description, startDate, endDate,
        startTime, endTime } = req.body

    const images = req.files;

    const imageNames = images.map(file => file.filename);

    const order = await orderModel.create({
        serviceType,
        location,
        serviceSite,
        noOfGuards,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        images: imageNames
    })

    res.status(200).json({
        success: true,
        message: "Order created successfully",
        data: { order }
    })
}


//Get all orders
export const getAllOrders = async (req, res) => {
    const orders = await orderModel.find({});
    res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: { orders }
    })
}



//Accept order 
export const acceptOrder = async (req, res) => {
    const { id } = req.params;
    const order = await orderModel.findById(id);
    if (!order) {
        throw new CustomError("Order not found", 404);
    }
    order.isAccepted = true;
    await order.save();
    res.status(200).json({
        success: true,
        message: "Order accepted successfully",
    })
}

//Reject order 
export const rejectOrder = async (req, res) => {
    const { id } = req.params;
    const order = await orderModel.findById(id);
    if (!order) {
        throw new CustomError("Order not found", 404);
    }
    order.isRejected = true;
    await order.save();
    res.status(200).json({
        success: true,
        message: "Order rejected successfully",
    })
}


//Get Accepted orders
export const getAcceptedOrder = async (req, res) => {
    const orders = await orderModel.find({ isAccepted: true });
    res.status(200).json({
        success: true,
        message: "Accepted orders fetched successfully",
        data: { orders }
    })
}

//get rejected order
export const getRejectedOrder = async (req, res) => {
    const orders = await orderModel.find({ isRejected: true });
    res.status(200).json({
        success: true,
        message: "Rejected orders fetched successfully",
        data: { orders }
    })
}



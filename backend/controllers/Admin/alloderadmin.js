const Order = require('../../models/Order');

// Get all orders with pagination and optional filters
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { name, userName, paymentMethod } = req.query;

    // Create dynamic filter object
    let query = {};

    if (name) {
      query['items.name'] = { $regex: name, $options: 'i' };
    }

    if (userName) {
      query.userName = { $regex: userName, $options: 'i' }; 
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    // Count filtered documents
    const totalOrders = await Order.countDocuments(query);

    // Find with filter + pagination
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const getMonthlyPaymentSummary = async (req, res) => {
  try {
    const summary = await Order.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
          totalAmount: 1,
          paymentMethod: { $toLower: "$paymentMethod" }, // lowercase करो
        }
      },
      {
        $group: {
          _id: {
            month: "$month",
            method: "$paymentMethod"
          },
          totalAmount: { $sum: "$totalAmount" }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          payments: {
            $push: {
              method: "$_id.method",
              total: "$totalAmount"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          monthNumber: "$_id",
          cashTotal: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$payments",
                    as: "p",
                    cond: { $eq: ["$$p.method", "cash"] }
                  }
                },
                as: "c",
                in: "$$c.total"
              }
            }
          },
          onlineTotal: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$payments",
                    as: "p",
                    cond: { $eq: ["$$p.method", "online"] }
                  }
                },
                as: "o",
                in: "$$o.total"
              }
            }
          }
        }
      },
      {
        $addFields: {
          month: {
            $arrayElemAt: [
              [
                "", "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ],
              "$monthNumber"
            ]
          }
        }
      },
      {
        $project: {
          monthNumber: 0
        }
      },
      {
        $sort: { month: 1 }
      }
    ]);

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error generating monthly summary:", error);
    res.status(500).json({ message: "Server Error" });
  }
};





module.exports = { getOrders,getMonthlyPaymentSummary };

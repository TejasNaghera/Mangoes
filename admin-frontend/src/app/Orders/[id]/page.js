"use client";
import { useOrderStore } from "../../../../store/orderStore"; // Adjust path
import { useRouter } from 'next/navigation';
import React from "react";
export default function OrderDetails({ params }) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
    const router = useRouter()
  const { orders } = useOrderStore();
  const order = orders.find((o) => o._id === id);

  if (!order) return <div className="text-center ">Order not found</div>;
  return (
    <div className="p-6 min-h-screen bg-yellow-50">
           <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-orange-800 text-white rounded hover:bg-gray-800"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold text-orange-800 mb-4">
        Order Details for #{order._id.slice(-5)}
      </h1>

      <div className="mb-6">
        <p><strong>Customer:</strong> {order.userName}</p>
        <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Address:</strong> {order.address}</p>
      </div>

      <h2 className="text-2xl font-semibold text-orange-700 mb-3">Items</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-orange-300 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Item Name</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-orange-100">
                <td className="py-2 px-4 text-orange-800">{item.name}</td>
                <td className="py-2 px-4 text-orange-800">{item.quantity}</td>
                <td className="py-2 px-4 text-orange-800">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";
import Head from "next/head"; // ✅ Import Head
import { useOrderStore } from "../../../store/orderStore"; // Adjust path

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
};

export default function Orders() {
  const {
    orders,
    loading,
    error,
    currentPage,
    totalPages,
    itemNames,
    selectedItemName,
    fetchOrders,
    goToNextPage,
    goToPrevPage,
    setSelectedItemName,
  } = useOrderStore();

  useEffect(() => {
    fetchOrders(currentPage, selectedItemName);
    const interval = setInterval(() => {
      fetchOrders(currentPage, selectedItemName);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPage, selectedItemName]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Orders | Kesar Mango</title>
      </Head>

      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold text-orange-800 mb-6">Orders</h1>

        <div className="mb-4">
          <label htmlFor="itemName" className="block mb-2">Filter by Item Name:</label>
          <select
            id="itemName"
            value={selectedItemName}
            onChange={(e) => {
              setSelectedItemName(e.target.value);
              fetchOrders(1, e.target.value);
            }}
            className="p-2 border rounded-md"
          >
            <option value="">All Items</option>
            {itemNames.map((name, i) => (
              <option key={i} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <table className="w-full bg-amber-500 shadow-md rounded-lg overflow-x-auto">
          <thead className="bg-orange-400 text-white">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Order Date</th>
              <th className="py-3 px-4">Delivery Date</th>
              <th className="py-3 px-4">Amount (₹)</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-amber-400">
                <td className="py-2 px-4 text-orange-800">#{order._id.slice(-5)}</td>
                <td className="py-2 px-4 text-orange-800">{order.userName}</td>
                <td className="py-2 px-4 text-orange-800">{formatDate(order.createdAt)}</td>
                <td className="py-2 px-4 text-orange-800">{formatDate(order.deliveryDate)}</td>
                <td className="py-2 px-4 text-orange-800">₹{order.totalAmount}</td>
                <td className="py-2 px-4 text-orange-800">{order.paymentMethod}</td>
                <td className="py-2 px-4 text-orange-800">{order.address}</td>
                <td className="py-2 px-4">
                  <Link href={`/Orders/${order._id}`}>
                    <button className="px-4 py-1 bg-green-800 text-white rounded">View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-6">
          <button onClick={goToPrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-orange-400 border-1 border-white text-white rounded mx-2 disabled:bg-gray-300">
            Previous
          </button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-orange-400 border-1 border-white text-white rounded mx-2 disabled:bg-gray-300">
            Next
          </button>
        </div>
      </div>
    </>
  );
}

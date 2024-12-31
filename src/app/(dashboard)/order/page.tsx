"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { toast } from "sonner";

import { useUser } from "@/src/context/user.provider";
import { useDeleteOrder, useGetAllOrdersByUser } from "@/src/hooks/order.hooks";
import { IOrderResponse } from "@/src/types";
import PaymentModal from "@/src/components/modal/PaymentModal";

const paymentFilters = [
  { key: "ALL", label: "All" },
  { key: "PAID", label: "Paid" },
  { key: "UNPAID", label: "Unpaid" },
];

const statusFilters = [
  { key: "ALL", label: "All Statuses" },
  { key: "PENDING", label: "Pending" },
  { key: "CONFIRM", label: "Confirmed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELED", label: "Canceled" },
];

const ITEMS_PER_PAGE = 5;

const OrderPage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { data: orderData, isLoading } = useGetAllOrdersByUser(userId!);
  const deleteOrderMutation = useDeleteOrder();

  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrderResponse[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [orderStatus, setOrderStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (userId && orderData) {
      try {
        const data: IOrderResponse[] = orderData;

        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        toast.error("Failed to fetch orders");
      }
    }
  }, [userId, orderData]);

  const handleFilterChange = (filter: string) => {
    setFilter(filter);
    applyFilters(filter, orderStatus);
  };

  const handleOrderStatusChange = (status: string) => {
    setOrderStatus(status);
    applyFilters(filter, status);
  };

  const applyFilters = (paymentFilter: string, statusFilter: string) => {
    let filtered = [...orders];

    if (paymentFilter !== "ALL") {
      filtered = filtered.filter((order) =>
        paymentFilter === "PAID"
          ? order.payment?.transactionId
          : !order.payment?.transactionId,
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderMutation.mutateAsync({ id: orderId });
      toast.success("Order deleted successfully");
      setOrders(orders.filter((order) => order.id !== orderId));
      setFilteredOrders(filteredOrders.filter((order) => order.id !== orderId));
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const handlePayment = async (payId: string, userId: string) => {
    try {
      setPaymentId(payId);
      // Add your payment handling logic here.
      console.log("Payment initiated for:", { paymentId, userId });
      setPaymentModalOpen(true);
      toast.success("Payment processed successfully!");
    } catch (error) {
      toast.error("Failed to process payment");
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">My Orders</h1>

      <div className="mb-4 flex gap-4">
        <Select
          label="Payment Filter"
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          {paymentFilters.map(({ key, label }) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Order Status"
          onChange={(e) => handleOrderStatusChange(e.target.value)}
        >
          {statusFilters.map(({ key, label }) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Payment</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                {order.payment?.transactionId ? "Paid" : "Unpaid"}
              </TableCell>
              <TableCell>
                {!order.payment?.transactionId && (
                  <>
                    <Button
                      className="mr-2"
                      color="primary"
                      onClick={() => {
                        handlePayment(order.payment?.id || "", userId!);
                      }}
                    >
                      Pay
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-3">
        <Pagination
          page={currentPage}
          total={Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        paymentId={paymentId}
        userId={userId}
        onClose={() => setPaymentModalOpen(false)}
      />
    </div>
  );
};

export default OrderPage;

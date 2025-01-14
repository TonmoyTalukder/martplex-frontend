'use client';

import { useState, useEffect } from 'react';
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react';
import { toast } from 'sonner';
import Link from 'next/link';
import { HiOutlineViewfinderCircle } from 'react-icons/hi2';

import { useUser } from '@/src/context/user.provider';
import {
  useDeleteOrder,
  useGetAllOrders,
  useUpdateOrderStatus,
} from '@/src/hooks/order.hooks';
import { IOrderResponse } from '@/src/types';
import PaymentModal from '@/src/components/modal/PaymentModal';
import { custom_date } from '@/src/utils/customDate';

const paymentFilters = [
  { key: 'ALL', label: 'All' },
  { key: 'PAID', label: 'Paid' },
  { key: 'UNPAID', label: 'Unpaid' },
];

const statusFilters = [
  { key: 'ALL', label: 'All Statuses' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRM', label: 'Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELED', label: 'Canceled' },
];

const ITEMS_PER_PAGE = 8;

const OrderPage = () => {
  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const [order, setOrder] = useState<IOrderResponse>();
  const [filteredOrders, setFilteredOrders] = useState<IOrderResponse[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [orderStatus, setOrderStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const { user } = useUser();
  const userId = user?.id;

  const { data: orderData, isLoading } = useGetAllOrders();
  const deleteOrderMutation = useDeleteOrder();

  const { mutate: updateOrderStatusMutation, isPending: isPendingOrderStatus } =
    useUpdateOrderStatus();

  console.log(orderData);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (userId && orderData) {
      try {
        const data: IOrderResponse[] = orderData;

        setOrders(data);
        if (user?.role === 'CUSTOMER') {
          const customerOrders = orderData.filter(
            (order) => order.userId === userId,
          );

          setFilteredOrders(customerOrders);
        } else if (user?.role === 'VENDOR') {
          const customerOrders = orderData.filter(
            (order) => order.vendorStand.ownerId === userId,
          );

          setFilteredOrders(customerOrders);
        } else {
          setFilteredOrders(orderData); // If not 'CUSTOMER', show all orders
        }
      } catch (error) {
        toast.error('Failed to fetch orders');
      }
    }
  }, [userId, orderData]);

  const handleOrderStatusUpdate = (orderId: string, status: string) => {
    const payload = {
      orderId,
      status,
    };
    // | 'PENDING'
    // | 'CONFIRM'
    // | 'PROCESSING'
    // | 'SHIPPED'
    // | 'DELIVERED'
    // | 'CANCELED';

    updateOrderStatusMutation(payload);
  };

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

    if (paymentFilter !== 'ALL') {
      filtered = filtered.filter((order) =>
        paymentFilter === 'PAID'
          ? order.payment?.transactionId
          : !order.payment?.transactionId,
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderMutation.mutateAsync({ id: orderId });
      toast.success('Order deleted successfully');
      setOrders(orders.filter((order) => order.id !== orderId));
      setFilteredOrders(filteredOrders.filter((order) => order.id !== orderId));
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const handlePayment = async (payId: string, userId: string) => {
    try {
      setPaymentId(payId);
      // Add your payment handling logic here.
      console.log('Payment initiated for:', { paymentId, userId });
      setPaymentModalOpen(true);
      toast.success('Payment processed successfully!');
    } catch (error) {
      toast.error('Failed to process payment');
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto py-8 px-4">
      {user?.role === 'CUSTOMER' ? (
        <h1 className="text-3xl font-bold text-center mb-6">My Orders</h1>
      ) : (
        <h1 className="text-3xl font-bold text-center mb-6">All Orders</h1>
      )}

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
          <TableColumn>Product</TableColumn>
          <TableColumn>Order Date</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Payment</TableColumn>
          <TableColumn>Details</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/product/${order.items[0].product.id}`}
                >
                  {order.items[0].product.name
                    .split(' ')
                    .slice(0, 4)
                    .join(' ')
                    .concat(
                      order.items[0].product.name.split(' ').length > 4
                        ? '...'
                        : '',
                    )}
                </Link>
              </TableCell>
              <TableCell>{custom_date(order.createdAt)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                {order.payment?.transactionId ? 'Paid' : 'Unpaid'}
              </TableCell>
              <TableCell className="flex justify-start">
                <Button
                  isIconOnly
                  className="mr-2 bg-transparent text-2xl text-blue-600"
                  color="primary"
                  variant="flat"
                  onClick={() => {
                    setOrder(order);
                  }}
                  onPress={onOpen}
                >
                  <HiOutlineViewfinderCircle />
                </Button>
              </TableCell>
              <TableCell>
                {!order.payment?.transactionId && user?.role === 'CUSTOMER' && (
                  <>
                    <Button
                      className="mr-2"
                      color="primary"
                      variant="flat"
                      onClick={() => {
                        handlePayment(order.payment?.id || '', userId!);
                      }}
                    >
                      Pay
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}

                {order.status === 'PENDING' &&
                  order.vendorStand.ownerId === user?.id && (
                    <>
                      <Button
                        className="mr-2"
                        color="success"
                        variant="flat"
                        onClick={() => {
                          handleOrderStatusUpdate(order.id, 'CONFIRMED');
                        }}
                      >
                        Confirm
                      </Button>
                    </>
                  )}

                {order.status === 'CONFIRM' &&
                  order.vendorStand.ownerId === user?.id && (
                    <Button
                      className="mr-2"
                      color="primary"
                      variant="flat"
                      onClick={() => {
                        handleOrderStatusUpdate(order.id, 'PROCESSING');
                      }}
                    >
                      Process
                    </Button>
                  )}

                {order.status === 'PROCESSING' &&
                  order.vendorStand.ownerId === user?.id && (
                    <Button
                      className="mr-2"
                      color="primary"
                      variant="flat"
                      onClick={() => {
                        handleOrderStatusUpdate(order.id, 'SHIPPED');
                      }}
                    >
                      Ship
                    </Button>
                  )}

                {order.status === 'SHIPPED' &&
                  order.vendorStand.ownerId === user?.id && (
                    <Button
                      className="mr-2"
                      color="primary"
                      variant="flat"
                      onClick={() => {
                        handleOrderStatusUpdate(order.id, 'DELIVERED');
                      }}
                    >
                      Delivary
                    </Button>
                  )}

                {order.vendorStand.ownerId === user?.id && (
                  <>
                    <Button
                      className="mr-2"
                      color="danger"
                      variant="flat"
                      onClick={() => {
                        handleOrderStatusUpdate(order.id, 'CANCELED');
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}

                {user?.role === 'ADMIN' && (
                  <>
                    {!order.payment?.transactionId && (
                      <Button
                        className="mr-2"
                        color="danger"
                        variant="flat"
                        onClick={() => {
                          handleOrderStatusUpdate(order.id, 'CANCELED');
                        }}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      color="danger"
                      variant="flat"
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

      <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {order && <p>Order Date: {custom_date(order.createdAt)}</p>}
              </ModalHeader>
              <ModalBody>
                <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Order Details
                  </h2>

                  {/* Order Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Order Information
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-semibold">Order ID:</span>{' '}
                      {order?.id}
                    </p>
                  </div>

                  {/* Ordered Products */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Ordered Products
                    </h3>
                    {order?.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 mb-4 rounded-lg border border-gray-200"
                      >
                        <p className="text-gray-600">
                          <span className="font-semibold">Product ID:</span>{' '}
                          {item.product.id}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Name:</span>{' '}
                          {item.product.name}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Price:</span> ৳
                          {item.price}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Quantity:</span>{' '}
                          {item.quantity}
                        </p>
                        <p className="text-gray-600 font-bold">
                          Total Price: ৳ {order.totalAmount}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Customer Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Customer Details
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-semibold">Name:</span>{' '}
                      {order?.user.name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Email:</span>{' '}
                      {order?.user.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Phone:</span>{' '}
                      {order?.user.phoneNumber}
                    </p>
                  </div>

                  {/* Delivery Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Delivery Details
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-semibold">Address:</span>{' '}
                      {order?.deliveryAddress}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Phone:</span>{' '}
                      {order?.deliveryPhone}
                    </p>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OrderPage;

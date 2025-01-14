'use client';

import { useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from '@nextui-org/react';
import { MdDeleteForever, MdBlock, MdCheckCircle } from 'react-icons/md';
import { useBlockUser, useCreateAdmin, useDeleteUser, useGetAlleUser } from '@/src/hooks/user.hooks';
import { custom_date } from '@/src/utils/customDate';
import { IUser } from '@/src/types';

const AdminUsersPage = () => {
  const { data: userData, isLoading } = useGetAlleUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const { mutate: handleBlockUserApi, isPending: blockUserPending } = useBlockUser();
  const { mutate: handleDeleteUserApi, isPending: deleteUserPending } = useDeleteUser();
  const { mutate: handleCreateAdminApi, isPending: createAdminPending } = useCreateAdmin();

  const users = userData?.data;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleBlock = (user: IUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const confirmMessage =
      newStatus === 'BLOCKED'
        ? `Are you sure you want to block ${user.name}?`
        : `Are you sure you want to unblock ${user.name}?`;

    if (confirm(confirmMessage)) {
      handleBlockUserApi(
        { id: user.id!, block: newStatus === 'BLOCKED' },
        {
          onSuccess: () => {
            alert(
              `User ${user.name} has been successfully ${
                newStatus === 'BLOCKED' ? 'blocked' : 'unblocked'
              }.`
            );
          },
          onError: (error) => {
            console.error(`Error updating status for user ${user.id}:`, error);
            alert('Failed to update the user status. Please try again.');
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      handleDeleteUserApi(
        { id },
        {
          onSuccess: () => {
            alert('User deleted successfully!');
          },
          onError: (error) => {
            console.error(`Error deleting user ${id}:`, error);
            alert('Failed to delete the user. Please try again.');
          },
        }
      );
    }
  };

  const handleCreateAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.phoneNumber || !newAdmin.password) {
      alert('Please fill in all fields to create an admin.');
      return;
    }

    handleCreateAdminApi(
      {
        name: newAdmin.name,
        email: newAdmin.email,
        phoneNumber: newAdmin.phoneNumber,
        password: newAdmin.password,
      },
      {
        onSuccess: () => {
          alert(`Admin ${newAdmin.name} created successfully!`);
          setNewAdmin({ name: '', email: '', phoneNumber: '', password: '' }); // Reset form
          onOpenChange(); // Close the modal
        },
        onError: (error) => {
          console.error('Error creating admin:', error);
          alert('Failed to create admin. Please try again.');
        },
      }
    );
  };

  const filteredUsers = users?.filter(
    (user: IUser) =>
      user.name?.toLowerCase().includes(searchQuery) ||
      user.email?.toLowerCase().includes(searchQuery)
  );

  // Pagination logic
  const totalItems = filteredUsers?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-semibold animate-pulse text-blue-600">Loading Users...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-400">
          Manage Users
        </h1>
      </div>
      <div className="flex justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Users"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full max-w-md"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button variant="solid" color="primary" className="px-4 py-2" onPress={onOpen}>
          + Create Admin
        </Button>
      </div>

      {paginatedUsers?.length > 0 ? (
        <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-gray-700">Joined At</th>
              <th className="px-6 py-3 text-center text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user: IUser) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">{user.role}</td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    user.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {user.status}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {custom_date(user.createdAt!)}
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-4">
                  <Button
                    isDisabled={blockUserPending}
                    variant="solid"
                    color={user.status === 'ACTIVE' ? 'warning' : 'success'}
                    onClick={() => handleBlock(user)}
                  >
                    {user.status === 'ACTIVE' ? (
                      <>
                        <MdBlock className="mr-2" />
                        Block
                      </>
                    ) : (
                      <>
                        <MdCheckCircle className="mr-2" />
                        Unblock
                      </>
                    )}
                  </Button>
                  <Button
                    isDisabled={deleteUserPending}
                    variant="solid"
                    isIconOnly
                    color="danger"
                    onClick={() => handleDelete(user.id!)}
                  >
                    <MdDeleteForever size={20} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-600">
          <p>No Users Found.</p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 mx-1 rounded ${
              page === currentPage
                ? 'bg-sky-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Create Admin Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                Create New Admin
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  placeholder="Enter name"
                  fullWidth
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                />
                <Input
                  label="Email"
                  placeholder="Enter email"
                  fullWidth
                  className="mt-4"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter phone number"
                  fullWidth
                  className="mt-4"
                  value={newAdmin.phoneNumber}
                  onChange={(e) => setNewAdmin({ ...newAdmin, phoneNumber: e.target.value })}
                />
                <Input
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                  fullWidth
                  className="mt-4"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isDisabled={createAdminPending}
                  onPress={handleCreateAdmin}
                >
                  {createAdminPending ? 'Creating...' : 'Create Admin'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;

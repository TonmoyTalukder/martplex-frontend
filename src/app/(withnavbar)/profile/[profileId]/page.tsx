'use client';

import { useState } from 'react';
import { useGetSingleUser } from '@/src/hooks/user.hooks';
import { Input, Button, Card, Avatar, Tooltip } from '@nextui-org/react';
import { IUser } from '@/src/types';
import { FaPen } from 'react-icons/fa';

interface IProps {
  params: {
    profileId: string;
  };
}

const ProfilePage = ({ params: { profileId } }: IProps) => {
  const { data, isLoading } = useGetSingleUser(profileId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUser | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const user = data?.data?.userData;

  // Initialize the form data when the user data is loaded
  if (!isLoading && !formData) {
    setFormData(user);
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    key: keyof IUser,
    value: string | boolean | null,
  ) => {
    if (formData) {
      setFormData({ ...formData, [key]: value });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the selected file
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('profilePhoto', selectedFile as File); 
      formDataToSend.append('name', formData?.name || '');
      formDataToSend.append('email', formData?.email || '');
      formDataToSend.append('phoneNumber', formData?.phoneNumber || '');
      formDataToSend.append('role', formData?.role || '');
      formDataToSend.append('status', formData?.status || '');

      // await useUpdateUser(profileId, formDataToSend);

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-3xl mx-auto p-6 shadow-lg">
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <Avatar
              size="lg"
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : formData?.profilePhoto ||
                    'https://i.ibb.co/wcv1QBQ/5951752.png'
              }
              alt="Profile Photo"
              className="w-32 h-32"
            />
            <Tooltip content="Update Profile Photo" placement="top">
              <label className="absolute top-0 right-0 bg-gray-700 text-white p-1 rounded-full cursor-pointer">
                <FaPen />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </Tooltip>
          </div>
          <h1 className="text-2xl font-bold text-black-500">
            {isEditing ? (
              <Input
                value={formData?.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                fullWidth
                placeholder="Name"
              />
            ) : (
              user?.name || 'Unknown User'
            )}
          </h1>
        </div>

        <div className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm font-bold text-black-600">
              Email
            </label>
            {isEditing ? (
              <Input
                id="email"
                value={formData?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                fullWidth
                placeholder="Email"
              />
            ) : (
              <p className="text-black-800">{user?.email || 'Not provided'}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="text-sm font-bold text-black-600">
              Phone Number
            </label>
            {isEditing ? (
              <Input
                id="phoneNumber"
                value={formData?.phoneNumber || ''}
                onChange={(e) =>
                  handleInputChange('phoneNumber', e.target.value)
                }
                fullWidth
                placeholder="Phone Number"
              />
            ) : (
              <p className="text-black-800">
                {user?.phoneNumber || 'Not provided'}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <p className="text-black-800">{user?.role || 'Not assigned'}</p>
          </div>

          {/* Status */}
          <div>
            <p className="text-black-800">{user?.status || 'Unknown'}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <Button onPress={handleEditToggle}>Cancel</Button>
                <Button onPress={handleSave}>Save</Button>
              </>
            ) : (
              <Tooltip content="Update Your Information" placement="top">
                <Button onPress={handleEditToggle}>Update Profile</Button>
              </Tooltip>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;

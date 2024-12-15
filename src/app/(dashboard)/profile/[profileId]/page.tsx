"use client";

import { useEffect, useState } from "react";
import { Input, Button, Card, Avatar, Tooltip } from "@nextui-org/react";
import { FaPen } from "react-icons/fa";
import { toast } from "sonner";

import { useGetSingleUser, useUpdateProfile } from "@/src/hooks/user.hooks";
import { IUser } from "@/src/types";
import { useChangePassword } from "@/src/hooks/auth.hooks";

interface IProps {
  params: {
    profileId: string;
  };
}

const ProfilePage = ({ params: { profileId } }: IProps) => {
  const { data, isLoading } = useGetSingleUser(profileId);
  const {
    mutate: handleUpdateProfileApi,
    isPending: updatePending,
    isSuccess: updateSuccess,
  } = useUpdateProfile();
  const {
    mutate: handleChangePasswordApi,
    isPending: changePasswordPending,
    isSuccess: changPasswordSuccess,
  } = useChangePassword();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUser | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const user = data?.data?.userData;

  useEffect(() => {
    if (!showPasswordChange) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [showPasswordChange]);

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

  // const handleSave = async () => {
  //   try {
  //     const formDataToSend = new FormData();

  //     // Append profile photo if available
  //     if (selectedFile) {
  //       formDataToSend.append('profilePhoto', selectedFile);
  //     }

  //     // Append other form fields
  //     formDataToSend.append('name', formData?.name || '');
  //     formDataToSend.append('email', formData?.email || '');
  //     formDataToSend.append('phoneNumber', formData?.phoneNumber || '');
  //     formDataToSend.append('role', formData?.role || '');
  //     formDataToSend.append('status', formData?.status || '');

  //     // Send the request to update the profile
  //     const payload = {
  //       id: profileId,
  //       formData: formDataToSend,
  //     };

  //     await handleUpdateProfileApi(payload);

  //     setIsEditing(false); // Exit editing mode
  //     toast.success('Profile updated successfully!'); // Notify success
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Failed to update profile.'); // Notify failure
  //   }
  // };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();

      // Add the profile data as a JSON string
      formDataToSend.append(
        "data",
        JSON.stringify({
          name: formData?.name || "",
          email: formData?.email || "",
          phoneNumber: formData?.phoneNumber || "",
          role: formData?.role || "",
          status: formData?.status || "",
        }),
      );

      // Append the profile photo if available
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      // Send the request to update the profile
      const payload = {
        id: profileId,
        formData: formDataToSend,
      };

      await handleUpdateProfileApi(payload);

      setIsEditing(false); // Exit editing mode
      toast.success("Profile updated successfully!"); // Notify success
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile."); // Notify failure
    }
  };

  const handlePasswordChange = async () => {
    if (currentPassword.length === 0) {
      alert("Current Password is empty.");

      return;
    }
    if (confirmPassword.length === 0) {
      alert("New passwords is empty.");

      return;
    }
    if (newPassword.length === 0) {
      alert("Confirm password before changing.");

      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");

      return;
    }

    try {
      const passwordData = {
        oldPassword: currentPassword,
        newPassword,
      };

      await handleChangePasswordApi(passwordData);

      if (changPasswordSuccess) {
        alert("Password changed successfully!");
        setShowPasswordChange(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to change password.");
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
    <div>
      <Card className="max-w-3xl ml-2 mt-2 p-6 shadow-lg">
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <Avatar
              alt="Profile Photo"
              className="w-32 h-32"
              size="lg"
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : formData?.profilePhoto ||
                    "https://i.ibb.co/wcv1QBQ/5951752.png"
              }
            />
            <Tooltip content="Update Profile Photo" placement="top">
              <label className="absolute top-0 right-0 bg-gray-700 text-white p-1 rounded-full cursor-pointer">
                <FaPen className="w-3 h-3" />
                <input
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={handlePhotoChange}
                />
              </label>
            </Tooltip>
          </div>
          <h1 className="text-2xl font-bold text-black-500">
            {isEditing ? (
              <Input
                fullWidth
                placeholder="Name"
                value={formData?.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              user?.name || "Unknown User"
            )}
          </h1>
        </div>

        <div className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-bold text-black-600" htmlFor="email">
              Email
            </label>
            {isEditing ? (
              <Input
                fullWidth
                id="email"
                placeholder="Email"
                value={formData?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            ) : (
              <p className="text-black-800">{user?.email || "Not provided"}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              className="text-sm font-bold text-black-600"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            {isEditing ? (
              <Input
                fullWidth
                id="phoneNumber"
                placeholder="Phone Number"
                value={formData?.phoneNumber || ""}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
            ) : (
              <p className="text-black-800">
                {user?.phoneNumber || "Not provided"}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <p className="text-black-800">{user?.role || "Not assigned"}</p>
          </div>

          {/* Status */}
          <div>
            <p className="text-black-800">{user?.status || "Unknown"}</p>
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

      {/* Change Password Card */}
      <Card className="max-w-3xl ml-2 my-6 p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-black-500">Change Password</h2>
          <Button onPress={() => setShowPasswordChange(!showPasswordChange)}>
            {showPasswordChange ? "Cancel" : "Change Password"}
          </Button>
        </div>
        {showPasswordChange && (
          <div className="mt-4 space-y-4">
            <div>
              <label
                className="text-sm font-bold text-black-600"
                htmlFor="currentPassword"
              >
                Current Password
              </label>
              <Input
                fullWidth
                id="currentPassword"
                placeholder="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                className="text-sm font-bold text-black-600"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <Input
                fullWidth
                id="newPassword"
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                className="text-sm font-bold text-black-600"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </label>
              <Input
                fullWidth
                id="confirmPassword"
                placeholder="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button onPress={handlePasswordChange}>Change Password</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
  createReply,
  updateReply,
  deleteReply,
} from "../services/ReviewService";

// Fetch all reviews
export const useGetAllReviews = () => {
  return useQuery({
    queryKey: ["GET_ALL_REVIEWS"],
    queryFn: () => {
      try {
        return getAllReviews();
      } catch (error) {
        toast.error("Failed to fetch reviews");
        throw error;
      }
    },
  });
};

// Create a new review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: any) => createReview(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_REVIEWS"] });
      toast.success("Review created successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create review.";

      toast.error(errorMessage);
    },
  });
};

// Update a review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; reviewData: any }) =>
      updateReview(params.id, params.reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_REVIEWS"] });
      toast.success("Review updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update review.";

      toast.error(errorMessage);
    },
  });
};

// Delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_REVIEWS"] });
      toast.success("Review deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete review.";

      toast.error(errorMessage);
    },
  });
};

// Create a new reply
export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replyData: any) => createReply(replyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_REVIEWS"] });
      toast.success("Reply created successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create reply.";

      toast.error(errorMessage);
    },
  });
};

// Update a reply
export const useUpdateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; replyData: any }) =>
      updateReply(params.id, params.replyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_REVIEWS"] });
      toast.success("Reply updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update reply.";

      toast.error(errorMessage);
    },
  });
};

// Delete a reply
export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReply(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_ALL_REVIEWS"] });
      toast.success("Reply deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete reply.";

      toast.error(errorMessage);
    },
  });
};

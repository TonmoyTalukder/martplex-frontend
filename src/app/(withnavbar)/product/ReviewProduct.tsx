"use client";

import { useState } from "react";
import {
  MdOutlineStarPurple500,
  MdOutlineStarHalf,
  MdOutlineStarOutline,
} from "react-icons/md";
import { Avatar } from "@nextui-org/react";

import {
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useCreateReply,
  useUpdateReply,
  useDeleteReply,
} from "@/src/hooks/review.hooks";

export interface IReview {
  id: string;
  content: string;
  rating: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: IUser;
  reply?: IReply[];
}

interface IUser {
  profilePhoto: string | null;
  name: string;
}

export interface IReply {
  id: string;
  content: string;
  userId: string;
  user: IUser;
  reviewId: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewProductProps {
  userId?: string;
  productId: string;
  vendorStandId: string;
  orderId: string;
  userRole: "CUSTOMER" | "ADMIN" | "VENDOR" | "SUPER_ADMIN" | undefined;
  productInfo: {
    reviews: IReview[];
  };
}

const ReviewProduct = ({
  productInfo,
  userId,
  productId,
  vendorStandId,
  orderId,
  userRole,
}: ReviewProductProps) => {
  const [reviews, setReviews] = useState<IReview[]>(productInfo.reviews);
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newEditReviewRating, setNewEditReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hoverEditRating, setHoverEditRating] = useState(0);
  const [editReviewId, setEditReviewId] = useState<string | null>(null);
  const [editReviewContent, setEditReviewContent] = useState("");
  const [newReplyContent, setNewReplyContent] = useState("");
  const [editReplyId, setEditReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");

  const userAvatar = "https://i.ibb.co/wcv1QBQ/5951752.png";

  // Hooks for server interactions
  const { mutate: createReview } = useCreateReview();
  const { mutate: updateReview } = useUpdateReview();
  const { mutate: deleteReview } = useDeleteReview();
  const { mutate: createReply } = useCreateReply();
  const { mutate: updateReply } = useUpdateReply();
  const { mutate: deleteReply } = useDeleteReply();

  const handleAddReview = () => {
    const payload = {
      content: newReviewContent,
      rating: newReviewRating,
      userId,
      productId,
      vendorStandId,
      orderId,
    };

    createReview(payload, {
      onSuccess: (data: IReview) => {
        window.location.reload();
        // setReviews([...reviews, data]);
        // setNewReviewContent('');
      },
    });
  };

  const handleEditReview = (id: string) => {
    const payload = {
      reviewId: id,
      content: editReviewContent,
      rating: newEditReviewRating,
    };

    updateReview(
      { id, reviewData: payload },
      {
        onSuccess: (data: IReview) => {
          //   setReviews(reviews.map((r) => (r.id === id ? data : r)));
          //   setEditReviewId(null);
          //   setEditReviewContent('');
          window.location.reload();
        },
      },
    );
  };

  const handleDeleteReview = (id: string) => {
    deleteReview(id, {
      onSuccess: () => {
        setReviews(reviews.filter((r) => r.id !== id));
      },
    });
  };

  const handleAddReply = (reviewId: string) => {
    const payload = { reviewId, userId, content: newReplyContent };

    createReply(payload, {
      onSuccess: (data: IReply) => {
        window.location.reload();

        // setReviews(
        //   reviews.map((r) =>
        //     r.id === reviewId ? { ...r, reply: [...(r.reply || []), data] } : r,
        //   ),
        // );
        // setNewReplyContent('');
      },
    });
  };

  const handleEditReply = (reviewId: string, replyId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    const reply = review?.reply?.find((rep) => rep.id === replyId);

    if (reply) {
      updateReply(
        { id: replyId, replyData: { replyId, content: editReplyContent } },
        {
          onSuccess: (data) => {
            window.location.reload();
            // setReviews(
            //   reviews.map((r) =>
            //     r.id === reviewId
            //       ? {
            //           ...r,
            //           reply: r.reply?.map((rep) =>
            //             rep.id === replyId ? data : rep,
            //           ),
            //         }
            //       : r,
            //   ),
            // );
            // setEditReplyId(null);
            // setEditReplyContent('');
          },
        },
      );
    }
  };

  const handleDeleteReply = (reviewId: string, replyId: string) => {
    deleteReply(replyId, {
      onSuccess: () => {
        setReviews(
          reviews.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  reply: r.reply?.filter((reply) => reply.id !== replyId),
                }
              : r,
          ),
        );
      },
    });
  };

  const handleStarClick = (rating: number) => {
    setNewReviewRating(rating); // Save the clicked rating
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating); // Update hover rating
  };

  const handleStarLeave = () => {
    setHoverRating(0); // Reset hover rating when mouse leaves
  };

  const handleEditStarClick = (rating: number) => {
    setNewEditReviewRating(rating); // Save the clicked rating
  };

  const handleEditStarHover = (rating: number) => {
    setHoverEditRating(rating); // Update hover rating
  };

  const handleEditStarLeave = () => {
    setHoverEditRating(0); // Reset hover rating when mouse leaves
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= (hoverRating || newReviewRating)) {
        // Full star
        stars.push(
          <MdOutlineStarPurple500
            key={i}
            className="text-yellow-500 cursor-pointer text-2xl"
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleStarHover(i)}
            onMouseLeave={handleStarLeave}
          />,
        );
      } else if (i - 0.5 === (hoverRating || newReviewRating)) {
        // Half star
        stars.push(
          <MdOutlineStarHalf
            key={i}
            className="text-yellow-500 cursor-pointer text-2xl"
            onClick={() => handleStarClick(i - 0.5)}
            onMouseEnter={() => handleStarHover(i - 0.5)}
            onMouseLeave={handleStarLeave}
          />,
        );
      } else {
        // Empty star
        stars.push(
          <MdOutlineStarOutline
            key={i}
            className="text-gray-400 cursor-pointer text-2xl"
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleStarHover(i)}
            onMouseLeave={handleStarLeave}
          />,
        );
      }
    }

    return stars;
  };

  const renderEditStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= (hoverEditRating || newEditReviewRating)) {
        // Full star
        stars.push(
          <MdOutlineStarPurple500
            key={i}
            className="text-yellow-500 cursor-pointer text-2xl"
            onClick={() => handleEditStarClick(i)}
            onMouseEnter={() => handleEditStarHover(i)}
            onMouseLeave={handleEditStarLeave}
          />,
        );
      } else if (i - 0.5 === (hoverEditRating || newEditReviewRating)) {
        // Half star
        stars.push(
          <MdOutlineStarHalf
            key={i}
            className="text-yellow-500 cursor-pointer text-2xl"
            onClick={() => handleEditStarClick(i - 0.5)}
            onMouseEnter={() => handleEditStarHover(i - 0.5)}
            onMouseLeave={handleEditStarLeave}
          />,
        );
      } else {
        // Empty star
        stars.push(
          <MdOutlineStarOutline
            key={i}
            className="text-gray-400 cursor-pointer text-2xl"
            onClick={() => handleEditStarClick(i)}
            onMouseEnter={() => handleEditStarHover(i)}
            onMouseLeave={handleEditStarLeave}
          />,
        );
      }
    }

    return stars;
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">
        <span
          className="font-bold text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
          }}
        >
          Customer Reviews
        </span>
      </h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 py-4">
            {editReviewId === review.id ? (
              <div className="flex flex-row gap-3 justify-start items-start">
                <div>
                  <Avatar
                    size="sm"
                    src={
                      review.user.profilePhoto !== null
                        ? review.user.profilePhoto
                        : userAvatar
                    }
                  />
                </div>
                <div className="w-full">
                  <h1 className="font-bold text-lg">{review.user.name}</h1>
                  <div className="mb-4">
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={editReviewContent}
                      onChange={(e) => setEditReviewContent(e.target.value)}
                    />
                    <div className="flex items-center mb-4">
                      <p className="text-gray-800 mr-2">Rating:</p>
                      <div className="flex">{renderEditStars()}</div>
                      <p className="ml-4 text-gray-600">
                        {newEditReviewRating > 0
                          ? newEditReviewRating > 1
                            ? `${newEditReviewRating} Stars`
                            : `${newEditReviewRating} Star`
                          : "No rating"}
                      </p>
                    </div>
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded-md mt-2 mr-2"
                      onClick={() => handleEditReview(review.id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white py-1 px-3 rounded-md mt-2"
                      onClick={() => setEditReviewId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-row gap-3 justify-start items-start">
                  <div>
                    <Avatar
                      size="sm"
                      src={
                        review.user.profilePhoto !== null
                          ? review.user.profilePhoto
                          : userAvatar
                      }
                    />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg">{review.user.name}</h1>
                    <p className="text-gray-800 font-medium text-justify">
                      {review.content}
                    </p>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(review.rating) ? (
                            <MdOutlineStarPurple500 className="text-yellow-500" />
                          ) : i < review.rating ? (
                            <MdOutlineStarHalf className="text-yellow-500" />
                          ) : (
                            <MdOutlineStarOutline className="text-yellow-500" />
                          )}
                        </span>
                      ))}
                    </div>
                    {userRole && (
                      <div className="flex gap-2">
                        {userId === review.userId && (
                          <button
                            className="text-blue-700 hover:underline"
                            onClick={() => {
                              setNewEditReviewRating(review.rating);
                              setEditReviewId(review.id);
                              setEditReviewContent(review.content);
                            }}
                          >
                            Edit
                          </button>
                        )}
                        {(userId === review.userId ||
                          userRole === "ADMIN" ||
                          userRole === "SUPER_ADMIN") && (
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            <div className="ml-6 mt-4">
              <h4 className="font-semibold">
                {" "}
                <span
                  className="font-bold text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(314deg, #336B92, #8DC2EF)",
                  }}
                >
                  Replies
                </span>
              </h4>
              {review.reply?.map((reply) => (
                <div key={reply.id} className="mt-2">
                  {editReplyId === reply.id ? (
                    <div>
                      <div className="flex flex-row gap-3 justify-start items-start">
                        <div>
                          <Avatar
                            size="sm"
                            src={
                              reply.user.profilePhoto !== null
                                ? reply.user.profilePhoto
                                : userAvatar
                            }
                          />
                        </div>
                        <div className="w-full">
                          <h1 className="font-bold text-lg">
                            {reply.user.name}
                          </h1>
                          <textarea
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={editReplyContent}
                            onChange={(e) =>
                              setEditReplyContent(e.target.value)
                            }
                          />
                          <button
                            className="bg-green-500 text-white py-1 px-3 rounded-md mt-2 mr-2"
                            onClick={() => handleEditReply(review.id, reply.id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-500 text-white py-1 px-3 rounded-md mt-2"
                            onClick={() => setEditReplyId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex flex-row gap-3 justify-start items-start">
                        <div>
                          <Avatar
                            size="sm"
                            src={
                              reply.user.profilePhoto !== null
                                ? reply.user.profilePhoto
                                : userAvatar
                            }
                          />
                        </div>
                        <div>
                          <h1 className="font-bold text-lg">
                            {reply.user.name}
                          </h1>
                          <p>{reply.content}</p>
                          {userRole && (
                            <div className="flex gap-2">
                              {userId === reply.userId && (
                                <button
                                  className="text-blue-700 hover:underline"
                                  onClick={() => {
                                    setEditReplyId(reply.id);
                                    setEditReplyContent(reply.content);
                                  }}
                                >
                                  Edit
                                </button>
                              )}
                              {(userId === reply.userId ||
                                userRole === "ADMIN" ||
                                userRole === "SUPER_ADMIN") && (
                                <button
                                  className="text-red-500 hover:underline"
                                  onClick={() =>
                                    handleDeleteReply(review.id, reply.id)
                                  }
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {userId && (
                <div>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 mt-2"
                    placeholder="Write a reply..."
                    value={newReplyContent}
                    onChange={(e) => setNewReplyContent(e.target.value)}
                  />
                  <button
                    className=" text-white py-1 px-3 rounded-md mt-2"
                    style={{
                      backgroundImage:
                        "linear-gradient(314deg, #336B92, #8DC2EF)",
                    }}
                    onClick={() => handleAddReply(review.id)}
                  >
                    Add Reply
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}

      {/* Write a Review */}
      {orderId && userRole === "CUSTOMER" && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Write a Review
          </h3>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 mb-4"
            placeholder="Write your review here..."
            value={newReviewContent}
            onChange={(e) => setNewReviewContent(e.target.value)}
          />
          <div className="flex items-center mb-4">
            <p className="text-gray-800 mr-2">Rating:</p>
            <div className="flex">{renderStars()}</div>
            <p className="ml-4 text-gray-600">
              {newReviewRating > 0
                ? newReviewRating > 1
                  ? `${newReviewRating} Stars`
                  : `${newReviewRating} Star`
                : "No rating"}
            </p>
          </div>
          <button
            className="text-white py-2 px-4 rounded-md hover:bg-sky-600 transition-all"
            style={{
              backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
            }}
            onClick={handleAddReview}
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewProduct;

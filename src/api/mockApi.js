import {
  mockAdminUser,
  mockHotels,
  mockBookings,
  mockUsers,
  mockReviews,
  mockCoupons,
  mockDashboardStats,
} from "./mockData";

// API 지연 시뮬레이션
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API 응답 생성
const createResponse = (data) => {
  return Promise.resolve(data);
};

// Mock 인증 API
export const mockAuthApi = {
  login: async (credentials) => {
    await delay();

    if (
      credentials.email === "admin@hotel.com" &&
      credentials.password === "admin1234"
    ) {
      return createResponse({
        token: "mock-jwt-token-" + Date.now(),
        admin: mockAdminUser,
      });
    }

    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  },

  logout: async () => {
    await delay(200);
    return createResponse({ message: "Logged out successfully" });
  },

  getMyInfo: async () => {
    await delay();
    return createResponse(mockAdminUser);
  },

  changePassword: async (data) => {
    await delay();
    return createResponse({ message: "Password changed successfully" });
  },

  forgotPassword: async (email) => {
    await delay();
    return createResponse({ message: "Reset email sent" });
  },
};

// Mock 호텔 API
export const mockHotelApi = {
  getHotels: async (params = {}) => {
    await delay();
    let filtered = [...mockHotels];

    // 필터링
    if (params.search) {
      filtered = filtered.filter((h) =>
        h.name.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    if (params.status) {
      filtered = filtered.filter((h) => h.status === params.status);
    }
    if (params.region) {
      filtered = filtered.filter((h) => h.region === params.region);
    }

    return createResponse({
      hotels: filtered,
      totalPages: 1,
      currentPage: params.page || 1,
    });
  },

  getHotelById: async (hotelId) => {
    await delay();
    const hotel = mockHotels.find((h) => h.id === parseInt(hotelId));
    if (!hotel) throw new Error("Hotel not found");
    return createResponse(hotel);
  },

  createHotel: async (data) => {
    await delay();
    const newHotel = {
      id: mockHotels.length + 1,
      ...data,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    mockHotels.push(newHotel);
    return createResponse(newHotel);
  },

  updateHotel: async (hotelId, data) => {
    await delay();
    const index = mockHotels.findIndex((h) => h.id === parseInt(hotelId));
    if (index === -1) throw new Error("Hotel not found");
    mockHotels[index] = { ...mockHotels[index], ...data };
    return createResponse(mockHotels[index]);
  },

  deleteHotel: async (hotelId) => {
    await delay();
    const index = mockHotels.findIndex((h) => h.id === parseInt(hotelId));
    if (index !== -1) {
      const deleted = mockHotels.splice(index, 1)[0];
      return createResponse({ message: "Hotel deleted", hotel: deleted });
    }
    throw new Error("Hotel not found");
  },

  approveHotel: async (hotelId) => {
    await delay();
    const hotel = mockHotels.find((h) => h.id === parseInt(hotelId));
    if (hotel) {
      hotel.approvalStatus = "approved";
      return createResponse({ message: "Hotel approved", hotel });
    }
    throw new Error("Hotel not found");
  },

  rejectHotel: async (hotelId, reason) => {
    await delay();
    const hotel = mockHotels.find((h) => h.id === parseInt(hotelId));
    if (hotel) {
      hotel.approvalStatus = "rejected";
      return createResponse({ message: "Hotel rejected", hotel });
    }
    throw new Error("Hotel not found");
  },
};

// Mock 예약 API
export const mockBookingApi = {
  getBookings: async (params = {}) => {
    await delay();
    console.log("mockApi getBookings params:", params); // DEBUG
    let filtered = [...mockBookings];

    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.id.toLowerCase().includes(search) ||
          b.guestName.toLowerCase().includes(search) ||
          b.hotelName.toLowerCase().includes(search) ||
          (b.hotelName + ' ' + b.roomType).toLowerCase().includes(search)
      );
    }
    if (params.paymentStatus && params.paymentStatus !== "") {
      filtered = filtered.filter((b) => b.paymentStatus === params.paymentStatus);
    }
    if (params.status && params.status !== "") {
      console.log("Filtering by status:", params.status); // DEBUG
      filtered = filtered.filter((b) => b.status === params.status);
      console.log("After status filter:", filtered.length); // DEBUG
    }

    return createResponse({
      bookings: filtered,
      totalPages: 1,
      currentPage: params.page || 1,
    });
  },

  getBookingById: async (bookingId) => {
    await delay();
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");
    return createResponse(booking);
  },

  updateBookingStatus: async (bookingId, status) => {
    await delay();
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (booking) booking.status = status;
    return createResponse({ message: "Status updated" });
  },

  cancelBooking: async (bookingId, reason) => {
    await delay();
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (booking) booking.status = "cancelled";
    return createResponse({ message: "Booking cancelled" });
  },

  deleteBooking: async (bookingId) => {
    await delay();
    return createResponse({ message: "Booking deleted" });
  },
};

// Mock 사용자 API
export const mockUserApi = {
  getUsers: async (params = {}) => {
    await delay();
    let filtered = [...mockUsers];

    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.phone.toLowerCase().includes(search) ||
          (u.type ? u.type.toLowerCase().includes(search) : false) ||
          (u.level ? u.level.toLowerCase().includes(search) : false)
      );
    }
    if (params.type) {
      filtered = filtered.filter((u) => u.type === params.type);
    }
    if (params.role) {
      filtered = filtered.filter((u) => u.role === params.role);
    }
    if (params.level) {
      filtered = filtered.filter((u) => u.level === params.level);
    }
    if (params.status) {
      filtered = filtered.filter((u) => u.status === params.status);
    }

    return createResponse({
      users: filtered,
      totalPages: 1,
      currentPage: params.page || 1,
    });
  },

  getUserById: async (userId) => {
    await delay();
    const user = mockUsers.find((u) => u.id === parseInt(userId));
    if (!user) throw new Error("User not found");
    return createResponse(user);
  },

  updateUser: async (userId, data) => {
    await delay();
    const user = mockUsers.find((u) => u.id === parseInt(userId));
    if (user) Object.assign(user, data);
    return createResponse(user);
  },

  deleteUser: async (userId) => {
    await delay();
    const index = mockUsers.findIndex((u) => u.id === parseInt(userId));
    if (index !== -1) {
      const deleted = mockUsers.splice(index, 1)[0];
      return createResponse({ message: "User deleted", user: deleted });
    }
    throw new Error("User not found");
  },

  updateUserStatus: async (userId, status) => {
    await delay();
    const user = mockUsers.find((u) => u.id === parseInt(userId));
    if (user) user.status = status;
    return createResponse({ message: "Status updated" });
  },

  getBusinessUsers: async (params = {}) => {
    await delay();
    const business = mockUsers.filter((u) => u.type === "business");
    return createResponse({
      users: business,
      totalPages: 1,
      currentPage: params.page || 1,
    });
  },
};

// Mock 리뷰 API
export const mockReviewApi = {
  getReviews: async (params = {}) => {
    await delay();
    let filtered = [...mockReviews];

    if (params.search) {
      filtered = filtered.filter(
        (r) =>
          r.hotelName.toLowerCase().includes(params.search.toLowerCase()) ||
          r.author.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    if (params.rating) {
      filtered = filtered.filter((r) => r.rating === parseInt(params.rating));
    }
    if (params.reported) {
      filtered = filtered.filter(
        (r) => r.reported === (params.reported === "true")
      );
    }

    return createResponse({
      reviews: filtered,
      totalPages: 1,
      currentPage: params.page || 1,
    });
  },

  getReviewById: async (reviewId) => {
    await delay();
    const review = mockReviews.find((r) => r.id === parseInt(reviewId));
    if (!review) throw new Error("Review not found");
    return createResponse(review);
  },

  deleteReview: async (reviewId) => {
    await delay();
    const index = mockReviews.findIndex((r) => r.id === parseInt(reviewId));
    if (index !== -1) {
      const deleted = mockReviews.splice(index, 1)[0];
      return createResponse({ message: "Review deleted", review: deleted });
    }
    throw new Error("Review not found");
  },

  updateReviewStatus: async (reviewId, status) => {
    await delay();
    const review = mockReviews.find((r) => r.id === parseInt(reviewId));
    if (!review) throw new Error("Review not found");
    review.status = status;
    return createResponse({ message: "Review status updated", review });
  },

  getReportedReviews: async (params = {}) => {
    await delay();
    const reported = mockReviews.filter((r) => r.reported);
    return createResponse({
      reviews: reported,
      totalPages: 1,
      currentPage: params.page || 1,
    });
  },

  handleReport: async (reviewId, action) => {
    await delay();
    const review = mockReviews.find((r) => r.id === parseInt(reviewId));
    if (!review) throw new Error("Review not found");
    
    if (action === "resolve") {
      review.reportCount = 0;
      review.reportStatus = "resolved";
      review.status = "published";
    } else if (action === "delete") {
      review.reportCount = 0;
      review.reportStatus = "clean";
    }
    
    return createResponse({ message: "Report handled", review });
  },
};

// Mock 통계 API
export const mockStatsApi = {
  getDashboardStats: async () => {
    await delay();
    return createResponse(mockDashboardStats);
  },

  getRevenueStats: async (params = {}) => {
    await delay();
    return createResponse({
      total: 12500000,
      monthly: mockDashboardStats.chartData.revenue,
    });
  },

  getBookingStats: async (params = {}) => {
    await delay();
    return createResponse({
      total: 342,
      monthly: mockDashboardStats.chartData.bookings,
    });
  },

  getUserStats: async (params = {}) => {
    await delay();
    return createResponse({
      total: 1523,
      new: 8,
      active: 1245,
    });
  },

  getHotelStats: async (params = {}) => {
    await delay();
    return createResponse({
      total: 45,
      active: 42,
      pending: 3,
    });
  },
};

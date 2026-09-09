import { apiConnector } from "../apiconnector";
import { supportTicketEndpoints } from "../apis";

const {
  CREATE_TICKET_API,
  GET_MY_TICKETS_API,
  GET_TICKET_BY_ID_API,
  REPLY_TO_TICKET_API,
  CLOSE_TICKET_API,
  RATE_TICKET_API,
  GET_UNREAD_COUNT_API,
  GET_ALL_TICKETS_API,
  GET_TICKET_STATS_API,
  GET_STAFF_FOR_ASSIGNMENT_API,
  UPDATE_TICKET_STATUS_API,
  ASSIGN_TICKET_API,
  ADD_INTERNAL_NOTE_API,
  DELETE_TICKET_API,
} = supportTicketEndpoints;

// =============================================
// USER FUNCTIONS
// =============================================

// Create a new support ticket
export const createTicket = async (ticketData, token) => {
  try {
    const response = await apiConnector(
      "POST",
      CREATE_TICKET_API,
      ticketData,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user's tickets
export const getMyTickets = async (token, params = {}) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_MY_TICKETS_API,
      null,
      { Authorization: `Bearer ${token}` },
      params
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single ticket by ID
export const getTicketById = async (ticketId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_TICKET_BY_ID_API(ticketId),
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reply to a ticket
export const replyToTicket = async (ticketId, message, token, attachments = []) => {
  try {
    const response = await apiConnector(
      "POST",
      REPLY_TO_TICKET_API(ticketId),
      { message, attachments },
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Close a ticket
export const closeTicket = async (ticketId, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      CLOSE_TICKET_API(ticketId),
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Rate a resolved/closed ticket
export const rateTicket = async (ticketId, ratingData, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      RATE_TICKET_API(ticketId),
      ratingData,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get unread ticket count
export const getUnreadCount = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_UNREAD_COUNT_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
return { data: { unreadCount: 0 } };
  }
};

// =============================================
// ADMIN FUNCTIONS
// =============================================

// Get all tickets (admin)
export const getAllTickets = async (token, params = {}) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_TICKETS_API,
      null,
      { Authorization: `Bearer ${token}` },
      params
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get ticket statistics (admin)
export const getTicketStats = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_TICKET_STATS_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// Get staff members for assignment (admin)
export const getStaffForAssignment = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_STAFF_FOR_ASSIGNMENT_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
throw error;
  }
};

// Update ticket status (admin)
export const updateTicketStatus = async (ticketId, status, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_TICKET_STATUS_API(ticketId),
      { status },
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Assign ticket to staff member (admin)
export const assignTicket = async (ticketId, assignData, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      ASSIGN_TICKET_API(ticketId),
      assignData,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add internal note (admin)
export const addInternalNote = async (ticketId, note, token) => {
  try {
    const response = await apiConnector(
      "POST",
      ADD_INTERNAL_NOTE_API(ticketId),
      { note },
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete ticket (admin)
export const deleteTicket = async (ticketId, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_TICKET_API(ticketId),
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

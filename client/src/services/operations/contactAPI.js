import { apiconnector } from "../apiconnector";
import { contactEndpoints } from "../apis";
import axios from "axios";

const {
  SUBMIT_CONTACT_API,
  BOOK_MEETING_API,
  RAISE_QUERY_API,
  GET_ALL_CONTACTS_API,
  GET_CONTACT_BY_ID_API,
  GET_CONTACT_STATS_API,
  UPDATE_CONTACT_STATUS_API,
  RESPOND_TO_CONTACT_API,
  ASSIGN_CONTACT_API,
  ADD_NOTE_API,
  DELETE_CONTACT_API,
  UPLOAD_ATTACHMENT_API,
} = contactEndpoints;

// Submit contact form (public)
export const submitContact = async (contactData) => {
  try {
    const response = await apiconnector("POST", SUBMIT_CONTACT_API, contactData);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Book a meeting (public)
export const bookMeeting = async (meetingData) => {
  try {
    const response = await apiconnector("POST", BOOK_MEETING_API, meetingData);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Raise a query (public)
export const raiseQuery = async (queryData) => {
  try {
    const response = await apiconnector("POST", RAISE_QUERY_API, queryData);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all contacts (admin only)
export const getAllContacts = async (params, token) => {
  try {
    const response = await apiconnector("GET", GET_ALL_CONTACTS_API, null, {
      Authorization: `Bearer ${token}`,
    }, params);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single contact (admin only)
export const getContactById = async (id, token) => {
  try {
    const response = await apiconnector("GET", GET_CONTACT_BY_ID_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get contact stats (admin only)
export const getContactStats = async (token) => {
  try {
    const response = await apiconnector("GET", GET_CONTACT_STATS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update contact status (admin only)
export const updateContactStatus = async (id, status, token) => {
  try {
    const response = await apiconnector("PUT", UPDATE_CONTACT_STATUS_API(id), { status }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload contact attachment (admin only)
export const uploadContactAttachment = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(UPLOAD_ATTACHMENT_API, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data; // Returns { name, url, publicId, type, size }
  } catch (error) {
    throw error;
  }
};

// Respond to contact (admin only)
export const respondToContact = async (id, message, attachments, token) => {
  try {
    // Ensure attachments is properly formatted
    const formattedAttachments = Array.isArray(attachments) 
      ? attachments.map(att => ({
          name: att.name,
          url: att.url,
          publicId: att.publicId,
          fileType: att.type || att.fileType,
          size: att.size
        }))
      : [];
    
    const response = await apiconnector("PUT", RESPOND_TO_CONTACT_API(id), { 
      message, 
      attachments: formattedAttachments 
    }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Assign contact (admin only)
export const assignContact = async (id, userId, token) => {
  try {
    const response = await apiconnector("PUT", ASSIGN_CONTACT_API(id), { assignedTo: userId }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add note to contact (admin only)
export const addNote = async (id, note, token) => {
  try {
    const response = await apiconnector("PUT", ADD_NOTE_API(id), { note }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete contact (admin only)
export const deleteContact = async (id, token) => {
  try {
    const response = await apiconnector("DELETE", DELETE_CONTACT_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

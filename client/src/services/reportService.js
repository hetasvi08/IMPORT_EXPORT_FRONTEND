import { apiConnector } from './apiconnector';
import { reportEndpoints } from './apis';

const {
  GET_REPORT_OVERVIEW_API,
  GET_WEEKLY_REPORT_API,
  GET_MONTHLY_REPORT_API,
  GET_QUARTERLY_REPORT_API,
  GET_YEARLY_REPORT_API,
  GET_REVENUE_TREND_API,
  GET_SALES_BY_CATEGORY_API,
  GET_SALES_BY_REGION_API,
  GET_TOP_SELLING_PRODUCTS_API,
  GET_USER_ACTIVITY_REPORT_API,
  GET_KPI_METRICS_API,
  EXPORT_REPORT_PDF_API,
  EXPORT_REPORT_CSV_API,
  EMAIL_REPORT_API,
  GET_SCHEDULED_REPORTS_API,
  CREATE_SCHEDULED_REPORT_API,
  UPDATE_SCHEDULED_REPORT_API,
  DELETE_SCHEDULED_REPORT_API,
  TOGGLE_SCHEDULED_REPORT_API,
  SEND_SCHEDULED_REPORT_NOW_API,
} = reportEndpoints;

// Helper to get auth headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const reportService = {
  // Get report overview with key metrics
  getReportOverview: async (period = 'weekly') => {
    const response = await apiConnector(
      'GET',
      `${GET_REPORT_OVERVIEW_API}?period=${period}`,
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get weekly report with daily breakdown
  getWeeklyReport: async () => {
    const response = await apiConnector(
      'GET',
      GET_WEEKLY_REPORT_API,
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get monthly report
  getMonthlyReport: async (month, year) => {
    let url = GET_MONTHLY_REPORT_API;
    const params = [];
    if (month !== undefined) params.push(`month=${month}`);
    if (year !== undefined) params.push(`year=${year}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    const response = await apiConnector('GET', url, null, getAuthHeaders());
    return response.data;
  },

  // Get quarterly report
  getQuarterlyReport: async (quarter, year) => {
    let url = GET_QUARTERLY_REPORT_API;
    const params = [];
    if (quarter !== undefined) params.push(`quarter=${quarter}`);
    if (year !== undefined) params.push(`year=${year}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    const response = await apiConnector('GET', url, null, getAuthHeaders());
    return response.data;
  },

  // Get yearly report
  getYearlyReport: async (year) => {
    let url = GET_YEARLY_REPORT_API;
    if (year) url += `?year=${year}`;

    const response = await apiConnector('GET', url, null, getAuthHeaders());
    return response.data;
  },

  // Get revenue trend data for charts
  getRevenueTrend: async (period = 'weekly') => {
    const response = await apiConnector(
      'GET',
      `${GET_REVENUE_TREND_API}?period=${period}`,
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get sales by category
  getSalesByCategory: async (period = 'weekly') => {
    const response = await apiConnector(
      'GET',
      `${GET_SALES_BY_CATEGORY_API}?period=${period}`,
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get sales by region/country
  getSalesByRegion: async (period = 'weekly') => {
    const response = await apiConnector(
      'GET',
      `${GET_SALES_BY_REGION_API}?period=${period}`,
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get top selling products
  getTopSellingProducts: async (period = 'weekly', limit = 10) => {
    const response = await apiConnector(
      'GET',
      `${GET_TOP_SELLING_PRODUCTS_API}?period=${period}&limit=${limit}`,
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get user activity report
  getUserActivityReport: async (period = 'weekly') => {
    const response = await apiConnector(
      'GET',
      `${GET_USER_ACTIVITY_REPORT_API}?period=${period}`,
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get KPI metrics
  getKPIMetrics: async (period = 'weekly') => {
    const response = await apiConnector(
      'GET',
      `${GET_KPI_METRICS_API}?period=${period}`,
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get all report data at once
  getAllReportData: async (period = 'weekly') => {
    try {
      const [
        overviewRes,
        periodReportRes,
        revenueTrendRes,
        categoryRes,
        regionRes,
        topProductsRes,
        userActivityRes,
        kpiRes
      ] = await Promise.all([
        reportService.getReportOverview(period).catch(() => ({ success: false, data: null })),
        period === 'weekly'
          ? reportService.getWeeklyReport().catch(() => ({ success: false, data: null }))
          : period === 'monthly'
          ? reportService.getMonthlyReport().catch(() => ({ success: false, data: null }))
          : period === 'quarterly'
          ? reportService.getQuarterlyReport().catch(() => ({ success: false, data: null }))
          : reportService.getYearlyReport().catch(() => ({ success: false, data: null })),
        reportService.getRevenueTrend(period).catch(() => ({ success: false, data: null })),
        reportService.getSalesByCategory(period).catch(() => ({ success: false, data: [] })),
        reportService.getSalesByRegion(period).catch(() => ({ success: false, data: [] })),
        reportService.getTopSellingProducts(period, 5).catch(() => ({ success: false, data: [] })),
        reportService.getUserActivityReport(period).catch(() => ({ success: false, data: null })),
        reportService.getKPIMetrics(period).catch(() => ({ success: false, data: null }))
      ]);

      return {
        success: true,
        data: {
          overview: overviewRes?.data || null,
          periodReport: periodReportRes?.data || null,
          revenueTrend: revenueTrendRes?.data || null,
          salesByCategory: categoryRes?.data || [],
          salesByRegion: regionRes?.data || [],
          topProducts: topProductsRes?.data || [],
          userActivity: userActivityRes?.data || null,
          kpiMetrics: kpiRes?.data || null
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Export report as PDF - Downloads the file directly
  exportPDF: async (period = 'weekly') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${EXPORT_REPORT_PDF_API}?period=${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${period}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export report as CSV - Downloads the file directly
  exportCSV: async (period = 'weekly') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${EXPORT_REPORT_CSV_API}?period=${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate CSV');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${period}-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Email report to recipients
  emailReport: async (period, recipients, subject, message) => {
    const response = await apiConnector(
      'POST',
      EMAIL_REPORT_API,
      { period, recipients, subject, message },
      getAuthHeaders()
    );
    return response.data;
  },

  // Get all scheduled reports
  getScheduledReports: async () => {
    const response = await apiConnector(
      'GET',
      GET_SCHEDULED_REPORTS_API,
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Create a new scheduled report
  createScheduledReport: async (data) => {
    const response = await apiConnector(
      'POST',
      CREATE_SCHEDULED_REPORT_API,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  // Update a scheduled report
  updateScheduledReport: async (id, data) => {
    const response = await apiConnector(
      'PUT',
      UPDATE_SCHEDULED_REPORT_API(id),
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  // Delete a scheduled report
  deleteScheduledReport: async (id) => {
    const response = await apiConnector(
      'DELETE',
      DELETE_SCHEDULED_REPORT_API(id),
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Toggle scheduled report active status
  toggleScheduledReport: async (id) => {
    const response = await apiConnector(
      'PATCH',
      TOGGLE_SCHEDULED_REPORT_API(id),
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // Send scheduled report now (manual trigger)
  sendScheduledReportNow: async (id) => {
    const response = await apiConnector(
      'POST',
      SEND_SCHEDULED_REPORT_NOW_API(id),
      null,
      getAuthHeaders()
    );
    return response.data;
  },
};

export default reportService;

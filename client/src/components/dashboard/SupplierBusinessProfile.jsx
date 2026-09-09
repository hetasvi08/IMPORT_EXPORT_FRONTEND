import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Building2,
  MapPin,
  Globe,
  Phone,
  Mail,
  Award,
  Calendar,
  Users,
  Package,
  Save,
  Loader2,
  Upload,
  Camera,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getSupplierProfile, updateSupplierProfile } from '../../services/operations/supplierDashboardAPI';

const SupplierBusinessProfile = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    businessType: '',
    yearEstablished: '',
    numberOfEmployees: '',
    annualRevenue: '',
    registrationNumber: '',
    taxId: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    contact: {
      phone: '',
      email: '',
      fax: '',
      whatsapp: ''
    },
    socialMedia: {
      linkedin: '',
      facebook: '',
      twitter: ''
    },
    certifications: [],
    paymentTerms: [],
    shippingMethods: [],
    productCategories: [],
    minimumOrderValue: '',
    leadTime: ''
  });

  const [newCertification, setNewCertification] = useState('');
  const [newPaymentTerm, setNewPaymentTerm] = useState('');
  const [newShippingMethod, setNewShippingMethod] = useState('');

  const populateFormData = useCallback((data) => {
    setFormData({
      companyName: data.companyName || '',
      description: data.description || '',
      businessType: data.businessType || '',
      yearEstablished: data.yearEstablished || '',
      numberOfEmployees: data.numberOfEmployees || '',
      annualRevenue: data.annualRevenue || '',
      registrationNumber: data.registrationNumber || '',
      taxId: data.taxId || '',
      website: data.website || '',
      // Map flat backend structure to nested frontend structure
      address: {
        street: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        zipCode: data.zipCode || ''
      },
      contact: {
        phone: data.contact?.phone || '',
        email: data.contact?.email || user?.email || '',
        fax: data.contact?.fax || '',
        whatsapp: data.contact?.whatsapp || ''
      },
      socialMedia: {
        linkedin: data.socialMedia?.linkedin || '',
        facebook: data.socialMedia?.facebook || '',
        twitter: data.socialMedia?.twitter || ''
      },
      certifications: data.certifications || [],
      paymentTerms: data.paymentTerms || [],
      shippingMethods: data.shippingMethods || [],
      productCategories: data.productCategories || [],
      minimumOrderValue: data.minimumOrderValue || '',
      leadTime: data.leadTime || ''
    });
  }, [user?.email]);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSupplierProfile(token);
      if (response.success && response.data) {
        setProfile(response.data);
        populateFormData(response.data);
      }
    } catch (error) {// Create default form if no profile exists
    } finally {
      setLoading(false);
    }
  }, [token, populateFormData]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addItem = (type, value, setter) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }));
    setter('');
  };

  const removeItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Flatten the nested address structure for backend compatibility
      const submitData = {
        companyName: formData.companyName,
        description: formData.description,
        businessType: formData.businessType,
        yearEstablished: formData.yearEstablished ? parseInt(formData.yearEstablished) : undefined,
        numberOfEmployees: formData.numberOfEmployees,
        annualRevenue: formData.annualRevenue,
        registrationNumber: formData.registrationNumber,
        taxId: formData.taxId,
        website: formData.website,
        // Flatten address fields for backend
        address: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        country: formData.address.country,
        zipCode: formData.address.zipCode,
        // Contact info
        contact: formData.contact,
        socialMedia: formData.socialMedia,
        certifications: formData.certifications,
        paymentTerms: formData.paymentTerms,
        shippingMethods: formData.shippingMethods,
        productCategories: formData.productCategories,
        minimumOrderValue: formData.minimumOrderValue ? parseFloat(formData.minimumOrderValue) : undefined,
        leadTime: formData.leadTime,
      };

      const response = await updateSupplierProfile(submitData, token);
      if (response.success) {
        
        setProfile(response.data);
        setIsEditing(false);
      }
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8 px-3 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-2xl border border-orange-100 shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-1">
                Business Profile
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Manage your business information visible to buyers
              </p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm sm:text-base font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all w-full sm:w-auto flex-shrink-0"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      {!profile?.isVerified && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-3 shadow-sm">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-amber-800 font-bold text-sm sm:text-base mb-0.5">Complete Your Profile</p>
            <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
              Fill in your business details to get verified and increase visibility to buyers.
            </p>
          </div>
        </div>
      )}

      {profile?.isVerified && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-3 shadow-sm">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-emerald-800 font-bold text-sm sm:text-base mb-0.5 flex items-center gap-2">
              Verified Business
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] sm:text-xs font-semibold rounded-full">✓</span>
            </p>
            <p className="text-emerald-700 text-xs sm:text-sm leading-relaxed">
              Your business profile has been verified. Buyers can see your verified badge.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-500" />
            Company Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="Your company name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Business Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="Describe your business, products, and services..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
              >
                <option value="">Select type</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Trading Company">Trading Company</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="Distributor">Distributor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Year Established</label>
              <input
                type="number"
                name="yearEstablished"
                value={formData.yearEstablished}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Employees</label>
              <select
                name="numberOfEmployees"
                value={formData.numberOfEmployees}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
              >
                <option value="">Select range</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="500+">500+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Revenue</label>
              <select
                name="annualRevenue"
                value={formData.annualRevenue}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
              >
                <option value="">Select range</option>
                <option value="< $100K">Less than $100K</option>
                <option value="$100K - $500K">$100K - $500K</option>
                <option value="$500K - $1M">$500K - $1M</option>
                <option value="$1M - $5M">$1M - $5M</option>
                <option value="$5M+">More than $5M</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="Business registration number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tax ID</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="Tax identification number"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Business Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="123 Business Street"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State/Province</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="Country"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP/Postal Code</label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="12345"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-orange-500" />
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="business@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="https://www.example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fax</label>
              <input
                type="tel"
                name="contact.fax"
                value={formData.contact.fax}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="+1 234 567 8901"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <i className="fab fa-whatsapp text-green-500"></i>
                  WhatsApp Number
                </span>
              </label>
              <input
                type="tel"
                name="contact.whatsapp"
                value={formData.contact.whatsapp}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                placeholder="919876543210 (with country code, no + sign)"
              />
              <p className="text-xs text-gray-500 mt-1">Customers can contact you directly via WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            Certifications
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            {formData.certifications.map((cert, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
              >
                {cert}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeItem('certifications', index)}
                    className="p-0.5 hover:bg-orange-200 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Add certification (e.g., ISO 9001)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('certifications', newCertification, setNewCertification))}
              />
              <button
                type="button"
                onClick={() => addItem('certifications', newCertification, setNewCertification)}
                className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Trade Terms */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            Trade Terms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Minimum Order Value (USD)</label>
              <input
                type="number"
                name="minimumOrderValue"
                value={formData.minimumOrderValue}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="1000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Lead Time (days)</label>
              <input
                type="text"
                name="leadTime"
                value={formData.leadTime}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
                placeholder="7-14 days"
              />
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Terms</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.paymentTerms.map((term, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {term}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeItem('paymentTerms', index)}
                      className="p-0.5 hover:bg-blue-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <select
                  value={newPaymentTerm}
                  onChange={(e) => setNewPaymentTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select payment term</option>
                  <option value="T/T">T/T (Telegraphic Transfer)</option>
                  <option value="L/C">L/C (Letter of Credit)</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Western Union">Western Union</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
                <button
                  type="button"
                  onClick={() => addItem('paymentTerms', newPaymentTerm, setNewPaymentTerm)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Shipping Methods */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Methods</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.shippingMethods.map((method, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  {method}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeItem('shippingMethods', index)}
                      className="p-0.5 hover:bg-green-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <select
                  value={newShippingMethod}
                  onChange={(e) => setNewShippingMethod(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select shipping method</option>
                  <option value="FOB">FOB</option>
                  <option value="CIF">CIF</option>
                  <option value="EXW">EXW</option>
                  <option value="DDP">DDP</option>
                  <option value="Air Freight">Air Freight</option>
                  <option value="Sea Freight">Sea Freight</option>
                  <option value="Express">Express</option>
                </select>
                <button
                  type="button"
                  onClick={() => addItem('shippingMethods', newShippingMethod, setNewShippingMethod)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        {isEditing && (
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                if (profile) populateFormData(profile);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SupplierBusinessProfile;

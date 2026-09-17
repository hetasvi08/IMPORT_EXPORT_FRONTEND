import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../services/operations/categoryAPI';
import { uploadSupplierProductImage as uploadProductImage } from '../../services/operations/supplierDashboardAPI';

const SupplierProductForm = () => {
  const navigate = useNavigate();
  const { user, token: authToken } = useSelector((state) => state.auth);
  const token = authToken || localStorage.getItem('token');

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadingImages, setUploadingImages] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    category: '',
    subCategory: '',
    priceMin: '',
    priceMax: '',
    moq: '',
    unit: 'pieces',
    stock: '',
    images: [],
    specifications: [{ key: '', value: '' }],
    features: [''],
    tags: '',
    material: '',
    color: '',
    size: '',
    weight: '',
    dimensionsLength: '',
    dimensionsWidth: '',
    dimensionsHeight: '',
    packagingType: '',
    shippingMethods: '',
    leadTime: '',
    warranty: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch {
      // no unused parameter needed
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      const tempId = Date.now() + Math.random();
      setUploadingImages(prev => [...prev, { id: tempId, name: file.name }]);

      try {
        const result = await uploadProductImage(file, token);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result]
        }));
        setUploadingImages(prev => prev.filter(img => img.id !== tempId));

      } catch {
        setUploadingImages(prev => prev.filter(img => img.id !== tempId));
      }
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }]
    });
  };

  const removeSpecification = (index) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index)
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.description || !formData.category) {

      return;
    }

    if (formData.images.length === 0) {

      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...formData,
        price: {
          min: parseFloat(formData.priceMin),
          max: parseFloat(formData.priceMax)
        },
        dimensions: {
          length: parseFloat(formData.dimensionsLength) || 0,
          width: parseFloat(formData.dimensionsWidth) || 0,
          height: parseFloat(formData.dimensionsHeight) || 0
        },
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        features: formData.features.filter(f => f.trim() !== ''),
        specifications: formData.specifications.filter(s => s.key && s.value),
        supplier: user._id, // Auto-assign current user as supplier
        isApproved: 'pending' // Supplier products need approval
      };

      // Remove temporary fields
      delete productData.priceMin;
      delete productData.priceMax;
      delete productData.dimensionsLength;
      delete productData.dimensionsWidth;
      delete productData.dimensionsHeight;

      // TODO: Call supplier product creation API

      navigate('/supplier/products');

    } catch {
      // no unused parameter needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Add New Product</h2>
          <p className="text-slate-600 mt-1">Submit a product for admin approval</p>
        </div>
        <button
          onClick={() => navigate('/supplier/products')}
          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-semibold"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Products
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <i className="fas fa-info-circle text-blue-600 text-xl"></i>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Product Review Process</h4>
            <p className="text-sm text-blue-800">
              Your product will be submitted for admin review. Once approved, it will be visible on the marketplace.
              Make sure all information is accurate and complete to speed up the approval process.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-orange-500"></i>
                Basic Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Premium Stainless Steel Water Bottle"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief product tagline (max 150 characters)"
                    maxLength={150}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed product description..."
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="e.g., WB-1001"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-images text-orange-500"></i>
                Product Images <span className="text-red-500">*</span>
              </h3>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <i className="fas fa-cloud-upload-alt text-4xl text-slate-400 mb-3"></i>
                    <p className="text-slate-700 font-semibold mb-1">Click to upload images</p>
                    <p className="text-sm text-slate-500">PNG, JPG up to 5MB each</p>
                  </label>
                </div>

                {/* Uploading Images */}
                {uploadingImages.length > 0 && (
                  <div className="space-y-2">
                    {uploadingImages.map((img) => (
                      <div key={img.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <i className="fas fa-circle-notch fa-spin text-blue-600"></i>
                        <span className="text-sm text-slate-700">{img.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Uploaded Images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-dollar-sign text-orange-500"></i>
                Pricing & Stock
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Min Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="priceMin"
                    value={formData.priceMin}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Max Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="priceMax"
                    value={formData.priceMax}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    MOQ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="moq"
                    value={formData.moq}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pieces">Pieces</option>
                    <option value="boxes">Boxes</option>
                    <option value="kg">Kilograms</option>
                    <option value="liters">Liters</option>
                    <option value="meters">Meters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Lead Time (days)
                  </label>
                  <input
                    type="number"
                    name="leadTime"
                    value={formData.leadTime}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-list-ul text-orange-500"></i>
                Specifications
              </h3>

              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Key (e.g., Material)"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., Stainless Steel)"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecification}
                  className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Specification
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-star text-orange-500"></i>
                Key Features
              </h3>

              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Feature description"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Feature
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Reference Cards */}
          <div className="lg:col-span-1 space-y-4">
            {/* Submission Tips */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 sticky top-6">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <i className="fas fa-lightbulb text-orange-500"></i>
                Submission Tips
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                  <span>Use high-quality images with white background</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                  <span>Write clear, detailed descriptions</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                  <span>Set competitive pricing</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                  <span>Provide accurate specifications</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                  <span>Double-check all information</span>
                </li>
              </ul>
            </div>

            {/* Approval Process */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <i className="fas fa-tasks text-blue-500"></i>
                Approval Process
              </h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">Submit Product</p>
                    <p className="text-xs text-slate-600">Fill in all details accurately</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">Admin Review</p>
                    <p className="text-xs text-slate-600">24-48 hours review time</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">Go Live</p>
                    <p className="text-xs text-slate-600">Product appears on marketplace</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <i className="fas fa-info-circle mr-2"></i>
                Product will be submitted for admin approval
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/supplier/products')}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImages.length > 0}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Submit for Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for fixed bottom bar */}
        <div className="h-24"></div>
      </form>
    </div>
  );
};

export default SupplierProductForm;

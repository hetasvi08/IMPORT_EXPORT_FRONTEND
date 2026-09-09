import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Package,
  Upload,
  X,
  Plus,
  Trash2,
  Save,
  Loader2,
  Image,
  AlertCircle,
  Info,
  Lightbulb,
  CheckCircle,
  Box,
  Ruler,
  Truck,
  BookOpen,
  DollarSign,
  Ship,
  Plane
} from 'lucide-react';
import { 
  getSupplierProductById, 
  createSupplierProduct, 
  updateSupplierProduct,
  uploadSupplierProductImage 
} from '../../services/operations/supplierDashboardAPI';
import { getAllCategories } from '../../services/operations/categoryAPI';

const SupplierProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
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

  const [errors, setErrors] = useState({});

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {}
  }, []);

  const fetchProductData = useCallback(async () => {
    if (!isEditMode) return;
    try {
      setInitialLoading(true);
      const response = await getSupplierProductById(id, token);
      if (response.success) {
        const product = response.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          sku: product.sku || '',
          category: product.category?._id || product.category || '',
          subCategory: product.subCategory || '',
          priceMin: product.price || '',
          priceMax: product.price || '',
          moq: product.moq || '',
          unit: product.unit || 'pieces',
          stock: product.stock || '',
          images: product.images || [],
          specifications: product.specifications?.length > 0 ? product.specifications : [{ key: '', value: '' }],
          features: product.features?.length > 0 ? product.features : [''],
          tags: product.tags?.join(', ') || '',
          material: product.material || '',
          color: Array.isArray(product.color) ? product.color.join(', ') : product.color || '',
          size: Array.isArray(product.size) ? product.size.join(', ') : product.size || '',
          weight: product.weight?.value || '',
          dimensionsLength: product.dimensions?.length || '',
          dimensionsWidth: product.dimensions?.width || '',
          dimensionsHeight: product.dimensions?.height || '',
          packagingType: product.packaging || '',
          shippingMethods: Array.isArray(product.shippingMethods) ? product.shippingMethods.join(', ') : product.shippingMethods || '',
          leadTime: product.leadTime?.min || '',
          warranty: product.warranty || ''
        });
      }
    } catch (error) {
      navigate('/dashboard/my-products');
    } finally {
      setInitialLoading(false);
    }
  }, [id, token, isEditMode, navigate]);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchProductData();
    }
  }, [fetchCategories, fetchProductData, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      const tempId = Date.now() + Math.random();
      setUploadingImages(prev => [...prev, { id: tempId, name: file.name }]);

      try {
        const result = await uploadSupplierProductImage(file, token);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result]
        }));
        setUploadingImages(prev => prev.filter(img => img.id !== tempId));
      } catch (error) {
        setUploadingImages(prev => prev.filter(img => img.id !== tempId));}
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.priceMin || Number(formData.priceMin) <= 0) newErrors.priceMin = 'Valid minimum price is required';
    if (!formData.priceMax || Number(formData.priceMax) <= 0) newErrors.priceMax = 'Valid maximum price is required';
    if (Number(formData.priceMax) < Number(formData.priceMin)) newErrors.priceMax = 'Max price must be greater than min price';
    if (!formData.moq || Number(formData.moq) <= 0) newErrors.moq = 'Valid MOQ is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      
      return;
    }

    setLoading(true);

    try {
      // Build product data
      const productData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        sku: formData.sku,
        category: formData.category,
        subCategory: formData.subCategory,
        price: {
          min: Number(formData.priceMin),
          max: Number(formData.priceMax),
          currency: 'USD'
        },
        moq: Number(formData.moq),
        unit: formData.unit,
        stock: Number(formData.stock) || 0,
        images: formData.images,
        specifications: formData.specifications.filter(s => s.key && s.value),
        features: formData.features.filter(f => f.trim()),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        material: formData.material,
        color: formData.color.split(',').map(c => c.trim()).filter(c => c),
        size: formData.size.split(',').map(s => s.trim()).filter(s => s),
        weight: formData.weight ? { value: Number(formData.weight), unit: 'kg' } : undefined,
        dimensions: (formData.dimensionsLength || formData.dimensionsWidth || formData.dimensionsHeight) ? {
          length: Number(formData.dimensionsLength) || 0,
          width: Number(formData.dimensionsWidth) || 0,
          height: Number(formData.dimensionsHeight) || 0,
          unit: 'cm'
        } : undefined,
        packaging: formData.packagingType,
        leadTime: formData.leadTime ? { min: Number(formData.leadTime), max: Number(formData.leadTime) * 2, unit: 'days' } : undefined,
        warranty: formData.warranty
      };

      if (isEditMode) {
        await updateSupplierProduct(id, productData, token);
        navigate('/dashboard/my-products');
      } else {
        await createSupplierProduct(productData, token);
        navigate('/dashboard/my-products');
      }
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-8 px-3 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/dashboard/my-products')}
          className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            {isEditMode ? 'Update product information' : 'Create a new product listing for review'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 font-semibold text-xs sm:text-sm">Product Review Process</p>
                <p className="text-blue-700 text-xs sm:text-sm">
                  All new products are reviewed by our team before being listed. You'll be notified once approved.
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Basic Information</h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 ${
                      errors.name ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    placeholder="e.g., PROD-001"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    maxLength="500"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    placeholder="Brief product description"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Full Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="6"
                    maxLength="2000"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 ${
                      errors.description ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Detailed product description"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.description.length}/2000 characters
                  </p>
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Pricing & Stock</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Min Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="priceMin"
                    value={formData.priceMin}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 ${
                      errors.priceMin ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.priceMin && <p className="text-red-500 text-xs mt-1">{errors.priceMin}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Max Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="priceMax"
                    value={formData.priceMax}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 ${
                      errors.priceMax ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.priceMax && <p className="text-red-500 text-xs mt-1">{errors.priceMax}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    MOQ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="moq"
                    value={formData.moq}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 ${
                      errors.moq ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.moq && <p className="text-red-500 text-xs mt-1">{errors.moq}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none bg-white"
                  >
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="lbs">Pounds</option>
                    <option value="meters">Meters</option>
                    <option value="sets">Sets</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Product Images</h2>
              
              {errors.images && (
                <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
                  <AlertCircle className="w-4 h-4" />
                  {errors.images}
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 sm:p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-10 h-10 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">
                      Images will upload immediately (Max 5MB per image)
                    </p>
                  </label>
                </div>

                {/* Uploading Images */}
                {uploadingImages.length > 0 && (
                  <div className="space-y-2">
                    {uploadingImages.map((img) => (
                      <div key={img.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                        <span className="text-sm text-slate-700">Uploading {img.name}...</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Uploaded Images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Specifications</h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="text-orange-500 hover:text-orange-600 text-xs sm:text-sm font-semibold flex items-center gap-1 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Add Specification
                </button>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      placeholder="Key (e.g., Material)"
                      className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      placeholder="Value (e.g., Stainless Steel)"
                      className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="px-3 sm:px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg self-start sm:self-auto"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Features</h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-orange-500 hover:text-orange-600 text-xs sm:text-sm font-semibold flex items-center gap-1 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Add Feature
                </button>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Enter product feature"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 sm:px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Additional Details</h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g., Plastic, Metal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Colors (comma separated)
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="Red, Blue, Green"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Sizes (comma separated)
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="S, M, L, XL"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g., 2.5kg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <input
                      type="number"
                      name="dimensionsLength"
                      value={formData.dimensionsLength}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Length"
                      className="w-full px-2.5 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <input
                      type="number"
                      name="dimensionsWidth"
                      value={formData.dimensionsWidth}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Width"
                      className="w-full px-2.5 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <input
                      type="number"
                      name="dimensionsHeight"
                      value={formData.dimensionsHeight}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Height"
                      className="w-full px-2.5 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Packaging Type
                    </label>
                    <input
                      type="text"
                      name="packagingType"
                      value={formData.packagingType}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g., Box, Carton"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Lead Time (days)
                    </label>
                    <input
                      type="text"
                      name="leadTime"
                      value={formData.leadTime}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g., 15-20 days"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Warranty
                    </label>
                    <input
                      type="text"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g., 1 year"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Shipping Methods (comma separated)
                    </label>
                    <input
                      type="text"
                      name="shippingMethods"
                      value={formData.shippingMethods}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="Sea, Air, Express"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    placeholder="electronics, gadget, bestseller"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Category Selector */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Category</h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:border-orange-500 focus:outline-none bg-white ${
                      errors.category ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Sub Category
                  </label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    placeholder="Enter sub category"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-2.5 sm:space-y-3">
              <button
                type="submit"
                disabled={loading || uploadingImages.length > 0}
                className="w-full bg-orange-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="hidden sm:inline">{isEditMode ? 'Updating Product...' : 'Submitting...'}</span>
                    <span className="sm:hidden">{isEditMode ? 'Updating...' : 'Submit'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{isEditMode ? 'Update Product' : 'Submit for Review'}</span>
                    <span className="sm:hidden">{isEditMode ? 'Update' : 'Submit'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard/my-products')}
                className="w-full bg-slate-200 text-slate-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
            </div>

            {/* Tips & Best Practices */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Pro Tips</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    <strong>High-quality images</strong> increase product visibility by 70%
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    <strong>Detailed descriptions</strong> reduce customer inquiries
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    <strong>Add specifications</strong> to improve search ranking
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    <strong>Use relevant tags</strong> for better discoverability
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    <strong>Competitive pricing</strong> attracts more buyers
                  </p>
                </div>
              </div>
            </div>

            {/* Common Materials */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Box className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Common Materials</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white rounded-full text-[10px] sm:text-xs font-semibold text-slate-700 border border-purple-200">Plastic</span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white rounded-full text-[10px] sm:text-xs font-semibold text-slate-700 border border-purple-200">Metal</span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white rounded-full text-[10px] sm:text-xs font-semibold text-slate-700 border border-purple-200">Wood</span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white rounded-full text-[10px] sm:text-xs font-semibold text-slate-700 border border-purple-200">Glass</span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white rounded-full text-[10px] sm:text-xs font-semibold text-slate-700 border border-purple-200">Fabric</span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white rounded-full text-[10px] sm:text-xs font-semibold text-slate-700 border border-purple-200">Leather</span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white rounded-full text-[10px] sm:text-xs font-semibold text-slate-700 border border-purple-200">Steel</span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white rounded-full text-[10px] sm:text-xs font-semibold text-slate-700 border border-purple-200">Aluminum</span>
              </div>
            </div>

            {/* Size Chart Reference */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 sm:p-6 border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Ruler className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Size Standards</h3>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between p-1.5 sm:p-2 bg-white rounded-lg">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-700">Clothing</span>
                  <span className="text-[10px] sm:text-xs text-slate-600">S, M, L, XL, XXL</span>
                </div>
                <div className="flex items-center justify-between p-1.5 sm:p-2 bg-white rounded-lg">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-700">Shoes (US)</span>
                  <span className="text-[10px] sm:text-xs text-slate-600">6, 7, 8, 9, 10, 11</span>
                </div>
                <div className="flex items-center justify-between p-1.5 sm:p-2 bg-white rounded-lg">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-700">Dimensions</span>
                  <span className="text-[10px] sm:text-xs text-slate-600">L × W × H (cm)</span>
                </div>
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-cyan-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Shipping Options</h3>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-start gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                  <Ship className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-500 mt-0.5 sm:mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-700">Sea Freight</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">Cost-effective, 20-45 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                  <Plane className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-500 mt-0.5 sm:mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-700">Air Freight</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">Fast delivery, 5-10 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                  <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-500 mt-0.5 sm:mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-700">Express</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">Premium, 2-5 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Guidelines */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 sm:p-6 border border-orange-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Product Guidelines</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-slate-600">Images</span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-900">Min. 1, Max 10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-slate-600">Description</span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-900">2000 chars</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-slate-600">Image Size</span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-900">Max 5MB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-slate-600">Review Time</span>
                  <span className="text-[10px] sm:text-xs font-bold text-orange-600">24-48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-3 sm:px-6 py-3 sm:py-4 -mx-3 sm:-mx-6 mt-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-7xl mx-auto">
            <div className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 justify-center sm:justify-start">
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">All required fields must be filled before submission</span>
              <span className="sm:hidden">Fill all required fields</span>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/my-products')}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-200 text-slate-700 rounded-lg text-sm sm:text-base font-bold hover:bg-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImages.length > 0}
                className="flex-1 sm:flex-none px-4 sm:px-8 py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg text-sm sm:text-base font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="hidden sm:inline">{isEditMode ? 'Updating Product...' : 'Submitting...'}</span>
                    <span className="sm:hidden">{isEditMode ? 'Updating...' : 'Submit'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{isEditMode ? 'Update Product' : 'Submit for Review'}</span>
                    <span className="sm:hidden">{isEditMode ? 'Update' : 'Submit'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SupplierProductForm;

import { Package, MapPin, FileText, CreditCard, Truck, Tag } from 'lucide-react';

const OrderSummaryStep = ({
  items,
  shippingAddress,
  billingAddress,
  subtotal,
  taxAmount,
  shippingCost,
  total,
  orderNotes
}) => {
  // Get billing address (use shipping if same)
  const billing = billingAddress.sameAsShipping ? shippingAddress : billingAddress;

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items
          </h3>
          <p className="text-emerald-100 text-sm">{items.length} items in your order</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.product._id} 
                className={`flex gap-4 pb-4 ${index < items.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                {/* Product Image */}
                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images?.[0]?.url || 'https://via.placeholder.com/80'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-slate-400 mb-2">
                    {item.product.category?.name || 'Uncategorized'}
                    {item.product.sku && ` • SKU: ${item.product.sku}`}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-500">
                      Qty: <span className="font-semibold text-slate-700">{item.quantity}</span>
                    </span>
                    <span className="text-slate-500">
                      × ${item.price?.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-bold text-emerald-600 text-lg">
                    ${item.subtotal?.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-700">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Shipping
                </span>
                <span className={`font-semibold ${shippingCost === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Tax (10%)
                </span>
                <span className="font-semibold text-slate-700">${taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="h-px bg-slate-200 my-3"></div>
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-800">Order Total</span>
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping & Billing Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Address
            </h3>
          </div>
          <div className="p-5">
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-slate-800">{shippingAddress.fullName}</p>
              {shippingAddress.company && (
                <p className="text-slate-600">{shippingAddress.company}</p>
              )}
              <p className="text-slate-600">{shippingAddress.street}</p>
              <p className="text-slate-600">
                {shippingAddress.city}
                {shippingAddress.state && `, ${shippingAddress.state}`}
                {shippingAddress.zipCode && ` ${shippingAddress.zipCode}`}
              </p>
              <p className="text-slate-600">{shippingAddress.country}</p>
              <div className="pt-2 border-t border-slate-100 mt-3">
                <p className="text-slate-500">
                  <span className="font-medium">Email:</span> {shippingAddress.email}
                </p>
                <p className="text-slate-500">
                  <span className="font-medium">Phone:</span> {shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Billing Address
            </h3>
          </div>
          <div className="p-5">
            {billingAddress.sameAsShipping ? (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Same as shipping address
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-slate-800">{billing.fullName}</p>
                {billing.company && (
                  <p className="text-slate-600">{billing.company}</p>
                )}
                <p className="text-slate-600">{billing.street}</p>
                <p className="text-slate-600">
                  {billing.city}
                  {billing.state && `, ${billing.state}`}
                  {billing.zipCode && ` ${billing.zipCode}`}
                </p>
                <p className="text-slate-600">{billing.country}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Notes */}
      {orderNotes && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Order Notes
            </h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-600 italic">"{orderNotes}"</p>
          </div>
        </div>
      )}

      {/* Delivery Info */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-800 mb-1">Estimated Delivery</h4>
            <p className="text-sm text-emerald-700">
              Your order will be processed within 1-2 business days. 
              Standard shipping typically takes 5-7 business days.
              {shippingCost === 0 && (
                <span className="block mt-1 font-medium text-emerald-600">
                  🎉 You've qualified for FREE shipping!
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryStep;

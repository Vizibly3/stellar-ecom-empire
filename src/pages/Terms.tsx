
export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using ByteCart, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Products and Services</h2>
              <p className="text-gray-600 mb-4">
                All products and services are subject to availability. We reserve the right to 
                discontinue any product at any time.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Product descriptions and images are for informational purposes</li>
                <li>Prices are subject to change without notice</li>
                <li>We strive to display accurate colors and details</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders and Payment</h2>
              <p className="text-gray-600 mb-4">
                By placing an order, you are making an offer to purchase products that is subject 
                to our acceptance.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>We reserve the right to refuse any order</li>
                <li>Payment must be received before order processing</li>
                <li>All prices are in USD unless otherwise stated</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
              <p className="text-gray-600 mb-4">
                You are responsible for maintaining the confidentiality of your account and password.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                ByteCart shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms and Conditions, please contact us at:
                <br />
                Email: legal@bytecart.site
                <br />
                Phone: (555) 123-4567
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

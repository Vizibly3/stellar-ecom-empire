
export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Options</h2>
              <p className="text-gray-600 mb-4">We offer several shipping options to meet your needs:</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Shipping Method</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Delivery Time</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Standard Shipping</td>
                      <td className="border border-gray-300 px-4 py-2">5-7 business days</td>
                      <td className="border border-gray-300 px-4 py-2">$5.99 (Free over $50)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Express Shipping</td>
                      <td className="border border-gray-300 px-4 py-2">2-3 business days</td>
                      <td className="border border-gray-300 px-4 py-2">$12.99</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Overnight Shipping</td>
                      <td className="border border-gray-300 px-4 py-2">1 business day</td>
                      <td className="border border-gray-300 px-4 py-2">$24.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Time</h2>
              <p className="text-gray-600 mb-4">
                Orders are typically processed within 1-2 business days. Processing time may be 
                longer during peak seasons or for custom orders.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Orders placed before 2 PM EST ship the same day</li>
                <li>Weekend orders are processed on the next business day</li>
                <li>Custom orders may require additional processing time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Locations</h2>
              <p className="text-gray-600 mb-4">
                We currently ship to all 50 US states and select international locations.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Domestic shipping: All 50 US states</li>
                <li>International shipping: Canada, UK, Australia</li>
                <li>Additional destinations available upon request</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h2>
              <p className="text-gray-600 mb-4">
                Once your order ships, you'll receive a tracking number via email. You can track 
                your package using this number on our website or the carrier's website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Issues</h2>
              <p className="text-gray-600 mb-4">
                If you experience any delivery issues, please contact us immediately:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Package not delivered within expected timeframe</li>
                <li>Damaged package upon arrival</li>
                <li>Missing items from your order</li>
                <li>Incorrect delivery address</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Handling</h2>
              <p className="text-gray-600 mb-4">
                Some items may require special handling or shipping restrictions:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Large or heavy items may incur additional shipping charges</li>
                <li>Hazardous materials follow special shipping regulations</li>
                <li>Fragile items are packaged with extra protective materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Shipping</h2>
              <p className="text-gray-600 mb-4">
                International customers are responsible for any customs duties, taxes, or fees 
                imposed by their country. Delivery times may vary based on customs processing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                For shipping questions or concerns, contact us at:
                <br />
                Email: shipping@bytecart.site
                <br />
                Phone: (555) 123-4567
                <br />
                Hours: Monday-Friday, 9AM-6PM EST
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

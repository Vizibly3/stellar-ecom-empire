
export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Returns & Exchanges</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Policy</h2>
              <p className="text-gray-600 mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy 
                with your order, you can return it within 30 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Conditions</h2>
              <p className="text-gray-600 mb-4">To be eligible for a return, items must meet the following conditions:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Items must be in original condition and packaging</li>
                <li>Items must be returned within 30 days of purchase</li>
                <li>Items must include all original accessories and documentation</li>
                <li>Items must not show signs of wear or damage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
              <p className="text-gray-600 mb-4">The following items cannot be returned:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Personalized or customized products</li>
                <li>Software that has been opened or downloaded</li>
                <li>Items damaged by misuse or normal wear</li>
                <li>Items returned after 30 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Process</h2>
              <p className="text-gray-600 mb-4">To initiate a return:</p>
              <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                <li>Contact our customer service team</li>
                <li>Provide your order number and reason for return</li>
                <li>Receive return authorization and shipping label</li>
                <li>Package items securely and ship back to us</li>
                <li>Receive refund within 5-7 business days after we receive your return</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
              <p className="text-gray-600 mb-4">
                We currently do not offer direct exchanges. If you need a different item, 
                please return the original item and place a new order.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refunds</h2>
              <p className="text-gray-600 mb-4">
                Refunds will be processed to the original payment method within 5-7 business 
                days after we receive and inspect your return.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                For return questions or to initiate a return, contact us at:
                <br />
                Email: returns@bytecart.site
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

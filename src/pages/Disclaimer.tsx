
export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Disclaimer</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">General Information</h2>
              <p className="text-gray-600 mb-4">
                The information on this website is provided on an "as is" basis. To the fullest 
                extent permitted by law, ByteCart excludes all representations, warranties, 
                obligations, and liabilities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
              <p className="text-gray-600 mb-4">
                While we strive to provide accurate product information, we do not warrant that 
                product descriptions or other content is accurate, complete, reliable, current, or error-free.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Product images may not reflect actual colors due to screen variations</li>
                <li>Specifications are subject to change by manufacturers</li>
                <li>Availability is subject to change without notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h2>
              <p className="text-gray-600 mb-4">
                All prices are subject to change without notice. We reserve the right to modify 
                prices at any time prior to accepting an order.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
              <p className="text-gray-600 mb-4">
                Our website may contain links to third-party websites. We are not responsible 
                for the content or practices of these external sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Issues</h2>
              <p className="text-gray-600 mb-4">
                We do not guarantee that our website will be available at all times or that it 
                will be free from errors, viruses, or other harmful components.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                In no event shall ByteCart be liable for any direct, indirect, punitive, 
                incidental, special, or consequential damages arising from the use of our website or products.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Disclaimer</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to update or modify this disclaimer at any time without prior notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about this disclaimer, please contact us at:
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

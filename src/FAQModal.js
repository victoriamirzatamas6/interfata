function FAQModal({ show, onClose }) {
  if (!show) {
      return null;
  }

  return (
      <div className="faq-modal-backdrop">
          <div className="faq-modal">
              <h2>Frequently asked questions</h2>
              <div className="faq-content">
                  <h3>1. What is software testing? </h3>
                  <p>Software testing is a systematic process of evaluating software 
to identify defects or errors. It involves executing software components or 
systems and comparing actual and expected results. Software testing 
aims to ensure that the software meets the specified requirements, 
functions correctly, and is reliable. Testing helps identify defects early in 
the development cycle, improves software quality, and provides 
confidence in its performance.</p>
                  
                  <h3>2. What is the difference between verification and validation?</h3>
                  <p>Verification and validation are two distinct activities in the 
software testing process. Verification focuses on evaluating work 
products, such as requirements, designs, and code, to ensure that they 
meet specified requirements and standards. It involves reviews, 
inspections, and walkthroughs to detect and correct errors early in the 
development process. Validation ensures that the software satisfies the 
intended use and customer needs. It involves testing the software against 
user requirements to validate its functionality, performance, and usability.
</p>
                  
                  <h3>3. What is the difference between functional testing and non-functional testing?</h3>
                  <p> Functional testing verifies the functional aspects of the software, 
ensuring that it behaves according to the specified requirements. It 
focuses on validating features, inputs, outputs, and interactions with the 
user. Non-functional testing, on the other hand, tests the non-functional 
aspects of the software, such as performance, security, reliability, and 
usability. It aims to evaluate how the software performs under various 
conditions and assess its quality attributes beyond functionality.</p>
                  
                  <h3>4. What is regression testing</h3>
                  <p>Regression testing ensures that changes or enhancements to a 
software product do not introduce new defects or negatively impact 
existing functionality. It involves retesting the previously tested 
components and functionalities to ensure they still function as intended 
after modifications or additions. Regression testing helps maintain the 
overall quality and stability of the software by uncovering any regressions 
or unintended consequences of changes.
</p>
                  
                  <h3>5. What is a test case?</h3>
                  <p>Test cases are a set of conditions or actions designed to validate 
a specific functionality or aspect of a software application. They describe 
the inputs, test steps, expected outcomes, and any preconditions or postconditions for a particular test scenario. Test cases are derived from test 
requirements or user stories and provide a structured approach to testing. 
They serve as a documented reference for executing and reproducing 
tests, ensuring consistency, and facilitating test coverage and 
traceability.
</p>
                  
                  


                  
              </div>
              <button onClick={onClose}>CLOSE</button>
          </div>
      </div>
  );
}

export default FAQModal;

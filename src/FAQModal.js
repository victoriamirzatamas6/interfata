function FAQModal({ show, onClose }) {
  if (!show) {
      return null;
  }

  return (
      <div className="faq-modal-backdrop">
          <div className="faq-modal">
              <h2>Frequently asked questions</h2>
              <div className="faq-content">
                  <h3>1. What is DUST?</h3>
                  <p>DUST is an automated testing framework designed to facilitate the development and execution of tests for both software and hardware components.</p>
                  
                  <h3>2. How do I set up my environment to use DUST?</h3>
                  <p>To set up your environment for DUST, you need to install Python 3.6, extract the DUST files into a designated directory, and configure PyDev in Eclipse or any other IDE that supports PyDev.</p>
                  
                  <h3>3. What is the folder structure of DUST?</h3>
                  <p>DUST includes major folders: DUST, Eclipse (IDE), and Workspaces, with the default path set to ‘D:\DUST\’. Workspaces contain the Test Architecture and Library (TAL) and project instances.</p>
                  
                  <h3>4. How can I update DUST to a new version on an existing setup?</h3>
                  <p>To update DUST on an existing setup, delete the old version of DUST and the test execution database from the ‘..\Reports\’ folder, then follow the steps for DUST framework files installation, excluding Eclipse.zip extraction..</p>
                  
                  <h3>5. How do I change the VARIANT for test execution?</h3>
                  <p>The VARIANT for test execution can be manually defined/changed in the ‘..\Utility\Config.py’. It can also be changed from Job properties.</p>
                  
                  <h3>6. What external automation tools does DUST integrate with, and how can I configure them? </h3>
                  <p>  As of R1.1, DUST integrates with UltraTools, winIdea, Ediabas, and Diagnosis UDS. Each tool is integrated at a low level in ‘..\Utility\Tools.py’. Activation flags and configurations for these tools are located in ‘..\Utility\Config.py’.  </p>

                  <h3> 7. How do I debug tests using DUST?</h3>
                  <p> Debugging can be performed by checking the database for data, comments, and measurements, adjusting debug flags in ‘..\Utility\Config.py’ for detailed logging, or using Python debug capabilities in an IDE.   </p>

                  <h3> 8. How do I use signal methods in test design with DUST?</h3>
                  <p> Signal methods such as Set, Get, and Check can be used in test design to interact with devices or software under test. Each method comes with parameters for precise control over signal manipulation. </p>

                  <h3>9. How do I add a new component to my project using DUST? </h3>
                  <p> To add a new component, create a new module in the ‘ProjectComponents’ folder derived from the relevant Functional/System Component in the Lib. Import and instantiate this new component in ‘..\ProjectComponents\ImportTestLib.py’. </p>


                  <h3> 10. How is the TAL framework structured? </h3>
                  <p> The TAL framework includes a Lib/Utility folder with generic code for Functional and System components, project components structured by functionalities, and configuration files for project-specific settings. </p>


                  <h3> 11. What configuration files are essential for TAL?</h3>
                  <p> Essential configuration files for TAL include ‘..\Utility_Config.py’ for variant selection, ‘..\Utility_SetupCleanup.py’ for device instantiation, and ‘..\Config\DustConfig_devices.cfg’ for device configurations. </p>


                  <h3> 12. How do I generate test jobs and scripts?</h3>
                  <p> Test jobs and scripts can be generated using the ‘JobsGenerator’ and ‘ScriptsGenerator’ scripts found in the Utility folder. These utilities automate the creation of job and script files based on test specifications. </p>


                  <h3>13. How is reporting handled in DUST? </h3>
                  <p> Reporting is managed through the Report Engine, which stores test execution data in a database. Reports can be generated in various formats and are stored in the ‘..\Reports\’ folder. </p>


                  <h3> 14. Can I use a different IDE other than Eclipse with DUST?</h3>
                  <p> Yes, any IDE program that supports PyDev interpreter can be configured and used as default for automation with DUST. However, Eclipse is provided as the default IDE. </p>


                  <h3> 15. How do I perform updates on the DUST version for an existing project setup?</h3>
                  <p>  For updating the DUST version, first ensure all DUST applications are closed. Delete the current DUST folder and test execution database from the ‘..\Reports\’ folder. Download and extract the new version of DUST framework files into the specified directory, following the setup instructions. Ensure to keep your project's TAL framework files and configurations unchanged. Reconfigure any necessary IDE settings to point to the new DUST framework path if required.</p>



                  
              </div>
              <button onClick={onClose}>CLOSE</button>
          </div>
      </div>
  );
}

export default FAQModal;

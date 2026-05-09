import { login } from "../../../support/modules/login";
import { patientRegistration } from "../../../support/modules/patient-flow";

describe('Patient Registration', () => {
    beforeEach(() => {
        login();
    });
  it('should register a patient successfully with valid details', () => {
    patientRegistration();
  })
})

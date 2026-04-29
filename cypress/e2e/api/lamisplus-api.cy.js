const { getGeneralDashboard, getPatientManagement } = require("../../support/modules/api-get-request")
const { postLogin } = require("../../support/modules/api-post-request")

describe('Login user - Basic Authentication', () => {
    beforeEach(() => {
        postLogin()
    })
  it('should login successfully with valid credentials', () => {
   postLogin()
  })
  it('should Load General Dashboard successfully', () => {
   getGeneralDashboard()
  })
  it('should Load Patient Management successfully', () => {
   getPatientManagement()
  })
})


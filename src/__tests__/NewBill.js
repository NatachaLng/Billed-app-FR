import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("cover handleChangeFile method", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'johndoe@email.com'
      }))
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({pathname})}
      const obj = new NewBill({document, onNavigate, firestore: null, localStorage: window.localStorage})
      const handleChangeFile = jest.fn(obj.handleChangeFile)
      const file = "test.png"
      const input_file = screen.getByTestId("file")
      input_file.addEventListener("input", handleChangeFile)
      fireEvent.input(input_file, file)
      expect(handleChangeFile).toHaveBeenCalled()
    })
  })
})
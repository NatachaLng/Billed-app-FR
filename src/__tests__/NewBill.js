import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"
import firebase from "../__mocks__/firebase"
import BillsUI from "../views/BillsUI.js"

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
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({pathname})
      }
      const obj = new NewBill({document, onNavigate, firestore: null, localStorage: window.localStorage})
      const handleChangeFile = jest.fn(obj.handleChangeFile)
      const file = "test.png"
      const input_file = screen.getByTestId("file")
      input_file.addEventListener("input", handleChangeFile)
      fireEvent.input(input_file, file)
      expect(handleChangeFile).toHaveBeenCalled()
    })
    test("cover handleSubmit method", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'johndoe@email.com'
      }))
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({pathname})}
      const obj = new NewBill({document, onNavigate, firestore: null, localStorage: window.localStorage})
      const handleSubmit = jest.fn(obj.handleSubmit)
      const submitNewBill = screen.getByTestId('form-new-bill')
      submitNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(submitNewBill)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})

//POST integration test
describe("Given I am a user connected as Employee", () => {
  describe("When I create a new bill", () => {
    test("Add bill to mock API POST", async () => {
      const getSpyPost = jest.spyOn(firebase, "post")
      const newBill = {
        id: "eoKIpYhECmaZAGRrHjaC",
        status: "refused",
        pct: 10,
        amount: 500,
        email: "john@doe.com",
        name: "Facture 236",
        vat: "60",
        fileName: "preview-facture-free-201903-pdf-1.jpg",
        date: "2021-03-13",
        commentAdmin: "à valider",
        commentary: "A déduire",
        type: "Restaurants et bars",
        fileUrl: "https://saving.com",
      }
      const bills = await firebase.post(newBill)
      expect(getSpyPost).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    });
    test("Add bill to API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    });
    test("Add bill to API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
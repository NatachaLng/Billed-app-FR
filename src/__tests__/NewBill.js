import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"
import firebase from "../__mocks__/firebase"
import BillsUI from "../views/BillsUI.js"

jest.mock("../app/Firestore");


describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    describe('When I choose a file to upload', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({pathname})
      }
      let firestore = null
      const newBill = new NewBill({ document, onNavigate, firestore, localStorage: window.localStorage })

      const input = screen.getByTestId('file')
      const falseAlert = jest.fn(newBill.falseAlert)
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      input.addEventListener('change', handleChangeFile)

      test('When I choose a file in a correct format to upload, the file should be loaded and handled', async () => {
        const fileTrue = new File(['testFile'], 'testFile.jpg', {type: 'image/jpg'})

        fireEvent.change(input, { target: { files: [fileTrue] } })
        await handleChangeFile()
        expect(handleChangeFile).toHaveBeenCalled()
        expect(input.files[0]).toStrictEqual(fileTrue)
        expect(window.alert).not.toHaveBeenCalled()
      })

      test('When I choose a new file in an incorrect format, there should be an alert', async () => {
        const fileFalse = new File(['testFile'], 'testFile.txt', {type: 'text/txt'})

        fireEvent.change(input, { target: { files: [fileFalse] } })
        await handleChangeFile()
        expect(handleChangeFile).toHaveBeenCalled()
        expect(input.files[0]).toStrictEqual(fileFalse)
        expect(input.value).toBe('')
        expect(window.alert).toHaveBeenCalled()
      })
    })

    test('When I click on the submit button with the right input, my new bill should be submitted and I go back to bills page', () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const inputData = {
        type: "Transports",
        name: "test",
        amount: "100",
        date: "2020-12-01",
        vat: "10",
        pct: "20",
        commentary: "ok",
        fileUrl: "thisurl",
        fileName: "thisName",
      }

      const billType = screen.getByTestId('expense-type')
      userEvent.selectOptions(billType, screen.getByText('Transports'))
      expect(billType.value).toBe(inputData.type)

      const billName = screen.getByTestId('expense-name')
      fireEvent.change(billName, { target: { value: inputData.name } })
      expect(billName.value).toBe(inputData.name)

      const billDate = screen.getByTestId('datepicker')
      fireEvent.change(billDate, { target: { value: inputData.date } })
      expect(billDate.value).toBe(inputData.date)

      const billVat = screen.getByTestId('vat')
      fireEvent.change(billVat, { target: { value: inputData.vat } })
      expect(billVat.value).toBe(inputData.vat)

      const billPct = screen.getByTestId('pct')
      fireEvent.change(billPct, { target: { value: inputData.pct } })
      expect(billPct.value).toBe(inputData.pct)

      const billComment = screen.getByTestId('commentary')
      fireEvent.change(billComment, { target: { value: inputData.commentary } })
      expect(billComment.value).toBe(inputData.commentary)

      const submitNewBill = screen.getByTestId('form-new-bill')
      Object.defineProperty(window, 'localStorage', { value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'johndoe@email.com'
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({pathname})
      }

      const PREVIOUS_LOCATION = ''

      const firestore = null
      const newBill = new NewBill({ document, onNavigate, firestore, localStorage: window.localStorage })

      const handleSubmit = jest.fn(newBill.handleSubmit)
      submitNewBill.addEventListener('submit', handleSubmit)

      fireEvent.submit(submitNewBill)
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I add an image file", () => {
    test("Then this new file should have been changed in the input file", () => {
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname });}
      Object.defineProperty(window, "localStorage", {value: localStorageMock,})
      window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          }))
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["image.png"], "image.png", { type: "image/png" })],
        },
      })
      expect(handleChangeFile).toHaveBeenCalled()
      expect(inputFile.files[0].name).toBe("image.png")
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I submit the form width an image (jpg, jpeg, png)", () => {
    test("Then I chose a file in a correct format to upload, the file should be loaded and handle", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
      );
      const firestore = null;
      const html = NewBillUI();
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const submitBtn = screen.getByTestId("form-new-bill");
      submitBtn.addEventListener("submit", handleSubmit);
      fireEvent.submit(submitBtn);
      expect(handleSubmit).toHaveBeenCalled();
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I add a file other than an image (jpg, jpeg or png)", () => {
    test("Then, the bill shouldn't be created and I stay on the NewBill page", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
      );
      const firestore = null;
      const html = NewBillUI();
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      newBill.fileName = "invalid"
      const submitBtn = screen.getByTestId("form-new-bill")
      submitBtn.addEventListener("submit", handleSubmit)
      fireEvent.submit(submitBtn)
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
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
        const html = BillsUI({error: "Erreur 404"})
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      });
      test("Add bill to API and fails with 500 message error", async () => {
        firebase.post.mockImplementationOnce(() =>
            Promise.reject(new Error("Erreur 404"))
        );
        const html = BillsUI({error: "Erreur 500"})
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })

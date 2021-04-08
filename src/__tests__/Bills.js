import { fireEvent, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import '@testing-library/jest-dom/extend-expect'
import Bills  from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import Router from "../app/Router"
import firebase from "../__mocks__/firebase"
import { localStorageMock } from "../__mocks__/localStorage.js"
import userEvent from '@testing-library/user-event'
import Firestore from "../app/Firestore"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      jest.mock("../app/Firestore");
      Firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue() });
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
      );
      const pathname = ROUTES_PATH["Bills"];
      Object.defineProperty(window, "location", { value: { hash: pathname } });
      document.body.innerHTML = `<div id="root"></div>`;
      Router();
      expect(
          screen.getByTestId("icon-window").classList.contains("active-icon")
      ).toBe(true);
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
  describe('When I am on bills page but it is loading', () => {
    test('Then, Loading page should be rendered', () => {
      const html = BillsUI({loading: true})
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe('When I am on bills page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      const html = BillsUI({error: 'some error message'})
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })
})

describe('When I am connected as an employee and I am on the bills page', () => {
  describe('When I click on the Make New Bill button', () => {
    test('A new bill modal should open', () => {
      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({data: []})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({pathname})
      }
      const firestore = null
      const bill = new Bills({document, onNavigate, firestore, localStorage: window.localstorage})

      const handleClickNewBill = jest.fn(bill.handleClickNewBill)
      const newBillIcon = screen.getByTestId('btn-new-bill')
      newBillIcon.addEventListener('click', handleClickNewBill)
      userEvent.click(newBillIcon)
      expect(handleClickNewBill).toHaveBeenCalled()

      const modal = screen.getByTestId('form-new-bill')
      expect(modal).toBeTruthy()
    })
  })
})

describe('When I click on the Eye Icon button', () => {
  test('Then a modal should open', async () => {
    const html = BillsUI({data: bills})
    document.body.innerHTML = html
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({pathname})
    }
    const bill = new Bills({document, onNavigate, firestore: null, localStorage: window.localStorage,})
    $.fn.modal = jest.fn()
    const button = screen.getAllByTestId('icon-eye')[0]
    const handleClickIconEye = jest.fn((e) => {
      e.preventDefault()
      bill.handleClickIconEye(button)
    })
    button.addEventListener('click', handleClickIconEye)
    fireEvent.click(button)
    expect(handleClickIconEye).toHaveBeenCalled()
  })
})

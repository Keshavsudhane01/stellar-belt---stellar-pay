import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import SendPayment from "@/components/SendPayment"

jest.mock("@/context/WalletContext", () => ({
  useWallet: () => ({
    publicKey: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
    isConnected: true,
    balance: "100.0000",
    refreshBalance: jest.fn()
  })
}))

jest.mock("@/lib/transactions", () => ({
  sendXLM: jest.fn().mockResolvedValue({ success: true, hash: "abc123hash", error: null })
}))

describe("SendPayment form", () => {
  it("renders all form fields", () => {
    render(<SendPayment />)
    expect(screen.getByPlaceholderText(/destination/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/amount/i)).toBeInTheDocument()
  })

  it("shows validation error for invalid Stellar address", async () => {
    render(<SendPayment />)
    fireEvent.change(screen.getByPlaceholderText(/destination/i), {
      target: { value: "invalid-address" }
    })
    fireEvent.blur(screen.getByPlaceholderText(/destination/i))
    await waitFor(() => {
      expect(screen.getByText(/invalid.*address/i)).toBeInTheDocument()
    })
  })

  it("disables submit button when form is empty", () => {
    render(<SendPayment />)
    const btn = screen.getByRole("button", { name: /send xlm/i })
    expect(btn).toBeDisabled()
  })

  it("shows success state after successful transaction", async () => {
    render(<SendPayment />)
    fireEvent.change(screen.getByPlaceholderText(/destination/i), {
      target: { value: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGKWP32GKFVDNB3FTPF4JPX" }
    })
    fireEvent.change(screen.getByPlaceholderText(/amount/i), {
      target: { value: "10" }
    })
    fireEvent.click(screen.getByRole("button", { name: /send xlm/i }))
    await waitFor(() => {
      expect(screen.getByText(/successful/i)).toBeInTheDocument()
    })
  })
})

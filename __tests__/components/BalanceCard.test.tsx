import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import BalanceCard from "@/components/BalanceCard"

const mockRefresh = jest.fn()
const mockUseWallet = {
  publicKey: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
  isConnected: true,
  balance: "1234.5678",
  optimisticBalance: null,
  isLoading: false,
  refreshBalance: mockRefresh,
  network: "TESTNET"
}

jest.mock("@/context/WalletContext", () => ({
  useWallet: () => mockUseWallet
}))

describe("BalanceCard", () => {
  it("renders XLM balance with correct value", () => {
    render(<BalanceCard />)
    expect(screen.getByText(/1,234\.5678/)).toBeInTheDocument()
  })

  it("shows XLM unit label", () => {
    render(<BalanceCard />)
    expect(screen.getAllByText(/XLM/i)[0]).toBeInTheDocument()
  })

  it("shows TESTNET network badge", () => {
    render(<BalanceCard />)
    expect(screen.getByText(/TESTNET/i)).toBeInTheDocument()
  })

  it("calls refreshBalance when refresh button is clicked", () => {
    render(<BalanceCard />)
    const btn = screen.getByRole("button", { name: /refresh/i })
    fireEvent.click(btn)
    expect(mockRefresh).toHaveBeenCalledTimes(1)
  })
})

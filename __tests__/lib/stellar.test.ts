import { getXLMBalance, isValidStellarAddress, fundTestnetAccount } from "@/lib/stellar"

const VALID_PK = "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWNY"
const INVALID_PK = "not-a-valid-key"
const UNFUNDED_PK = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGKWP32GKFVDNB3FTPF4JPX"

// Mock the Horizon server
jest.mock("@stellar/stellar-sdk", () => {
  const real = jest.requireActual("@stellar/stellar-sdk")
  return {
    ...real,
    StrKey: {
      ...real.StrKey,
      isValidEd25519PublicKey: jest.fn().mockImplementation((pk) => {
        return pk.startsWith("G") && pk.length === 56
      })
    },
    Horizon: {
      ...real.Horizon,
      Server: jest.fn().mockImplementation(() => ({
        loadAccount: jest.fn().mockImplementation((pk) => {
          if (pk === UNFUNDED_PK) throw Object.assign(new Error("not found"), { response: { status: 404 } })
          return Promise.resolve({
            balances: [
              { asset_type: "native", balance: "1234.5678900" },
              { asset_type: "credit_alphanum4", balance: "100.0000000" }
            ]
          })
        })
      }))
    }
  }
})

describe("getXLMBalance", () => {
  it("returns formatted XLM balance for funded account", async () => {
    const balance = await getXLMBalance(VALID_PK)
    expect(balance).toBe("1234.5679")
  })

  it("returns 0.0000 for unfunded account (404 error)", async () => {
    const balance = await getXLMBalance(UNFUNDED_PK)
    expect(balance).toBe("0.0000")
  })

  it("returns native balance not other asset balances", async () => {
    const balance = await getXLMBalance(VALID_PK)
    expect(balance).not.toBe("100.0000")
  })
})

describe("isValidStellarAddress", () => {
  it("returns true for a valid Stellar public key", () => {
    expect(isValidStellarAddress(VALID_PK)).toBe(true)
  })

  it("returns false for an invalid address", () => {
    expect(isValidStellarAddress(INVALID_PK)).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(isValidStellarAddress("")).toBe(false)
  })

  it("returns false for a Stellar secret key (S...)", () => {
    expect(isValidStellarAddress("SCZANGBA5AKIA5GKFNF5ABMO4SDIKL7R65FKQMXDATCTHDQ5WVBDKIP")).toBe(false)
  })
})

describe("fundTestnetAccount", () => {
  beforeEach(() => { global.fetch = jest.fn() })

  it("returns true when friendbot succeeds", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true })
    const result = await fundTestnetAccount(VALID_PK)
    expect(result).toBe(true)
  })

  it("returns false when friendbot fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false })
    const result = await fundTestnetAccount(VALID_PK)
    expect(result).toBe(false)
  })

  it("returns false on network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"))
    const result = await fundTestnetAccount(VALID_PK)
    expect(result).toBe(false)
  })
})

import { isValidStellarAddress } from "@/lib/stellar"
import { WalletNotFoundError, UserRejectedError, InsufficientBalanceError, parseHorizonError } from "@/lib/errors"

jest.mock("@stellar/stellar-sdk", () => {
  const real = jest.requireActual("@stellar/stellar-sdk")
  return {
    ...real,
    StrKey: {
      ...real.StrKey,
      isValidEd25519PublicKey: jest.fn().mockImplementation((pk) => {
        return pk && pk.startsWith("G") && pk.length === 56
      })
    }
  }
})

describe("Stellar address validation in payment flow", () => {
  it("accepts a valid G... public key", () => {
    expect(isValidStellarAddress("GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWNY")).toBe(true)
  })

  it("rejects addresses shorter than 56 characters", () => {
    expect(isValidStellarAddress("GABC123")).toBe(false)
  })

  it("rejects addresses that do not start with G", () => {
    expect(isValidStellarAddress("XAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN")).toBe(false)
  })
})

describe("Error classes", () => {
  it("WalletNotFoundError contains wallet name in message", () => {
    const err = new WalletNotFoundError("Freighter")
    expect(err.message).toContain("Freighter")
    expect(err.name).toBe("WalletNotFoundError")
  })

  it("UserRejectedError has correct name", () => {
    const err = new UserRejectedError()
    expect(err.name).toBe("UserRejectedError")
    expect(err.message).toContain("cancelled")
  })

  it("InsufficientBalanceError includes amounts in message", () => {
    const err = new InsufficientBalanceError("5.0000", "10.0000")
    expect(err.message).toContain("5.0000")
    expect(err.message).toContain("10.0000")
  })
})

describe("parseHorizonError", () => {
  it("returns human-readable message for op_underfunded", () => {
    const err = { response: { data: { extras: { result_codes: { operations: ["op_underfunded"] } } } } }
    expect(parseHorizonError(err)).toContain("Insufficient balance")
  })

  it("returns human-readable message for op_no_destination", () => {
    const err = { response: { data: { extras: { result_codes: { operations: ["op_no_destination"] } } } } }
    expect(parseHorizonError(err)).toContain("Destination account")
  })

  it("falls back to error message when no result_codes", () => {
    const err = { message: "Connection timeout" }
    expect(parseHorizonError(err)).toBe("Connection timeout")
  })

  it("returns unknown error string when no message or codes", () => {
    expect(parseHorizonError({})).toBe("Unknown error occurred")
  })
})

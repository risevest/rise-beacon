import { expect } from "chai";

import { ValidationSubCodes } from "../classification";
import { AppError, SystemLevelFailed, ValidationFailed, toBeaconError } from "../errors";
import { beacon } from "./helpers";

describe("BeaconError serialization", () => {
  it("should serialize with the registry prefix and numeric wire codes", () => {
    const body = beacon.errors.WALLET.FROZEN("msg", { walletId: "w_1" }).toJSON();
    expect(body.message).to.equal("msg");
    expect(body.data.super_code).to.equal(7000);
    expect(body.data.sub_code).to.equal("PAY-001");
    expect(body.data.meta).to.deep.equal({ walletId: "w_1" });
    expect(body.data.timestamp).to.be.a("string");
  });

  it("should not include the docsUrl on the wire", () => {
    const body = beacon.errors.WALLET.FROZEN().toJSON();
    expect(JSON.stringify(body)).to.not.include("docsUrl");
  });
});

describe("v1 error classes", () => {
  it("should serialize with the global service prefix", () => {
    const body = new ValidationFailed(ValidationSubCodes.INVALID_OTP).toJSON();
    expect(body.data.sub_code).to.equal("GEN-001");
    expect(body.data.super_code).to.equal(1000);
  });
});

describe("toBeaconError", () => {
  it("should pass AppError instances through unchanged", () => {
    const original = beacon.errors.WALLET.FROZEN();
    expect(toBeaconError(original)).to.equal(original);
  });

  it("should wrap Error instances as system errors, keeping the message and stack", () => {
    const boom = new TypeError("boom");
    const wrapped = toBeaconError(boom);
    expect(wrapped).to.be.instanceOf(SystemLevelFailed);
    expect(wrapped.message).to.equal("boom");
    expect(wrapped.stack).to.equal(boom.stack);
    expect((wrapped as { cause?: unknown }).cause).to.equal(boom);
  });

  it("should wrap thrown strings using the string as the message", () => {
    expect(toBeaconError("plain failure").message).to.equal("plain failure");
  });

  it("should use the fallback message for values with no message", () => {
    expect(toBeaconError({ odd: true }, "fallback").message).to.equal("fallback");
    expect(toBeaconError(undefined).message).to.equal("An unexpected error occurred.");
  });

  it("should always produce an AppError", () => {
    expect(toBeaconError(42)).to.be.instanceOf(AppError);
  });
});

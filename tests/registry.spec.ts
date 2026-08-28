import { expect } from "chai";

import { AppError, BeaconError, ErrorUtils, defineErrorSystem } from "../index";
import { beacon } from "./helpers";

describe("defineErrorSystem", () => {
  it("should throw at definition time when two categories share a super code", () => {
    expect(() =>
      defineErrorSystem({
        prefix: "X",
        categories: {
          A: { superCode: 1, subCodes: { ONE: { code: 1, message: "m" } } },
          B: { superCode: 1, subCodes: { TWO: { code: 2, message: "m" } } }
        }
      })
    ).to.throw(/Duplicate super code 1/);
  });

  it("should throw at definition time when two sub-codes in a category share a number", () => {
    expect(() =>
      defineErrorSystem({
        prefix: "X",
        categories: {
          A: { superCode: 1, subCodes: { ONE: { code: 1, message: "m" }, UNO: { code: 1, message: "m" } } }
        }
      })
    ).to.throw(/Duplicate sub code 1 in category "A"/);
  });

  it("should reject category names containing a dot", () => {
    expect(() =>
      defineErrorSystem({
        prefix: "X",
        categories: { "A.B": { superCode: 1, subCodes: { ONE: { code: 1, message: "m" } } } }
      })
    ).to.throw(/must not contain "\./);
  });

  it("should reject sub-code names containing a dot", () => {
    expect(() =>
      defineErrorSystem({
        prefix: "X",
        categories: { A: { superCode: 1, subCodes: { "ONE.TWO": { code: 1, message: "m" } } } }
      })
    ).to.throw(/must not contain "\./);
  });
});

describe("error factories", () => {
  it("should create errors that extend AppError and satisfy isAppError", () => {
    const err = beacon.errors.WALLET.FROZEN();
    expect(err).to.be.instanceOf(BeaconError);
    expect(err).to.be.instanceOf(AppError);
    expect(ErrorUtils.isAppError(err)).to.be.true;
  });

  it("should carry the category and code names, HTTP status, and docsUrl", () => {
    const err = beacon.errors.WALLET.FROZEN();
    expect(err.categoryName).to.equal("WALLET");
    expect(err.codeName).to.equal("FROZEN");
    expect(err.httpStatus).to.equal(422);
    expect(err.docsUrl).to.equal("https://docs.example.com/wallet-frozen");
  });

  it("should use the registry message when none is given", () => {
    expect(beacon.errors.WALLET.LIMIT_EXCEEDED().message).to.equal("Wallet limit exceeded");
  });

  it("should accept positional message and meta", () => {
    const err = beacon.errors.WALLET.FROZEN("custom", { walletId: "w_1" });
    expect(err.message).to.equal("custom");
    expect(err.meta).to.deep.equal({ walletId: "w_1" });
  });

  it("should accept an options object so meta can be passed without a message", () => {
    const err = beacon.errors.WALLET.FROZEN({ meta: { walletId: "w_9" } });
    expect(err.message).to.equal("Wallet is frozen");
    expect(err.meta).to.deep.equal({ walletId: "w_9" });
  });

  it("should inherit v1 descriptions as default messages in preset categories", () => {
    const err = beacon.errors.VALIDATION.INVALID_OTP();
    expect(err.message).to.equal("Invalid or expired OTP");
    expect(Number(err.superCode)).to.equal(1000);
  });

  it("should apply sub-code HTTP status overrides from the preset", () => {
    expect(beacon.errors.BUSINESS_LOGIC.RESOURCE_NOT_FOUND().httpStatus).to.equal(404);
    expect(beacon.errors.BUSINESS_LOGIC.RATE_LIMIT_EXCEEDED().httpStatus).to.equal(429);
    expect(beacon.errors.VALIDATION.RESOURCE_NOT_FOUND().httpStatus).to.equal(404);
    expect(beacon.errors.AUTHORIZATION.RATE_LIMIT().httpStatus).to.equal(429);
  });

  it("should fall back to the category HTTP status when a sub-code has no override", () => {
    expect(beacon.errors.BUSINESS_LOGIC.RULE_VIOLATION().httpStatus).to.equal(422);
  });
});

describe("system helpers", () => {
  describe("error", () => {
    it("should create the error for a key without throwing", () => {
      const err = beacon.error("WALLET.FROZEN", "msg", { a: 1 });
      expect(err).to.be.instanceOf(BeaconError);
      expect(err.codeName).to.equal("FROZEN");
      expect(err.meta).to.deep.equal({ a: 1 });
    });

    it("should accept an options object", () => {
      const err = beacon.error("WALLET.FROZEN", { message: "custom", meta: { b: 2 } });
      expect(err.message).to.equal("custom");
      expect(err.meta).to.deep.equal({ b: 2 });
    });
  });

  describe("throw", () => {
    it("should throw the error for the given key", () => {
      expect(() => beacon.throw("WALLET.LIMIT_EXCEEDED"))
        .to.throw(BeaconError)
        .with.property("codeName", "LIMIT_EXCEEDED");
    });

    it("should fail at runtime for keys not in the registry", () => {
      // @ts-expect-error unknown key
      expect(() => beacon.throw("WALLET.NOPE")).to.throw(/Unknown error key/);
    });
  });

  describe("assert", () => {
    it("should throw when the condition is falsy", () => {
      expect(() => beacon.assert(false, "WALLET.FROZEN")).to.throw(BeaconError);
    });

    it("should pass through meta from an options object", () => {
      expect(() => beacon.assert(0, "WALLET.FROZEN", { meta: { walletId: "w_1" } }))
        .to.throw(BeaconError)
        .with.deep.property("meta", { walletId: "w_1" });
    });

    it("should not throw when the condition is truthy", () => {
      expect(() => beacon.assert("truthy", "VALIDATION.REQUIRED_FIELD_MISSING")).to.not.throw();
    });
  });

  describe("orThrow", () => {
    it("should throw when the value is null", () => {
      expect(() => beacon.orThrow(null, "VALIDATION.RESOURCE_NOT_FOUND")).to.throw(BeaconError);
    });

    it("should throw when the value is undefined", () => {
      expect(() => beacon.orThrow(undefined, "VALIDATION.RESOURCE_NOT_FOUND")).to.throw(BeaconError);
    });

    it("should return the value with a non-nullable type", () => {
      const found = { id: "w_1" } as { id: string } | undefined;
      const wallet = beacon.orThrow(found, "VALIDATION.RESOURCE_NOT_FOUND");
      const idLength: number = wallet.id.length;
      expect(idLength).to.equal(3);
    });
  });
});

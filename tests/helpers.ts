import { beaconDefaultCategories, defineErrorSystem } from "../index";

export const beacon = defineErrorSystem({
  prefix: "PAY",
  categories: {
    ...beaconDefaultCategories,
    WALLET: {
      superCode: 7000,
      httpStatus: 422,
      subCodes: {
        FROZEN: { code: 1, message: "Wallet is frozen", docsUrl: "https://docs.example.com/wallet-frozen" },
        LIMIT_EXCEEDED: { code: 2, message: "Wallet limit exceeded" }
      }
    }
  }
});

export interface CapturedResponse {
  status?: number;
  body?: any;
}

export function mockRes() {
  const captured: CapturedResponse = {};
  const res = {
    headersSent: false,
    status(code: number) {
      captured.status = code;
      return res;
    },
    json(body: any) {
      captured.body = body;
      return res;
    }
  };
  return { res, captured };
}

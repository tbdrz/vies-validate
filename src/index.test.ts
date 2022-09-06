import { describe, expect, test } from "vitest";
import {
  validateVat,
  ViesValidationResponse,
  VAT_TEST_SERVICE_URL,
} from "./index";

describe("validateVat()", () => {
  describe("Using VIES prod service", () => {
    test("should return true if it is a valid VAT number", async () => {
      const result = (await validateVat(
        "NL",
        "853746333B01"
      )) as ViesValidationResponse;
      expect(result.valid).toBeTruthy();
    });

    test("should throw INVALID_INPUT when VAT number is empty", async () => {
      try {
        await validateVat("DE", "");
      } catch (e) {
        expect((e as Error).message).toBe("INVALID_INPUT");
      }
    });

    test("should throw INVALID_INPUT when VAT number is invalid", async () => {
      const result = (await validateVat(
        "DE",
        "853746333B"
      )) as ViesValidationResponse;
      expect(result.valid).toBeFalsy();
    });

    test("should throw Error when failed to call service", async () => {
      try {
        await validateVat("DE", "test", "http://www.vattest123.com");
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe("Using VIES testing service", () => {
    test("should throw INVALID_INPUT when VAT number is 201", async () => {
      try {
        await validateVat("DE", "201", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("INVALID_INPUT");
      }
    });

    test("should throw INVALID_REQUESTER_INFO when VAT number is 202", async () => {
      try {
        await validateVat("DE", "202", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("INVALID_REQUESTER_INFO");
      }
    });

    test("should throw SERVICE_UNAVAILABLE when VAT number is 300", async () => {
      try {
        await validateVat("DE", "300", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("SERVICE_UNAVAILABLE");
      }
    });

    test("should throw MS_UNAVAILABLE when VAT number is 301", async () => {
      try {
        await validateVat("DE", "301", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("MS_UNAVAILABLE");
      }
    });

    test("should throw TIMEOUT when VAT number is 302", async () => {
      try {
        await validateVat("DE", "302", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("TIMEOUT");
      }
    });

    test("should throw VAT_BLOCKED when VAT number is 400", async () => {
      try {
        await validateVat("DE", "400", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("VAT_BLOCKED");
      }
    });

    test("should throw IP_BLOCKED when VAT number is 401", async () => {
      try {
        await validateVat("DE", "401", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("IP_BLOCKED");
      }
    });

    test("should throw GLOBAL_MAX_CONCURRENT_REQ when VAT number is 500", async () => {
      try {
        await validateVat("DE", "500", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("GLOBAL_MAX_CONCURRENT_REQ");
      }
    });

    test("should throw GLOBAL_MAX_CONCURRENT_REQ_TIME when VAT number is 501", async () => {
      try {
        await validateVat("DE", "501", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("GLOBAL_MAX_CONCURRENT_REQ_TIME");
      }
    });

    test("should throw MS_MAX_CONCURRENT_REQ when VAT number is 600", async () => {
      try {
        await validateVat("DE", "600", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("MS_MAX_CONCURRENT_REQ");
      }
    });

    test("should throw MS_MAX_CONCURRENT_REQ_TIME when VAT number is 601", async () => {
      try {
        await validateVat("DE", "601", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("MS_MAX_CONCURRENT_REQ_TIME");
      }
    });

    test("should throw SERVICE_UNAVAILABLE for all other cases", async () => {
      try {
        await validateVat("DE", "700", VAT_TEST_SERVICE_URL);
      } catch (e) {
        expect((e as Error).message).toBe("SERVICE_UNAVAILABLE");
      }
    });
  });
});

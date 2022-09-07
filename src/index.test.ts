import { expect, test } from "vitest";
import { validate } from "./index";

test("should return true if it is a valid VAT number", async () => {
  const { data, error } = await validate("NL", "853746333B01");
  expect(data?.valid).toBeTruthy();
  expect(error).toBe(null);
});

test("should return false when VAT number is invalid", async () => {
  const { data, error } = await validate("BE", "04598");
  expect(data?.valid).toBeFalsy();
  expect(error).toBe(null);
});

test("should throw INVALID_INPUT when VAT number is empty", async () => {
  const { data, error } = await validate("DE", "");
  expect(data).toBe(null);
  expect(error).toBe("INVALID_INPUT");
});

test("should throw INVALID_INPUT when country code is empty or invalid", async () => {
  const { data, error } = await validate("", "853746333B01");
  expect(data).toBe(null);
  expect(error).toBe("INVALID_INPUT");
});

test("should throw Error when failed to call service", async () => {
  try {
    await validate("DE", "test", "http://www.vattest123.com");
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});

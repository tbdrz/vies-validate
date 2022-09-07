import fetch from "node-fetch";

export interface ViesValidationResponse {
  countryCode: string;
  vatNumber: string;
  requestDate: string;
  valid: boolean;
  name?: string;
  address?: string;
}

export interface ViesResponse {
  data: ViesValidationResponse | null;
  error: string | null;
}

export const VAT_SERVICE_URL: string =
  "https://ec.europa.eu/taxation_customs/vies/services/checkVatService";

export const VAT_TEST_SERVICE_URL: string =
  "https://ec.europa.eu/taxation_customs/vies/services/checkVatTestService";

const soapBodyTemplate: string =
  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"\n  xmlns:tns1="urn:ec.europa.eu:taxud:vies:services:checkVat:types"\n  xmlns:impl="urn:ec.europa.eu:taxud:vies:services:checkVat">\n  <soap:Header>\n  </soap:Header>\n  <soap:Body>\n    <tns1:checkVat xmlns:tns1="urn:ec.europa.eu:taxud:vies:services:checkVat:types"\n     xmlns="urn:ec.europa.eu:taxud:vies:services:checkVat:types">\n     <tns1:countryCode>_country_code_placeholder_</tns1:countryCode>\n     <tns1:vatNumber>_vat_number_placeholder_</tns1:vatNumber>\n    </tns1:checkVat>\n  </soap:Body>\n</soap:Envelope>';

const parseField = (
  soapMessage: string,
  fieldName: string
): string | undefined => {
  const regex = new RegExp(
    `<${fieldName}>\((\.|\\s)\*?\)</${fieldName}>`,
    "gm"
  );
  const match = regex.exec(soapMessage);
  return match ? match[1] : undefined;
};

const hasFault = (soapMessage: string): boolean => {
  return soapMessage.match(/<env:Fault>\S+<\/env:Fault>/g) !== null;
};

export async function validate(
  countryCode: string,
  vatNumber: string,
  serviceUrl: string = VAT_SERVICE_URL
): Promise<{
  data: ViesValidationResponse | null;
  error: string | null;
}> {
  const xml = soapBodyTemplate
    .replace("_country_code_placeholder_", countryCode)
    .replace("_vat_number_placeholder_", vatNumber)
    .replace("\n", "")
    .trim();

  const response = await fetch(serviceUrl, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "User-Agent": "node-soap",
      Accept:
        "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
      "Accept-Encoding": "none",
      "Accept-Charset": "utf-8",
      Connection: "close",
      Host: "ec.europa.eu",
    },
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    body: xml, // body data type must match "Content-Type" header
  });

  const soapMessage = await response.text();

  if (hasFault(soapMessage)) {
    const faultString = parseField(soapMessage, "faultstring");

    return { data: null, error: faultString ?? "" };
  } else {
    const countryCode = parseField(soapMessage, "ns2:countryCode");
    const vatNumber = parseField(soapMessage, "ns2:vatNumber");
    const requestDate = parseField(soapMessage, "ns2:requestDate");
    const valid = parseField(soapMessage, "ns2:valid");

    // vatNumber is an empty string when evaluated as not valid
    if (!countryCode || vatNumber === undefined || !requestDate || !valid) {
      return {
        data: null,
        error: "Failed to parse vat validation info from VIES response",
      };
    }

    return {
      data: {
        countryCode,
        vatNumber,
        requestDate,
        valid: valid === "true",
        name: parseField(soapMessage, "ns2:name"),
        address: parseField(soapMessage, "ns2:address")?.replace(/\n/g, ", "),
      },
      error: null,
    };
  }
}

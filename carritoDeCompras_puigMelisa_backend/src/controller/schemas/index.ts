import Ajv from 'ajv';

import validations from './validations';

const ajv = new Ajv({ removeAdditional: true, useDefaults: true });

type JSONType = Record<string, unknown>;
type ValidationDictType = Record<string, Ajv.ValidateFunction>;

class Validator {
  private _schemaValidators: ValidationDictType = {};

  constructor() {
    const validationJSONS: Record<string, Record<string, unknown>> = { ...validations };
    let schemaJSON = {};
    Object.keys(validations).forEach((validation) => {
      schemaJSON = validationJSONS[validation];
      this._schemaValidators[validation] = ajv.compile(schemaJSON);
    });
  }

  async validate(data: JSONType, schema: keyof typeof validations): Promise<JSONType> {
    const validationFunction = this._schemaValidators[schema];
    const isValid = validationFunction(data);
    if (!isValid) {
      console.error(validationFunction.errors);
      throw new Error('INVALID_PARAMS');
    }
    return data;
  }
}

export default new Validator();

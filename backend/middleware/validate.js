const ApiError = require('../utils/ApiError');

/**
 * Lightweight field validator. Usage:
 * validate({ email: 'required|email', password: 'required|min:6' })
 * Keeps the project dependency-light while still giving real validation errors.
 */
const rules = {
  required: (val) => val !== undefined && val !== null && val !== '',
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(val).trim()),
  name: (val) => /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(String(val).trim()),
  phone: (val) => /^\d{10}$/.test(String(val).replace(/\D/g, '')),
  number: (val) => !isNaN(Number(val)),
};

const parseRule = (rule) => {
  const [name, arg] = rule.split(':');
  return { name, arg };
};

const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    Object.entries(schema).forEach(([field, ruleString]) => {
      const value = req.body[field];
      const fieldRules = ruleString.split('|');

      fieldRules.forEach((r) => {
        const { name, arg } = parseRule(r);

        if (name === 'required' && !rules.required(value)) {
          errors.push(`${field} is required`);
          return;
        }
        if (value === undefined || value === null || value === '') return; // skip other checks if empty & not required

        if (name === 'email' && !rules.email(value)) {
          errors.push(`${field} must be a valid email`);
        }
        if (name === 'name' && !rules.name(value)) {
          errors.push(`${field} can contain letters and spaces only`);
        }
        if (name === 'phone' && !rules.phone(value)) {
          errors.push(`${field} must be a valid 10-digit mobile number`);
        }
        if (name === 'min' && String(value).length < Number(arg)) {
          errors.push(`${field} must be at least ${arg} characters`);
        }
        if (name === 'number' && !rules.number(value)) {
          errors.push(`${field} must be a number`);
        }
      });
    });

    if (errors.length) {
      throw new ApiError(400, 'Validation failed', errors);
    }
    next();
  };
};

module.exports = validate;

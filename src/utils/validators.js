import lodashMemoize from "lodash.memoize"

/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape

const validation = {
  required: "Required",
  minLength: "Must be %{min} characters at least",
  maxLength: "Must be %{max} characters or less",
  minValue: "Must be at least %{min}",
  maxValue: "Must be %{max} or less",
  betweenValue: "Must be between (%{min}, %{max})",
  number: "Must be a number",
  email: "Must be a valid email",
  oneOf: "Must be one of: %{options}",
  regex: "Must match a specific format (regexp): %{pattern}"
}

const translate = (message, args = {}) => {
  let result = message;
  if (validation[message]) {
    result = validation[message];
    const keys = Object.keys(args);
    keys.forEach(key => {
      result = result.replaceAll(`%{${key}}`, args[key])
    })
  } 
  return result;
}

const isEmpty = value => typeof value === "undefined" || value === null || value === "";

const getMessage = (message, messageArgs, value, values, props) =>
  typeof message === "function"
    ? message({
        args: messageArgs,
        value,
        values,
        ...props
      })
    : translate(message, messageArgs);

// If we define validation functions directly in JSX, it will
// result in a new function at every render, and then trigger infinite re-render.
// Hence, we memoize every built-in validator to prevent a "Maximum call stack" error.
const memoize = fn => lodashMemoize(fn, (...args) => JSON.stringify(args));

export const required = memoize((message = "required") =>
  Object.assign(
    (value, values, props) => (isEmpty(value) ? getMessage(message, undefined, value, values, props) : undefined),
    { isRequired: true }
  )
);

export const minLength = memoize((min, message = "minLength") => (value, values, props) =>
  !isEmpty(value) && value.trim().length < min ? getMessage(message, { min }, value, values, props) : undefined
);

export const maxLength = memoize((max, message = "maxLength") => (value, values, props) =>
  !isEmpty(value) && value.trim().length > max ? getMessage(message, { max }, value, values, props) : undefined
);

export const minValue = memoize((min, message = "minValue") => (value, values, props) =>
  !isEmpty(value) && value < min ? getMessage(message, { min }, value, values, props) : undefined
);

export const maxValue = memoize((max, message = "maxValue") => (value, values, props) =>
  !isEmpty(value) && value > max ? getMessage(message, { max }, value, values, props) : undefined
);

export const betweenValue = memoize((min, max, message = "betweenValue") => (value, values, props) =>
  !isEmpty(value) && (value < min || value > max) ? getMessage(message, { min, max }, value, values, props) : undefined
);

export const number = memoize((message = "number") => (value, values, props) =>
  !isEmpty(value) && isNaN(Number(value)) ? getMessage(message, undefined, value, values, props) : undefined
);

export const regex = memoize((pattern, message = "regex") => (value, values, props) =>
  !isEmpty(value) && typeof value === "string" && !pattern.test(value)
    ? getMessage(message, { pattern }, value, values, props)
    : undefined
);

export const email = memoize((message = "email") => regex(EMAIL_REGEX, message));

const oneOfTypeMessage = ({ list }, value, values, { translate }) => {
  translate("oneOf", {
    options: list.join(", ")
  });
};

export const choices = memoize((list, message = oneOfTypeMessage) => (value, values, props) =>
  !isEmpty(value) && list.indexOf(value) === -1 ? getMessage(message, { list }, value, values, props) : undefined
);

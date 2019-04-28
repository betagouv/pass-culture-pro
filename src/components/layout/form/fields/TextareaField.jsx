/* eslint
  react/jsx-one-expression-per-line: 0 */
import classnames from 'classnames'
import React, { Fragment } from 'react'
import Textarea from 'react-autosize-textarea'
import { Field } from 'react-final-form'
import PropTypes from 'prop-types'
import { composeValidators } from 'react-final-form-utils'

import FieldError from 'components/layout/form/FieldError'
import validateRequiredField from 'components/layout/form/utils/validateRequiredField'

export const TextareaField = ({
  autoComplete,
  className,
  disabled,
  label,
  maxLength,
  name,
  placeholder,
  readOnly,
  required,
  validate,
  validating,
  // react-autosize-textarea
  ...ReactAutosizeProps
}) => {
  const requiredValidate =
    required && typeof required === 'function'
      ? required
      : (required && validateRequiredField) || undefined

  return (
    <Field
      name={name}
      validate={composeValidators(validate, requiredValidate)}
      render={({ input, meta }) => {
        const valueLength = input.value.length
        const value =
          valueLength > maxLength - 1
            ? input.value.slice(0, maxLength - 1)
            : input.value

        return (
          <div
            className={classnames('field textarea-field', className, {
              'is-label-aligned': label,
              'is-read-only': readOnly,
            })}>
            <label
              htmlFor={name}
              className={classnames('field-label', { empty: !label })}>
              {label && (
                <span>
                  <span>{label}</span>
                  {required && !readOnly && (
                    <span className="field-asterisk">*</span>
                  )}
                  {!readOnly && (
                    <Fragment>
                      <br />
                      <span className="fs12">
                        {' '}
                        ({valueLength} / {maxLength}){' '}
                      </span>
                    </Fragment>
                  )}
                </span>
              )}
            </label>
            <div className="field-control">
              <div className="field-value flex-columns items-center">
                <span className="field-inner">
                  <Textarea
                    {...input}
                    autoComplete={autoComplete ? 'on' : 'off'}
                    className="field-textarea"
                    disabled={disabled || readOnly}
                    id={name}
                    placeholder={readOnly ? '' : placeholder}
                    readOnly={readOnly}
                    required={!!required} // cast to boolean
                    value={value}
                    {...ReactAutosizeProps}
                  />
                </span>
              </div>
              <FieldError meta={meta} />
            </div>
          </div>
        )
      }}
    />
  )
}

TextareaField.defaultProps = {
  autoComplete: false,
  className: '',
  disabled: false,
  label: '',
  maxLength: 1000,
  placeholder: '',
  readOnly: false,
  required: false,
  validate: null,
  validating: false,
}

TextareaField.propTypes = {
  autoComplete: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  maxLength: PropTypes.number,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  validate: PropTypes.func,
  validating: PropTypes.bool,
}

export default TextareaField
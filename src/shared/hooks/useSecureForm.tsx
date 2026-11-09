// hooks/useSecureForm.ts
import * as Yup from 'yup';
import { useContext, useMemo } from 'react';
import { AuthGuardContext } from '../core/AuthGuard';
import { useFormik, FormikValues } from 'formik';

// ==================== Types ====================
export type Rule = {
  required?: boolean;
  requiredMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
  custom?: (value: any) => string | null;
  validator?: Yup.AnySchema;
};

export type OptionType = {
  value: string | number;
  label: string;
};

export type FieldConfig = {
  name: string;
  label: string;
  permission: string;
  uiText?: string;
  type?: 'text' | 'email' | 'number' | 'phone' | 'password' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'autocomplete';
  initialValue?: any;
  options?: OptionType[];
  multiple?: boolean;
  freeSolo?: boolean;
  native?: boolean;
  rules?: Rule;
};

// ==================== Helper: Build Custom Rules ====================
const buildCustomValidations = (
  schema: Yup.AnySchema,
  rules: Rule | undefined,
  label: string,
  ctx: any,
  permission?: string
): Yup.AnySchema => {
  let result = schema;

  if (!rules) return result;

  if (permission) {
    result = result.test(
      'required-if',
      rules.requiredMessage || `${label} is required`,
      function(value) {
        const hasPermission = ctx?.checkVisibility(permission);
        
        if (hasPermission && (rules.required !== false)) {
          if (value === undefined || value === null || value === '') {
            return false;
          }
          if (Array.isArray(value) && value.length === 0) {
            return false;
          }
        }
        return true;
      }
    );
  } else if (rules.required) {
    result = result.required(rules.requiredMessage || `${label} is required`);
  }

  if (rules.pattern) {
    result = (result as Yup.StringSchema).matches(
      rules.pattern,
      rules.patternMessage || 'Invalid format'
    );
  }

  if (rules.custom) {
    result = result.test(
      'custom',
      'Invalid value',
      function(value) {
        const errorMessage = rules.custom!(value);
        if (errorMessage) {
          return this.createError({ message: errorMessage });
        }
        return true;
      }
    );
  }

  if (rules.validator) {
    result = rules.validator;
  }

  return result;
};

// ==================== Schema Builder ====================
export const buildSecureSchema = (
  fields: FieldConfig[],
  ctx: any
): Yup.ObjectSchema<any> => {
  const shape: Record<string, Yup.AnySchema> = {};

  fields.forEach((field) => {
    let schema: Yup.AnySchema;
    const rules = field.rules || {};

    switch (field.type) {
      case 'email':
        schema = Yup.string().email('Invalid email format');
        break;
      case 'number':
        schema = Yup.number().typeError('Must be a number');
        break;
      case 'phone':
        schema = Yup.string().matches(/^[0-9]+$/, 'Must be numbers only');
        break;
      case 'checkbox':
        schema = Yup.boolean();
        break;
      case 'select':
      case 'radio':
      case 'autocomplete':
        schema = Yup.mixed();
        break;
      default:
        schema = Yup.string();
    }

    schema = buildCustomValidations(schema, rules, field.label, ctx, field.permission);

    if (!rules.required && !field.permission) {
      schema = schema.nullable();
    }

    shape[field.name] = schema;
  });

  return Yup.object(shape);
};

// ==================== Custom Hook ====================
export type UseSecureFormOptions<T extends FormikValues> = {
  fields: FieldConfig[];
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  enableReinitialize?: boolean;
};

export const useSecureForm = <T extends FormikValues>({
  fields,
  initialValues,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
  enableReinitialize = true,
}: UseSecureFormOptions<T>) => {
  const ctx = useContext(AuthGuardContext);

  const validationSchema = useMemo(
    () => buildSecureSchema(fields, ctx),
    [fields, ctx]
  );

  const formInitialValues = useMemo(() => {
    const values: any = {};
    fields.forEach((field) => {
      let defaultValue = field.initialValue !== undefined 
        ? field.initialValue 
        : (initialValues[field.name as keyof T] ?? '');
      
      if (field.type === 'checkbox' && defaultValue === '') {
        defaultValue = false;
      }
      
      values[field.name] = defaultValue;
    });
    return values;
  }, [fields, initialValues]);

  const getFieldProps = useMemo(() => {
    return (fieldName: string, overrides?: { disabled?: boolean; required?: boolean }) => {
      const field = fields.find(f => f.name === fieldName);
      if (!field) {
        return { 
          permission: '', 
          disabled: false, 
          required: false, 
          label: '', 
          uiText: '',
          options: [] 
        };
      }

      const isDisabled = overrides?.disabled ?? ctx?.checkDisabled(field.permission) ?? false;
      const isRequired = overrides?.required ?? ctx?.checkRequired(field.permission) ?? false;

      return {
        permission: field.permission,
        disabled: isDisabled,
        required: isRequired,
        label: field.label,
        uiText: field.uiText,
        options: field.options || [],
        multiple: field.multiple || false,
        freeSolo: field.freeSolo || false,
        native: field.native || false,
      };
    };
  }, [fields, ctx]);

  const formik = useFormik({
    initialValues: formInitialValues as T,
    validationSchema,
    validateOnChange,
    validateOnBlur,
    enableReinitialize,
    onSubmit,
  });

  return {
    formik,
    getFieldProps,
    fields,
    validationSchema,
    renderField: (fieldName: string, overrides?: { disabled?: boolean; required?: boolean }) => {
      const field = fields.find(f => f.name === fieldName);
      const props = getFieldProps(fieldName, overrides);
      const error = formik.touched[fieldName as keyof typeof formik.touched] && 
                    formik.errors[fieldName as keyof typeof formik.errors];
      
      // Base props for all fields
      const baseProps = {
        ...props,
        name: fieldName,
        value: formik.values[fieldName as keyof T],
        onChange: (value: any) => {
          // Handle both event and direct value
          if (value && value.target) {
            formik.handleChange(value);
          } else {
            formik.setFieldValue(fieldName, value);
          }
        },
        onBlur: formik.handleBlur,
        error: !!error,
        errorMessage: error as string | undefined,
        type: field?.type || 'text',
      };

      // Checkbox special handling
      if (field?.type === 'checkbox') {
        return {
          ...props,
          name: fieldName,
          checked: formik.values[fieldName as keyof T] || false,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            formik.setFieldValue(fieldName, e.target.checked);
          },
          onBlur: formik.handleBlur,
          error: !!error,
          errorMessage: error as string | undefined,
        };
      }

      // Autocomplete special handling
      if (field?.type === 'autocomplete') {
        return {
          ...props,
          name: fieldName,
          value: formik.values[fieldName as keyof T],
          onChange: (_: any, newValue: any) => {
            formik.setFieldValue(fieldName, newValue);
          },
          onBlur: formik.handleBlur,
          error: !!error,
          errorMessage: error as string | undefined,
        };
      }

      return baseProps;
    }
  };
};
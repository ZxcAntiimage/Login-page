"use client";

import { z } from "zod";

type ValidationResult = { valid: boolean; message?: string };

export const validateEmail = (email: string): ValidationResult => {
  const emailSchema = z.string().email("Please enter a valid email address");
  const result = emailSchema.safeParse(email);

  if (result.success) {
    return { valid: true };
  } else {
    const firstError = result.error.issues[0]?.message;
    return { valid: false, message: firstError || "Please enter a valid email address" };
  }
};

export const validatePassword = (password: string): ValidationResult => {
  const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    );

  const result = passwordSchema.safeParse(password);

  if (result.success) {
    return { valid: true };
  } else {
    // Исправлено: берем сообщение из первой найденной ошибки
    const firstError = result.error.issues[0]?.message;
    return { valid: false, message: firstError || "Invalid password" };
  }
};

export const validateName = (name: string): ValidationResult => {
  const nameSchema = z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

  const result = nameSchema.safeParse(name);

  if (result.success) {
    return { valid: true };
  } else {
    const firstError = result.error.issues[0]?.message;
    return { valid: false, message: firstError || "Invalid name" };
  }
};

export const validatePhone = (phone: string): ValidationResult => {
  const phoneSchema = z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(
      /^\+?[0-9\s\-()]+$/,
      "Phone number can only contain digits, spaces, and +-() characters"
    );

  const result = phoneSchema.safeParse(phone);

  if (result.success) {
    return { valid: true };
  } else {
    const firstError = result.error.issues[0]?.message;
    return { valid: false, message: firstError || "Invalid phone number" };
  }
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match" };
  }
  return { valid: true };
};

export const validateCheckbox = (checked: boolean): ValidationResult => {
  if (!checked) {
    return {
      valid: false,
      message: "You must accept the terms and conditions",
    };
  }
  return { valid: true };
};

export const validateLoginForm = (email: string, password: string) => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  return {
    valid: emailValidation.valid && passwordValidation.valid,
    errors: {
      email: emailValidation.valid ? undefined : emailValidation.message,
      password: passwordValidation.valid
        ? undefined
        : passwordValidation.message,
    },
  };
};

export const validateSignupForm = (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string,
  termsAccepted: boolean
) => {
  const firstNameValidation = validateName(firstName);
  const lastNameValidation = validateName(lastName);
  const emailValidation = validateEmail(email);
  const phoneValidation = validatePhone(phone);
  const passwordValidation = validatePassword(password);
  const confirmPasswordValidation = validateConfirmPassword(
    password,
    confirmPassword
  );
  const termsValidation = validateCheckbox(termsAccepted);

  return {
    valid:
      firstNameValidation.valid &&
      lastNameValidation.valid &&
      emailValidation.valid &&
      phoneValidation.valid &&
      passwordValidation.valid &&
      confirmPasswordValidation.valid &&
      termsValidation.valid,
    errors: {
      firstName: firstNameValidation.valid
        ? undefined
        : firstNameValidation.message,
      lastName: lastNameValidation.valid
        ? undefined
        : lastNameValidation.message,
      email: emailValidation.valid ? undefined : emailValidation.message,
      phone: phoneValidation.valid ? undefined : phoneValidation.message,
      password: passwordValidation.valid
        ? undefined
        : passwordValidation.message,
      confirmPassword: confirmPasswordValidation.valid
        ? undefined
        : confirmPasswordValidation.message,
      terms: termsValidation.valid ? undefined : termsValidation.message,
    },
  };
};
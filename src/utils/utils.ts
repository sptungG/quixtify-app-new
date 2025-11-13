import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ----------------------------------------

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------

export const splitUrl = (url: string) => {
  const urlParts = url.split('/');
  const baseUrl = `${urlParts[0]}//${urlParts[2]}`; // Construct the base domain
  const paths = urlParts.slice(3); // Extract everything after the domain
  return [baseUrl, ...paths];
};

export function getCallbackUrl(url: string): string | null {
  const callbackUrlIndex = url.indexOf('?callbackUrl=');
  if (callbackUrlIndex !== -1) {
    return url.substring(callbackUrlIndex + 13); // 13 is the length of "?callbackUrl="
  }
  return null;
}

// ----------------------------------------

export const formatPN = (phoneNumber: string) => {
  try {
    const [countryCode, firstPart, secondPart, ...remainingDigits] =
      phoneNumber.split(' ');
    const formattedNumber = `${countryCode} (${firstPart}) ${secondPart}-${remainingDigits.join('')}`;
    return formattedNumber;
  } catch (error) {
    console.log('~ error:', error);
  }
  return phoneNumber;
};

// ----------------------------------------

export const regexUrl =
  /^https:\/\/(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}(?::\d{2,5})?(?:\/[^\s?#]*)?(?:\?[^\s#]*)?(?:#[^\s]*)?$/;

// export const regexSpecialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

/**
 * letters, spaces with only one space between words
 */
export const regexLetters01 = /^[a-zA-Zà-ÿÀ-ÿ0-9& ]+$/;

/**
 * letters, digits, spaces with only one space between words, underscores _, hyphens -, and periods .
 */
export const regexLetters02 =
  /^[a-zA-Zà-ÿÀ-ÿ0-9]+(?:[ _.-][a-zA-Zà-ÿÀ-ÿ0-9]+)*$/;

/**
 * Only letters and spaces are allowed.
 *
 * Only one space between words.
 *
 * The first letter after each space is capitalized.
 */
export const regexLetters03 = /^[A-Z][a-z]*(?:\s[A-Z][a-z]*)*$/;

export const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

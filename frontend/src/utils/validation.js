export const NAME_PATTERN = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;

export const sanitizeNameInput = (value) => value.replace(/[^A-Za-z\s]/g, '');

export const validateName = (value) => {
  const name = value.trim();
  if (!name) return 'Name is required';
  if (!NAME_PATTERN.test(name)) return 'Name can contain letters and spaces only';
  if (name.length < 2) return 'Name must be at least 2 characters';
  return '';
};
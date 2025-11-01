// Validadores para o cadastro de pets

export const validateRequired = (value: string): boolean => {
  return value && value.trim().length > 0;
};

export const validateMicrochip = (microchip: string): boolean => {
  if (!microchip) return true; // Opcional

  // Remove espaços e traços
  const cleaned = microchip.replace(/[\s-]/g, '');
  
  // Microchip deve ter 15 dígitos
  return /^\d{15}$/.test(cleaned);
};

export const validateWeight = (weight: number | undefined): boolean => {
  if (!weight) return true; // Opcional
  return weight > 0 && weight < 500; // Peso razoável
};

export const validateAge = (age: number | undefined): boolean => {
  if (!age) return true; // Opcional
  return age >= 0 && age < 50; // Idade razoável
};

export const validateBirthDate = (birthDate: string): boolean => {
  if (!birthDate) return true; // Opcional

  const date = new Date(birthDate);
  const today = new Date();
  
  // Data não pode ser futura
  if (date > today) return false;
  
  // Data não pode ser muito antiga (mais de 50 anos)
  const fiftyYearsAgo = new Date();
  fiftyYearsAgo.setFullYear(today.getFullYear() - 50);
  if (date < fiftyYearsAgo) return false;

  return true;
};

export const validatePetForm = (data: any): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Nome (obrigatório)
  if (!validateRequired(data.name)) {
    errors.name = 'Nome é obrigatório';
  }

  // Espécie (obrigatório)
  if (!validateRequired(data.species)) {
    errors.species = 'Espécie é obrigatória';
  }

  // Gênero (obrigatório)
  if (!validateRequired(data.gender)) {
    errors.gender = 'Sexo é obrigatório';
  }

  // Cliente (obrigatório)
  if (!validateRequired(data.customerId)) {
    errors.customerId = 'Cliente é obrigatório';
  }

  // Microchip (opcional, mas se preenchido deve ser válido)
  if (data.microchip && !validateMicrochip(data.microchip)) {
    errors.microchip = 'Microchip inválido (deve ter 15 dígitos)';
  }

  // Peso (opcional, mas se preenchido deve ser válido)
  if (data.weight && !validateWeight(data.weight)) {
    errors.weight = 'Peso inválido';
  }

  // Idade (opcional, mas se preenchida deve ser válida)
  if (data.age && !validateAge(data.age)) {
    errors.age = 'Idade inválida';
  }

  // Data de nascimento (opcional, mas se preenchida deve ser válida)
  if (data.birthDate && !validateBirthDate(data.birthDate)) {
    errors.birthDate = 'Data de nascimento inválida';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};




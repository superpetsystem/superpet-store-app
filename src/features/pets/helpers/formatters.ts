import { PetSpecies, PetSize, PetGender } from '../../../types';

// Formatadores para dados de pets

export const formatSpecies = (species: PetSpecies): string => {
  const speciesMap: Record<PetSpecies, string> = {
    dog: 'Cachorro',
    cat: 'Gato',
    bird: 'Pássaro',
    rabbit: 'Coelho',
    hamster: 'Hamster',
    other: 'Outro',
  };
  return speciesMap[species] || species;
};

export const formatSize = (size: PetSize | undefined): string => {
  if (!size) return '-';
  
  const sizeMap: Record<PetSize, string> = {
    small: 'Pequeno',
    medium: 'Médio',
    large: 'Grande',
    'extra-large': 'Extra Grande',
  };
  return sizeMap[size] || size;
};

export const formatGender = (gender: PetGender): string => {
  const genderMap: Record<PetGender, string> = {
    male: 'Macho',
    female: 'Fêmea',
  };
  return genderMap[gender] || gender;
};

export const formatWeight = (weight: number | undefined): string => {
  if (!weight) return '-';
  return `${weight.toFixed(1)} kg`;
};

export const formatAge = (age: number | undefined, birthDate?: string): string => {
  if (age !== undefined) {
    if (age === 0) return 'Menos de 1 ano';
    if (age === 1) return '1 ano';
    return `${age} anos`;
  }
  
  if (birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInYears = today.getFullYear() - birth.getFullYear();
    
    if (ageInYears === 0) return 'Menos de 1 ano';
    if (ageInYears === 1) return '1 ano';
    return `${ageInYears} anos`;
  }
  
  return '-';
};

export const formatBirthDate = (birthDate: string | undefined): string => {
  if (!birthDate) return '-';
  
  const date = new Date(birthDate);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatMicrochip = (microchip: string | undefined): string => {
  if (!microchip) return '-';
  
  // Formata como: 123 456 789 012 345
  const cleaned = microchip.replace(/\D/g, '');
  if (cleaned.length === 15) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4 $5');
  }
  
  return microchip;
};

export const formatNeutered = (neutered: boolean | undefined): string => {
  if (neutered === undefined) return '-';
  return neutered ? 'Sim' : 'Não';
};

export const formatList = (list: string[] | undefined): string => {
  if (!list || list.length === 0) return 'Nenhuma';
  return list.join(', ');
};

export const getSpeciesIcon = (species: PetSpecies): string => {
  const iconMap: Record<PetSpecies, string> = {
    dog: '🐕',
    cat: '🐈',
    bird: '🐦',
    rabbit: '🐰',
    hamster: '🐹',
    other: '🐾',
  };
  return iconMap[species] || '🐾';
};

export const getSpeciesColor = (species: PetSpecies): string => {
  const colorMap: Record<PetSpecies, string> = {
    dog: '#E47B24',
    cat: '#9C27B0',
    bird: '#2196F3',
    rabbit: '#4CAF50',
    hamster: '#FF9800',
    other: '#757575',
  };
  return colorMap[species] || '#757575';
};

export const getSizeColor = (size: PetSize | undefined): string => {
  if (!size) return '#757575';
  
  const colorMap: Record<PetSize, string> = {
    small: '#4CAF50',
    medium: '#2196F3',
    large: '#FF9800',
    'extra-large': '#F44336',
  };
  return colorMap[size] || '#757575';
};

export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  const ageInYears = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return ageInYears - 1;
  }
  
  return ageInYears;
};

export const getInitials = (name: string): string => {
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};




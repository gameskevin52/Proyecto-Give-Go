export class OrganizationValidators {
  static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static isValidNIT(nit: string): boolean {
    const regex = /^\d{10}$/;
    return regex.test(nit);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  static isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  static validateOrganization(data: any): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    if (!this.isRequired(data.nombre)) {
      errors.nombre = 'El nombre es obligatorio';
    }
    
    if (!this.isRequired(data.nit)) {
      errors.nit = 'El NIT es obligatorio';
    } else if (!this.isValidNIT(data.nit)) {
      errors.nit = 'El NIT debe tener 10 dígitos';
    }
    
    if (!this.isRequired(data.direccion)) {
      errors.direccion = 'La dirección es obligatoria';
    }
    
    if (!this.isRequired(data.email)) {
      errors.email = 'El email es obligatorio';
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!this.isRequired(data.password)) {
      errors.password = 'La contraseña es obligatoria';
    } else if (!this.isValidPassword(data.password)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    return { valid: Object.keys(errors).length === 0, errors };
  }
}
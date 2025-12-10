// Template Engine for processing contract templates with variable substitution

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'address' | 'select';
  required: boolean;
  description?: string;
  options?: string[]; // For select type
  defaultValue?: string;
  format?: string; // For date formatting
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: 'membership' | 'training' | 'corporate' | 'trial' | 'custom';
  content: string; // HTML content with template variables
  variables: TemplateVariable[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  version: number;
}

// Predefined template variables that are commonly used
export const COMMON_VARIABLES: TemplateVariable[] = [
  {
    key: 'client.name',
    label: 'Client Full Name',
    type: 'text',
    required: true,
    description: 'Full name of the client'
  },
  {
    key: 'client.email',
    label: 'Client Email',
    type: 'email',
    required: true,
    description: 'Client email address'
  },
  {
    key: 'client.phone',
    label: 'Client Phone',
    type: 'phone',
    required: true,
    description: 'Client contact phone number'
  },
  {
    key: 'client.address',
    label: 'Client Address',
    type: 'address',
    required: false,
    description: 'Client residential address'
  },
  {
    key: 'gym.name',
    label: 'Gym Name',
    type: 'text',
    required: true,
    description: 'Name of the gym'
  },
  {
    key: 'gym.address',
    label: 'Gym Address',
    type: 'address',
    required: true,
    description: 'Gym business address'
  },
  {
    key: 'gym.phone',
    label: 'Gym Phone',
    type: 'phone',
    required: true,
    description: 'Gym contact phone number'
  },
  {
    key: 'gym.email',
    label: 'Gym Email',
    type: 'email',
    required: true,
    description: 'Gym business email'
  },
  {
    key: 'contract.startDate',
    label: 'Contract Start Date',
    type: 'date',
    required: true,
    format: 'DD/MM/YYYY',
    description: 'When the contract begins'
  },
  {
    key: 'contract.endDate',
    label: 'Contract End Date',
    type: 'date',
    required: true,
    format: 'DD/MM/YYYY',
    description: 'When the contract expires'
  },
  {
    key: 'contract.duration',
    label: 'Contract Duration',
    type: 'select',
    required: true,
    options: ['1 Month', '3 Months', '6 Months', '12 Months', '24 Months'],
    description: 'Length of the contract'
  },
  {
    key: 'membership.type',
    label: 'Membership Type',
    type: 'select',
    required: true,
    options: ['Basic', 'Premium', 'VIP', 'Corporate', 'Student'],
    description: 'Type of membership plan'
  },
  {
    key: 'membership.price',
    label: 'Membership Price',
    type: 'number',
    required: true,
    description: 'Monthly membership fee'
  },
  {
    key: 'today',
    label: 'Today\'s Date',
    type: 'date',
    required: false,
    format: 'DD/MM/YYYY',
    defaultValue: 'current_date',
    description: 'Current date when contract is generated'
  },
  {
    key: 'trainer.name',
    label: 'Personal Trainer Name',
    type: 'text',
    required: false,
    description: 'Name of assigned personal trainer'
  },
  {
    key: 'payment.method',
    label: 'Payment Method',
    type: 'select',
    required: true,
    options: ['Monthly Direct Debit', 'Credit Card', 'Bank Transfer', 'Cash', 'Cheque'],
    description: 'Preferred payment method'
  }
];

// Template processing functions
export class TemplateEngine {
  
  /**
   * Process template content by replacing variables with actual values
   */
  static processTemplate(
    template: ContractTemplate, 
    variables: Record<string, any>
  ): string {
    let processedContent = template.content;
    
    // Replace each variable in the template
    template.variables.forEach(variable => {
      const value = variables[variable.key];
      
      if (value !== undefined) {
        const formattedValue = this.formatValue(value, variable);
        // Replace {{variable.key}} with actual value
        const regex = new RegExp(`{{\\s*${this.escapeRegExp(variable.key)}\\s*}}`, 'g');
        processedContent = processedContent.replace(regex, formattedValue);
      } else if (variable.required) {
        // Keep placeholder for required missing variables
        const regex = new RegExp(`{{\\s*${this.escapeRegExp(variable.key)}\\s*}}`, 'g');
        processedContent = processedContent.replace(
          regex, 
          `<span class="missing-variable" style="background-color: #fff2f0; color: #ff4d4f; padding: 2px 6px; border-radius: 4px;">[${variable.label} - Required]</span>`
        );
      }
    });
    
    // Handle default values for missing optional variables
    template.variables.forEach(variable => {
      if (variable.defaultValue && variables[variable.key] === undefined) {
        let defaultValue = variable.defaultValue;
        
        // Handle special default values
        if (defaultValue === 'current_date') {
          defaultValue = this.formatDate(new Date(), variable.format || 'DD/MM/YYYY');
        }
        
        const regex = new RegExp(`{{\\s*${this.escapeRegExp(variable.key)}\\s*}}`, 'g');
        processedContent = processedContent.replace(regex, defaultValue);
      }
    });
    
    return processedContent;
  }

  /**
   * Extract all variable placeholders from template content
   */
  static extractVariables(content: string): string[] {
    const regex = /{{(.*?)}}/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const variableKey = match[1].trim();
      if (!matches.includes(variableKey)) {
        matches.push(variableKey);
      }
    }
    
    return matches;
  }

  /**
   * Validate template variables against available data
   */
  static validateTemplate(
    template: ContractTemplate, 
    variables: Record<string, any>
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    template.variables.forEach(variable => {
      if (variable.required && !variables[variable.key]) {
        errors.push(`Missing required variable: ${variable.label}`);
      }
      
      if (variables[variable.key]) {
        const validationError = this.validateVariableValue(
          variables[variable.key], 
          variable
        );
        if (validationError) {
          errors.push(`${variable.label}: ${validationError}`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format value based on variable type
   */
  private static formatValue(value: any, variable: TemplateVariable): string {
    switch (variable.type) {
      case 'date':
        return this.formatDate(new Date(value), variable.format || 'DD/MM/YYYY');
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      case 'phone':
        return this.formatPhone(String(value));
      case 'email':
        return String(value).toLowerCase();
      default:
        return String(value);
    }
  }

  /**
   * Validate individual variable value
   */
  private static validateVariableValue(
    value: any, 
    variable: TemplateVariable
  ): string | null {
    switch (variable.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          return 'Invalid email format';
        }
        break;
      case 'phone':
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(String(value))) {
          return 'Invalid phone format';
        }
        break;
      case 'number':
        if (isNaN(Number(value))) {
          return 'Must be a valid number';
        }
        break;
      case 'date':
        if (isNaN(new Date(value).getTime())) {
          return 'Invalid date format';
        }
        break;
      case 'select':
        if (variable.options && !variable.options.includes(String(value))) {
          return `Must be one of: ${variable.options.join(', ')}`;
        }
        break;
    }
    return null;
  }

  /**
   * Format date according to specified format
   */
  private static formatDate(date: Date, format: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  }

  /**
   * Format phone number
   */
  private static formatPhone(phone: string): string {
    // Simple phone formatting - can be enhanced
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }

  /**
   * Escape special regex characters
   */
  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Generate preview with sample data
   */
  static generatePreview(template: ContractTemplate): string {
    const sampleData: Record<string, any> = {};
    
    template.variables.forEach(variable => {
      switch (variable.type) {
        case 'text':
          sampleData[variable.key] = variable.key.includes('name') ? 'John Doe' : 'Sample Text';
          break;
        case 'email':
          sampleData[variable.key] = 'john.doe@example.com';
          break;
        case 'phone':
          sampleData[variable.key] = '(555) 123-4567';
          break;
        case 'address':
          sampleData[variable.key] = '123 Main Street, City, State 12345';
          break;
        case 'number':
          sampleData[variable.key] = variable.key.includes('price') ? '99.99' : '1';
          break;
        case 'date':
          sampleData[variable.key] = new Date();
          break;
        case 'select':
          sampleData[variable.key] = variable.options?.[0] || 'Option 1';
          break;
      }
    });
    
    return this.processTemplate(template, sampleData);
  }
}

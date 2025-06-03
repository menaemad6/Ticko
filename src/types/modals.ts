
export interface TaskTemplatesModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onTemplateSelect?: (templateName: string) => void;
}

export interface PreferencesModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

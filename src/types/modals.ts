
export interface TaskTemplatesModalProps {
  onTemplateSelect?: (templateName: string) => void;
}

export interface PreferencesModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  required = false,
  helperText,
  containerStyle,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredStar}> *</Text>}
      </View>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          rest.multiline ? styles.multilineInput : null,
          style,
        ]}
        placeholderTextColor="#94A3B8"
        {...rest}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  requiredStar: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  helperText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
});

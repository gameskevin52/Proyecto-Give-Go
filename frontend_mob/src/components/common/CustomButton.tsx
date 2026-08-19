import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        getVariantStyle(),
        (disabled || isLoading) && styles.disabledButton,
        pressed && styles.pressed,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'outline' ? '#DC2626' : '#FFFFFF'}
        />
      ) : (
        <Text style={[styles.text, getVariantTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: '#DC2626', // Rojo Give & Go
  },
  secondaryButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    elevation: 0,
    shadowOpacity: 0,
  },
  dangerButton: {
    backgroundColor: '#B91C1C',
  },
  disabledButton: {
    opacity: 0.55,
    elevation: 0,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#DC2626',
  },
  outlineText: {
    color: '#475569',
  },
});

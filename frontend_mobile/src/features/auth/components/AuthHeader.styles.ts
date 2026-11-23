import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../config/theme';

export const authHeaderStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.xs,
  },
  badgeWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FECACA',
  },
  tag: {
    marginTop: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.8,
  },
  brandTitleHighlight: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.8,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 260,
  },
});

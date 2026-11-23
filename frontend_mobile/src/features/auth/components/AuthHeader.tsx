import React from 'react';
import { View, Text } from 'react-native';
import { Heart } from 'lucide-react-native';
import { authHeaderStyles } from './AuthHeader.styles';

export const AuthHeader: React.FC = () => {
  return (
    <View style={authHeaderStyles.container}>
      <View style={authHeaderStyles.badgeWrapper}>
        <View style={authHeaderStyles.logoBox}>
          <Heart size={28} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2.5} />
        </View>
        <View style={authHeaderStyles.tag}>
          <Text style={authHeaderStyles.tagText}>Bogota Solidaria</Text>
        </View>
      </View>
      <View style={authHeaderStyles.brandTitleRow}>
        <Text style={authHeaderStyles.brandTitle}>Give</Text>
        <Text style={authHeaderStyles.brandTitleHighlight}>&Go</Text>
      </View>
      <Text style={authHeaderStyles.brandSubtitle}>
        Plataforma comunitaria de impacto y voluntariado
      </Text>
    </View>
  );
};

export default AuthHeader;

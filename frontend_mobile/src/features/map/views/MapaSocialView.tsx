import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Building2,
  Calendar,
  Search,
  Filter,
  Navigation,
  Heart,
  ChevronRight,
  List,
  Map as MapIcon,
  ShieldCheck,
  Phone,
  X,
  RotateCcw,
  SlidersHorizontal,
  Check,
} from 'lucide-react-native';
import { colors } from '../../../config/theme';
import { useMapController } from '../controllers/useMapController';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';
import { MobileOpenStreetMap } from '../components/MobileOpenStreetMap';

const { width } = Dimensions.get('window');

interface MapaSocialViewProps {
  navigation: any;
}

export const MapaSocialView: React.FC<MapaSocialViewProps> = ({ navigation }) => {
  const {
    items,
    allItems,
    allItemsCount,
    orgsCount,
    eventsCount,
    closestItem,
    selectedItem,
    setSelectedItem,
    centerCoords,
    focusOnItem,
    focusOnClosestItem,
    focusOnUserLocation,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    maxDistance,
    setMaxDistance,
    selectedCategory,
    setSelectedCategory,
    availableCategories,
    resetFilters,
    viewMode,
    setViewMode,
    isLoading,
    userLocation,
    isLocating,
    handleSelectItem,
    handleDonateToOrg,
    handleViewEvent,
  } = useMapController(navigation);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Active filters count
  const activeFilterCount =
    (filterType !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (maxDistance !== 0 ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header & Compact Controls */}
      <View style={styles.topBar}>
        {/* Row 1: Search + Filter button + View Mode Toggle */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por sede, evento o barrio..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{ padding: 4 }}
              >
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter modal toggle button */}
          <TouchableOpacity
            style={[styles.headerIconButton, hasActiveFilters && styles.headerIconButtonActive]}
            onPress={() => setIsFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <Filter size={18} color={hasActiveFilters ? '#FFFFFF' : '#334155'} />
            {activeFilterCount > 0 && (
              <View style={styles.activeFilterDot}>
                <Text style={styles.activeFilterDotText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* View mode toggle (Map <-> List) */}
          <TouchableOpacity
            style={[styles.headerIconButton, viewMode === 'list' && styles.headerIconButtonActive]}
            onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            activeOpacity={0.7}
          >
            {viewMode === 'map' ? (
              <List size={18} color="#334155" />
            ) : (
              <MapIcon size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Row 2: Compact Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsScroll}
        >
          {/* Todos */}
          <TouchableOpacity
            style={[
              styles.pill,
              filterType === 'all' && maxDistance === 0 && selectedCategory === 'all' && styles.pillActive,
            ]}
            onPress={() => {
              setFilterType('all');
              setSelectedCategory('all');
              setMaxDistance(0);
            }}
          >
            <Text
              style={[
                styles.pillText,
                filterType === 'all' && maxDistance === 0 && selectedCategory === 'all' && styles.pillTextActive,
              ]}
            >
              Todos ({allItemsCount})
            </Text>
          </TouchableOpacity>

          {/* Sedes / Organizaciones */}
          <TouchableOpacity
            style={[styles.pill, filterType === 'organizacion' && styles.pillActiveOrg]}
            onPress={() => setFilterType(filterType === 'organizacion' ? 'all' : 'organizacion')}
          >
            <Building2
              size={13}
              color={filterType === 'organizacion' ? '#FFFFFF' : '#2563EB'}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.pillText,
                filterType === 'organizacion' && styles.pillTextActive,
              ]}
            >
              Sedes ({orgsCount})
            </Text>
          </TouchableOpacity>

          {/* Eventos */}
          <TouchableOpacity
            style={[styles.pill, filterType === 'evento' && styles.pillActiveEvent]}
            onPress={() => setFilterType(filterType === 'evento' ? 'all' : 'evento')}
          >
            <Calendar
              size={13}
              color={filterType === 'evento' ? '#FFFFFF' : '#DC2626'}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.pillText,
                filterType === 'evento' && styles.pillTextActive,
              ]}
            >
              Eventos ({eventsCount})
            </Text>
          </TouchableOpacity>

          {/* Quick Distance: < 3 km */}
          <TouchableOpacity
            style={[styles.pill, maxDistance === 3 && styles.pillActive]}
            onPress={() => setMaxDistance(maxDistance === 3 ? 0 : 3)}
          >
            <Navigation
              size={12}
              color={maxDistance === 3 ? '#FFFFFF' : '#0284C7'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.pillText, maxDistance === 3 && styles.pillTextActive]}>
              Cerca (&lt; 3 km)
            </Text>
          </TouchableOpacity>

          {/* Quick Distance: < 5 km */}
          <TouchableOpacity
            style={[styles.pill, maxDistance === 5 && styles.pillActive]}
            onPress={() => setMaxDistance(maxDistance === 5 ? 0 : 5)}
          >
            <Text style={[styles.pillText, maxDistance === 5 && styles.pillTextActive]}>
              &lt; 5 km
            </Text>
          </TouchableOpacity>

          {/* Advanced Filter Button */}
          <TouchableOpacity
            style={[styles.pill, (selectedCategory !== 'all' || maxDistance > 5) && styles.pillActive]}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <SlidersHorizontal
              size={12}
              color={selectedCategory !== 'all' || maxDistance > 5 ? '#FFFFFF' : '#64748B'}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.pillText,
                (selectedCategory !== 'all' || maxDistance > 5) && styles.pillTextActive,
              ]}
            >
              {selectedCategory !== 'all' ? selectedCategory : 'Filtros'}
            </Text>
          </TouchableOpacity>

          {/* Reset Filters Pill if active */}
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearPill} onPress={resetFilters}>
              <RotateCcw size={12} color="#DC2626" style={{ marginRight: 4 }} />
              <Text style={styles.clearPillText}>Limpiar</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Row 3: Closest location highlight banner */}
        {closestItem && (
          <TouchableOpacity
            style={styles.closestBanner}
            onPress={() => focusOnItem(closestItem)}
            activeOpacity={0.85}
          >
            <View style={styles.closestIconWrapper}>
              <MapPin size={13} color="#059669" />
            </View>
            <View style={{ flex: 1, paddingRight: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.closestTag}>MÁS CERCANO A TI</Text>
                {closestItem.distanciaKm !== undefined && (
                  <Text style={styles.closestDistText}>a {closestItem.distanciaKm} km</Text>
                )}
              </View>
              <Text style={styles.closestTitle} numberOfLines={1}>
                {closestItem.titulo}
              </Text>
            </View>
            <View style={styles.closestActionBtn}>
              <Text style={styles.closestActionText}>Ver</Text>
              <ChevronRight size={13} color="#059669" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content Area */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <AppLoader message="Cargando mapa social..." />
        </View>
      ) : viewMode === 'map' ? (
        /* Map View Mode: 100% Static & Native, NO outer ScrollView */
        <View style={styles.mapWrapper}>
          <MobileOpenStreetMap
            items={items}
            selectedItem={selectedItem}
            onSelectItem={handleSelectItem}
            userLocation={userLocation}
            centerCoords={centerCoords}
            style={styles.fullMap}
          />

          {/* Floating Google Maps Style Locate FAB */}
          <TouchableOpacity
            style={[styles.floatingGpsButton, isLocating && styles.floatingGpsButtonActive]}
            onPress={focusOnUserLocation}
            activeOpacity={0.8}
            accessibilityLabel="Actualizar mi ubicación GPS"
          >
            {isLocating ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Navigation size={22} color="#2563EB" />
            )}
          </TouchableOpacity>

          {/* Floating Map Legend Pill */}
          <View style={styles.floatingLegendPill}>
            <View style={styles.legendDotItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
              <Text style={styles.legendDotText}>Sedes ({orgsCount})</Text>
            </View>
            <View style={styles.legendSeparator} />
            <View style={styles.legendDotItem}>
              <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
              <Text style={styles.legendDotText}>Eventos ({eventsCount})</Text>
            </View>
            {userLocation && (
              <>
                <View style={styles.legendSeparator} />
                <View style={styles.legendDotItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#059669' }]} />
                  <Text style={[styles.legendDotText, { color: '#059669' }]}>Tú</Text>
                </View>
              </>
            )}
          </View>

          {/* Floating Bottom Card for Selected Item (Google Maps / Airbnb style) */}
          {selectedItem ? (
            <View style={styles.bottomCardContainer}>
              <View style={styles.dragIndicator} />

              {/* Header: Type Badge + Distance + Close */}
              <View style={styles.bottomCardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                  <View
                    style={[
                      styles.typeBadge,
                      selectedItem.tipo === 'organizacion' ? styles.typeBadgeOrg : styles.typeBadgeEvent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        selectedItem.tipo === 'organizacion'
                          ? styles.typeBadgeTextOrg
                          : styles.typeBadgeTextEvent,
                      ]}
                    >
                      {selectedItem.tipo === 'organizacion'
                        ? 'SEDE DE ORGANIZACIÓN'
                        : 'CONVOCATORIA SOLIDARIA'}
                    </Text>
                  </View>

                  {selectedItem.verificada && (
                    <View style={styles.verifiedBadge}>
                      <ShieldCheck size={11} color="#1D4ED8" />
                      <Text style={styles.verifiedBadgeText}>Verificada</Text>
                    </View>
                  )}

                  {selectedItem.distanciaKm !== undefined && (
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceBadgeText}>
                        a {selectedItem.distanciaKm} km
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedItem(null)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.closeButton}
                >
                  <X size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Title & Description */}
              <Text style={styles.bottomCardTitle} numberOfLines={2}>
                {selectedItem.titulo}
              </Text>

              {/* Address / Neighborhood */}
              <View style={styles.bottomCardInfoRow}>
                <MapPin size={13} color="#64748B" style={{ marginRight: 5 }} />
                <Text style={styles.bottomCardInfoText} numberOfLines={1}>
                  {selectedItem.direccion}
                  {selectedItem.barrio ? ` • Barrio ${selectedItem.barrio}` : ''}
                </Text>
              </View>

              {/* Meta: Schedule or Phone */}
              {selectedItem.tipo === 'evento' && selectedItem.fecha ? (
                <View style={styles.bottomCardInfoRow}>
                  <Calendar size={13} color="#64748B" style={{ marginRight: 5 }} />
                  <Text style={styles.bottomCardInfoText}>
                    {selectedItem.fecha} • {selectedItem.hora || '08:00'}
                    {selectedItem.cupos_disponibles !== undefined
                      ? ` • ${selectedItem.cupos_disponibles} cupos libres`
                      : ''}
                  </Text>
                </View>
              ) : selectedItem.tipo === 'organizacion' && selectedItem.telefono ? (
                <View style={styles.bottomCardInfoRow}>
                  <Phone size={13} color="#64748B" style={{ marginRight: 5 }} />
                  <Text style={styles.bottomCardInfoText}>{selectedItem.telefono}</Text>
                </View>
              ) : null}

              {/* Action Buttons Row */}
              <View style={styles.bottomCardActionsRow}>
                <TouchableOpacity
                  style={styles.actionButtonSecondary}
                  onPress={() => focusOnItem(selectedItem)}
                  activeOpacity={0.8}
                >
                  <Navigation size={14} color="#2563EB" style={{ marginRight: 4 }} />
                  <Text style={styles.actionButtonSecondaryText}>Centrar</Text>
                </TouchableOpacity>

                {selectedItem.tipo === 'organizacion' ? (
                  <TouchableOpacity
                    style={styles.actionButtonPrimaryOrg}
                    onPress={() => handleDonateToOrg(selectedItem.id)}
                    activeOpacity={0.8}
                  >
                    <Heart size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.actionButtonPrimaryText}>Donar a esta ONG</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.actionButtonPrimaryEvent}
                    onPress={() => handleViewEvent(selectedItem.id)}
                    activeOpacity={0.8}
                  >
                    <Calendar size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.actionButtonPrimaryText}>Ver Convocatoria</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.floatingHintBar}>
              <Text style={styles.floatingHintText}>
                💡 Toca cualquier marcador en el mapa para ver la sede o evento social
              </Text>
            </View>
          )}
        </View>
      ) : (
        /* List Mode: Scrollable list of cards matching web parity */
        <ScrollView
          style={styles.listScrollView}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.listHeaderSummary}>
            <Text style={styles.listHeaderCount}>
              Mostrando {items.length} {items.length === 1 ? 'ubicación' : 'ubicaciones'}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity onPress={resetFilters} style={styles.listResetFiltersBtn}>
                <Text style={styles.listResetFiltersText}>Restablecer filtros</Text>
              </TouchableOpacity>
            )}
          </View>

          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No se encontraron ubicaciones</Text>
              <Text style={styles.emptySubtitle}>
                Prueba ajustando los filtros de búsqueda, categoría o distancia.
              </Text>
              <TouchableOpacity style={styles.emptyResetBtn} onPress={resetFilters}>
                <Text style={styles.emptyResetBtnText}>Ver todas las ubicaciones</Text>
              </TouchableOpacity>
            </View>
          ) : (
            items.map((item) => {
              const isOrg = item.tipo === 'organizacion';
              return (
                <TouchableOpacity
                  key={String(item.id)}
                  style={styles.listCard}
                  onPress={() => {
                    handleSelectItem(item);
                    setViewMode('map');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.listCardContent}>
                    {/* Tag Row */}
                    <View style={styles.listCardTagRow}>
                      <View
                        style={[
                          styles.listTypeBadge,
                          { backgroundColor: isOrg ? '#EFF6FF' : '#FEF2F2' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.listTypeBadgeText,
                            { color: isOrg ? '#1D4ED8' : '#DC2626' },
                          ]}
                        >
                          {isOrg ? 'Organización' : 'Evento Solidario'}
                        </Text>
                      </View>

                      {item.categoria ? (
                        <View style={styles.listCategoryBadge}>
                          <Text style={styles.listCategoryBadgeText}>{item.categoria}</Text>
                        </View>
                      ) : null}

                      {item.distanciaKm !== undefined && (
                        <Text style={styles.listDistanceText}>
                          a {item.distanciaKm} km
                        </Text>
                      )}
                    </View>

                    {/* Title */}
                    <Text style={styles.listCardTitle}>{item.titulo}</Text>

                    {/* Address */}
                    <View style={styles.listCardAddressRow}>
                      <MapPin size={13} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.listCardAddressText} numberOfLines={1}>
                        {item.direccion} • {item.barrio || 'Kennedy'}
                      </Text>
                    </View>

                    {/* Extra Info */}
                    {item.tipo === 'evento' && item.fecha ? (
                      <View style={styles.listCardAddressRow}>
                        <Calendar size={13} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={styles.listCardAddressText}>
                          {item.fecha} • {item.cupos_disponibles || 15} cupos
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.listCardRightAction}>
                    <ChevronRight size={18} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Filter Modal Dialog */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Filtrar Mapa Social</Text>
                <Text style={styles.modalSubtitle}>Ajusta los filtros según tus preferencias</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsFilterModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Type Filter */}
              <Text style={styles.modalSectionTitle}>Tipo de Marcador</Text>
              <View style={styles.modalOptionsRow}>
                {[
                  { key: 'all', label: 'Todos' },
                  { key: 'organizacion', label: '🏢 Sedes ONG' },
                  { key: 'evento', label: '📅 Eventos' },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.modalOptionPill,
                      filterType === opt.key && styles.modalOptionPillActive,
                    ]}
                    onPress={() => setFilterType(opt.key as any)}
                  >
                    <Text
                      style={[
                        styles.modalOptionPillText,
                        filterType === opt.key && styles.modalOptionPillTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Distance Range */}
              <Text style={styles.modalSectionTitle}>Radio de Distancia</Text>
              <View style={styles.modalOptionsWrap}>
                {[
                  { value: 0, label: 'Sin límite' },
                  { value: 1, label: '< 1 km' },
                  { value: 3, label: '< 3 km' },
                  { value: 5, label: '< 5 km' },
                  { value: 10, label: '< 10 km' },
                  { value: 20, label: '< 20 km' },
                ].map((dist) => (
                  <TouchableOpacity
                    key={dist.value}
                    style={[
                      styles.modalOptionPill,
                      maxDistance === dist.value && styles.modalOptionPillActive,
                    ]}
                    onPress={() => setMaxDistance(dist.value)}
                  >
                    <Text
                      style={[
                        styles.modalOptionPillText,
                        maxDistance === dist.value && styles.modalOptionPillTextActive,
                      ]}
                    >
                      {dist.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Categories */}
              {availableCategories.length > 0 && (
                <>
                  <Text style={styles.modalSectionTitle}>Categoría</Text>
                  <View style={styles.modalOptionsWrap}>
                    <TouchableOpacity
                      style={[
                        styles.modalOptionPill,
                        selectedCategory === 'all' && styles.modalOptionPillActive,
                      ]}
                      onPress={() => setSelectedCategory('all')}
                    >
                      <Text
                        style={[
                          styles.modalOptionPillText,
                          selectedCategory === 'all' && styles.modalOptionPillTextActive,
                        ]}
                      >
                        Todas las categorías
                      </Text>
                    </TouchableOpacity>
                    {availableCategories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.modalOptionPill,
                          selectedCategory.toLowerCase() === cat.toLowerCase() &&
                            styles.modalOptionPillActive,
                        ]}
                        onPress={() => setSelectedCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.modalOptionPillText,
                            selectedCategory.toLowerCase() === cat.toLowerCase() &&
                              styles.modalOptionPillTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalResetBtn}
                onPress={() => {
                  resetFilters();
                  setIsFilterModalVisible(false);
                }}
              >
                <Text style={styles.modalResetBtnText}>Restablecer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalApplyBtn}
                onPress={() => setIsFilterModalVisible(false)}
              >
                <Text style={styles.modalApplyBtnText}>Aplicar ({items.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Top Bar */
  topBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    zIndex: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerIconButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  activeFilterDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  activeFilterDotText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  /* Filter Pills */
  filterPillsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  pillActiveOrg: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  pillActiveEvent: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  clearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#FEE2E2',
  },
  clearPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },

  /* Closest Location Banner */
  closestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6,
  },
  closestIconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  closestTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  closestDistText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  closestTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#14532D',
  },
  closestActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  closestActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },

  /* Map View Wrapper (Static) */
  mapWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  fullMap: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  /* Floating Locate FAB */
  floatingGpsButton: {
    position: 'absolute',
    right: 16,
    bottom: 240,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  floatingGpsButtonActive: {
    backgroundColor: '#EFF6FF',
  },

  /* Floating Legend Pill */
  floatingLegendPill: {
    position: 'absolute',
    left: 14,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 25,
  },
  legendDotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendDotText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#334155',
  },
  legendSeparator: {
    width: 1,
    height: 10,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 6,
  },

  /* Floating Bottom Sheet Card */
  bottomCardContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 35,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  bottomCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeOrg: {
    backgroundColor: '#DBEAFE',
  },
  typeBadgeEvent: {
    backgroundColor: '#FEE2E2',
  },
  typeBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  typeBadgeTextOrg: {
    color: '#1D4ED8',
  },
  typeBadgeTextEvent: {
    color: '#B91C1C',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  distanceBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  distanceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  closeButton: {
    padding: 4,
  },
  bottomCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    lineHeight: 19,
  },
  bottomCardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  bottomCardInfoText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  bottomCardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  actionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  actionButtonSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  actionButtonPrimaryOrg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  actionButtonPrimaryEvent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#DC2626',
  },
  actionButtonPrimaryText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  floatingHintBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: 'center',
    zIndex: 20,
  },
  floatingHintText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
    textAlign: 'center',
  },

  /* List Mode Styles */
  listScrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContentContainer: {
    padding: 12,
    paddingBottom: 40,
  },
  listHeaderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  listHeaderCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  listResetFiltersBtn: {
    paddingVertical: 2,
  },
  listResetFiltersText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  listCardContent: {
    flex: 1,
  },
  listCardTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  listTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listTypeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  listCategoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listCategoryBadgeText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  listDistanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 'auto',
  },
  listCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  listCardAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  listCardAddressText: {
    fontSize: 12,
    color: '#64748B',
  },
  listCardRightAction: {
    paddingLeft: 8,
  },

  /* Empty State */
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyResetBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyResetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Filter Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 16,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  modalOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  modalOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  modalOptionPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalOptionPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  modalOptionPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  modalOptionPillTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modalResetBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  modalResetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  modalApplyBtn: {
    flex: 1.5,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalApplyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

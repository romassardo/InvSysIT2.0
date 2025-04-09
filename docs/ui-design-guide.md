# Guía de Diseño UI: Dashboard de Gestión de Inventario en React

## Índice

1. [Sistema Visual](#1-sistema-visual)
2. [Componentes UI](#2-componentes-ui)
3. [Patrones de Interfaz](#3-patrones-de-interfaz)
4. [Iconografía](#4-iconografía)
5. [Estados Visuales](#5-estados-visuales)
6. [Diseño Responsive](#6-diseño-responsive)
7. [Implementación en Nuevas Páginas](#7-implementación-en-nuevas-páginas)

## 1. Sistema Visual

### 1.1 Paleta de Colores

La aplicación utiliza una paleta de colores vibrante pero profesional, definida en el objeto `theme`:

| Variable | Color | Código Hex | Uso |
|----------|-------|------------|-----|
| `primary` | Violeta | `#6200EA` | Acento principal, botones, enlaces |
| `primaryLight` | Violeta claro | `rgba(98, 0, 234, 0.1)` | Fondos, estados hover |
| `secondary` | Verde | `#00C853` | Confirmaciones, indicadores positivos |
| `secondaryLight` | Verde claro | `rgba(0, 200, 83, 0.1)` | Fondos para badges positivos |
| `accent` | Naranja | `#FF5722` | Notificaciones, badges importantes |
| `warning` | Amarillo | `#FFC107` | Alertas, advertencias |
| `warningLight` | Amarillo claro | `rgba(255, 193, 7, 0.1)` | Fondos para alertas |
| `danger` | Rojo | `#F44336` | Errores, acciones destructivas |
| `dangerLight` | Rojo claro | `rgba(244, 67, 54, 0.1)` | Fondos para errores |
| `background` | Gris claro | `#f8f9fc` | Fondo principal |
| `cardBg` | Blanco | `#ffffff` | Fondo de tarjetas |
| `textPrimary` | Gris oscuro | `#333333` | Texto principal |
| `textSecondary` | Gris medio | `#666666` | Texto secundario |
| `textMuted` | Gris claro | `#888888` | Texto de menor importancia |

#### Gradientes
- **Sidebar**: Degradado vertical de `primary` a `#4527A0`

### 1.2 Tipografía

| Elemento | Familia | Tamaño | Peso | Uso |
|----------|---------|--------|------|-----|
| Fuente principal | 'Nunito' | - | - | Toda la aplicación |
| Fuentes de respaldo | 'Segoe UI', 'Roboto', sans-serif | - | - | Si Nunito no está disponible |
| Título de página | Nunito | `1.8rem` (28.8px) | 800 | Encabezados principales |
| Título de sección | Nunito | `1.25rem` (20px) | 700 | Títulos de tarjetas |
| Valor de estadística | Nunito | `2rem` (32px) | 800 | Números destacados |
| Texto regular | Nunito | `0.95rem` (15.2px) | 400 | Texto general |
| Texto pequeño | Nunito | `0.85rem` (13.6px) | 400/600 | Etiquetas, metadata |
| Texto muy pequeño | Nunito | `0.8rem` (12.8px) | 400 | Información secundaria |

### 1.3 Espaciado

Sistema de espaciado consistente:

| Variable | Tamaño | Uso |
|----------|--------|-----|
| `spacing.xs` | `0.5rem` (8px) | Espaciado mínimo entre elementos relacionados |
| `spacing.sm` | `0.75rem` (12px) | Espaciado entre elementos cercanos |
| `spacing.md` | `1rem` (16px) | Espaciado estándar |
| `spacing.lg` | `1.5rem` (24px) | Espaciado entre secciones |
| `spacing.xl` | `2rem` (32px) | Espaciado de márgenes de página |

#### Padding estándar:
- **Tarjetas**: `1.5rem` (24px)
- **Headers de tarjetas**: `1.25rem 1.5rem` (20px vertical, 24px horizontal)
- **Botones**: `0.75rem 1.25rem` (12px vertical, 20px horizontal)
- **Botones de icono**: igual padding en todos lados para forma cuadrada

### 1.4 Bordes y Radios

| Variable | Valor | Uso |
|----------|-------|-----|
| `borderRadius.sm` | `8px` | Botones, pequeños elementos UI |
| `borderRadius.md` | `14px` | Tarjetas, contenedores principales |
| `borderRadius.full` | `9999px` | Elementos circulares, badges |

### 1.5 Sombras

| Variable | Valor | Uso |
|----------|-------|-----|
| `shadows.sm` | `0 2px 5px rgba(0, 0, 0, 0.05)` | Elevación sutil |
| `shadows.md` | `0 4px 15px rgba(0, 0, 0, 0.1)` | Elevación estándar para tarjetas |
| `shadows.lg` | `0 10px 25px rgba(0, 0, 0, 0.1)` | Elevación aumentada para estados hover |
| `shadows.primary` | `0 5px 15px rgba(98, 0, 234, 0.3)` | Sombra colorizada para elementos primarios |

## 2. Componentes UI

### 2.1 Layout Principal

#### Sidebar
- **Ancho**: `260px`
- **Color de fondo**: Degradado de `primary` a `#4527A0`
- **Secciones**: Agrupadas con etiquetas en mayúsculas
- **Elementos activos**: Fondo semitransparente `rgba(255, 255, 255, 0.2)`
- **Hover**: Fondo semitransparente `rgba(255, 255, 255, 0.1)`

```jsx
<SidebarContainer>
  <Logo>...</Logo>
  
  <NavSection>
    <NavLabel>Principal</NavLabel>
    <NavMenu>
      <NavItem>
        <StyledNavLink to="/">
          <NavIcon><Activity size={20} /></NavIcon>
          <span>Dashboard</span>
        </StyledNavLink>
      </NavItem>
      {/* Más ítems de navegación */}
    </NavMenu>
  </NavSection>
  
  <SidebarFooter>...</SidebarFooter>
</SidebarContainer>
```

#### Header
- **Altura**: `70px`
- **Color de fondo**: `cardBg` (blanco)
- **Elementos**: Barra de búsqueda, botones de acción, perfil de usuario

```jsx
<HeaderContainer>
  <SearchBar>...</SearchBar>
  
  <HeaderActions>
    <ActionButton>
      <Bell size={20} />
      <NotificationBadge>3</NotificationBadge>
    </ActionButton>
    
    <UserProfile>...</UserProfile>
  </HeaderActions>
</HeaderContainer>
```

### 2.2 Tarjetas y Contenedores

#### Card (Tarjeta Estándar)
- **Fondo**: `cardBg` (blanco)
- **Radio de borde**: `borderRadius.md` (14px)
- **Sombra**: `shadows.md`
- **Header**: Título + acciones opcionales
- **Padding**: `1.5rem`

```jsx
<Card 
  title="Título de la Tarjeta" 
  actions={<Button variant="icon" icon={<Download size={18} />} />}
>
  Contenido de la tarjeta
</Card>
```

#### StatCard (Tarjeta de Estadísticas)
- **Elemento distintivo**: Línea de color en la parte superior
- **Estructura**:
  - Ícono + indicador de tendencia
  - Valor numérico prominente
  - Etiqueta descriptiva

```jsx
<StatCard 
  variant="primary"
  icon={<Box size={24} />}
  value="2,543"
  label="Productos Totales"
  trend="up"
  change="2.4%"
/>
```

### 2.3 Botones y Controles

#### Button
**Variantes:**
- **Primary**: Fondo `primary`, texto blanco, elevación en hover
- **Outline**: Borde `primary`, texto `primary`, fondo `primaryLight` en hover
- **Icon**: Cuadrado con icono centrado, padding igual en todos lados

```jsx
<Button variant="primary" icon={<Plus size={18} />}>
  Nuevo Producto
</Button>

<Button variant="outline">Exportar Reporte</Button>

<Button variant="icon" icon={<Filter size={18} />} />
```

#### Badge (Etiqueta de Estado)
- **Forma**: Cápsula redondeada
- **Variantes**:
  - **Success**: Verde para estados positivos
  - **Warning**: Amarillo para alertas
  - **Danger**: Rojo para errores o estados críticos
  - **Default**: Violeta para estados normales

```jsx
<Badge variant="success">Completado</Badge>
<Badge variant="warning">Procesando</Badge>
<Badge variant="danger">Pendiente</Badge>
```

### 2.4 Tablas

- **Headers**: Alineación izquierda, texto `textSecondary`, fondo transparente
- **Filas**: Separador sutil entre filas, hover con fondo ligeramente coloreado
- **Acciones**: Botones de icono agrupados en última columna

```jsx
<table className="inventory-table">
  <thead>
    <tr>
      <th>Producto</th>
      <th>Fecha</th>
      <th>Cantidad</th>
      <th>Estado</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td><Badge variant="success">Completado</Badge></td>
      <td>
        <div className="item-actions">
          <div className="action-item action-edit">
            <Edit2 size={16} />
          </div>
          {/* Más acciones */}
        </div>
      </td>
    </tr>
  </tbody>
</table>
```

### 2.5 Formularios

- **Inputs**: Bordes sutiles, placeholders claros, estados de foco visibles
- **Labels**: Posicionados sobre los campos, texto `textSecondary`
- **Feedback**: Mensajes de error en `danger`, mensajes de éxito en `secondary`

## 3. Patrones de Interfaz

### 3.1 Patrones de Página

#### Dashboard
Estructura recomendada para páginas de dashboard:

1. **Header de página** con título y acciones principales
2. **Tarjetas de estadísticas** en fila o grid
3. **Contenido principal** (generalmente tablas o gráficos)
4. **Paneles secundarios** (actividad reciente, alertas, etc.)

```jsx
<DashboardContainer>
  <PageHeader>
    <PageTitle>Dashboard</PageTitle>
    <PageActions>
      {/* Botones de acción */}
    </PageActions>
  </PageHeader>
  
  <StatsGrid>
    {/* Tarjetas de estadísticas */}
  </StatsGrid>
  
  <ContentGrid>
    <Card title="Contenido Principal">
      {/* Tabla o gráfico principal */}
    </Card>
    
    <Card title="Panel Secundario">
      {/* Información secundaria */}
    </Card>
  </ContentGrid>
</DashboardContainer>
```

#### Páginas de lista
Para páginas que muestran listas de elementos (productos, órdenes, etc.):

1. **Header con búsqueda** y filtros 
2. **Tabla con paginación**
3. **Panel de detalle** (opcional, para vista dividida)

#### Páginas de detalle
Para páginas que muestran información detallada de un elemento:

1. **Header con breadcrumbs** y acciones
2. **Información principal** en tarjeta destacada
3. **Información secundaria** en tarjetas adicionales
4. **Historial o actividad** relacionada

### 3.2 Jerarquía Visual

Mantener consistencia en la jerarquía visual:

1. **Elementos primarios**: Color `primary`, más grandes, más peso visual
2. **Elementos secundarios**: Colores más sutiles, tamaño moderado
3. **Elementos terciarios**: Texto `textMuted`, tamaño pequeño

### 3.3 Feedback Visual

- **Confirmación**: Verde `secondary` para acciones exitosas
- **Advertencia**: Amarillo `warning` para alertas
- **Error**: Rojo `danger` para problemas
- **Progreso**: Indicadores claros para procesos largos

## 4. Iconografía

### 4.1 Sistema de Iconos

La aplicación utiliza **Feather Icons** por su estilo consistente y minimalista.

**Características de los iconos Feather:**
- Trazo fino uniforme
- Diseño minimalista
- Esquinas y uniones redondeadas
- Estilo monocromático

### 4.2 Tamaños de Iconos

| Contexto | Tamaño |
|----------|--------|
| Navegación | 20px |
| Botones | 18px |
| Tarjetas de estadísticas | 24px |
| Acciones en tabla | 16px |
| Notificaciones | 20px |

### 4.3 Colores de Iconos

- **Default**: Heredan el color del texto contenedor
- **Primary**: `primary` para acciones destacadas
- **Contextual**: Adoptan colores semánticos según su contexto

### 4.4 Implementación

```jsx
// En un componente React
import { Activity, Package, Box } from 'react-feather';

// Uso en JSX
<Button icon={<Plus size={18} />}>Añadir</Button>
```

**Importaciones comunes:**
- Navegación: `Activity`, `Package`, `Box`, `ShoppingCart`
- Acciones: `Plus`, `Edit2`, `Eye`, `Trash2`, `Download`
- UI: `Search`, `Filter`, `Bell`, `Settings`
- Datos: `BarChart2`, `PieChart`, `TrendingUp`, `TrendingDown`

## 5. Estados Visuales

### 5.1 Estados de Elementos Interactivos

#### Botones
- **Normal**: Color base según variante
- **Hover**: 
  - Primary: Sombra aumentada + ligera elevación
  - Outline: Fondo `primaryLight`
  - Icon: Color `primary`
- **Active**: Ligera oscuridad
- **Disabled**: Opacidad reducida (0.6)

#### Inputs
- **Normal**: Borde sutil
- **Focus**: Borde `primary` + sombra ligera
- **Error**: Borde `danger`
- **Disabled**: Fondo grisáceo, cursor not-allowed

#### Elementos de navegación
- **Normal**: Texto claro
- **Hover**: Fondo semitransparente
- **Active**: Fondo más opaco + indicador visual

### 5.2 Transiciones y Animaciones

Todas las transiciones siguen la misma curva de suavidad:
```css
transition: all 0.25s ease;
```

**Efectos comunes:**
- **Hover en tarjetas**: `transform: translateY(-5px)` + sombra aumentada
- **Hover en botones**: Cambio de color + sombra
- **Cambios de estado**: Transición suave entre colores

## 6. Diseño Responsive

### 6.1 Breakpoints

| Nombre | Tamaño | Dispositivos |
|--------|--------|-------------|
| xs | < 576px | Móviles pequeños |
| sm | ≥ 576px | Móviles grandes |
| md | ≥ 768px | Tablets |
| lg | ≥ 992px | Laptops |
| xl | ≥ 1200px | Desktops |
| xxl | ≥ 1400px | Pantallas grandes |

### 6.2 Adaptaciones Principales

- **Sidebar**: Colapsa a menú desplegable en mobile
- **Stats Grid**: 4 columnas -> 2 columnas -> 1 columna
- **Content Grid**: 2 columnas -> 1 columna
- **Tablas**: Scroll horizontal o diseño adaptativo
- **Spacing**: Reducción proporcional en dispositivos pequeños

## 7. Implementación en Nuevas Páginas

Para mantener la consistencia al crear nuevas páginas, sigue estos patrones:

### 7.1 Plantilla Básica

```jsx
import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

// Styled components
const PageContainer = styled.div`
  padding: ${theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
`;

const PageActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ContentSection = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

// Componente de página
const NuevaPageName = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Título de la Página</PageTitle>
        <PageActions>
          <Button 
            variant="outline" 
            icon={/* Icono relevante */}
          >
            Acción Secundaria
          </Button>
          <Button 
            variant="primary" 
            icon={/* Icono relevante */}
          >
            Acción Principal
          </Button>
        </PageActions>
      </PageHeader>
      
      <ContentSection>
        <Card title="Sección Principal">
          {/* Contenido */}
        </Card>
      </ContentSection>
      
      <ContentSection>
        <Card title="Sección Secundaria">
          {/* Contenido */}
        </Card>
      </ContentSection>
    </PageContainer>
  );
};

export default NuevaPageName;
```

### 7.2 Lista de Verificación de Diseño

Antes de finalizar una nueva página, verifica estos aspectos:

- [ ] Usa componentes base consistentes (`Button`, `Card`, etc.)
- [ ] Sigue la paleta de colores definida en `theme.js`
- [ ] Mantiene la jerarquía visual establecida
- [ ] Utiliza el espaciado consistente
- [ ] Usa iconografía de Feather Icons
- [ ] Implementa estados hover/active apropiados
- [ ] Es responsiva para diferentes tamaños de pantalla
- [ ] Mantiene consistencia con las otras páginas existentes

### 7.3 Componentes Específicos por Tipo de Página

#### Para Páginas de Lista

```jsx
<Card title="Lista de Productos">
  <ListHeader>
    <SearchBar placeholder="Buscar productos..." />
    <FilterControls>
      {/* Filtros */}
    </FilterControls>
  </ListHeader>
  
  <DataTable>
    {/* Tabla con datos */}
  </DataTable>
  
  <Pagination />
</Card>
```

#### Para Páginas de Detalle

```jsx
<>
  <BreadcrumbNav>
    <BreadcrumbItem to="/products">Productos</BreadcrumbItem>
    <BreadcrumbItem active>Detalles del Producto</BreadcrumbItem>
  </BreadcrumbNav>
  
  <Card>
    <DetailHeader>
      <DetailTitle>{product.name}</DetailTitle>
      <DetailActions>
        <Button variant="outline" icon={<Edit2 size={18} />}>
          Editar
        </Button>
      </DetailActions>
    </DetailHeader>
    
    <DetailContent>
      {/* Información detallada */}
    </DetailContent>
  </Card>
  
  <TabsContainer>
    {/* Tabs para diferentes secciones */}
  </TabsContainer>
</>
```

---

Esta guía de diseño UI te servirá como referencia para mantener la consistencia visual y la calidad de interfaz de usuario en todas las páginas de tu aplicación React. Sigue estos lineamientos para asegurar que todos los componentes y páginas nuevas se integren perfectamente con el diseño existente.

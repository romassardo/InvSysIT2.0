import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Icon from '../components/ui/Icon';

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th {
      text-align: left;
      padding: var(--spacing-sm);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.9rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    td {
      padding: var(--spacing-sm);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      font-size: 0.95rem;
    }
    
    tr:hover td {
      background-color: var(--primary-light);
    }
    
    tr:last-child td {
      border-bottom: none;
    }
  }
`;

const InventoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  .item-icon {
    width: 40px;
    height: 40px;
    background-color: var(--primary-light);
    color: var(--primary);
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .item-details {
    display: flex;
    flex-direction: column;
    
    .item-name {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .item-category {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    totalAssets: 0,
    assignedAssets: 0,
    inRepair: 0,
    lowStock: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  
  // Simulación de carga de datos
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    
    // Datos simulados para estadísticas
    setStatsData({
      totalAssets: 345,
      assignedAssets: 187,
      inRepair: 8,
      lowStock: 5
    });
    
    // Datos simulados para actividad reciente
    setRecentActivity([
      {
        id: 1,
        type: 'assignment',
        assetName: 'Notebook Dell Latitude 7400',
        assetType: 'Computadoras',
        assetIcon: 'Package', // Mejor alternativa para laptop que no se confunda con Monitor
        assignedTo: 'Juan Pérez',
        location: 'Oficina Central',
        timestamp: '2025-04-04T14:22:10Z',
        user: 'Admin'
      },
      {
        id: 2,
        type: 'repair',
        assetName: 'Monitor Samsung 24"',
        assetType: 'Periféricos',
        assetIcon: 'monitor',
        repairReason: 'Falla en encendido',
        timestamp: '2025-04-03T10:30:45Z',
        user: 'Soporte1'
      },
      {
        id: 3,
        type: 'entry',
        assetName: 'Teclado Logitech MX Keys',
        assetType: 'Periféricos',
        assetIcon: 'Type', // Reemplazado de 'keyboard' que no existe en react-feather
        quantity: 5,
        timestamp: '2025-04-02T16:15:22Z',
        user: 'Admin'
      },
      {
        id: 4,
        type: 'return',
        assetName: 'iPhone 13 Pro',
        assetType: 'Celulares',
        assetIcon: 'Smartphone', // Nombre correcto en PascalCase
        previousUser: 'María López',
        timestamp: '2025-04-01T11:05:18Z',
        user: 'Soporte2'
      }
    ]);
    
    // Datos simulados para items con stock bajo
    setLowStockItems([
      {
        id: 1,
        name: 'Toner HP 85A',
        category: 'Consumibles',
        currentStock: 2,
        minimumThreshold: 5
      },
      {
        id: 2,
        name: 'Cargador Notebook Dell',
        category: 'Consumibles',
        currentStock: 1,
        minimumThreshold: 3
      },
      {
        id: 3,
        name: 'Drum Unidad de Imagen Lexmark',
        category: 'Consumibles',
        currentStock: 0,
        minimumThreshold: 2
      },
      {
        id: 4,
        name: 'Mouse Wireless Logitech',
        category: 'Periféricos',
        currentStock: 3,
        minimumThreshold: 8
      },
      {
        id: 5,
        name: 'Cable HDMI 1.5m',
        category: 'Consumibles',
        currentStock: 4,
        minimumThreshold: 10
      }
    ]);
  }, []);
  
  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Función para obtener badge según tipo de actividad
  const getActivityBadge = (type) => {
    switch (type) {
      case 'assignment':
        return <Badge variant="success">Asignación</Badge>;
      case 'repair':
        return <Badge variant="warning">Reparación</Badge>;
      case 'entry':
        return <Badge variant="info">Entrada</Badge>;
      case 'return':
        return <Badge variant="default">Devolución</Badge>;
      default:
        return <Badge>Otros</Badge>;
    }
  };
  
  return (
    <div>
      <PageTitle>Dashboard</PageTitle>
      
      {/* Tarjetas de estadísticas */}
      <DashboardGrid>
        <StatCard
          variant="primary"
          icon="box"
          value={statsData.totalAssets}
          label="Activos Totales"
        />
        
        <StatCard
          variant="success"
          icon="UserCheck"
          value={statsData.assignedAssets}
          label="Activos Asignados"
          trend="up"
          change="2.4%"
        />
        
        <StatCard
          variant="warning"
          icon="Tool"
          value={statsData.inRepair}
          label="En Reparación"
        />
        
        <StatCard
          variant="danger"
          icon="AlertTriangle"
          value={statsData.lowStock}
          label="Stock Bajo"
          trend="down"
          change="3 items"
        />
      </DashboardGrid>
      
      {/* Tarjetas principales */}
      <CardGrid>
        {/* Actividad reciente */}
        <Card 
          title="Actividad Reciente" 
          actions={
            <Button variant="outline" icon="RefreshCw" iconPosition="left">
              Actualizar
            </Button>
          }
        >
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Activo</th>
                  <th>Fecha</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map(activity => (
                  <tr key={activity.id}>
                    <td>
                      <BadgeContainer>
                        {getActivityBadge(activity.type)}
                      </BadgeContainer>
                    </td>
                    <td>
                      <InventoryItem>
                        <div className="item-icon">
                          <Icon name={activity.assetIcon} size={18} />
                        </div>
                        <div className="item-details">
                          <span className="item-name">{activity.assetName}</span>
                          <span className="item-category">{activity.assetType}</span>
                        </div>
                      </InventoryItem>
                    </td>
                    <td>{formatDate(activity.timestamp)}</td>
                    <td>{activity.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
          
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
            <Button variant="outline" as={Link} to="/reports">
              Ver Historial Completo
            </Button>
          </div>
        </Card>
        
        {/* Consumibles con stock bajo */}
        <Card 
          title="Consumibles con Stock Bajo" 
          actions={
            <Button 
              variant="outline" 
              icon="ExternalLink"
              as={Link}
              to="/inventory/low-stock"
            >
              Ver Todos
            </Button>
          }
        >
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <span style={{ 
                        color: item.currentStock === 0 ? 'var(--danger)' : 'var(--warning)',
                        fontWeight: 600
                      }}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td>{item.minimumThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        </Card>
      </CardGrid>
      
      {/* Botones de acciones rápidas */}
      <Card title="Acciones Rápidas" style={{ marginTop: 'var(--spacing-lg)' }}>
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-md)', 
          flexWrap: 'wrap' 
        }}>
          <Button icon="PlusCircle" variant="primary">
            Nueva Entrada
          </Button>
          
          <Button icon="UserPlus" variant="outline">
            Asignar Activo
          </Button>
          
          <Button icon="tool" variant="outline">
            Registrar Reparación
          </Button>
          
          <Button icon="file-text" variant="outline">
            Generar Reporte
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

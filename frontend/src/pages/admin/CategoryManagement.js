import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
`;

const SectionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-lg);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background-color: ${props => props.active ? 'var(--primary-light)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'var(--primary)' : 'rgba(0, 0, 0, 0.1)'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-light)' : 'rgba(0, 0, 0, 0.03)'};
    border-color: ${props => props.active ? 'var(--primary)' : 'rgba(0, 0, 0, 0.2)'};
  }
`;

const CategoryName = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const SubcategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-left: var(--spacing-lg);
  margin-top: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
`;

const SubcategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background-color: ${props => props.active ? 'rgba(0, 0, 0, 0.05)' : 'transparent'};
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const FormContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
  
  label {
    display: block;
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    font-size: 0.95rem;
  }
  
  input, select, textarea {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-family: 'Nunito', sans-serif;
    font-size: 0.95rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

const ErrorText = styled.div`
  color: var(--danger);
  font-size: 0.85rem;
  margin-top: var(--spacing-xs);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--text-muted);
  text-align: center;
  
  svg {
    margin-bottom: var(--spacing-md);
  }
`;

const AssetCountBadge = styled.div`
  background-color: var(--gray-light);
  color: var(--text-secondary);
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: var(--border-radius-full);
`;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState('category'); // 'category' o 'subcategory'
  const [editMode, setEditMode] = useState(false);
  
  // Simular carga de datos
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockCategories = [
      { 
        id: 1, 
        name: 'Computadoras', 
        icon: 'monitor',
        count: 127,
        subcategories: [
          { id: 1, name: 'Desktops', count: 45 },
          { id: 2, name: 'Notebooks', count: 75 },
          { id: 3, name: 'Raspberry Pi', count: 7 }
        ]
      },
      { 
        id: 2, 
        name: 'Celulares', 
        icon: 'smartphone',
        count: 43,
        subcategories: []
      },
      { 
        id: 3, 
        name: 'Periféricos', 
        icon: 'mouse-pointer',
        count: 215,
        subcategories: [
          { id: 4, name: 'Teclados', count: 32 },
          { id: 5, name: 'Mouse', count: 40 },
          { id: 6, name: 'Kit Teclado/Mouse', count: 15 },
          { id: 7, name: 'Auriculares', count: 28 },
          { id: 8, name: 'Webcams', count: 20 },
          { id: 9, name: 'Monitores', count: 65 },
          { id: 10, name: 'Televisores', count: 15 }
        ]
      },
      { 
        id: 4, 
        name: 'Consumibles', 
        icon: 'box',
        count: 520,
        subcategories: [
          { id: 11, name: 'Cables', count: 150 },
          { id: 12, name: 'Pilas', count: 80 },
          { id: 13, name: 'Toner', count: 35 },
          { id: 14, name: 'Drum', count: 15 },
          { id: 15, name: 'Cargadores', count: 240 }
        ]
      },
      { 
        id: 5, 
        name: 'Componentes', 
        icon: 'hard-drive',
        count: 189,
        subcategories: [
          { id: 16, name: 'Memorias RAM', count: 45 },
          { id: 17, name: 'Discos Externos', count: 35 },
          { id: 18, name: 'Discos SSD/NVMe', count: 40 },
          { id: 19, name: 'Placas Sending', count: 12 },
          { id: 20, name: 'Placas de Video', count: 15 },
          { id: 21, name: 'Motherboards', count: 7 },
          { id: 22, name: 'Adaptadores USB Varios', count: 35 }
        ]
      }
    ];
    
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 800);
  }, []);
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setFormMode('subcategory');
    setEditMode(false);
  };
  
  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setFormMode('subcategory');
    setEditMode(true);
  };
  
  const handleNewCategory = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setFormMode('category');
    setEditMode(false);
  };
  
  const handleNewSubcategory = () => {
    setSelectedSubcategory(null);
    setFormMode('subcategory');
    setEditMode(false);
  };
  
  const handleEditCategory = () => {
    setFormMode('category');
    setEditMode(true);
  };
  
  // Validación de formulario de categoría
  const categorySchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    icon: Yup.string().required('El ícono es obligatorio')
  });
  
  // Validación de formulario de subcategoría
  const subcategorySchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio')
  });
  
  // Valores iniciales para el formulario de categoría
  const categoryInitialValues = editMode && selectedCategory
    ? {
        name: selectedCategory.name,
        icon: selectedCategory.icon,
        description: selectedCategory.description || ''
      }
    : {
        name: '',
        icon: 'box',
        description: ''
      };
  
  // Valores iniciales para el formulario de subcategoría
  const subcategoryInitialValues = editMode && selectedSubcategory
    ? {
        name: selectedSubcategory.name,
        description: selectedSubcategory.description || ''
      }
    : {
        name: '',
        description: ''
      };
  
  // Enviar formulario de categoría
  const handleCategorySubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Valores del formulario de categoría:', values);
    
    // En una implementación real, aquí enviaríamos los datos a la API
    setTimeout(() => {
      if (editMode && selectedCategory) {
        // Actualizar categoría existente
        const updatedCategories = categories.map(cat => 
          cat.id === selectedCategory.id 
            ? { ...cat, ...values }
            : cat
        );
        setCategories(updatedCategories);
      } else {
        // Crear nueva categoría
        const newCategory = {
          id: categories.length + 1,
          ...values,
          count: 0,
          subcategories: []
        };
        setCategories([...categories, newCategory]);
      }
      
      setSubmitting(false);
      resetForm();
      setEditMode(false);
    }, 1000);
  };
  
  // Enviar formulario de subcategoría
  const handleSubcategorySubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Valores del formulario de subcategoría:', values);
    
    // En una implementación real, aquí enviaríamos los datos a la API
    setTimeout(() => {
      if (editMode && selectedSubcategory) {
        // Actualizar subcategoría existente
        const updatedCategories = categories.map(cat => {
          if (cat.id === selectedCategory.id) {
            const updatedSubcategories = cat.subcategories.map(subcat => 
              subcat.id === selectedSubcategory.id 
                ? { ...subcat, ...values }
                : subcat
            );
            return { ...cat, subcategories: updatedSubcategories };
          }
          return cat;
        });
        setCategories(updatedCategories);
        
        // Mostrar mensaje de éxito
        alert(`Subcategoría "${values.name}" actualizada correctamente`);
      } else if (selectedCategory) {
        // Crear nueva subcategoría
        const newSubcategory = {
          id: Math.max(0, ...categories.flatMap(cat => cat.subcategories.map(subcat => subcat.id))) + 1,
          ...values,
          count: 0
        };
        
        const updatedCategories = categories.map(cat => 
          cat.id === selectedCategory.id 
            ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
            : cat
        );
        setCategories(updatedCategories);
        
        // Mostrar mensaje de éxito
        alert(`Nueva subcategoría "${values.name}" creada correctamente en ${selectedCategory.name}`);
      }
      
      setSubmitting(false);
      resetForm();
      setEditMode(false);
    }, 1000);
  };
  
  // Opciones de iconos
  const iconOptions = [
    { value: 'box', label: 'Caja' },
    { value: 'monitor', label: 'Monitor' },
    { value: 'cpu', label: 'CPU' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'smartphone', label: 'Celular' },
    { value: 'mouse-pointer', label: 'Mouse' },
    { value: 'keyboard', label: 'Teclado' },
    { value: 'hard-drive', label: 'Disco Duro' },
    { value: 'printer', label: 'Impresora' },
    { value: 'headphones', label: 'Auriculares' },
    { value: 'camera', label: 'Cámara' },
    { value: 'wifi', label: 'Wifi' },
    { value: 'battery', label: 'Batería' },
    { value: 'tool', label: 'Herramienta' },
    { value: 'settings', label: 'Configuración' }
  ];
  
  // Eliminar categoría
  const handleDeleteCategory = (category) => {
    if (window.confirm(`¿Está seguro de eliminar la categoría "${category.name}"? Esta acción eliminará también todas sus subcategorías.`)) {
      // En una implementación real, aquí enviaríamos la solicitud a la API
      const updatedCategories = categories.filter(cat => cat.id !== category.id);
      setCategories(updatedCategories);
      
      if (selectedCategory && selectedCategory.id === category.id) {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      }
    }
  };
  
  // Eliminar subcategoría
  const handleDeleteSubcategory = (subcategory) => {
    if (window.confirm(`¿Está seguro de eliminar la subcategoría "${subcategory.name}"?`)) {
      // En una implementación real, aquí enviaríamos la solicitud a la API
      const updatedCategories = categories.map(cat => {
        if (cat.id === selectedCategory.id) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(subcat => subcat.id !== subcategory.id)
          };
        }
        return cat;
      });
      
      setCategories(updatedCategories);
      
      if (selectedSubcategory && selectedSubcategory.id === subcategory.id) {
        setSelectedSubcategory(null);
      }
    }
  };
  
  if (loading) {
    return (
      <div>
        <PageHeader>
          <PageTitle>Gestión de Categorías</PageTitle>
        </PageHeader>
        
        <Card>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
            <FeatherIcon icon="loader" size={36} />
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader>
        <PageTitle>Gestión de Categorías</PageTitle>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          {selectedCategory && (
            <Button 
              variant="outline" 
              icon="list" 
              onClick={handleNewSubcategory}
            >
              Nueva Subcategoría en {selectedCategory.name}
            </Button>
          )}
          <Button variant="primary" icon="plus" onClick={handleNewCategory}>
            Nueva Categoría
          </Button>
        </div>
      </PageHeader>
      
      <SectionsContainer>
        <Card title="Categorías y Subcategorías" style={{ position: 'relative' }}>
          {categories.length === 0 ? (
            <EmptyState>
              <FeatherIcon icon="box" size={48} />
              <p>No hay categorías definidas</p>
              <Button variant="primary" icon="plus" onClick={handleNewCategory} style={{ marginTop: 'var(--spacing-md)' }}>
                Crear Primera Categoría
              </Button>
            </EmptyState>
          ) : (
            <CategoryList>
              {categories.map(category => (
                <div key={category.id} style={{ marginBottom: 'var(--spacing-md)' }}>
                  <CategoryItem 
                    active={selectedCategory && selectedCategory.id === category.id}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <CategoryName>
                      <FeatherIcon icon={category.icon} size={16} />
                      {category.name}
                    </CategoryName>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                      <AssetCountBadge>{category.count} activos</AssetCountBadge>
                      
                      <ActionButtons>
                        <Button 
                          variant="icon" 
                          title="Editar categoría"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(category);
                            handleEditCategory();
                          }}
                        >
                          <FeatherIcon icon="edit-2" size={14} />
                        </Button>
                        
                        <Button 
                          variant="icon" 
                          title="Eliminar categoría"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category);
                          }}
                        >
                          <FeatherIcon icon="trash-2" size={14} />
                        </Button>
                      </ActionButtons>
                    </div>
                  </CategoryItem>
                  
                  {selectedCategory && selectedCategory.id === category.id && (
                    <SubcategoryList>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xs)' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Subcategorías</span>
                        <Button 
                          variant="outline"
                          size="small"
                          icon="plus"
                          onClick={handleNewSubcategory}
                          style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                        >
                          Añadir
                        </Button>
                      </div>
                      {category.subcategories.length === 0 ? (
                        <div style={{ 
                          padding: 'var(--spacing-sm)', 
                          fontSize: '0.9rem', 
                          color: 'var(--text-muted)',
                          fontStyle: 'italic',
                          backgroundColor: 'rgba(0,0,0,0.03)',
                          borderRadius: 'var(--border-radius-sm)',
                          border: '1px dashed rgba(0,0,0,0.1)',
                          textAlign: 'center'
                        }}>
                          No hay subcategorías definidas
                          <Button 
                            variant="text"
                            icon="plus-circle"
                            onClick={handleNewSubcategory}
                            style={{ display: 'block', margin: '5px auto 0', fontSize: '0.85rem' }}
                          >
                            Crear subcategoría
                          </Button>
                        </div>
                      ) : (
                        category.subcategories.map(subcategory => (
                          <SubcategoryItem 
                            key={subcategory.id} 
                            active={selectedSubcategory && selectedSubcategory.id === subcategory.id}
                            onClick={() => handleSubcategorySelect(subcategory)}
                          >
                            <span>{subcategory.name}</span>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                              <AssetCountBadge>{subcategory.count}</AssetCountBadge>
                              
                              <ActionButtons>
                                <Button 
                                  variant="icon" 
                                  title="Editar subcategoría"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubcategorySelect(subcategory);
                                  }}
                                  style={{ color: 'var(--primary)' }}
                                >
                                  <FeatherIcon icon="edit-2" size={14} />
                                </Button>
                                
                                <Button 
                                  variant="icon" 
                                  title="Eliminar subcategoría"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSubcategory(subcategory);
                                  }}
                                >
                                  <FeatherIcon icon="trash-2" size={14} />
                                </Button>
                              </ActionButtons>
                            </div>
                          </SubcategoryItem>
                        ))
                      )}
                      
                      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
                        <Button 
                          variant="outline" 
                          size="small" 
                          icon="plus"
                          onClick={handleNewSubcategory}
                        >
                          Añadir Subcategoría
                        </Button>
                      </div>
                    </SubcategoryList>
                  )}
                </div>
              ))}
            </CategoryList>
          )}
        </Card>
        
        <Card title={
          formMode === 'category' 
            ? (editMode ? 'Editar Categoría' : 'Nueva Categoría')
            : (editMode ? 'Editar Subcategoría' : 'Nueva Subcategoría')
        }>
          {formMode === 'category' ? (
            <FormContainer>
              <Formik
                initialValues={categoryInitialValues}
                validationSchema={categorySchema}
                onSubmit={handleCategorySubmit}
              >
                {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                  <Form>
                    <FormGroup>
                      <label htmlFor="name">Nombre de la Categoría*</label>
                      <Field type="text" id="name" name="name" />
                      <ErrorMessage name="name" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="icon">Ícono*</label>
                      <Field as="select" id="icon" name="icon">
                        {iconOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="icon" component={ErrorText} />
                      
                      {values.icon && (
                        <div style={{ 
                          marginTop: 'var(--spacing-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)'
                        }}>
                          <span>Vista previa:</span>
                          <div style={{ 
                            width: '40px', 
                            height: '40px',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            borderRadius: 'var(--border-radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <FeatherIcon icon={values.icon} size={20} />
                          </div>
                        </div>
                      )}
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="description">Descripción</label>
                      <Field as="textarea" id="description" name="description" />
                    </FormGroup>
                    
                    <FormActions>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditMode(false);
                          setSelectedCategory(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      
                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <FeatherIcon icon="loader" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                            Guardando...
                          </>
                        ) : (
                          editMode ? 'Actualizar Categoría' : 'Crear Categoría'
                        )}
                      </Button>
                    </FormActions>
                  </Form>
                )}
              </Formik>
            </FormContainer>
          ) : (
            <FormContainer>
              {selectedCategory ? (
                <Formik
                  initialValues={subcategoryInitialValues}
                  validationSchema={subcategorySchema}
                  onSubmit={handleSubcategorySubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div style={{ 
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        backgroundColor: 'var(--primary-light)',
                        borderRadius: 'var(--border-radius-sm)',
                        marginBottom: 'var(--spacing-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)'
                      }}>
                        <FeatherIcon icon={selectedCategory.icon} size={18} />
                        <span>Categoría: <strong>{selectedCategory.name}</strong></span>
                      </div>
                      
                      <FormGroup>
                        <label htmlFor="name">Nombre de la Subcategoría*</label>
                        <Field type="text" id="name" name="name" />
                        <ErrorMessage name="name" component={ErrorText} />
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="description">Descripción</label>
                        <Field as="textarea" id="description" name="description" />
                      </FormGroup>
                      
                      <FormActions>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setEditMode(false);
                            setSelectedSubcategory(null);
                          }}
                        >
                          Cancelar
                        </Button>
                        
                        <Button 
                          type="submit" 
                          variant="primary" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <FeatherIcon icon="loader" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                              Guardando...
                            </>
                          ) : (
                            editMode ? 'Actualizar Subcategoría' : 'Crear Subcategoría'
                          )}
                        </Button>
                      </FormActions>
                    </Form>
                  )}
                </Formik>
              ) : (
                <EmptyState>
                  <FeatherIcon icon="list" size={48} />
                  <p>Seleccione una categoría para añadir subcategorías</p>
                </EmptyState>
              )}
            </FormContainer>
          )}
        </Card>
      </SectionsContainer>
    </div>
  );
};

export default CategoryManagement;

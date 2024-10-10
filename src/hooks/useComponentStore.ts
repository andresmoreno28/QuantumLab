import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Component, Category } from '../types';

interface ComponentStore {
  components: Component[];
  categories: Category[];
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updatedComponent: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
}

const useComponentStore = create<ComponentStore>()(
  persist(
    (set) => ({
      components: [],
      categories: [],
      addComponent: (component) =>
        set((state) => ({ components: [...state.components, component] })),
      updateComponent: (id, updatedComponent) =>
        set((state) => ({
          components: state.components.map((c) =>
            c.id === id ? { ...c, ...updatedComponent } : c
          ),
        })),
      deleteComponent: (id) =>
        set((state) => ({
          components: state.components.filter((c) => c.id !== id),
        })),
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, name) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, name } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'component-store',
    }
  )
);

export default useComponentStore;
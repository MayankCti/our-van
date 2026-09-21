import { createSlice } from "@reduxjs/toolkit";
import {
  getComponentsList,
  createComponent,
  editComponent,
  deleteComponent,
} from "../actions/componentAction";

const initialState = {
  // Components List
  componentsList: [],
  componentsMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isComponentsLoading: false,
  componentsError: null,

  // Create Component
  isCreateComponentLoading: false,
  createComponentError: null,

  // Edit Component
  isEditComponentLoading: false,
  editComponentError: null,

  // Delete Component
  isDeleteComponentLoading: false,
  deleteComponentError: null,
};

const componentSlice = createSlice({
  name: "component",
  initialState,
  reducers: {
    setComponentsList: (state, action) => {
      state.componentsList = action.payload;
    },
    resetComponentState: () => initialState,
  },
  extraReducers: (builder) => {
    // getComponentsList
    builder.addCase(getComponentsList.pending, (state) => {
      state.isComponentsLoading = true;
      state.componentsError = null;
    });
    builder.addCase(getComponentsList.fulfilled, (state, action) => {
      state.isComponentsLoading = false;
      const data = action?.payload?.data || action?.payload || {};
      const rawList =
        data?.component_types ||
        data?.components ||
        (Array.isArray(data) ? data : []);
      state.componentsList = Array.isArray(rawList) ? rawList : [];

      const pagination = data?.pagination || action?.payload?.meta || {};
      const total = pagination?.total ?? pagination?.totalItems ?? state.componentsList.length;
      const limit = pagination?.limit ?? 10;
      const totalPages =
        pagination?.total_pages ??
        pagination?.totalPages ??
        (Math.ceil(total / limit) || 1);

      state.componentsMeta = {
        totalItems: total,
        totalPages: totalPages,
        currentPage: pagination?.page ?? pagination?.currentPage ?? 1,
        limit: limit,
        hasNextPage: (pagination?.page ?? 1) < totalPages,
        hasPrevPage: (pagination?.page ?? 1) > 1,
      };
      state.componentsError = null;
    });
    builder.addCase(getComponentsList.rejected, (state, action) => {
      state.isComponentsLoading = false;
      state.componentsError = action.payload || action.error?.message;
    });

    // createComponent
    builder.addCase(createComponent.pending, (state) => {
      state.isCreateComponentLoading = true;
      state.createComponentError = null;
    });
    builder.addCase(createComponent.fulfilled, (state, action) => {
      state.isCreateComponentLoading = false;
      const created =
        action.payload?.data?.component ||
        action.payload?.component ||
        action.payload?.data;
      if (created && typeof created === "object" && (created.name || created.id)) {
        const normalized = {
          id: created.id || created.component_id || Date.now(),
          name: created.name || action.meta?.arg?.payload?.name || "",
          ...created,
        };
        const exists = state.componentsList.some(
          (c) => String(c.id || c.component_id) === String(normalized.id)
        );
        if (!exists) {
          state.componentsList = [normalized, ...state.componentsList];
          state.componentsMeta = {
            ...state.componentsMeta,
            totalItems: (state.componentsMeta.totalItems || 0) + 1,
          };
        }
      }
      state.createComponentError = null;
    });
    builder.addCase(createComponent.rejected, (state, action) => {
      state.isCreateComponentLoading = false;
      state.createComponentError = action.payload || action.error?.message;
    });

    // editComponent
    builder.addCase(editComponent.pending, (state) => {
      state.isEditComponentLoading = true;
      state.editComponentError = null;
    });
    builder.addCase(editComponent.fulfilled, (state, action) => {
      state.isEditComponentLoading = false;
      const payloadArg = action.meta?.arg?.payload;
      const editId = payloadArg?.id;
      const editName = payloadArg?.name;
      if (editId && Array.isArray(state.componentsList)) {
        state.componentsList = state.componentsList.map((comp) => {
          if (String(comp.id || comp.component_id) === String(editId)) {
            return {
              ...comp,
              name: editName || comp.name,
              ...(action.payload?.data && typeof action.payload?.data === "object"
                ? action.payload.data
                : {}),
            };
          }
          return comp;
        });
      }
      state.editComponentError = null;
    });
    builder.addCase(editComponent.rejected, (state, action) => {
      state.isEditComponentLoading = false;
      state.editComponentError = action.payload || action.error?.message;
    });

    // deleteComponent
    builder.addCase(deleteComponent.pending, (state) => {
      state.isDeleteComponentLoading = true;
      state.deleteComponentError = null;
    });
    builder.addCase(deleteComponent.fulfilled, (state, action) => {
      state.isDeleteComponentLoading = false;
      const deletedId = action.meta?.arg?.id;
      if (deletedId && Array.isArray(state.componentsList)) {
        state.componentsList = state.componentsList.filter(
          (comp) => String(comp.id || comp.component_id) !== String(deletedId)
        );
        state.componentsMeta = {
          ...state.componentsMeta,
          totalItems: Math.max(0, (state.componentsMeta.totalItems || 1) - 1),
        };
      }
      state.deleteComponentError = null;
    });
  },
});

export const { setComponentsList, resetComponentState } = componentSlice.actions;
export default componentSlice.reducer;

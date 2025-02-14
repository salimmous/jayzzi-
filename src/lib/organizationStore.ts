import { create } from 'zustand';
import { supabase } from './supabase.ts';

interface Organization {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, any>;
}

interface OrganizationMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  email: string;
  name: string;
}

interface OrganizationStore {
  currentOrganization: Organization | null;
  organizations: Organization[];
  members: OrganizationMember[];
  loading: boolean;
  error: string | null;
  fetchOrganizations: () => Promise<void>;
  createOrganization: (name: string, slug: string) => Promise<void>;
  switchOrganization: (id: string) => Promise<void>;
  inviteMember: (email: string, role: OrganizationMember['role']) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  updateMemberRole: (userId: string, role: OrganizationMember['role']) => Promise<void>;
  fetchMembers: () => Promise<void>;
}

export const useOrganizationStore = create<OrganizationStore>((set, get) => ({
  currentOrganization: null,
  organizations: [],
  members: [],
  loading: false,
  error: null,

  fetchOrganizations: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          slug,
          settings,
          organization_members!inner(user_id, role)
        `)
        .eq('organization_members.user_id', supabase.auth.user()?.id);

      if (error) throw error;

      set({
        organizations: data,
        currentOrganization: data[0] || null
      });
    } catch (error:any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createOrganization: async (name: string, slug: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.rpc('create_organization', {
        org_name: name,
        org_slug: slug,
        owner_id: supabase.auth.user()?.id
      });

      if (error) throw error;

      await get().fetchOrganizations();
    } catch (error:any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  switchOrganization: async (id: string) => {
    const org = get().organizations.find(o => o.id === id);
    if (org) {
      set({ currentOrganization: org });
    }
  },

  inviteMember: async (email: string, role: OrganizationMember['role']) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('organization_members')
        .insert({
          organization_id: get().currentOrganization?.id,
          user_id: email, // This will be replaced with actual user id after invitation
          role
        });

      if (error) throw error;

      await get().fetchMembers();
    } catch (error:any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  removeMember: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .match({
          organization_id: get().currentOrganization?.id,
          user_id: userId
        });

      if (error) throw error;

      await get().fetchMembers();
    } catch (error:any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateMemberRole: async (userId: string, role: OrganizationMember['role']) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ role })
        .match({
          organization_id: get().currentOrganization?.id,
          user_id: userId
        });

      if (error) throw error;

      await get().fetchMembers();
    } catch (error:any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchMembers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          profiles:user_id(
            email,
            name
          )
        `)
        .eq('organization_id', get().currentOrganization?.id);

      if (error) throw error;

      set({
        members: data.map(member => ({
          id: member.id,
          userId: member.user_id,
          role: member.role,
          email: member.profiles.email,
          name: member.profiles.name
        }))
      });
    } catch (error:any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  }
}));

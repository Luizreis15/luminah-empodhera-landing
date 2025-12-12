import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WorkbookAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export function useWorkbookAuth(): WorkbookAuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    const redirectUrl = `${window.location.origin}/caderno`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { name, phone }
      }
    });

    if (!error && data.user) {
      // Copy to contacts table for marketing
      try {
        await supabase.from('contacts').insert({
          email,
          name,
        });
      } catch (e) {
        console.log('Contact may already exist:', e);
      }

      // Also add to waiting list if not exists
      try {
        await supabase.from('waiting_list').insert({
          email,
          name,
          phone: phone || null,
          subscribed_to_marketing: true
        });
      } catch (e) {
        console.log('Already in waiting list:', e);
      }

      // Send welcome email
      try {
        await supabase.functions.invoke('send-workbook-welcome', {
          body: { email, name }
        });
      } catch (e) {
        console.log('Welcome email error:', e);
      }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return { user, session, isLoading, signIn, signUp, signOut };
}

// Hook for managing workbook responses
export function useWorkbookResponses(moduleId: number) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch responses for this module
  useEffect(() => {
    const fetchResponses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('workbook_responses')
        .select('activity_id, response')
        .eq('user_id', user.id)
        .eq('module_id', moduleId);

      if (error) {
        console.error('Error fetching responses:', error);
      } else if (data) {
        const responsesMap: Record<string, any> = {};
        data.forEach((item) => {
          responsesMap[item.activity_id] = item.response;
        });
        setResponses(responsesMap);
      }
      setIsLoading(false);
    };

    fetchResponses();
  }, [moduleId]);

  // Save a single response
  const saveResponse = useCallback(async (activityId: string, response: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setIsSaving(true);
    setResponses(prev => ({ ...prev, [activityId]: response }));

    const { error } = await supabase
      .from('workbook_responses')
      .upsert({
        user_id: user.id,
        module_id: moduleId,
        activity_id: activityId,
        response
      }, {
        onConflict: 'user_id,module_id,activity_id'
      });

    if (error) {
      console.error('Error saving response:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar sua resposta. Tente novamente.",
        variant: "destructive"
      });
    }

    setIsSaving(false);
  }, [moduleId, toast]);

  return { responses, isLoading, isSaving, saveResponse };
}

// Hook for calculating progress
export function useWorkbookProgress() {
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [totalProgress, setTotalProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('workbook_responses')
        .select('module_id, activity_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching progress:', error);
        setIsLoading(false);
        return;
      }

      // Count activities per module (approximate - based on workbookModules data)
      const totalActivitiesPerModule: Record<number, number> = {
        1: 9, // Module 1 activities
        2: 5, // Module 2 activities
        3: 6, // Module 3 activities
        4: 6  // Module 4 activities
      };

      const completedPerModule: Record<number, Set<string>> = {
        1: new Set(),
        2: new Set(),
        3: new Set(),
        4: new Set()
      };

      data?.forEach((item) => {
        if (item.module_id >= 1 && item.module_id <= 4) {
          completedPerModule[item.module_id].add(item.activity_id);
        }
      });

      const progressMap: Record<number, number> = {};
      let totalCompleted = 0;
      let totalActivities = 0;

      for (let i = 1; i <= 4; i++) {
        const completed = completedPerModule[i].size;
        const total = totalActivitiesPerModule[i];
        progressMap[i] = Math.round((completed / total) * 100);
        totalCompleted += completed;
        totalActivities += total;
      }

      setProgress(progressMap);
      setTotalProgress(Math.round((totalCompleted / totalActivities) * 100));
      setIsLoading(false);
    };

    fetchProgress();
  }, []);

  return { progress, totalProgress, isLoading };
}

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/apiClient';
import { supabase } from '@/lib/supabase';

export function useDeleteAccount(user_id: string | undefined) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user_id) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      console.log("Deleting account for user_id:", user_id);
      const result = await apiFetch(`/profiles/${user_id}`, { method: "DELETE" });
      console.log("Delete result:", result);
      
      await supabase.auth.signOut();
      
      router.push("/");
    } catch (err: any) {
      console.log("Delete error:", err);
      alert(err.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDeleteAccount, isDeleting };
}

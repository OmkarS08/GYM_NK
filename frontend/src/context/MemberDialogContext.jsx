import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
const MemberDialogContext = createContext();

export const useMemberDialog = () => useContext(MemberDialogContext);

export const MemberDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [member, setMember] = useState(null);
  const [showAadhar, setShowAadhar] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all members on mount
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/members/getMember');
      if (res.status === 200) {
        setMembers(res.data);
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Open dialog with full member info
  const openDialog = (memberData) => {
    let fullMember = null;
    if (memberData && memberData.id) {
      fullMember = members.find(m => m.id === memberData.id);
    } else if (memberData && memberData.name) {
      fullMember = members.find(m => m.name === memberData.name);
    }
    setMember(fullMember || memberData);
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
    setMember(null);
    setShowAadhar(false);
  };

  return (
    <MemberDialogContext.Provider value={{
      open, member, showAadhar, setShowAadhar, openDialog, closeDialog, members, refreshMembers: fetchMembers, loading
    }}>
      {children}
    </MemberDialogContext.Provider>
  );
}; 
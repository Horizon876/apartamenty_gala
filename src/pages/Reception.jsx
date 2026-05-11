import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Modular Components
import ReceptionSidebar from '../components/reception/ReceptionSidebar';
import ReceptionDashboard from '../components/reception/ReceptionDashboard';
import ReceptionCalendar from '../components/reception/ReceptionCalendar';
import ReceptionGuestList from '../components/reception/ReceptionGuestList';
import ReceptionRoomManager from '../components/reception/ReceptionRoomManager';
import ReceptionRoomModal from '../components/reception/ReceptionRoomModal';

const API_URL = 'http://127.0.0.1:3000';

const Reception = () => {
  const [bookings, setBookings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('timeline');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoomTypeId, setFilterRoomTypeId] = useState('all');
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    name: '',
    capacity: 2,
    totalRooms: 5,
    basePrice: 200,
    description: '',
    images: []
  });
  
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{"firstName": "Admin"}');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchBookings(), fetchRoomTypes()]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      handleLogout();
      return { error: 'Brak autoryzacji' };
    }

    const headers = { 'Authorization': `Bearer ${token}`, ...options.headers };
    if (options.body && typeof options.body === 'string') {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return { error: 'Sesja wygasła' };
      }
      
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) return { error: data?.error || 'Błąd serwera' };
      return { data: data || true };
    } catch (err) {
      return { error: 'Błąd połączenia' };
    }
  };

  const fetchRoomTypes = async () => {
    const { data } = await apiFetch('/admin/room-types');
    if (data) setRoomTypes(data);
  };

  const fetchBookings = async () => {
    const { data } = await apiFetch('/admin/bookings');
    if (data) setBookings(data);
  };

  const handleOpenRoomModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setRoomFormData({
        name: room.name,
        capacity: room.capacity,
        totalRooms: room.totalRooms,
        basePrice: room.basePrice,
        description: room.description || '',
        images: room.images ? (typeof room.images === 'string' ? JSON.parse(room.images) : room.images) : []
      });
    } else {
      setEditingRoom(null);
      setRoomFormData({
        name: '',
        capacity: 2,
        totalRooms: 5,
        basePrice: 200,
        description: '',
        images: []
      });
    }
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    const endpoint = editingRoom ? `/admin/room-types/${editingRoom.id}` : '/admin/room-types';
    const method = editingRoom ? 'PUT' : 'POST';
    
    const { error } = await apiFetch(endpoint, {
      method,
      body: JSON.stringify({
        ...roomFormData,
        capacity: Number(roomFormData.capacity),
        totalRooms: Number(roomFormData.totalRooms),
        basePrice: Number(roomFormData.basePrice)
      })
    });

    if (error) {
      alert(error);
    } else {
      setIsRoomModalOpen(false);
      fetchRoomTypes();
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć ten typ pokoju?')) return;
    
    const { error } = await apiFetch(`/admin/room-types/${id}`, { method: 'DELETE' });
    if (error) {
      alert(`Błąd: ${error}`);
    } else {
      await fetchRoomTypes();
      alert('Typ pokoju został pomyślnie usunięty.');
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    const { error } = await apiFetch(`/admin/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    
    if (error) {
      alert(error);
    } else {
      fetchBookings();
    }
  };
  
  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('Czy na pewno chcesz usunąć tę rezerwację? Tej operacji nie można cofnąć.')) return;
    
    const { error } = await apiFetch(`/admin/bookings/${bookingId}`, { method: 'DELETE' });
    if (error) {
      alert(error);
    } else {
      fetchBookings();
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col md:flex-row font-sans text-brand-anthracite selection:bg-brand-gold selection:text-white">
      {/* Sidebar Navigation */}
      <ReceptionSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        adminName={adminUser.firstName}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen">
        <div className="p-10 md:p-20 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <ReceptionDashboard 
                  bookings={bookings} 
                  roomTypes={roomTypes} 
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteBooking={handleDeleteBooking}
                />
              )}
              {activeTab === 'calendar' && (
                <ReceptionCalendar 
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  viewType={viewType}
                  setViewType={setViewType}
                  bookings={bookings}
                  roomTypes={roomTypes}
                  loading={loading}
                  filterRoomTypeId={filterRoomTypeId}
                  setFilterRoomTypeId={setFilterRoomTypeId}
                />
              )}
              {activeTab === 'guests' && (
                <ReceptionGuestList 
                  bookings={bookings} 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm} 
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteBooking={handleDeleteBooking}
                />
              )}
              {activeTab === 'rooms' && (
                <ReceptionRoomManager 
                  roomTypes={roomTypes} 
                  onOpenModal={handleOpenRoomModal} 
                  onDeleteRoom={handleDeleteRoom} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Room Management Modal */}
      <AnimatePresence>
        {isRoomModalOpen && (
          <ReceptionRoomModal 
            isOpen={isRoomModalOpen}
            onClose={() => setIsRoomModalOpen(false)}
            onSave={handleSaveRoom}
            formData={roomFormData}
            setFormData={setRoomFormData}
            editingRoom={editingRoom}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reception;

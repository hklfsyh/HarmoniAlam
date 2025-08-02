import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import organizerApi from '../../API/organizer';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Tag, Search, Mail } from 'lucide-react';
import EventGallery from '../DetailEventComponents/EventGallery';
import SendEmailModal from '../SendEmailModal';
import SuccessModal from '../SuccessModal';
import ErrorModal from '../ErrorModal';

//=================================================================
// KOMPONEN-KOMPONEN LOKAL (Digabungkan dalam satu file)
//=================================================================
const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
const TABS = ['Overview', 'Partisipan'];
const DetailEventTabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; }> = ({ activeTab, setActiveTab }) => (
  <div className="bg-slate-200 p-1 rounded-lg flex flex-col sm:flex-row gap-1 mb-6">
    {TABS.map(tab => (
      <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full py-2 px-4 rounded-md font-semibold text-sm transition-all ${activeTab === tab ? 'bg-white shadow' : 'text-gray-600'}`}>
        {tab}
      </button>
    ))}
  </div>
);

const formatTime = (isoString: string) => new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
const InfoItem: React.FC<{ icon: React.ReactElement; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-4"><div className="text-[#79B829] mt-1">{icon}</div><div><p className="text-gray-500">{label}</p><p className="font-semibold text-[#1A3A53]">{value}</p></div></div>
);
const InfoSection: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div><h3 className="text-lg font-semibold text-[#1A3A53] mb-2">{label}</h3><p className="text-gray-600 leading-relaxed whitespace-pre-line">{children}</p></div>
);
const OverviewTab: React.FC<{ event: any }> = ({ event }) => (
  <div className="bg-white p-8 rounded-lg shadow-md space-y-8">
    <div><h2 className="text-2xl font-bold text-[#1A3A53] mb-6">Detail Event</h2><img src={event.imagePath} alt={event.title} className="w-full h-80 object-cover rounded-lg mb-8 shadow-md"/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoItem icon={<Calendar />} label="Tanggal" value={new Date(event.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
            <InfoItem icon={<Clock />} label="Waktu" value={`${formatTime(event.eventTime)} WIB`} />
            <InfoItem icon={<MapPin />} label="Lokasi" value={event.location} />
            <InfoItem icon={<Users />} label="Kapasitas" value={`${event.currentParticipants} / ${event.maxParticipants} orang`} />
            <InfoItem icon={<Tag />} label="Kategori Event" value={event.category.categoryName} />
        </div>
    </div><hr/><div className="space-y-6"><InfoSection label="Deskripsi Event">{event.description}</InfoSection><InfoSection label="Kebutuhan yang Harus Dibawa">{event.requiredItems}</InfoSection><InfoSection label="Kebutuhan yang Disediakan">{event.providedItems}</InfoSection></div>
    {/* Gallery Event */}
    {event.gallery && event.gallery.length > 0 && (
      <EventGallery gallery={event.gallery.map((img: any) => typeof img === 'string' ? img : img.url)} />
    )}
    {/* Map Preview */}
    {event.latitude && event.longitude && (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#1A3A53] mb-4 text-center">Lokasi Event di Map</h2>
        <div className="flex justify-center">
          <img
            src={`https://maps.locationiq.com/v3/staticmap?key=${apiKey}&center=${event.latitude},${event.longitude}&zoom=15&size=600x300&markers=icon:large-red-cutout|${event.latitude},${event.longitude}`}
            alt="Map Lokasi Event"
            className="rounded-xl shadow border"
            style={{ width: '600px', height: '300px', objectFit: 'cover', maxWidth: '100%' }}
          />
        </div>
      </div>
    )}
  </div>
);


// Tipe data volunteer
interface VolunteerReg {
  registration_id: number;
  registeredAt: string;
  volunteer: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const fetchEventVolunteers = async (eventId: number): Promise<VolunteerReg[]> => {
    const { data } = await organizerApi.get(`/events/${eventId}/volunteers`);
    return data; // langsung return array
};

const sendEmailToAllVolunteers = async ({ eventId, subject, message }: { eventId: number; subject: string; message: string }) => {
  await organizerApi.post(`/events/${eventId}/email-volunteers`, { subject, message });
};

const sendEmailToVolunteer = async ({ eventId, subject, message, volunteerId }: { eventId: number; subject: string; message: string; volunteerId: number }) => {
  await organizerApi.post(`/events/${eventId}/email-volunteers`, { subject, message, volunteerId });
};

const PartisipanTab: React.FC<{ eventId: number }> = ({ eventId }) => {
    const { data: volunteers, isLoading, isError, error } = useQuery<VolunteerReg[]>({
        queryKey: ['eventVolunteers', eventId],
        queryFn: () => fetchEventVolunteers(eventId),
        enabled: !!eventId,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('Berhasil');
    const [modalButtonText, setModalButtonText] = useState('Tutup');
    const [isSingleEmailModalOpen, setIsSingleEmailModalOpen] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState<{ id: number, name: string, email: string } | null>(null);

    const sendEmailMutation = useMutation({
      mutationFn: ({ subject, message }: { subject: string; message: string }) =>
        sendEmailToAllVolunteers({ eventId, subject, message }),
      onSuccess: () => {
        setIsModalOpen(false);
        setModalTitle('Berhasil');
        setModalMessage('Email berhasil dikirim ke semua volunteer!');
        setModalButtonText('Tutup');
        setIsSuccessModalOpen(true);
      },
      onError: () => {
        setIsModalOpen(false);
        setModalTitle('Gagal');
        setModalMessage('Gagal mengirim email.');
        setModalButtonText('Coba Lagi');
        setIsErrorModalOpen(true);
      }
    });

    // Mutasi untuk email satu volunteer
    const sendSingleEmailMutation = useMutation({
      mutationFn: ({ subject, message, volunteerId }: { subject: string; message: string; volunteerId: number }) =>
        sendEmailToVolunteer({ eventId, subject, message, volunteerId }),
      onSuccess: () => {
        setIsSingleEmailModalOpen(false);
        setModalTitle('Berhasil');
        setModalMessage('Email berhasil dikirim ke volunteer!');
        setModalButtonText('Tutup');
        setIsSuccessModalOpen(true);
      },
      onError: () => {
        setIsSingleEmailModalOpen(false);
        setModalTitle('Gagal');
        setModalMessage('Gagal mengirim email.');
        setModalButtonText('Coba Lagi');
        setIsErrorModalOpen(true);
      }
    });

    // Fungsi kirim email ke semua volunteer
    const handleSendEmailAll = () => {
        if (!Array.isArray(volunteers) || volunteers.length === 0) return;
        const emails = volunteers.map(v => v.volunteer.email).join(',');
        window.open(`mailto:${emails}`, '_blank');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Button Send Email ke Semua Volunteer */}
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#79B829] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#5fa31e] transition"
                    disabled={!Array.isArray(volunteers) || volunteers.length === 0}
                >
                    <Mail size={18} />
                    Send Email ke Semua Volunteer
                </button>
            </div>
            <SendEmailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={(subject, message) => sendEmailMutation.mutate({ subject, message })}
              isSending={sendEmailMutation.isPending}
              recipientName="Semua Volunteer"
              recipientEmail="(mass email)"
            />
            <SuccessModal
              isOpen={isSuccessModalOpen}
              onClose={() => setIsSuccessModalOpen(false)}
              title={modalTitle}
              message={modalMessage}
              buttonText={modalButtonText}
            />
            <ErrorModal
              isOpen={isErrorModalOpen}
              onClose={() => setIsErrorModalOpen(false)}
              title={modalTitle}
              message={modalMessage}
              buttonText={modalButtonText}
            />
            <SendEmailModal
              isOpen={isSingleEmailModalOpen}
              onClose={() => setIsSingleEmailModalOpen(false)}
              onConfirm={(subject, message) => {
                if (selectedVolunteer)
                  sendSingleEmailMutation.mutate({ subject, message, volunteerId: selectedVolunteer.id });
              }}
              isSending={sendSingleEmailMutation.isPending}
              recipientName={selectedVolunteer?.name || ''}
              recipientEmail={selectedVolunteer?.email || ''}
            />
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Cari Partisipan..." className="w-full pl-12 pr-4 py-3 border rounded-lg" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A3A53] mb-4">Daftar Partisipan</h2>
            {isLoading && <p>Memuat daftar partisipan...</p>}
            {isError && <p className="text-red-500">Gagal memuat data: {error.message}</p>}
            {Array.isArray(volunteers) && (
                <div className="border rounded-lg text-sm overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-slate-50 font-semibold text-gray-500 border-b">
                        <div>Nama</div>
                        <div>Email</div>
                        <div>Tanggal Daftar</div>
                        <div>Aksi</div>
                    </div>
                    <div className="divide-y">
                        {volunteers.length > 0 ? (
                            volunteers.map((reg) => (
                                <div key={reg.registration_id} className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
                                    <div className="font-semibold text-[#1A3A53]">{reg.volunteer.firstName} {reg.volunteer.lastName}</div>
                                    <div>{reg.volunteer.email}</div>
                                    <div>{new Date(reg.registeredAt).toLocaleDateString('id-ID')}</div>
                                    <div>
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center p-2 rounded-full bg-[#eaf7e1] hover:bg-[#79B829] transition cursor-pointer"
                                            title="Kirim Email"
                                            onClick={() => {
                                              setSelectedVolunteer({
                                                id: reg.volunteer.id,
                                                name: `${reg.volunteer.firstName} ${reg.volunteer.lastName}`,
                                                email: reg.volunteer.email
                                              });
                                              setIsSingleEmailModalOpen(true);
                                            }}
                                        >
                                            <Mail size={18} className="text-[#1A3A53] group-hover:text-white" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-gray-500">Belum ada partisipan yang mendaftar.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


interface DetailEventViewProps {
  eventId: number;
  onBack: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const fetchEventDetail = async (id: number) => {
    const { data } = await organizerApi.get(`/events/${id}`);
    return data;
};

const DetailEventView: React.FC<DetailEventViewProps> = ({ eventId, onBack, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const { data: event, isLoading, isError, error } = useQuery({
      queryKey: ['organizerEventDetail', eventId],
      queryFn: () => fetchEventDetail(eventId),
      enabled: !!eventId,
  });

  const renderContent = () => {
    if (isLoading) return <p className="text-center p-4">Memuat data event...</p>;
    if (isError) return <p className="text-center p-4 text-red-500">Gagal memuat data: {error.message}</p>;
    if (!event) return null;

    switch (activeTab) {
      case 'Overview': return <OverviewTab event={event} />;
      case 'Partisipan': return <PartisipanTab eventId={eventId} />;
      default: return <OverviewTab event={event} />;
    }
  };

  return (
    <div>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div>
                <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1A3A53] font-semibold mb-2">
                    <ArrowLeft size={20} />
                    Kembali ke Dashboard
                </button>
                <h1 className="text-3xl font-bold text-[#1A3A53]">{event?.title || 'Memuat...'}</h1>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => onEdit(eventId)} className="bg-[#1A3A53] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90">
                    Edit Event
                </button>
                <button onClick={() => onDelete(eventId)} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-700">
                    Hapus Event
                </button>
            </div>
        </div>
        <DetailEventTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div>{renderContent()}</div>
    </div>
  );
};
export default DetailEventView;

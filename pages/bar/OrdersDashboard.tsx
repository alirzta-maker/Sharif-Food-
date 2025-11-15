import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n';
import { api } from '../../api';
import { DeliveryJob } from '../../types';
import CountdownTimer from '../../components/delivery/CountdownTimer';

const OrderCard: React.FC<{ job: DeliveryJob; onAccept: (jobId: string) => void; onDecline: (jobId: string) => void; }> = ({ job, onAccept, onDecline }) => {
    const { t, language, direction } = useTranslation();
    
    return (
        <div dir={direction} className="bg-sharif-yellow border-3 border-black rounded-5xl p-4 mb-4 shadow-study">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-extrabold text-xl">{job.restaurantName[language]}</h3>
                <CountdownTimer expiryTimestamp={job.expiresAt} />
            </div>
            <div className="my-3 text-sm space-y-1">
                <p><span className="font-bold">{t('items')}:</span> {job.itemsSummary}</p>
                <p><span className="font-bold">{t('from')}:</span> {job.pickupPoint}</p>
                <p><span className="font-bold">{t('to')}:</span> {job.deliveryLocation?.name[language] || job.deliveryPoint}</p>
                {job.customerPhone && <p><span className="font-bold">{t('customer_contact_phone')}:</span> {job.customerPhone}</p>}
                {job.customerNotes && <p><span className="font-bold">{t('customer_notes')}:</span> {job.customerNotes}</p>}
                {job.promoCodeApplied && <p><span className="font-bold">{t('promo_code')}:</span> {job.promoCodeApplied}</p>}
                {job.discountAmount && job.discountAmount > 0 && <p className="text-green-600"><span className="font-bold">{t('discount_amount')}:</span> {job.discountAmount.toLocaleString()} T</p>}
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-lg text-sharif-gir">{t('earnings')}: {job.earnings.toLocaleString()} T</span>
                <div className="flex gap-2">
                   <button onClick={() => onDecline(job.id)} className="bg-white text-black font-bold py-2 px-6 rounded-4xl border-2 border-black bouncy-button">{t('decline_order')}</button>
                   <button onClick={() => onAccept(job.id)} className="bg-sharif-bar text-white font-bold py-2 px-6 rounded-4xl border-2 border-black bouncy-button">{t('accept_order')}</button>
                </div>
            </div>
        </div>
    );
};


const OrdersDashboard: React.FC = () => {
    const { t, direction } = useTranslation();
    const [jobs, setJobs] = useState<DeliveryJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            const riderJobs = await api.getAvailableJobs('rider-123');
            setJobs(riderJobs.filter(job => job.expiresAt > Date.now()));
            setIsLoading(false);
        };
        
        fetchJobs(); // Initial fetch
        const interval = setInterval(fetchJobs, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleAccept = async (jobId: string) => {
        const { success, message } = await api.acceptJob(jobId, 'rider-123');
        if (success) {
            setJobs(prev => prev.filter(j => j.id !== jobId));
            // In a real app, a toast notification would be shown
        } else {
            alert(message); // e.g., "Job already taken"
            setJobs(prev => prev.filter(j => j.id !== jobId));
        }
    };
    
    const handleDecline = (jobId: string) => {
        // Just remove from UI for now
        setJobs(prev => prev.filter(j => j.id !== jobId));
    };

    return (
        <div dir={direction}>
            <h1 className="text-3xl font-extrabold mb-6">{t('order_dashboard')}</h1>
            <div>
                {isLoading && <p>Loading jobs...</p>}
                {!isLoading && jobs.length === 0 && <p className="text-center text-gray-500 mt-8">No available requests right now.</p>}
                {jobs.map(job => (
                    <OrderCard key={job.id} job={job} onAccept={handleAccept} onDecline={handleDecline} />
                ))}
            </div>
        </div>
    );
};

export default OrdersDashboard;
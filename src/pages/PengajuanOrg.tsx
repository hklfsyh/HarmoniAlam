// src/pages/PengajuanOrgPage.tsx
import React from 'react';

import PengajuanHeader from '../components/PengajuanOrgComponents/PengajuanHeader';
import KeuntunganSection from '../components/PengajuanOrgComponents/KeuntunganSection';
import FormPengajuan from '../components/PengajuanOrgComponents/FormPengajuan';

const PengajuanOrgPage: React.FC = () => {
  return (
    <div className="bg-slate-50">
      <main className="container mx-auto px-6 py-12 mt-16">
        <div className="space-y-12">
          <PengajuanHeader />
          <KeuntunganSection />
          <FormPengajuan />
        </div>
      </main>
    </div>
  );
};

export default PengajuanOrgPage;
import React from 'react';
import AdminCard from './AdminCard';
import AdminTable from './AdminTable';

const Admin = () => {
  const cardData = [
    {
      title: 'Patients',
      count: 69,
      images: ['/images/pic1.jpg', '/images/pic2.jpg', '/images/pic3.jpg'],
    },
    {
      title: 'Doctors',
      count: 24,
      images: ['/images/pic2.jpg', '/images/pic1.jpg', '/images/pic3.jpg'],
    },
    {
      title: 'Lab-Technicians',
      count: 12,
      images: ['/images/pic3.jpg', '/images/pic1.jpg', '/images/pic2.jpg'],
    },
  ];

  const tableData=[
    {
        name:"Aashutosh",
        imgSrc:'/images/pic1.jpg',
        role:'Patient',
        date:'1/08/2025'
    },
    {
        name:"Aadarsan",
        imgSrc:'/images/pic2.jpg',
        role:'Patient',
        date:'1/10/2022'
    },
    {
        name:"Kripa",
        imgSrc:'/images/pic3.jpg',
        role:'Patient',
        date:'12/08/2024'
    },
  ]

  return (
    <div className="p-5">
        <div className="flex justify-between items-center mb-5">
            <p className="font-figtree text-4xl">ADMIN PANEL</p>
            <button className="bg-buttonGray text-white px-7 py-3 rounded-lg">
            Create User
            </button>
        </div>
      <div className="flex gap-4">
        {cardData.map((data, index) => (
          <AdminCard
            key={index}
            title={data.title}
            count={data.count}
            images={data.images}
          />
        ))}
      </div>
      <div className='mt-10'>
      <AdminTable tableData={tableData}/>
      </div>
    </div>
  );
};

export default Admin;

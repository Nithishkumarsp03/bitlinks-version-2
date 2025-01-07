import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import '../../Styles/tab.css'
import { useEffect } from 'react';

export default function Persontab({activeTab, setActiveTab, uuid}) {

    const navigate = useNavigate();
    const location = useLocation();

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        if (tabName === "Interlinks"){
            navigate(`/admin/${uuid}/person-details/interlinks`)
        }
        else if (tabName === "M.O.M"){
            navigate(`/admin/${uuid}/person-details/minutes-of-meeting`)
        }
        else if(tabName === "Infograph"){
          navigate(`/admin/${uuid}/person-details/info-graph`)
        }
        else if(tabName === "Graph"){
          navigate(`/admin/${uuid}/person-details/graph`)
        }
        else{
            navigate(`/admin/${uuid}/person-details`)
        }

        return () => {
          setActiveTab('Profile')
        }
      };

      useEffect(() => {
        // This effect is to synchronize the activeTab with the URL path
        if (location.pathname.includes('/interlinks')) {
          setActiveTab('Interlinks');
        } else if (location.pathname.includes('/minutes-of-meeting')) {
          setActiveTab('M.O.M');
        } else if (location.pathname.includes('/info-graph')) {
          setActiveTab('Infograph');
        } else {
          setActiveTab('Profile');
        }
      }, [location.pathname, setActiveTab]);


  return (
    <div className="scrolling-tabs">
          <div className={`tab ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => handleTabClick('Profile')} >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
              <path d="M9 22L9.00192 17.9976C9.00236 17.067 9.00258 16.6017 9.15462 16.2347C9.35774 15.7443 9.74746 15.3547 10.2379 15.1519C10.6051 15 11.0704 15 12.001 15V15C12.9319 15 13.3974 15 13.7647 15.152C14.2553 15.355 14.645 15.7447 14.848 16.2353C15 16.6026 15 17.0681 15 17.999V22" />
              <path d="M7.08848 4.76243L6.08847 5.54298C4.57181 6.72681 3.81348 7.31873 3.40674 8.15333C3 8.98792 3 9.95205 3 11.8803V13.9715C3 17.7562 3 19.6485 4.17157 20.8243C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8243C21 19.6485 21 17.7562 21 13.9715V11.8803C21 9.95205 21 8.98792 20.5933 8.15333C20.1865 7.31873 19.4282 6.72681 17.9115 5.54298L16.9115 4.76243C14.5521 2.92081 13.3724 2 12 2C10.6276 2 9.44787 2.92081 7.08848 4.76243Z"  />
          </svg>
          <p>Profile</p>
          </div>
          <div className={`tab ${activeTab === 'Interlinks' ? 'active' : ''}`} onClick={() => handleTabClick('Interlinks')} >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000   " fill="none">
              <path d="M2.5 6L8 4L13.5 6L11 7.5V9C11 9 10.3333 8.5 8 8.5C5.66667 8.5 5 9 5 9V7.5L2.5 6ZM2.5 6V10"  />
              <path d="M11 8.5V9.38889C11 11.1071 9.65685 12.5 8 12.5C6.34315 12.5 5 11.1071 5 9.38889V8.5" />
              <path d="M15.3182 11.0294C15.3182 11.0294 15.803 10.6765 17.5 10.6765C19.197 10.6765 19.6818 11.0294 19.6818 11.0294M15.3182 11.0294V10L13.5 9L17.5 7.5L21.5 9L19.6818 10V11.0294M15.3182 11.0294V11.3182C15.3182 12.5232 16.295 13.5 17.5 13.5C18.705 13.5 19.6818 12.5232 19.6818 11.3182V11.0294" />
              <path d="M4.38505 15.926C3.44187 16.4525 0.96891 17.5276 2.47511 18.8729C3.21087 19.53 4.03033 20 5.06058 20H10.9394C11.9697 20 12.7891 19.53 13.5249 18.8729C15.0311 17.5276 12.5581 16.4525 11.6149 15.926C9.40321 14.6913 6.59679 14.6913 4.38505 15.926Z" />
              <path d="M16 20H19.7048C20.4775 20 21.0921 19.624 21.6439 19.0983C22.7736 18.0221 20.9189 17.162 20.2115 16.7408C18.9362 15.9814 17.3972 15.8059 16 16.2141" />
          </svg>
          <p>Interlinks</p>
          </div>
          <div className={`tab ${activeTab === 'Infograph' ? 'active' : ''}`} onClick={() => handleTabClick('Infograph')} >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000   " fill="none">
              <path d="M2.5 6L8 4L13.5 6L11 7.5V9C11 9 10.3333 8.5 8 8.5C5.66667 8.5 5 9 5 9V7.5L2.5 6ZM2.5 6V10"  />
              <path d="M11 8.5V9.38889C11 11.1071 9.65685 12.5 8 12.5C6.34315 12.5 5 11.1071 5 9.38889V8.5" />
              <path d="M15.3182 11.0294C15.3182 11.0294 15.803 10.6765 17.5 10.6765C19.197 10.6765 19.6818 11.0294 19.6818 11.0294M15.3182 11.0294V10L13.5 9L17.5 7.5L21.5 9L19.6818 10V11.0294M15.3182 11.0294V11.3182C15.3182 12.5232 16.295 13.5 17.5 13.5C18.705 13.5 19.6818 12.5232 19.6818 11.3182V11.0294" />
              <path d="M4.38505 15.926C3.44187 16.4525 0.96891 17.5276 2.47511 18.8729C3.21087 19.53 4.03033 20 5.06058 20H10.9394C11.9697 20 12.7891 19.53 13.5249 18.8729C15.0311 17.5276 12.5581 16.4525 11.6149 15.926C9.40321 14.6913 6.59679 14.6913 4.38505 15.926Z" />
              <path d="M16 20H19.7048C20.4775 20 21.0921 19.624 21.6439 19.0983C22.7736 18.0221 20.9189 17.162 20.2115 16.7408C18.9362 15.9814 17.3972 15.8059 16 16.2141" />
          </svg>
          <p>Infograph</p>
          </div>
          <div className={`tab ${activeTab === 'M.O.M' ? 'active' : ''}`} onClick={() => handleTabClick('M.O.M')} >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000  "} fill={"none"}>
              <path d="M5.08069 15.2964C3.86241 16.0335 0.668175 17.5386 2.61368 19.422C3.56404 20.342 4.62251 21 5.95325 21H13.5468C14.8775 21 15.936 20.342 16.8863 19.422C18.8318 17.5386 15.6376 16.0335 14.4193 15.2964C11.5625 13.5679 7.93752 13.5679 5.08069 15.2964Z" />
              <path d="M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" />
              <path d="M17 5L22 5"  />
              <path d="M17 8L22 8"  />
              <path d="M20 11L22 11"  />
          </svg>
          <p>M.O.M</p>
          </div>
          
      </div>
  )
}

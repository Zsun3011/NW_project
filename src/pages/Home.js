import React , { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    

    return (
        <div>
    
          <button onClick={() => navigate("/quiz")}>퀴즈 시작하기</button>

    </div>
    );
};

export default Home;